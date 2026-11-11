// src/lib/tokenRefresh.ts
// Single-flight access-token renewal, shared by every authenticated fetch call.
//
// The backend already rotates the refresh token on each use (old one revoked,
// new one issued) — see zeneyer-auth's /auth/refresh. That means two
// concurrent 401s racing to refresh at once would have the second request
// try to redeem an already-revoked token and fail. `refreshAccessToken()`
// de-duplicates concurrent callers into one in-flight request so every
// caller gets the same new token (or the same "session really is over"
// outcome) instead of racing.
//
// Every renewal is bound to the ACCOUNT whose request was rejected. Logout and
// account switches don't wait for an in-flight renewal, and all tabs share one
// localStorage, so before writing or clearing anything this module checks that
// the stored session still belongs to that account; otherwise it discards the
// outcome instead of restoring a logged-out session or touching another
// account's tokens.
//
// This module talks to localStorage directly (not React state) so it works
// from plain fetch wrappers outside React. UserContext listens for the
// events below to keep its own state in sync.

import { authRefresh, RefreshTokenInvalidError } from '../services/authService';
import { TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT } from './authEvents';
import { JWT_KEY, REFRESH_KEY, getStoredUserId, getTokenUserId } from './authStorage';

export { TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT };

// One in-flight renewal per account: callers for the same account share it, but a
// renewal started for account A is never handed to a caller acting as account B.
const inFlight = new Map<string, Promise<string | null>>();

const REFRESH_LOCK_NAME = 'zen-auth-refresh';

/**
 * Serializes renewal across every tab/window of this origin. `inFlight` below
 * only de-duplicates within one JavaScript realm, but all tabs share the same
 * localStorage refresh token and the backend rotates it on use, so two tabs
 * refreshing at once would make one of them redeem a revoked token. Falls
 * back to running directly where the Web Locks API is unavailable.
 */
const withRefreshLock = <T>(task: () => Promise<T>): Promise<T> =>
  typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request(REFRESH_LOCK_NAME, task)
    : task();

/**
 * If localStorage holds an access token different from the one that was
 * rejected, another tab already renewed: mirror it to this tab's state and
 * return it. Returns null when there is nothing newer to adopt. Callers must
 * have verified that the stored session is still the same account's.
 */
const adoptRenewedToken = (staleToken: string | null, expectedUserId: number | null): string | null => {
  const current = localStorage.getItem(JWT_KEY);
  if (!current || current === staleToken) return null;
  const currentUserId = getTokenUserId(current);
  if (currentUserId !== null && currentUserId !== expectedUserId) return null;
  window.dispatchEvent(new CustomEvent(TOKEN_REFRESHED_EVENT, { detail: { token: current } }));
  return current;
};

/**
 * Exchanges the stored refresh token for a new access token.
 * Returns the new access token, or null if the session cannot be renewed
 * (nothing to refresh with, or the refresh token itself was rejected —
 * SESSION_EXPIRED_EVENT fires in that case so the UI can log the user out
 * with a clear message instead of leaving stale "looks logged in" state).
 * Also null, silently, when the session ended or switched accounts meanwhile:
 * nothing is written and nobody is told the session "expired".
 * A transient failure (network error) rejects instead, so a flaky request
 * doesn't end the session.
 */
const runRefresh = (staleToken: string | null, expectedUserId: number | null): Promise<string | null> =>
  withRefreshLock(async () => {
    // The user may have logged out, or switched account, while this call waited
    // for the lock. Their stored tokens are not ours to renew or overwrite.
    if (getStoredUserId() !== expectedUserId) return null;
    const storedTokenUserId = getTokenUserId(localStorage.getItem(JWT_KEY));
    if (storedTokenUserId !== null && storedTokenUserId !== expectedUserId) return null;

    // Another tab may have renewed while this one waited for the lock (or
    // between the 401 and now). The shared localStorage then already holds a
    // newer access token than the one that was rejected: reuse it instead of
    // redeeming a refresh token that tab just rotated away.
    const adopted = adoptRenewedToken(staleToken, expectedUserId);
    if (adopted) return adopted;

    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const userId = expectedUserId;

    if (!refreshToken || !userId) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      return null;
    }

    try {
      const { token, refreshToken: newRefreshToken } = await authRefresh(refreshToken, userId);

      // Logout and login don't wait for this request. If the stored session is no
      // longer this account's, writing the response would resurrect a logged-out
      // session or mix this account's tokens into another one.
      if (getStoredUserId() !== userId) return null;
      // Same account, but its session was replaced or rotated by another context
      // while we waited: keep that one and only pick up its access token.
      if (localStorage.getItem(REFRESH_KEY) !== refreshToken) return adoptRenewedToken(staleToken, userId);

      localStorage.setItem(JWT_KEY, token);
      localStorage.setItem(REFRESH_KEY, newRefreshToken);
      window.dispatchEvent(new CustomEvent(TOKEN_REFRESHED_EVENT, { detail: { token } }));
      return token;
    } catch (err) {
      if (err instanceof RefreshTokenInvalidError) {
        // Never clear or expire a session that is no longer the one we tried:
        // another account may be logged in now.
        if (getStoredUserId() !== userId) return null;
        // Without Web Locks another tab can rotate the refresh token while this
        // request is in flight, which makes the token we sent look "invalid".
        // If storage now holds a different refresh token, that tab won: keep its
        // session instead of wiping the token it just stored.
        if (localStorage.getItem(REFRESH_KEY) !== refreshToken) return adoptRenewedToken(staleToken, userId);

        localStorage.removeItem(REFRESH_KEY);
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
        return null;
      }
      throw err;
    }
  });

/**
 * @param staleToken The access token the rejected request was sent with. Lets
 * a late 401 (from this tab or another) tell "my token is old" from "my token
 * is the current one and really expired", and identifies which account the
 * request acted as. Defaults to whatever is stored now.
 */
export const refreshAccessToken = (staleToken?: string | null): Promise<string | null> => {
  const stale = staleToken ?? localStorage.getItem(JWT_KEY);
  // The token's own claim wins over the stored account: another tab may have
  // switched accounts since this request was sent.
  const userId = getTokenUserId(stale) ?? getStoredUserId();
  const key = `${String(userId)}:${localStorage.getItem(REFRESH_KEY) ?? ''}`;

  const running = inFlight.get(key);
  if (running) return running;

  // IMPORTANT: when runRefresh() has no `await` on its path (the "nothing to
  // refresh with" branch resolves synchronously), chaining `.finally()`
  // directly on its result — rather than resetting the map entry from inside an
  // `async () => { ...; inFlight.delete(key); }` IIFE — is what keeps the reset
  // from racing the `inFlight.set()` below. A `.finally()` callback is always
  // scheduled as a microtask, so it can never run before this synchronous
  // assignment completes, whereas code inside the async function body can run
  // synchronously up to its first `await` — including past a `return` — and
  // would otherwise delete the entry *before* it was ever set to the promise.
  const promise = runRefresh(stale, userId).finally(() => {
    if (inFlight.get(key) === promise) {
      inFlight.delete(key);
    }
  });

  inFlight.set(key, promise);
  return promise;
};

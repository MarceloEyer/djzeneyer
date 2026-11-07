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
// This module talks to localStorage directly (not React state) so it works
// from plain fetch wrappers outside React. UserContext listens for the
// events below to keep its own state in sync.

import { authRefresh, RefreshTokenInvalidError } from '../services/authService';
import { TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT } from './authEvents';

export { TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT };

const JWT_KEY = 'zen_jwt';
const REFRESH_KEY = 'zen_refresh_token';
const USER_KEY = 'zen_user';

let inFlight: Promise<string | null> | null = null;

const getStoredUserId = (): number | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id?: number };
    return typeof parsed.id === 'number' ? parsed.id : null;
  } catch {
    return null;
  }
};

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
 * return it. Returns null when there is nothing newer to adopt.
 */
const adoptRenewedToken = (staleToken: string | null): string | null => {
  const current = localStorage.getItem(JWT_KEY);
  if (!current || current === staleToken) return null;
  window.dispatchEvent(new CustomEvent(TOKEN_REFRESHED_EVENT, { detail: { token: current } }));
  return current;
};

/**
 * Exchanges the stored refresh token for a new access token.
 * Returns the new access token, or null if the session cannot be renewed
 * (nothing to refresh with, or the refresh token itself was rejected —
 * SESSION_EXPIRED_EVENT fires in that case so the UI can log the user out
 * with a clear message instead of leaving stale "looks logged in" state).
 * A transient failure (network error) rejects instead, so a flaky request
 * doesn't end the session.
 */
const runRefresh = (staleToken: string | null): Promise<string | null> =>
  withRefreshLock(async () => {
    // Another tab may have renewed while this one waited for the lock (or
    // between the 401 and now). The shared localStorage then already holds a
    // newer access token than the one that was rejected: reuse it instead of
    // redeeming a refresh token that tab just rotated away.
    const adopted = adoptRenewedToken(staleToken);
    if (adopted) return adopted;

    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const userId = getStoredUserId();

    if (!refreshToken || !userId) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      return null;
    }

    try {
      const { token, refreshToken: newRefreshToken } = await authRefresh(refreshToken, userId);

      localStorage.setItem(JWT_KEY, token);
      localStorage.setItem(REFRESH_KEY, newRefreshToken);
      window.dispatchEvent(new CustomEvent(TOKEN_REFRESHED_EVENT, { detail: { token } }));
      return token;
    } catch (err) {
      if (err instanceof RefreshTokenInvalidError) {
        // Without Web Locks another tab can rotate the refresh token while this
        // request is in flight, which makes the token we sent look "invalid".
        // If storage now holds a different refresh token, that tab won: keep its
        // session instead of wiping the token it just stored.
        if (localStorage.getItem(REFRESH_KEY) !== refreshToken) {
          const adoptedAfterRace = adoptRenewedToken(staleToken);
          if (adoptedAfterRace) return adoptedAfterRace;
        }
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
 * is the current one and really expired". Defaults to whatever is stored now.
 */
export const refreshAccessToken = (staleToken?: string | null): Promise<string | null> => {
  if (inFlight) return inFlight;

  // IMPORTANT: when runRefresh() has no `await` on its path (the "nothing to
  // refresh with" branch resolves synchronously), chaining `.finally()`
  // directly on its result — rather than resetting `inFlight` from inside an
  // `async () => { ...; inFlight = null; }` IIFE — is what keeps the reset
  // from racing the `inFlight = promise` assignment below. A `.finally()`
  // callback is always scheduled as a microtask, so it can never run before
  // this synchronous assignment completes, whereas code inside the async
  // function body can run synchronously up to its first `await` — including
  // past a `return` — and would otherwise clobber this assignment by
  // resetting `inFlight` to null *before* it was ever set to the promise.
  const promise = runRefresh(staleToken ?? localStorage.getItem(JWT_KEY)).finally(() => {
    if (inFlight === promise) {
      inFlight = null;
    }
  });

  inFlight = promise;
  return promise;
};

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

const JWT_KEY = 'zen_jwt';
const REFRESH_KEY = 'zen_refresh_token';
const USER_KEY = 'zen_user';

/** Dispatched on `window` with `detail: { token: string }` after a successful renewal. */
export const TOKEN_REFRESHED_EVENT = 'zen-auth:token-refreshed';
/** Dispatched on `window` when the session cannot be renewed and must end. */
export const SESSION_EXPIRED_EVENT = 'zen-auth:session-expired';

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

/**
 * Exchanges the stored refresh token for a new access token.
 * Returns the new access token, or null if the session cannot be renewed
 * (nothing to refresh with, or the refresh token itself was rejected —
 * SESSION_EXPIRED_EVENT fires in that case so the UI can log the user out
 * with a clear message instead of leaving stale "looks logged in" state).
 * A transient failure (network error) rejects instead, so a flaky request
 * doesn't end the session.
 */
export const refreshAccessToken = (): Promise<string | null> => {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      const userId = getStoredUserId();

      if (!refreshToken || !userId) {
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
        return null;
      }

      const { token, refreshToken: newRefreshToken } = await authRefresh(refreshToken, userId);

      localStorage.setItem(JWT_KEY, token);
      localStorage.setItem(REFRESH_KEY, newRefreshToken);
      window.dispatchEvent(new CustomEvent(TOKEN_REFRESHED_EVENT, { detail: { token } }));
      return token;
    } catch (err) {
      if (err instanceof RefreshTokenInvalidError) {
        localStorage.removeItem(REFRESH_KEY);
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
        return null;
      }
      throw err;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
};

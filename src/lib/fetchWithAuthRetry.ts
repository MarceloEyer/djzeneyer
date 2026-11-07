// src/lib/fetchWithAuthRetry.ts
// Kept out of src/config/api.ts on purpose: api.ts is imported from the app
// shell (index.html's entry graph), so anything exported from it ships in
// the initial JS bundle. Giving this function its own file keeps its
// dynamic import of lib/tokenRefresh.ts — the actual renewal logic — out of
// the eagerly-loaded bundle.
//
// NOTE: this file itself IS in the initial bundle. UserContext statically
// imports fetchAuthSessionFn, which lives in hooks/useAuthenticatedQueries.ts,
// and that module imports this one. So keep static imports here to a minimum
// and put anything new (account/identity checks, storage helpers) in
// lib/tokenRefresh.ts or lib/authStorage.ts, which only that lazy module loads.

import { getAuthHeaders } from '../config/api';

/**
 * Like `fetch`, but when the call is authenticated (a `token` is passed) and
 * the server answers 401, it renews the access token once (via the shared,
 * single-flight `refreshAccessToken()`) and retries the request with the new
 * token before giving up. If renewal isn't possible (no refresh token, or it
 * was rejected), the original 401 response is returned as-is — the caller's
 * existing error handling still applies, and `tokenRefresh` has already
 * dispatched SESSION_EXPIRED_EVENT so the UI can log the user out with a
 * clear message rather than erroring silently forever.
 */
export const fetchWithAuthRetry = async (
  url: string,
  token: string | undefined,
  init: RequestInit = {}
): Promise<Response> => {
  const res = await fetch(url, { ...init, headers: { ...init.headers, ...getAuthHeaders(token) } });

  if (res.status !== 401 || !token) {
    return res;
  }

  const { refreshAccessToken } = await import('./tokenRefresh');
  // Renewal is bound to the account that owns `token` (its own user_id claim): it
  // returns null if the stored session was logged out or switched to another
  // account meanwhile, so a non-null result is always this account's token.
  const newToken = await refreshAccessToken(token);
  if (!newToken) {
    return res; // Session couldn't be renewed (or changed hands); original 401 stands.
  }

  return fetch(url, { ...init, headers: { ...init.headers, ...getAuthHeaders(newToken) } });
};

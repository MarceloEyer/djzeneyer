// src/lib/fetchWithAuthRetry.ts
// Kept out of src/config/api.ts on purpose: api.ts is imported from the app
// shell (index.html's entry graph), so anything exported from it ships in
// the initial JS bundle. This function is only used by route-lazy
// authenticated hooks (useAuthenticatedQueries.ts, useMutations.ts), so
// giving it — and its dynamic import of lib/tokenRefresh.ts — its own file
// lets both stay out of the eagerly-loaded bundle entirely.

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
  const newToken = await refreshAccessToken();
  if (!newToken) {
    return res; // Session couldn't be renewed; original 401 stands.
  }

  return fetch(url, { ...init, headers: { ...init.headers, ...getAuthHeaders(newToken) } });
};

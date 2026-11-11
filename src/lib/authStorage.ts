// src/lib/authStorage.ts
// Session identity helpers shared by lib/tokenRefresh.ts and
// lib/fetchWithAuthRetry.ts. Only those two lazy modules import this file, so
// it stays out of the initial JS bundle (UserContext keeps its own literals).

export const JWT_KEY = 'zen_jwt';
export const REFRESH_KEY = 'zen_refresh_token';
export const USER_KEY = 'zen_user';

/** Id of the account whose session is currently stored, or null when logged out. */
export const getStoredUserId = (): number | null => {
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
 * Account an access token was issued to, from its own `data.user_id` claim
 * (see JWT_Manager::create_token). The signature is not checked — this is only
 * used to notice that a request belongs to a different account than the one
 * now stored, never to trust a token. Null when the token isn't a decodable JWT.
 */
export const getTokenUserId = (token: string | null | undefined): number | null => {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const claim = (JSON.parse(atob(padded)) as { data?: { user_id?: unknown } }).data?.user_id;

    if (typeof claim === 'number') return claim;
    return typeof claim === 'string' && /^\d+$/.test(claim) ? Number(claim) : null;
  } catch {
    return null;
  }
};

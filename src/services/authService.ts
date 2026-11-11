// src/services/authService.ts
// Plain async functions for auth API calls. No React state — just fetch + parse.
// UserContext calls these and manages session state.

import { buildApiUrl } from '../config/api';

export interface WordPressUser {
  id: number;
  email: string;
  name?: string;
  display_name?: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
  user_registered_year?: number;
  roles?: string[];
}

export interface AuthResult {
  user: WordPressUser;
  token: string;
  refreshToken?: string;
}

const authBase = () => buildApiUrl('zeneyer-auth/v1');

const parseJsonOrThrow = async (res: Response): Promise<unknown> => {
  const text = await res.text();
  if (!res.ok) {
    // Try to parse as JSON for a structured error message, fall back to HTTP status.
    try {
      const json = JSON.parse(text) as { message?: string; error?: string };
      throw new Error(json.message ?? json.error ?? `HTTP ${res.status}`);
    } catch (inner) {
      if (inner instanceof SyntaxError) throw new Error(`HTTP ${res.status}`, { cause: inner });
      throw inner;
    }
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      'Servidor retornou HTML ao invés de JSON. ' +
      'Verifique se o plugin ZenEyer Auth está ativo e se as rewrite rules estão corretas.',
      { cause: e }
    );
  }
};

const extractAuthResult = (json: unknown): AuthResult => {
  const data = json as {
    success: boolean;
    message?: string;
    data?: { user: WordPressUser; token: string; refresh_token?: string };
  };
  if (!data.success) throw new Error(data.message || 'Falha na autenticação');
  if (!data.data) throw new Error('Resposta inválida do servidor de autenticação');
  return { user: data.data.user, token: data.data.token, refreshToken: data.data.refresh_token };
};

export const authLogin = async (email: string, password: string): Promise<AuthResult> => {
  const res = await fetch(`${authBase()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return extractAuthResult(await parseJsonOrThrow(res));
};

/** Returned when the server answers registration identically for new and existing e-mails
 *  (ZENEYER_AUTH_UNIFORM_REGISTRATION): no session, the user finishes via the e-mail link. */
export interface RegisterPending {
  pending: true;
}

export type RegisterResult = AuthResult | RegisterPending;

export const isRegisterPending = (result: RegisterResult): result is RegisterPending =>
  'pending' in result && result.pending === true;

export const authRegister = async (
  name: string,
  email: string,
  password: string,
  turnstileToken?: string
): Promise<RegisterResult> => {
  const res = await fetch(`${authBase()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, turnstileToken: turnstileToken || '' }),
  });
  const json = await parseJsonOrThrow(res);
  const pending = json as { success?: boolean; data?: { status?: string } };
  if (pending.success && pending.data?.status === 'verification_sent') {
    return { pending: true };
  }
  return extractAuthResult(json);
};

export const authGoogleLogin = async (idToken: string): Promise<AuthResult> => {
  const res = await fetch(`${authBase()}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });
  return extractAuthResult(await parseJsonOrThrow(res));
};

/** Thrown when the refresh token itself is invalid/expired/revoked — the caller must
 *  end the session (log out) rather than retry; no new token is recoverable. */
export class RefreshTokenInvalidError extends Error {
  constructor(message = 'Refresh token inválido ou expirado') {
    super(message);
    this.name = 'RefreshTokenInvalidError';
  }
}

export const authRefresh = async (
  refreshToken: string,
  userId: number
): Promise<{ token: string; refreshToken: string }> => {
  const res = await fetch(`${authBase()}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken, user_id: userId }),
  });

  if (res.status === 401) {
    throw new RefreshTokenInvalidError();
  }

  const json = (await parseJsonOrThrow(res)) as {
    success: boolean;
    message?: string;
    data?: { token: string; refresh_token: string };
  };
  if (!json.success || !json.data) throw new RefreshTokenInvalidError(json.message);

  return { token: json.data.token, refreshToken: json.data.refresh_token };
};

export const authRequestPasswordReset = async (email: string): Promise<void> => {
  const res = await fetch(`${authBase()}/auth/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await parseJsonOrThrow(res) as { success: boolean; message?: string };
  if (!json.success) throw new Error(json.message || 'Erro ao solicitar reset de senha');
};

export const authResetPassword = async (key: string, login: string, password: string): Promise<void> => {
  const res = await fetch(`${authBase()}/auth/password/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, login, password }),
  });
  const json = await parseJsonOrThrow(res) as { success: boolean; message?: string };
  if (!json.success) throw new Error(json.message || 'Erro ao definir nova senha');
};

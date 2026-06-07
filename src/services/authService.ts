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
}

const authBase = () => buildApiUrl('zeneyer-auth/v1');

const parseJsonOrThrow = async (res: Response): Promise<unknown> => {
  const text = await res.text();
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error(
      'Servidor retornou HTML ao invés de JSON. ' +
      'Verifique se o plugin ZenEyer Auth está ativo e se as rewrite rules estão corretas.'
    );
  }
  return JSON.parse(text);
};

const extractAuthResult = (json: unknown): AuthResult => {
  const data = json as { success: boolean; message?: string; data?: { user: WordPressUser; token: string } };
  if (!data.success) throw new Error(data.message || 'Falha na autenticação');
  if (!data.data) throw new Error('Resposta inválida do servidor de autenticação');
  return { user: data.data.user, token: data.data.token };
};

export const authLogin = async (email: string, password: string): Promise<AuthResult> => {
  const res = await fetch(`${authBase()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return extractAuthResult(await parseJsonOrThrow(res));
};

export const authRegister = async (
  name: string,
  email: string,
  password: string,
  turnstileToken?: string
): Promise<AuthResult> => {
  const res = await fetch(`${authBase()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, turnstileToken: turnstileToken || '' }),
  });
  return extractAuthResult(await parseJsonOrThrow(res));
};

export const authGoogleLogin = async (idToken: string): Promise<AuthResult> => {
  const res = await fetch(`${authBase()}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  });
  return extractAuthResult(await parseJsonOrThrow(res));
};

export const authRequestPasswordReset = async (email: string): Promise<void> => {
  const res = await fetch(`${authBase()}/auth/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await res.json() as { success: boolean; message?: string };
  if (!json.success) throw new Error(json.message || 'Erro ao solicitar reset de senha');
};

export const authResetPassword = async (key: string, login: string, password: string): Promise<void> => {
  const res = await fetch(`${authBase()}/auth/password/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, login, password }),
  });
  const json = await res.json() as { success: boolean; message?: string };
  if (!json.success) throw new Error(json.message || 'Erro ao definir nova senha');
};

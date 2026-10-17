/**
 * API Configuration - Centralized Config Service
 * 
 * SECURITY: Prioriza window.wpData (injetado pelo WordPress) sobre variáveis de ambiente.
 * Variáveis de ambiente são usadas apenas como fallback para desenvolvimento local.
 * 
 * PRINCÍPIOS:
 * - Single Source of Truth (SSOT)
 * - Security by Design
 * - DRY (Don't Repeat Yourself)
 */

// ============================================================================
// TYPES
// ============================================================================

interface WordPressData {
  rootUrl?: string;
  siteUrl: string;
  restUrl: string;
  nonce: string;
}

interface ApiConfig {
  siteUrl: string;
  restUrl: string;
  nonce: string;
  turnstileSiteKey: string;
}

// ============================================================================
// GLOBAL WINDOW EXTENSION
// ============================================================================

declare global {
  interface Window {
    wpData?: WordPressData;
  }
}

// ============================================================================
// CONFIGURATION GETTERS
// ============================================================================

/**
 * Obtém configuração completa da API
 * Prioriza window.wpData (produção) sobre import.meta.env (desenvolvimento)
 */
export const getApiConfig = (): ApiConfig => {
  // Produção: WordPress injeta wpData via PHP
  if (window.wpData?.restUrl) {
    return {
      siteUrl: window.wpData.rootUrl || window.wpData.siteUrl || '',
      restUrl: window.wpData.restUrl || '',
      nonce: window.wpData.nonce || '',
      turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
    };
  }

  // Desenvolvimento: Fallback para variáveis de ambiente
  return {
    siteUrl: import.meta.env.VITE_WP_SITE_URL || 'https://djzeneyer.com',
    restUrl: import.meta.env.VITE_WP_REST_URL || 'https://djzeneyer.com/wp-json/',
    nonce: 'dev-nonce',
    turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
  };
};

/**
 * Obtém apenas a URL base da REST API
 * Remove trailing slash para consistência
 */
export const getRestUrl = (): string => {
  const config = getApiConfig();
  return config.restUrl.replace(/\/$/, '');
};

/**
 * Obtém apenas a URL do site
 */
export const getSiteUrl = (): string => {
  const config = getApiConfig();
  return config.siteUrl;
};

/**
 * Obtém o nonce do WordPress para requisições autenticadas
 */
export const getNonce = (): string => {
  const config = getApiConfig();
  return config.nonce;
};

/**
 * Obtém a chave pública do Cloudflare Turnstile
 * Nota: Esta é uma chave PÚBLICA, seguro expor no frontend
 */
export const getTurnstileSiteKey = (): string => {
  const config = getApiConfig();
  return config.turnstileSiteKey;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verifica se está rodando em ambiente de produção
 */
export const isProduction = (): boolean => {
  return !!window.wpData?.restUrl;
};

/**
 * Verifica se está rodando em ambiente de desenvolvimento
 */
export const isDevelopment = (): boolean => {
  return !isProduction();
};

/**
 * Constrói URL completa para endpoint da API
 * @param endpoint - Caminho do endpoint (ex: 'djzeneyer/v1/menu')
 * @param params - Query parameters opcionais
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  const baseUrl = getRestUrl();
  const cleanEndpoint = endpoint.replace(/^\//, '');
  
  let url = `${baseUrl}/${cleanEndpoint}`;
  
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  
  return url;
};

/**
 * Headers padrão para requisições autenticadas
 */
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Se temos token Bearer, o nonce do WP costuma causar conflitos 403 
  // caso o usuário tenha acabado de logar (nonce de guest x usuário logado).
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const nonce = getNonce();
    if (nonce && nonce !== 'dev-nonce') {
      headers['X-WP-Nonce'] = nonce;
    }
  }

  return headers;
};

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

  const { refreshAccessToken } = await import('../lib/tokenRefresh');
  const newToken = await refreshAccessToken();
  if (!newToken) {
    return res; // Session couldn't be renewed; original 401 stands.
  }

  return fetch(url, { ...init, headers: { ...init.headers, ...getAuthHeaders(newToken) } });
};


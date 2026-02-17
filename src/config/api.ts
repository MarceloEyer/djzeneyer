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
      siteUrl: window.wpData.siteUrl || '',
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
  };

  const nonce = getNonce();
  if (nonce && nonce !== 'dev-nonce') {
    headers['X-WP-Nonce'] = nonce;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// ============================================================================
// DEBUG HELPERS (apenas em desenvolvimento)
// ============================================================================

if (import.meta.env.DEV) {
  console.log('[API Config] 🔧 Modo Desenvolvimento');
  console.log('[API Config] 📍 REST URL:', getRestUrl());
  console.log('[API Config] 🌐 Site URL:', getSiteUrl());
}

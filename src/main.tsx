/**
 * @file src/main.tsx
 * @description Entry point do React com CSP Nonce Integration (Híbrido)
 * @author DJ Zen Eyer Team
 * @created 2025-10-30
 * @updated 2025-10-30
 *
 * 🔒 SEGURANÇA:
 * - Recupera nonce dinâmico do Plugin PHP
 * - Aplica nonce em todos os inline scripts
 * - Fallback seguro para ambientes sem WordPress
 * - Error handling robusto
 *
 * 📊 DEBUG:
 * - Logs detalhados no console
 * - Verificação de estado do nonce
 * - Diagnóstico de falhas
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import './index.css';
import './i18n';

// ============================================
// TIPOS E INTERFACES
// ============================================

interface CSPNonceSource {
  type: 'meta-tag' | 'window-global' | 'body-attribute' | 'fallback';
  nonce: string;
  source: string;
}

interface WindowWithNonce extends Window {
  __CSP_NONCE__?: string;
  __vite_nonce__?: string;
  __webpack_nonce__?: string;
  wpData?: {
    siteUrl: string;
    restUrl: string;
    nonce: string;
    cspNonce?: string;
  };
}

// ============================================
// LOGGER UTILITY
// ============================================

class AppLogger {
  private isDev = import.meta.env.DEV;

  log(section: string, message: string, data?: any) {
    if (this.isDev) {
      const style = 'color: #0D96FF; font-weight: bold;';
      console.log(`%c[${section}]%c ${message}`, style, 'color: inherit;', data || '');
    }
  }

  warn(section: string, message: string, data?: any) {
    const style = 'color: #FFA500; font-weight: bold;';
    console.warn(`%c[${section}]%c ⚠️ ${message}`, style, 'color: inherit;', data || '');
  }

  error(section: string, message: string, error?: any) {
    const style = 'color: #FF0000; font-weight: bold;';
    console.error(`%c[${section}]%c ❌ ${message}`, style, 'color: inherit;', error || '');
  }

  success(section: string, message: string, data?: any) {
    const style = 'color: #00AA00; font-weight: bold;';
    console.log(`%c[${section}]%c ✅ ${message}`, style, 'color: inherit;', data || '');
  }
}

const logger = new AppLogger();

// ============================================
// CSP NONCE MANAGER
// ============================================

class CSPNonceManager {
  private static readonly DEFAULT_NONCE = 'fallback-nonce-' + Date.now();
  private nonce: string = '';
  private source: CSPNonceSource['type'] = 'fallback';

  /**
   * Recupera nonce de múltiplas fontes com prioridade
   */
  public initialize(): string {
    logger.log('CSPNonce', 'Inicializando detecção de nonce...');

    // Prioridade 1: Meta tag (Plugin PHP - RECOMENDADO)
    const metaNonce = this.getFromMetaTag();
    if (metaNonce) {
      this.nonce = metaNonce;
      this.source = 'meta-tag';
      logger.success('CSPNonce', 'Nonce encontrado em <meta> tag', {
        nonce: metaNonce.substring(0, 10) + '...',
        source: 'Plugin PHP (Híbrido)'
      });
      return metaNonce;
    }

    // Prioridade 2: Window global (Plugin PHP - alternativa)
    const windowNonce = this.getFromWindow();
    if (windowNonce) {
      this.nonce = windowNonce;
      this.source = 'window-global';
      logger.success('CSPNonce', 'Nonce encontrado em window.__CSP_NONCE__', {
        nonce: windowNonce.substring(0, 10) + '...',
        source: 'Plugin PHP (Window)'
      });
      return windowNonce;
    }

    // Prioridade 3: Atributo data- no body
    const bodyNonce = this.getFromBodyAttribute();
    if (bodyNonce) {
      this.nonce = bodyNonce;
      this.source = 'body-attribute';
      logger.success('CSPNonce', 'Nonce encontrado em data-csp-nonce', {
        nonce: bodyNonce.substring(0, 10) + '...',
        source: 'WordPress Header'
      });
      return bodyNonce;
    }

    // Prioridade 4: wpData (Fallback para WP REST API)
    const wpDataNonce = this.getFromWPData();
    if (wpDataNonce) {
      this.nonce = wpDataNonce;
      this.source = 'window-global';
      logger.warn('CSPNonce', 'Usando nonce de wpData (fallback)', {
        nonce: wpDataNonce.substring(0, 10) + '...',
        source: 'WordPress localize_script'
      });
      return wpDataNonce;
    }

    // Fallback: Gera um nonce local (não recomendado para produção)
    logger.warn('CSPNonce', 'Nenhum nonce encontrado! Usando fallback local', {
      warning: 'Isso indica que o Plugin CSP não está ativo ou falhou',
      recommendation: 'Verifique se "djzeneyer-csp" está ativado em Plugins'
    });

    this.nonce = CSPNonceManager.DEFAULT_NONCE;
    this.source = 'fallback';
    return this.nonce;
  }

  /**
   * Recupera nonce do meta tag (melhor forma)
   */
  private getFromMetaTag(): string | null {
    try {
      const metaTag = document.querySelector('meta[name="csp-nonce"]');
      return metaTag?.getAttribute('content') || null;
    } catch (error) {
      logger.error('CSPNonce', 'Erro ao recuperar nonce do meta tag', error);
      return null;
    }
  }

  /**
   * Recupera nonce do window global
   */
  private getFromWindow(): string | null {
    try {
      const win = window as WindowWithNonce;
      return win.__CSP_NONCE__ || null;
    } catch (error) {
      logger.error('CSPNonce', 'Erro ao recuperar nonce do window', error);
      return null;
    }
  }

  /**
   * Recupera nonce do atributo data- no body
   */
  private getFromBodyAttribute(): string | null {
    try {
      return document.body.getAttribute('data-csp-nonce');
    } catch (error) {
      logger.error('CSPNonce', 'Erro ao recuperar nonce do body attribute', error);
      return null;
    }
  }

  /**
   * Recupera nonce de wpData (localize_script)
   */
  private getFromWPData(): string | null {
    try {
      const win = window as WindowWithNonce;
      return win.wpData?.cspNonce || null;
    } catch (error) {
      logger.error('CSPNonce', 'Erro ao recuperar nonce de wpData', error);
      return null;
    }
  }

  /**
   * Retorna o nonce configurado
   */
  public getNonce(): string {
    return this.nonce;
  }

  /**
   * Retorna a fonte do nonce
   */
  public getSource(): CSPNonceSource['type'] {
    return this.source;
  }

  /**
   * Aplica nonce em builders do React/Webpack
   */
  public applyToBuilders(): void {
    if (!this.nonce) {
      logger.warn('CSPNonce', 'Nonce vazio, não pode aplicar aos builders');
      return;
    }

    const win = window as WindowWithNonce;

    // Vite
    if (import.meta.env.PROD) {
      win.__vite_nonce__ = this.nonce;
      logger.log('CSPNonce', 'Nonce aplicado a Vite');
    }

    // Webpack (fallback para versões antigas)
    win.__webpack_nonce__ = this.nonce;
    logger.log('CSPNonce', 'Nonce aplicado a Webpack');
  }

  /**
   * Diagnóstico completo de CSP
   */
  public diagnose(): void {
    logger.log('CSPNonce', '=== DIAGNÓSTICO DE CSP ===');
    logger.log('CSPNonce', 'Environment', { isDev: import.meta.env.DEV });
    logger.log('CSPNonce', 'Nonce encontrado', {
      nonce: this.nonce.substring(0, 10) + '...',
      source: this.source,
      length: this.nonce.length
    });

    const win = window as WindowWithNonce;
    logger.log('CSPNonce', 'Window globals', {
      hasCSPNonce: !!win.__CSP_NONCE__,
      hasViteNonce: !!win.__vite_nonce__,
      hasWebpackNonce: !!win.__webpack_nonce__,
      hasWpData: !!win.wpData
    });

    const metaTag = document.querySelector('meta[name="csp-nonce"]');
    const bodyAttr = document.body.getAttribute('data-csp-nonce');
    logger.log('CSPNonce', 'DOM attributes', {
      hasMetaTag: !!metaTag,
      hasBodyAttribute: !!bodyAttr
    });
  }
}

// ============================================
// VERIFICAÇÃO DE ELEMENTO ROOT
// ============================================

function checkRootElement(): boolean {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    logger.error('Main', 'Elemento #root não encontrado!', {
      availableElements: {
        body: !!document.body,
        html: !!document.documentElement,
        documentReady: document.readyState
      }
    });
    return false;
  }

  logger.success('Main', 'Elemento #root encontrado');
  return true;
}

// ============================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================

async function initializeApp(): Promise<void> {
  try {
    logger.log('Main', '🚀 Inicializando DJ Zen Eyer App v1.0');

    // 1. Inicializa CSP Nonce
    const nonceManager = new CSPNonceManager();
    const nonceValue = nonceManager.initialize();

    // 2. Aplica nonce em builders
    nonceManager.applyToBuilders();

    // 3. Diagnóstico em dev
    if (import.meta.env.DEV) {
      nonceManager.diagnose();
    }

    // 4. Verifica wpData
    const win = window as WindowWithNonce;
    if (win.wpData) {
      logger.success('Main', 'wpData disponível', {
        siteUrl: win.wpData.siteUrl,
        restUrl: win.wpData.restUrl,
        hasNonce: !!win.wpData.nonce
      });
    } else {
      logger.warn('Main', 'wpData não encontrado (pode estar OK em SPA puro)');
    }

    // 5. Verifica elemento root
    if (!checkRootElement()) {
      throw new Error('Elemento #root não encontrado no DOM');
    }

    // 6. Monta React
    const rootElement = document.getElementById('root')!;
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <BrowserRouter>
            <UserProvider>
              <App />
            </UserProvider>
          </BrowserRouter>
        </HelmetProvider>
      </React.StrictMode>
    );

    logger.success('Main', 'Aplicação montada com sucesso', {
      nonce: nonceValue.substring(0, 10) + '...',
      source: nonceManager.getSource(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Main', 'Falha crítica durante inicialização', error);

    // Fallback: Mostrar mensagem de erro no DOM
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #1a1a1a;
          color: #fff;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1>😞 Erro ao Carregar a Aplicação</h1>
            <p>Verifique o console para mais detalhes.</p>
            <pre style="
              background: #2a2a2a;
              padding: 15px;
              border-radius: 8px;
              overflow-x: auto;
              text-align: left;
              color: #0D96FF;
            ">${error instanceof Error ? error.message : String(error)}</pre>
          </div>
        </div>
      `;
    }

    throw error;
  }
}

// ============================================
// INICIA A APLICAÇÃO
// ============================================

if (document.readyState === 'loading') {
  // DOM ainda está carregando
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM já está pronto
  initializeApp();
}

// ============================================
// EXPORT PARA TESTES
// ============================================

export { CSPNonceManager, AppLogger };

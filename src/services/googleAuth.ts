// src/services/googleAuth.ts

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

let isGoogleSDKLoaded = false;
let googleSDKLoadPromise: Promise<void> | null = null;

/**
 * Carrega o SDK do Google Sign-In
 */
export const loadGoogleSDK = (): Promise<void> => {
  // Se já está carregado, retorna imediatamente
  if (isGoogleSDKLoaded) {
    return Promise.resolve();
  }

  // Se já está carregando, retorna a promise existente
  if (googleSDKLoadPromise) {
    return googleSDKLoadPromise;
  }

  console.log('[GoogleAuth] 📦 Carregando Google SDK...');

  googleSDKLoadPromise = new Promise((resolve, reject) => {
    // Verifica se o script já existe
    if (document.getElementById('google-signin-script')) {
      console.log('[GoogleAuth] ✅ Script já existe no DOM');
      isGoogleSDKLoaded = true;
      resolve();
      return;
    }

    // Cria o script
    const script = document.createElement('script');
    script.id = 'google-signin-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('[GoogleAuth] ✅ Google SDK carregado com sucesso');
      isGoogleSDKLoaded = true;
      resolve();
    };

    script.onerror = (error) => {
      console.error('[GoogleAuth] ❌ Erro ao carregar Google SDK:', error);
      googleSDKLoadPromise = null;
      reject(new Error('Falha ao carregar Google SDK'));
    };

    document.head.appendChild(script);
  });

  return googleSDKLoadPromise;
};

/**
 * Inicializa o botão do Google Sign-In
 */
export const initializeGoogleButton = async (
  element: HTMLElement,
  onSuccess: (credential: string) => void | Promise<void>
): Promise<void> => {
  try {
    console.log('[GoogleAuth] 🔵 Inicializando botão do Google...');

    // Carrega o SDK se necessário
    await loadGoogleSDK();

    // Verifica se o SDK está disponível
    if (!window.google?.accounts?.id) {
      throw new Error('Google SDK não está disponível após carregamento');
    }

    // Pega o Client ID do ambiente
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('[GoogleAuth] ❌ VITE_GOOGLE_CLIENT_ID não encontrado no .env');
      throw new Error('Google Client ID não configurado. Adicione VITE_GOOGLE_CLIENT_ID ao arquivo .env');
    }

    console.log('[GoogleAuth] 🔑 Client ID encontrado:', clientId.substring(0, 20) + '...');

    // Inicializa o Google Sign-In
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        console.log('[GoogleAuth] ✅ Credencial recebida do Google');
        try {
          await onSuccess(response.credential);
        } catch (error) {
          console.error('[GoogleAuth] ❌ Erro no callback:', error);
        }
      },
    });

    // Renderiza o botão
    window.google.accounts.id.renderButton(element, {
      theme: 'filled_blue',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: element.offsetWidth || 300,
    });

    console.log('[GoogleAuth] ✅ Botão renderizado com sucesso');
  } catch (error) {
    console.error('[GoogleAuth] ❌ Erro ao inicializar botão:', error);
    throw error;
  }
};

/**
 * Limpa o estado do SDK (útil para testes)
 */
export const resetGoogleSDK = (): void => {
  isGoogleSDKLoaded = false;
  googleSDKLoadPromise = null;
  const script = document.getElementById('google-signin-script');
  if (script) {
    script.remove();
  }
};

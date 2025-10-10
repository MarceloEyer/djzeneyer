// src/services/googleAuth.ts

/**
 * Serviço de autenticação Google OAuth + Simple JWT Login
 * Integra login social com backend WordPress
 */

interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

interface JWTResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    name: string;
    display_name: string;
  };
}

export class GoogleAuthService {
  private clientId: string;
  private wpRestUrl: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    this.wpRestUrl = import.meta.env.VITE_WP_REST_URL || `${window.location.origin}/wp-json/`;

    console.log('[GoogleAuthService] Inicializado');
    console.log('[GoogleAuthService] Client ID:', this.clientId ? 'definido' : 'AUSENTE');
    console.log('[GoogleAuthService] WP REST URL:', this.wpRestUrl);
  }

  /**
   * Inicializa o Google Sign-In button
   */
  initializeGoogleButton(buttonElement: HTMLElement): void {
    if (!this.clientId) {
      console.error('[GoogleAuthService] ❌ VITE_GOOGLE_CLIENT_ID não está definido no .env');
      return;
    }

    console.log('[GoogleAuthService] 🔄 Inicializando botão Google Sign-In');

    // Carrega a biblioteca Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('[GoogleAuthService] ✅ Google Identity Services carregado');
      this.renderGoogleButton(buttonElement);
    };
    document.head.appendChild(script);
  }

  /**
   * Renderiza o botão Google Sign-In
   */
  private renderGoogleButton(buttonElement: HTMLElement): void {
    if (typeof window.google === 'undefined') {
      console.error('[GoogleAuthService] ❌ Google Identity Services não carregou');
      return;
    }

    console.log('[GoogleAuthService] 🎨 Renderizando botão Google');

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleGoogleCallback.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(buttonElement, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'filled_blue',
      text: 'signin_with',
      size: 'large',
      width: buttonElement.offsetWidth,
    });

    console.log('[GoogleAuthService] ✅ Botão Google renderizado');
  }

  /**
   * Callback do Google após login bem-sucedido
   */
  private async handleGoogleCallback(response: GoogleAuthResponse): Promise<void> {
    console.log('[GoogleAuthService] 🔐 Callback do Google recebido');
    console.log('[GoogleAuthService] Credential recebido:', response.credential.substring(0, 50) + '...');

    try {
      // Envia o token Google para o backend WordPress
      const jwt = await this.exchangeGoogleTokenForJWT(response.credential);
      console.log('[GoogleAuthService] ✅ JWT obtido:', jwt.substring(0, 50) + '...');

      // Salva JWT no localStorage
      localStorage.setItem('jwt_token', jwt);

      // Recarrega a página para atualizar o estado do usuário
      console.log('[GoogleAuthService] 🔄 Recarregando página...');
      window.location.reload();
    } catch (error) {
      console.error('[GoogleAuthService] ❌ Erro no login Google:', error);
      alert('Erro ao fazer login com Google. Tente novamente.');
    }
  }

  /**
   * Troca o token Google por JWT do WordPress
   */
  private async exchangeGoogleTokenForJWT(googleToken: string): Promise<string> {
    console.log('[GoogleAuthService] 📡 Trocando token Google por JWT');

    const endpoint = `${this.wpRestUrl}simple-jwt-login/v1/auth/google`;
    console.log('[GoogleAuthService] Endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: googleToken,
      }),
    });

    console.log('[GoogleAuthService] Status da resposta:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[GoogleAuthService] ❌ Erro na API:', errorData);
      throw new Error(`Falha ao autenticar: ${response.status}`);
    }

    const data: JWTResponse = await response.json();
    console.log('[GoogleAuthService] ✅ Dados recebidos:', {
      userId: data.user.id,
      userEmail: data.user.email,
      userName: data.user.name,
    });

    return data.jwt;
  }

  /**
   * Login manual (email + senha) via Simple JWT Login
   */
  async loginWithEmailPassword(email: string, password: string): Promise<string> {
    console.log('[GoogleAuthService] 🔐 Login via email/senha');
    console.log('[GoogleAuthService] Email:', email);

    const endpoint = `${this.wpRestUrl}simple-jwt-login/v1/auth`;
    console.log('[GoogleAuthService] Endpoint:', endpoint);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log('[GoogleAuthService] Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[GoogleAuthService] ❌ Erro na API:', errorData);
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      console.log('[GoogleAuthService] ✅ Login bem-sucedido');
      console.log('[GoogleAuthService] JWT recebido:', data.jwt?.substring(0, 50) + '...');

      return data.jwt;
    } catch (error: any) {
      console.error('[GoogleAuthService] ❌ Erro no login:', error);
      throw error;
    }
  }

  /**
   * Valida JWT armazenado
   */
  async validateStoredJWT(): Promise<boolean> {
    const jwt = localStorage.getItem('jwt_token');

    if (!jwt) {
      console.log('[GoogleAuthService] ⚠️ JWT não encontrado no localStorage');
      return false;
    }

    console.log('[GoogleAuthService] 🔍 Validando JWT armazenado');

    const endpoint = `${this.wpRestUrl}simple-jwt-login/v1/auth/validate`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      });

      console.log('[GoogleAuthService] Status da validação:', response.status);

      if (!response.ok) {
        console.error('[GoogleAuthService] ❌ JWT inválido ou expirado');
        localStorage.removeItem('jwt_token');
        return false;
      }

      console.log('[GoogleAuthService] ✅ JWT válido');
      return true;
    } catch (error) {
      console.error('[GoogleAuthService] ❌ Erro ao validar JWT:', error);
      return false;
    }
  }
}

// Export singleton instance
export const googleAuth = new GoogleAuthService();

// Adiciona tipos ao objeto window
declare global {
  interface Window {
    google: any;
  }
}

// src/services/googleAuth.ts

// TypeScript declarations for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdentityConfig) => void;
          renderButton: (element: HTMLElement, options: GoogleButtonConfig) => void;
          prompt: (callback?: (notification: PromptNotification) => void) => void;
        };
      };
    };
  }
}

interface GoogleIdentityConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  type?: 'standard' | 'icon';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface PromptNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
}

interface GoogleAuthService {
  initializeGoogleButton: (element: HTMLElement, onSuccess: (credential: string) => void) => void;
  destroy: (element: HTMLElement) => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const googleAuth: GoogleAuthService = {
  initializeGoogleButton: (element, onSuccess) => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is not defined.");
      return;
    }

    if (typeof window !== 'undefined' && window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: GoogleCredentialResponse) => {
          console.log("Google credential received");
          // Chama o callback de sucesso com o credential token
          onSuccess(response.credential);
        }
      });
      
      window.google.accounts.id.renderButton(
        element,
        { 
          theme: "outline", 
          size: "large", 
          type: "standard", 
          text: "signin_with" 
        }
      );
      
      // Opcional: mostra o pop-up de "One Tap"
      // window.google.accounts.id.prompt();
    } else {
      console.error("Google Identity Services script not loaded.");
    }
  },
  
  destroy: (element) => {
    // A API do Google não tem um método de "destroy" para o botão renderizado,
    // mas limpar o innerHTML é uma alternativa válida.
    if (element) {
      element.innerHTML = '';
    }
  }
};

// src/services/googleAuth.ts

interface GoogleAuthService {
  initializeGoogleButton: (element: HTMLElement) => void;
  destroy: (element: HTMLElement) => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const handleCredentialResponse = (response: any) => {
  console.log("Encoded JWT ID token: " + response.credential);
  // Aqui, você enviaria o `response.credential` para o seu backend para validação e login.
  // Por exemplo, para um endpoint /auth/google
  // fetch(`${window.wpData.restUrl}simple-jwt-login/v1/auth/google`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ jwt: response.credential })
  // });
};

export const googleAuth: GoogleAuthService = {
  initializeGoogleButton: (element) => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is not defined.");
      return;
    }

    if (typeof window.google !== 'undefined' && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        element,
        { theme: "outline", size: "large", type: "standard", text: "signin_with" }
      );
      // window.google.accounts.id.prompt(); // Opcional: mostra o pop-up de "One Tap"
    } else {
        console.error("Google Identity Services script not loaded.");
    }
  },
  destroy: (element) => {
    // A API do Google não tem um método de "destroy" para o botão renderizado,
    // mas se tivesse, a lógica estaria aqui. Limpar o innerHTML é uma alternativa.
    if (element) {
        element.innerHTML = '';
    }
  }
};
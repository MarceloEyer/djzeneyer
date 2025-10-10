// src/services/googleAuth.ts
import { UserContextType } from '../contexts/UserContext';

export const loadGoogleIdentityScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));
    if ((window as any).google?.accounts) return resolve();
    
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Google script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google script failed to load'));
    document.head.appendChild(script);
  });
};

const handleCredentialResponse = async (response: any, userContext: UserContextType) => {
  if (!response?.credential) {
    console.error('Google response missing credential');
    return;
  }
  try {
    // Chama a função que criaremos no UserContext
    await userContext.loginWithGoogleToken(response.credential);
  } catch (err) {
    console.error('Error exchanging Google token:', err);
  }
};

export const initializeGoogleButton = async (element: HTMLElement | null, userContext: UserContextType) => {
  if (!element) return;
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!CLIENT_ID) {
    console.error('VITE_GOOGLE_CLIENT_ID is not defined');
    return;
  }

  try {
    await loadGoogleIdentityScript();
    
    if (typeof (window as any).google?.accounts?.id === 'undefined') {
        throw new Error('Google Identity Services not available after script load');
    }

    (window as any).google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (resp: any) => handleCredentialResponse(resp, userContext),
    });

    element.innerHTML = ''; // Limpa o botão anterior para evitar duplicatas
    (window as any).google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      width: '300' // Largura fixa para consistência
    });
  } catch (err) {
    console.error('Error initializing Google button', err);
  }
};
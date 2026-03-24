import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n';

// Definição global da interface
declare global {
  interface Window {
    wpData?: {
      rootUrl?: string;
      siteUrl?: string;
      restUrl: string;
      nonce: string;
    };
  }
}

if (import.meta.env.DEV) {
  console.log('[Main] 🚀 Inicializando aplicação DJ Zen Eyer...');

  // Verifica se wpData está disponível
  if (window.wpData) {
    console.log('[Main] ✅ wpData encontrado:', {
      siteUrl: window.wpData.rootUrl || window.wpData.siteUrl,
      restUrl: window.wpData.restUrl,
      hasNonce: !!window.wpData.nonce,
    });
  } else {
    console.warn('[Main] ⚠️ wpData não encontrado no window');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O BrowserRouter é essencial aqui para o useRoutes funcionar lá dentro */}
    <BrowserRouter>
      {/* Removemos o UserProvider daqui pois ele já está dentro do App.tsx */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (import.meta.env.DEV) {
  console.log('[Main] ✅ Aplicação montada com sucesso');
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext'; 
import './index.css';
import './i18n';

// Definição global da interface (Assumindo que está em um global.d.ts ou similar)
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

console.log('[Main] 🚀 Inicializando aplicação DJ Zen Eyer...');

// Verifica se wpData está disponível
if (window.wpData) {
  console.log('[Main] ✅ wpData encontrado:', {
    siteUrl: window.wpData.siteUrl,
    restUrl: window.wpData.restUrl,
    hasNonce: !!window.wpData.nonce
  });
} else {
  console.warn('[Main] ⚠️ wpData não encontrado no window');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

console.log('[Main] ✅ Aplicação montada com sucesso');
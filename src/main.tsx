// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import './index.css';
import './i18n';

console.log('[Main] 🚀 Inicializando aplicação DJ Zen Eyer...');

if (window.wpData) {
  console.log('[Main] ✅ wpData encontrado:', {
    siteUrl: window.wpData.siteUrl,
    restUrl: window.wpData.restUrl,
    hasNonce: !!window.wpData.nonce
  });
} else {
  console.warn('[Main] ⚠️ wpData não encontrado no window');
}

// Só monta o app se o container #root existir
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
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
  console.log('[Main] ✅ Aplicação montada com sucesso');
} else {
  console.warn('[Main] ⚠️ Elemento #root não encontrado. App não montado.');
}
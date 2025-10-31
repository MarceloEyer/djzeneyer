// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  css: {
    postcss: {
      plugins: [
        tailwindcss('./tailwind.config.js'),
        autoprefixer(),
      ],
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    // ✅ REMOVIDO: "external" (evita bloquear arquivos locais)
    // external: [ ... ] ← REMOVIDO

    rollupOptions: {
      // ✅ Input simples (Vite encontra o index.html automaticamente)
      input: resolve(__dirname, 'index.html'),

      output: {
        // ✅ Code splitting (otimiza o carregamento)
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  // ✅ ADICIONADO: Configuração para desenvolvimento local
  server: {
    open: true,
    port: 3000,
  },
});

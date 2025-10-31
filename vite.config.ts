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
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: [
        /^\/public\//,
        /^\/scripts\//,
        /^\/plugins\//,
        /^\/inc\//, // Ignora a pasta inc (PHP)
        /^\/wp-/,
        /^\/bolt\.new/,
      ],
      output: {
        // Otimiza code splitting para bibliotecas grandes
        manualChunks: {
          react: ['react', 'react-dom'],
          spotify: ['@spotify/web-api-js-sdk'],
          // Adicione outras bibliotecas grandes aqui
        },
      },
    },
  },
});

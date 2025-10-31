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
        // Ignora pastas específicas (backend)
        /^\/public\//,
        /^\/scripts\//,
        /^\/plugins\//,
        /^\/inc\//, // Ignora a pasta inc (PHP)
        // Ignora dependências do WordPress/Bolt.new
        /^\/wp-/,
        /^\/bolt\.new/,
      ],
    },
  },
});

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
      plugins: [tailwindcss('./tailwind.config.js'), autoprefixer()],
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
        // Ignora pastas específicas
        /^\/public\//,
        /^\/scripts\//,
        /^\/plugins\//,
        // Ignora dependências que não devem ser bundladas (ex: WordPress, Bolt.new)
        /^\/wp-/,
        /^\/bolt\.new/,
      ],
    },
  },
});

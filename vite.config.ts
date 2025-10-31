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
    
    // ✅ REMOVA "external" - causa problemas!
    // external: [ ... ] ← DELETE ISTO
    
    rollupOptions: {
      // ✅ Input simples (Vite encontra sozinho)
      input: resolve(__dirname, 'index.html'),
      
      output: {
        // ✅ Code splitting (mantém, é bom)
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  // ✅ ADICIONE isto para desenvolvimento local
  server: {
    open: true,
    port: 3000,
  },
});

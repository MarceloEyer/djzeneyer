// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Correto para o desenvolvimento no bolt.new, HTTPS desativado.
    // https: true,
  },
  build: {
    // Output to WordPress theme directory
    outDir: 'dist',
    // Generate manifest for WordPress enqueue
    manifest: true,

    // ADIÇÃO RECOMENDADA: Garante uma build de produção limpa e otimizada
    minify: 'terser', // Usa o minificador 'terser'
    terserOptions: {
      compress: {
        drop_console: true, // Remove todos os `console.log` do código final
      },
    },

    rollupOptions: {
      output: {
        // Ensure asset names are WordPress friendly
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
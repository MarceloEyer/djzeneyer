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
    outDir: 'dist',
    manifest: true,

    // A seção 'minify' e 'terserOptions' foi REMOVIDA.
    // O Vite agora usará o padrão 'esbuild' automaticamente durante o build.

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
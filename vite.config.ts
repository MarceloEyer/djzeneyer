// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importa o módulo 'path' do Node.js, necessário para o alias

export default defineConfig({
  plugins: [react()],
  server: {
    // Correto para o desenvolvimento no bolt.new, HTTPS desativado.
    // https: true,
  },
  build: {
    outDir: 'dist',
    manifest: true,
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
  // ADICIONADO: Configuração do atalho '@' para apontar para a pasta 'src'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
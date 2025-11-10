import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],

  server: {
    port: 5173,
    host: true, // Permite acesso externo (útil no Bolt.new)
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true, // Limpa a pasta dist antes de cada build
    manifest: true,   // Gera manifest para cache
    target: 'es2020', // Navegadores modernos (código menor)
    minify: 'esbuild', // Minificação rápida e eficiente
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true, // Remove debugger em produção
      },
    },
    sourcemap: false, // Desabilita sourcemaps em produção
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]', // Nomes com hash para cache
        chunkFileNames: 'assets/[name]-[hash].js',    // Nomes com hash para cache
        entryFileNames: 'assets/[name]-[hash].js',    // Nomes com hash para cache
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'], // Agrupa bibliotecas principais
          i18n: ['i18next', 'react-i18next'],                  // Agrupa i18n
          motion: ['framer-motion'],                          // Agrupa framer-motion
        },
      },
    },
    chunkSizeWarningLimit: 500, // Avisa se chunks > 500KB
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'], // Pré-carrega dependências críticas
    exclude: ['lucide-react'], // Evita pré-carregar lucide-react (pode causar problemas)
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Permite imports como @/components/Button
    },
  },
});

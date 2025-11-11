import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    host: true, // Permite acesso externo
  },

  build: {
    outDir: 'dist/assets', // Gera arquivos dentro de dist/assets
    emptyOutDir: true,
    manifest: true, // Gera manifest.json para WordPress
    target: 'es2020',
    minify: 'esbuild', // Usa esbuild para minificação
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'), // Corrigido para o entry real
      output: {
        assetFileNames: '[name]-[hash].[ext]',       // Corrigido: sem pasta "assets/"
        chunkFileNames: '[name]-[hash].js',           // Corrigido: sem pasta "assets/"
        entryFileNames: '[name]-[hash].js',           // Corrigido: sem pasta "assets/"
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

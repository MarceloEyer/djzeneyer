import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import removeConsole from 'vite-plugin-remove-console';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    removeConsole({
      exclude: ['error', 'warn'], // mantém console.error e console.warn
    }),
  ],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    manifest: true,
    target: 'es2015',
    minify: 'esbuild', // ← esbuild é mais rápido e nativo
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name].js',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
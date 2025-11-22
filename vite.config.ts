import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default {
  plugins: [react()],

  server: {
    port: 5173,
    host: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: false,
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    ssrManifest: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
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
      '@': resolve(import.meta.url.replace('file://', ''), '../src'),
    },
  },

  publicDir: 'public',
};

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // ✅ Caminho base para assets no WordPress
  base: '/wp-content/themes/zentheme/dist/',

  server: {
    port: 5173,
    open: false, // evita abrir navegador automaticamente
  },

  build: {
    outDir: 'dist',
    manifest: true,
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
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
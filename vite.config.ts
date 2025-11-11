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
    manifest: true, // Gera manifest.json
    target: 'es2020',
    minify: 'esbuild',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.tsx'), // ou index.js se for JS
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
      '@': path.resolve(__dirname, './src'),
    },
  },
});

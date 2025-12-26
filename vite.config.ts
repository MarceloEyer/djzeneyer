import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => {
  // Verifica se estamos construindo para produção
  const isProduction = command === 'build';

  return {
    plugins: [react()],

    // 👇 A CORREÇÃO DEFINITIVA (O "Pulo do Gato")
    // Em produção, aponta para a pasta exata do tema no WordPress.
    // Em desenvolvimento (localhost), mantém na raiz para não quebrar seu teste local.
    base: isProduction ? '/wp-content/themes/zentheme/dist/' : '/',

    server: {
      port: 5173,
      host: true,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Gera o manifesto para o PHP ler (CRÍTICO)
      manifest: true,
      
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2020',
      minify: 'terser',
      sourcemap: false,
      
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
        // CRÍTICO: Desabilita otimizações que usam eval
        ecma: 2020,
        safari10: true,
      },
      
      rollupOptions: {
        output: {
          // Nomes padronizados para evitar cache antigo
          assetFileNames: 'assets/[name]-[hash].[ext]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          
          // Separação inteligente de código
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            i18n: ['i18next', 'react-i18next'],
            motion: ['framer-motion'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['lucide-react'],
    },
  };
});
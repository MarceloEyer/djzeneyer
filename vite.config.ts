import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' || mode === 'production';

  return {
    plugins: [
      react(),
      // Gzip compression (suportado pelo servidor Hostinger)
      isProduction && viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024, // Só comprime arquivos > 1KB
        deleteOriginFile: false,
      }),
      // Brotli compression (melhor taxa para Cloudflare/CDN)
      isProduction && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
      }),
    ].filter(Boolean),

    publicDir: 'public',

    // BASE PATH para o Headless WordPress
    base: command === 'serve' ? '/' : '/wp-content/themes/zentheme/dist/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      manifest: true,
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2020',

      // Minificação com hardening para evitar transformações inseguras
      minify: 'terser',
      sourcemap: false,

      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          evaluate: false,
          unsafe: false,
        },
        format: {
          comments: false,
        },
      },

      modulePreload: {
        resolveDependencies: (_url, deps) => {
          // Evita pré-carregar chunks estritamente opcionais (auth/quiz)
          return deps.filter(
            (dep) =>
              !dep.includes('AuthModal') &&
              !dep.includes('auth-vendors') &&
              !dep.includes('ZoukPersonaQuizPage') &&
              !dep.includes('quiz')
          );
        },
      },

      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash].[ext]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              if (id.includes('ZoukPersonaQuizPage') || id.includes('/locales/') && id.includes('quiz.json')) {
                return 'quiz';
              }
              return undefined;
            }

            if (id.includes('@react-oauth/google') || id.includes('@marsidev/react-turnstile')) {
              return 'auth-vendors';
            }

            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }

            if (id.includes('framer-motion')) {
              return 'motion';
            }

            if (
              id.includes('react-router') ||
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('@tanstack/react-query')
            ) {
              return 'vendor-core';
            }

            return 'vendor';
          },
        },
      },
    },
  };
});

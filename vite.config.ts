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

    // 🚀 BASE PATH: Importante para o Headless WordPress
    // Em produção, os assets ficam na pasta do tema.
    // No dev local (npm run dev) ou Prerender (CI), usamos '/' para o Preview funcionar sem subpastas.
    base: (command === 'serve' || process.env.PRERENDER_MODE === 'true') ? '/' : '/wp-content/themes/zentheme/dist/',

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

      // 🔒 PULO DO GATO ANTI-EVAL
      minify: 'terser',
      sourcemap: false,

      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          // Segurança
          evaluate: false,
          unsafe: false,
        },
        format: {
          comments: false,
        },
      },

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
    },
  };
});

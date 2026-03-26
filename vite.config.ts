import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' || mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
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
    // No dev local (npm run dev), usamos '/' para o Preview funcionar sem subpastas.
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
      // Vite 8 uses OXC (Rolldown) by default — faster than terser/esbuild, no extra deps needed
      sourcemap: false,

      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash].[ext]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('framer-motion')) return 'vendor-motion';
              if (id.includes('i18next')) return 'vendor-i18n';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

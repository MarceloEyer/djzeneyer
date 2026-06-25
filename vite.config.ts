import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' || mode === 'production';
  const shouldCompressAssets = isProduction && process.platform !== 'win32';
  const compressibleAssetPattern = /\.(js|mjs|css|html|svg|json|xml|txt|webmanifest)$/i;

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Gzip compression (suportado pelo servidor Hostinger)
      shouldCompressAssets && viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024, // Só comprime arquivos > 1KB
        deleteOriginFile: false,
        verbose: false,
        filter: compressibleAssetPattern,
      }),
      // Brotli compression (melhor taxa para Cloudflare/CDN)
      shouldCompressAssets && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
        verbose: false,
        filter: compressibleAssetPattern,
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

    // framer-motion and lucide-react have many sub-modules that can stall the
    // Vite pre-bundler in memory-constrained environments (containers, CI).
    // They are already split into their own vendor chunks at build time so
    // excluding them from optimizeDeps is safe and consistent.
    optimizeDeps: {
      exclude: ['framer-motion', 'lucide-react'],
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
            if (id.includes('framer-motion')) return;
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('i18next')) return 'vendor-i18n';
              if (id.includes('@tanstack')) return 'vendor-query';
              if (id.includes('lucide')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

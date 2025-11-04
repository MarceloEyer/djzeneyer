import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  return {
    plugins: [
      react({
        // Fast Refresh otimizado
        fastRefresh: isDev,
      }),
    ],

    // Base path para produção WordPress
    base: isProd ? '/wp-content/themes/zentheme/dist/' : '/',

    // Resolve aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },

    // Development server
    server: {
      port: 3000,
      host: true,
      strictPort: false,
      open: true,
      cors: true,
      proxy: {
        // Proxy para WordPress REST API em desenvolvimento
        '/wp-json': {
          target: env.VITE_WP_SITE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: isDev,
      minify: isProd ? 'esbuild' : false,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['framer-motion', 'lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // Optimization
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },

    // CSS configuration
    css: {
      devSourcemap: isDev,
      modules: {
        localsConvention: 'camelCase',
      },
    },

    // Preview configuration
    preview: {
      port: 3000,
      host: true,
      strictPort: false,
      open: true,
    },

    // Environment variables
    envPrefix: 'VITE_',

    // Clear screen
    clearScreen: false,
  };
});
/**
 * Vite Configuration for DJ Zen Eyer WordPress Theme
 * Framework: React 18 + TypeScript
 * Build Target: ES2015 (IE11 compatible)
 * 
 * Usage: vite dev | vite build
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: ['@babel/plugin-transform-runtime'],
      },
    }),
    // Bundle analyzer (optional, remove for production)
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as any,
  ],

  // ✅ WordPress theme assets path
  base: '/wp-content/themes/zentheme/dist/',

  // ============================================
  // 🔧 DEV SERVER
  // ============================================
  server: {
    port: 5173,
    open: false,
    // Proxy WordPress API requests
    proxy: {
      '/wp-json': {
        target: 'http://localhost:8000', // Your WordPress dev URL
        changeOrigin: true,
      },
    },
    // HMR for development
    hmr: {
      protocol: 'http',
      host: 'localhost',
      port: 5173,
    },
  },

  // ============================================
  // 🏗️ BUILD CONFIGURATION
  // ============================================
  build: {
    outDir: 'dist',
    manifest: 'manifest.json', // For WordPress enqueue
    target: 'es2015', // ES2015 = IE11 support
    minify: 'terser',
    sourcemap: false, // Set to 'true' for debugging
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // More aggressive compression
      },
      mangle: {
        safari10: true, // Safari 10 compatibility
      },
      output: {
        comments: false, // Remove comments
      },
    },

    // ============================================
    // 📦 CHUNK SPLITTING STRATEGY
    // ============================================
    rollupOptions: {
      output: {
        // CSS handling
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/styles/[name].[hash][extname]';
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/images/[name].[hash][extname]';
        },

        // JS chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return 'assets/chunks/[name]-[hash].js';
        },

        // Entry points
        entryFileNames: 'assets/[name].[hash].js',

        // Manual chunks for better caching
        manualChunks: {
          // Core dependencies
          'vendor-core': ['react', 'react-dom'],
          
          // Routing
          'vendor-router': ['react-router-dom'],
          
          // Internationalization
          'vendor-i18n': ['i18next', 'react-i18next'],
          
          // Animation
          'vendor-motion': ['framer-motion'],
          
          // UI Libraries (if used)
          'vendor-ui': [
            'lucide-react',
            'tailwindcss', // if using tailwind
          ],
        },
      },
    },

    // Chunk size warning limit
    chunkSizeWarningLimit: 600,

    // CSS minification
    cssMinify: true,

    // Reduce emit size
    emptyOutDir: true,

    // Report compressed size
    reportCompressedSize: true,
  },

  // ============================================
  // ⚡ DEPENDENCY OPTIMIZATION
  // ============================================
  optimizeDeps: {
    // Exclude from pre-bundling
    exclude: ['lucide-react', '@wordpress/block-editor'],
    
    // Force include (pre-bundle)
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'i18next',
      'react-i18next',
      'framer-motion',
    ],

    // Hold optimization
    hold: ['lucide-react'],

    // Parallel processing
    force: process.env.VITE_FORCE_OPTIMIZE === 'true',
  },

  // ============================================
  // 🔗 RESOLVE ALIASES
  // ============================================
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@wp': path.resolve(__dirname, './src/wordpress'),
    },
  },

  // ============================================
  // 🌍 ENVIRONMENT VARIABLES
  // ============================================
  define: {
    'process.env.VITE_WORDPRESS_URL': JSON.stringify(
      process.env.VITE_WORDPRESS_URL || 'https://djzeneyer.com'
    ),
    'process.env.VITE_REST_API': JSON.stringify(
      process.env.VITE_REST_API || '/wp-json'
    ),
  },
});

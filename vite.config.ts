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
        // Babel config para produção
        babel: isProd ? {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        } : undefined,
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
      
      // Source maps apenas em dev
      sourcemap: isDev ? 'inline' : false,
      
      // Minification
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
      } : undefined,

      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunks para code splitting
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@tanstack') || id.includes('react-query')) {
                return 'vendor-query';
              }
              if (id.includes('axios') || id.includes('ky')) {
                return 'vendor-http';
              }
              return 'vendor';
            }
            
            // Component chunks
            if (id.includes('/src/components/')) {
              return 'components';
            }
            
            // Utils chunks
            if (id.includes('/src/utils/') || id.includes('/src/hooks/')) {
              return 'utils';
            }
          },
          
          // Naming pattern
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            
            if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(assetInfo.name || '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            
            if (ext === 'css') {
              return 'assets/css/[name]-[hash][extname]';
            }
            
            return 'assets/[name]-[hash][extname]';
          },
        },
      },

      // Chunk size warnings
      chunkSizeWarningLimit: 500, // KB
      
      // Asset inline limit
      assetsInlineLimit: 4096, // 4KB - inline smaller assets

      // CSS code splitting
      cssCodeSplit: true,
      
      // Report compressed size
      reportCompressedSize: true,
      
      // Target browsers
      target: 'es2015',
      
      // Polyfills
      polyfillModulePreload: true,
    },

    // CSS configuration
    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProd 
          ? '[hash:base64:8]' 
          : '[name]__[local]__[hash:base64:5]',
      },
      postcss: {
        plugins: [
          // PostCSS plugins serão carregados do postcss.config.js
        ],
      },
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      exclude: [
        // Exclude packages that should not be pre-bundled
      ],
      esbuildOptions: {
        target: 'es2015',
      },
    },

    // Environment variables prefix
    envPrefix: 'VITE_',

    // Define global constants
    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    // Preview server (para testar build)
    preview: {
      port: 4173,
      host: true,
      strictPort: false,
      open: true,
    },

    // Logging
    logLevel: 'info',
    clearScreen: true,

    // JSON options
    json: {
      namedExports: true,
      stringify: false,
    },
  };
});

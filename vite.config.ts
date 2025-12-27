import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Verifica se estamos rodando o build de produção
  const isProduction = command === 'build' || mode === 'production';

  return {
    plugins: [react()],

    // 👇 A vírgula mágica que faltava antes está aqui:
    publicDir: false, 

    // 👇 Caminho base para o tema
    base: isProduction ? '/wp-content/themes/zentheme/dist/' : '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 5173,
      host: true,
    },

    build: {
      manifest: true,
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2020',
      
      // ✅ AQUI TÁ A MÁGICA DO TERSER (Segurança + Leveza)
      minify: 'terser', 
      sourcemap: false,
      
      terserOptions: {
        compress: {
          drop_console: true, // Tchau console.log
          drop_debugger: true,
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
      chunkSizeWarningLimit: 1000,
    },
  };
});
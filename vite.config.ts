import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Verifica se estamos rodando o build de produção
  const isProduction = command === 'build' || mode === 'production';

  return {
    plugins: [react()],

    // ========================================================================
    // A CORREÇÃO CRÍTICA (PULO DO GATO) 🐈
    // ========================================================================
    // Isso diz ao navegador: "Não procure em /assets. Procure DENTRO do tema".
    // Se o nome da pasta do seu tema na Hostinger for diferente de 'zentheme', ajuste aqui.
    base: isProduction ? '/wp-content/themes/zentheme/dist/' : '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 5173,
      host: true, // Necessário para funcionar em containers/bolt
    },

    build: {
      // Gera o manifest.json para o inc/vite.php ler
      manifest: true,
      
      outDir: 'dist',
      emptyOutDir: true, // Limpa a pasta dist antes de gerar novos
      target: 'es2020',
      minify: 'terser',
      sourcemap: false, // Desliga sourcemaps em produção para economizar espaço
      
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log em produção
          drop_debugger: true,
        },
      },
      
      rollupOptions: {
        output: {
          // Nomes padronizados para cache busting
          assetFileNames: 'assets/[name]-[hash].[ext]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          
          // Separa bibliotecas grandes em arquivos menores
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
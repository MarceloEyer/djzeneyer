import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: true,
  },
  build: {
    // Output to WordPress theme directory
    outDir: 'dist',
    // Generate manifest for WordPress enqueue
    manifest: true,
    rollupOptions: {
      output: {
        // Ensure asset names are WordPress friendly
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
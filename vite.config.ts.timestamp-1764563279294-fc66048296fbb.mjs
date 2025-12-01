// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ command }) => {
  const isProduction = command === "build";
  return {
    plugins: [react()],
    // 👇 A CORREÇÃO DEFINITIVA (O "Pulo do Gato")
    // Em produção, aponta para a pasta exata do tema no WordPress.
    // Em desenvolvimento (localhost), mantém na raiz para não quebrar seu teste local.
    base: isProduction ? "/wp-content/themes/zentheme/dist/" : "/",
    server: {
      port: 5173,
      host: true
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      // Gera o manifesto para o PHP ler (CRÍTICO)
      manifest: true,
      outDir: "dist",
      emptyOutDir: true,
      target: "es2020",
      minify: "esbuild",
      sourcemap: false,
      // Desligado para performance máxima em produção
      rollupOptions: {
        output: {
          // Nomes padronizados para evitar cache antigo
          assetFileNames: "assets/[name]-[hash].[ext]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          // Separação inteligente de código
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            i18n: ["i18next", "react-i18next"],
            motion: ["framer-motion"]
          }
        }
      },
      chunkSizeWarningLimit: 600
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
      exclude: ["lucide-react"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xuICAvLyBWZXJpZmljYSBzZSBlc3RhbW9zIGNvbnN0cnVpbmRvIHBhcmEgcHJvZHVcdTAwRTdcdTAwRTNvXG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IGNvbW1hbmQgPT09ICdidWlsZCc7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG5cbiAgICAvLyBcdUQ4M0RcdURDNDcgQSBDT1JSRVx1MDBDN1x1MDBDM08gREVGSU5JVElWQSAoTyBcIlB1bG8gZG8gR2F0b1wiKVxuICAgIC8vIEVtIHByb2R1XHUwMEU3XHUwMEUzbywgYXBvbnRhIHBhcmEgYSBwYXN0YSBleGF0YSBkbyB0ZW1hIG5vIFdvcmRQcmVzcy5cbiAgICAvLyBFbSBkZXNlbnZvbHZpbWVudG8gKGxvY2FsaG9zdCksIG1hbnRcdTAwRTltIG5hIHJhaXogcGFyYSBuXHUwMEUzbyBxdWVicmFyIHNldSB0ZXN0ZSBsb2NhbC5cbiAgICBiYXNlOiBpc1Byb2R1Y3Rpb24gPyAnL3dwLWNvbnRlbnQvdGhlbWVzL3plbnRoZW1lL2Rpc3QvJyA6ICcvJyxcblxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNTE3MyxcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgfSxcblxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBidWlsZDoge1xuICAgICAgLy8gR2VyYSBvIG1hbmlmZXN0byBwYXJhIG8gUEhQIGxlciAoQ1JcdTAwQ0RUSUNPKVxuICAgICAgbWFuaWZlc3Q6IHRydWUsXG4gICAgICBcbiAgICAgIG91dERpcjogJ2Rpc3QnLFxuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLCAvLyBEZXNsaWdhZG8gcGFyYSBwZXJmb3JtYW5jZSBtXHUwMEUxeGltYSBlbSBwcm9kdVx1MDBFN1x1MDBFM29cbiAgICAgIFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyBOb21lcyBwYWRyb25pemFkb3MgcGFyYSBldml0YXIgY2FjaGUgYW50aWdvXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XScsXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU2VwYXJhXHUwMEU3XHUwMEUzbyBpbnRlbGlnZW50ZSBkZSBjXHUwMEYzZGlnb1xuICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgICBpMThuOiBbJ2kxOG5leHQnLCAncmVhY3QtaTE4bmV4dCddLFxuICAgICAgICAgICAgbW90aW9uOiBbJ2ZyYW1lci1tb3Rpb24nXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwLFxuICAgIH0sXG5cbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgfSxcbiAgfTtcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUUzQyxRQUFNLGVBQWUsWUFBWTtBQUVqQyxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLakIsTUFBTSxlQUFlLHNDQUFzQztBQUFBLElBRTNELFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFFQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFFQSxPQUFPO0FBQUE7QUFBQSxNQUVMLFVBQVU7QUFBQSxNQUVWLFFBQVE7QUFBQSxNQUNSLGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQTtBQUFBLE1BRVgsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBO0FBQUEsVUFFTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQTtBQUFBLFVBR2hCLGNBQWM7QUFBQSxZQUNaLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsWUFDakQsTUFBTSxDQUFDLFdBQVcsZUFBZTtBQUFBLFlBQ2pDLFFBQVEsQ0FBQyxlQUFlO0FBQUEsVUFDMUI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsdUJBQXVCO0FBQUEsSUFDekI7QUFBQSxJQUVBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsTUFDbEQsU0FBUyxDQUFDLGNBQWM7QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

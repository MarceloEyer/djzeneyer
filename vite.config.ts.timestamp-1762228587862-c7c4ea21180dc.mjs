// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";
  const isProd = mode === "production";
  return {
    plugins: [
      react({
        // Fast Refresh otimizado
        fastRefresh: isDev
      })
    ],
    // Base path para produção WordPress
    base: isProd ? "/wp-content/themes/zentheme/dist/" : "/",
    // Resolve aliases
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
        "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
        "@styles": path.resolve(__vite_injected_original_dirname, "./src/styles"),
        "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
        "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils")
      }
    },
    // Development server
    server: {
      port: 3e3,
      host: true,
      strictPort: false,
      open: true,
      cors: true,
      proxy: {
        // Proxy para WordPress REST API em desenvolvimento
        "/wp-json": {
          target: env.VITE_WP_SITE_URL || "http://localhost:8000",
          changeOrigin: true,
          secure: false
        }
      }
    },
    // Build configuration
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      sourcemap: isDev,
      minify: isProd ? "esbuild" : false,
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": ["framer-motion", "lucide-react"]
          }
        }
      },
      chunkSizeWarningLimit: 1e3
    },
    // Optimization
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"]
    },
    // CSS configuration
    css: {
      devSourcemap: isDev,
      modules: {
        localsConvention: "camelCase"
      }
    },
    // Preview configuration
    preview: {
      port: 3e3,
      host: true,
      strictPort: false,
      open: true
    },
    // Environment variables
    envPrefix: "VITE_",
    // Clear screen
    clearScreen: false
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIGNvbnN0IGlzRGV2ID0gbW9kZSA9PT0gJ2RldmVsb3BtZW50JztcbiAgY29uc3QgaXNQcm9kID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3Qoe1xuICAgICAgICAvLyBGYXN0IFJlZnJlc2ggb3RpbWl6YWRvXG4gICAgICAgIGZhc3RSZWZyZXNoOiBpc0RldixcbiAgICAgIH0pLFxuICAgIF0sXG5cbiAgICAvLyBCYXNlIHBhdGggcGFyYSBwcm9kdVx1MDBFN1x1MDBFM28gV29yZFByZXNzXG4gICAgYmFzZTogaXNQcm9kID8gJy93cC1jb250ZW50L3RoZW1lcy96ZW50aGVtZS9kaXN0LycgOiAnLycsXG5cbiAgICAvLyBSZXNvbHZlIGFsaWFzZXNcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxuICAgICAgICAnQGhvb2tzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2hvb2tzJyksXG4gICAgICAgICdAc3R5bGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3N0eWxlcycpLFxuICAgICAgICAnQHR5cGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJyksXG4gICAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIERldmVsb3BtZW50IHNlcnZlclxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMzAwMCxcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBzdHJpY3RQb3J0OiBmYWxzZSxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBjb3JzOiB0cnVlLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gUHJveHkgcGFyYSBXb3JkUHJlc3MgUkVTVCBBUEkgZW0gZGVzZW52b2x2aW1lbnRvXG4gICAgICAgICcvd3AtanNvbic6IHtcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1dQX1NJVEVfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwMDAnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gQnVpbGQgY29uZmlndXJhdGlvblxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHNvdXJjZW1hcDogaXNEZXYsXG4gICAgICBtaW5pZnk6IGlzUHJvZCA/ICdlc2J1aWxkJyA6IGZhbHNlLFxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICAgJ3VpLXZlbmRvcic6IFsnZnJhbWVyLW1vdGlvbicsICdsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICB9LFxuXG4gICAgLy8gT3B0aW1pemF0aW9uXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgfSxcblxuICAgIC8vIENTUyBjb25maWd1cmF0aW9uXG4gICAgY3NzOiB7XG4gICAgICBkZXZTb3VyY2VtYXA6IGlzRGV2LFxuICAgICAgbW9kdWxlczoge1xuICAgICAgICBsb2NhbHNDb252ZW50aW9uOiAnY2FtZWxDYXNlJyxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIFByZXZpZXcgY29uZmlndXJhdGlvblxuICAgIHByZXZpZXc6IHtcbiAgICAgIHBvcnQ6IDMwMDAsXG4gICAgICBob3N0OiB0cnVlLFxuICAgICAgc3RyaWN0UG9ydDogZmFsc2UsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBFbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICBlbnZQcmVmaXg6ICdWSVRFXycsXG5cbiAgICAvLyBDbGVhciBzY3JlZW5cbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXG4gIH07XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsY0FBYyxlQUFlO0FBQy9QLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sUUFBUSxTQUFTO0FBQ3ZCLFFBQU0sU0FBUyxTQUFTO0FBRXhCLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQTtBQUFBLFFBRUosYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBLElBQ0g7QUFBQTtBQUFBLElBR0EsTUFBTSxTQUFTLHNDQUFzQztBQUFBO0FBQUEsSUFHckQsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQ3BDLGVBQWUsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLFFBQ3pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxRQUMvQyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsUUFDakQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLFFBQy9DLFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBR0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUEsUUFFTCxZQUFZO0FBQUEsVUFDVixRQUFRLElBQUksb0JBQW9CO0FBQUEsVUFDaEMsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxhQUFhO0FBQUEsTUFDYixXQUFXO0FBQUEsTUFDWCxRQUFRLFNBQVMsWUFBWTtBQUFBLE1BQzdCLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGNBQWM7QUFBQSxZQUNaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUN6RCxhQUFhLENBQUMsaUJBQWlCLGNBQWM7QUFBQSxVQUMvQztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSx1QkFBdUI7QUFBQSxJQUN6QjtBQUFBO0FBQUEsSUFHQSxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLElBQ3BEO0FBQUE7QUFBQSxJQUdBLEtBQUs7QUFBQSxNQUNILGNBQWM7QUFBQSxNQUNkLFNBQVM7QUFBQSxRQUNQLGtCQUFrQjtBQUFBLE1BQ3BCO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsTUFDWixNQUFNO0FBQUEsSUFDUjtBQUFBO0FBQUEsSUFHQSxXQUFXO0FBQUE7QUFBQSxJQUdYLGFBQWE7QUFBQSxFQUNmO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

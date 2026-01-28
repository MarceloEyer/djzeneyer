// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import viteCompression from "file:///home/project/node_modules/vite-plugin-compression/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ command, mode }) => {
  const isProduction = command === "build" || mode === "production";
  return {
    plugins: [
      react(),
      // Gzip compression (suportado pelo servidor Hostinger)
      isProduction && viteCompression({
        algorithm: "gzip",
        ext: ".gz",
        threshold: 1024,
        // Só comprime arquivos > 1KB
        deleteOriginFile: false
      })
    ].filter(Boolean),
    publicDir: false,
    base: isProduction ? "/wp-content/themes/zentheme/dist/" : "/",
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      manifest: true,
      outDir: "dist",
      emptyOutDir: true,
      target: "es2020",
      // 🔒 AQUI É O PULO DO GATO ANTI-EVAL
      minify: "terser",
      // O Terser não usa eval por padrão
      sourcemap: false,
      // Desliga os mapas (eles usam eval!)
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          // Força o Terser a não usar truques inseguros
          evaluate: false,
          unsafe: false
        },
        output: {
          comments: false
        }
      },
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash].[ext]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            i18n: ["i18next", "react-i18next"],
            motion: ["framer-motion"]
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IGNvbW1hbmQgPT09ICdidWlsZCcgfHwgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIC8vIEd6aXAgY29tcHJlc3Npb24gKHN1cG9ydGFkbyBwZWxvIHNlcnZpZG9yIEhvc3RpbmdlcilcbiAgICAgIGlzUHJvZHVjdGlvbiAmJiB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgICAgZXh0OiAnLmd6JyxcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0LCAvLyBTXHUwMEYzIGNvbXByaW1lIGFycXVpdm9zID4gMUtCXG4gICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLFxuICAgICAgfSksXG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgXG4gICAgcHVibGljRGlyOiBmYWxzZSxcbiAgICBiYXNlOiBpc1Byb2R1Y3Rpb24gPyAnL3dwLWNvbnRlbnQvdGhlbWVzL3plbnRoZW1lL2Rpc3QvJyA6ICcvJyxcblxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBidWlsZDoge1xuICAgICAgbWFuaWZlc3Q6IHRydWUsXG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIFxuICAgICAgLy8gXHVEODNEXHVERDEyIEFRVUkgXHUwMEM5IE8gUFVMTyBETyBHQVRPIEFOVEktRVZBTFxuICAgICAgbWluaWZ5OiAndGVyc2VyJywgLy8gTyBUZXJzZXIgblx1MDBFM28gdXNhIGV2YWwgcG9yIHBhZHJcdTAwRTNvXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLCAvLyBEZXNsaWdhIG9zIG1hcGFzIChlbGVzIHVzYW0gZXZhbCEpXG4gICAgICBcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICAvLyBGb3JcdTAwRTdhIG8gVGVyc2VyIGEgblx1MDBFM28gdXNhciB0cnVxdWVzIGluc2VndXJvc1xuICAgICAgICAgIGV2YWx1YXRlOiBmYWxzZSwgXG4gICAgICAgICAgdW5zYWZlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgY29tbWVudHM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJyxcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICAgaTE4bjogWydpMThuZXh0JywgJ3JlYWN0LWkxOG5leHQnXSxcbiAgICAgICAgICAgIG1vdGlvbjogWydmcmFtZXItbW90aW9uJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBQ2pELFFBQU0sZUFBZSxZQUFZLFdBQVcsU0FBUztBQUVyRCxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUE7QUFBQSxNQUVOLGdCQUFnQixnQkFBZ0I7QUFBQSxRQUM5QixXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUE7QUFBQSxRQUNYLGtCQUFrQjtBQUFBLE1BQ3BCLENBQUM7QUFBQSxJQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsSUFFaEIsV0FBVztBQUFBLElBQ1gsTUFBTSxlQUFlLHNDQUFzQztBQUFBLElBRTNELFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNMLFVBQVU7QUFBQSxNQUNWLFFBQVE7QUFBQSxNQUNSLGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLE1BR1IsUUFBUTtBQUFBO0FBQUEsTUFDUixXQUFXO0FBQUE7QUFBQSxNQUVYLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLGVBQWU7QUFBQTtBQUFBLFVBRWYsVUFBVTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLFVBQVU7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUFBLE1BRUEsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsY0FBYztBQUFBLFlBQ1osUUFBUSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUNqRCxNQUFNLENBQUMsV0FBVyxlQUFlO0FBQUEsWUFDakMsUUFBUSxDQUFDLGVBQWU7QUFBQSxVQUMxQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

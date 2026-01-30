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
    // 🚨 CORREÇÃO CRÍTICA AQUI 🚨
    // Mudamos para '/' absoluto. 
    // Isso permite que o 'vite preview' no GitHub Actions encontre os arquivos JS/CSS.
    // O caminho antigo (/wp-content/...) causava 404 no Prerender.
    base: "/",
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
      // 🔒 PULO DO GATO ANTI-EVAL
      minify: "terser",
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          // Segurança
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IGNvbW1hbmQgPT09ICdidWlsZCcgfHwgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIC8vIEd6aXAgY29tcHJlc3Npb24gKHN1cG9ydGFkbyBwZWxvIHNlcnZpZG9yIEhvc3RpbmdlcilcbiAgICAgIGlzUHJvZHVjdGlvbiAmJiB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgICAgZXh0OiAnLmd6JyxcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0LCAvLyBTXHUwMEYzIGNvbXByaW1lIGFycXVpdm9zID4gMUtCXG4gICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLFxuICAgICAgfSksXG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgXG4gICAgcHVibGljRGlyOiBmYWxzZSxcbiAgICBcbiAgICAvLyBcdUQ4M0RcdURFQTggQ09SUkVcdTAwQzdcdTAwQzNPIENSXHUwMENEVElDQSBBUVVJIFx1RDgzRFx1REVBOFxuICAgIC8vIE11ZGFtb3MgcGFyYSAnLycgYWJzb2x1dG8uIFxuICAgIC8vIElzc28gcGVybWl0ZSBxdWUgbyAndml0ZSBwcmV2aWV3JyBubyBHaXRIdWIgQWN0aW9ucyBlbmNvbnRyZSBvcyBhcnF1aXZvcyBKUy9DU1MuXG4gICAgLy8gTyBjYW1pbmhvIGFudGlnbyAoL3dwLWNvbnRlbnQvLi4uKSBjYXVzYXZhIDQwNCBubyBQcmVyZW5kZXIuXG4gICAgYmFzZTogJy8nLFxuXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGJ1aWxkOiB7XG4gICAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICAgIG91dERpcjogJ2Rpc3QnLFxuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgICAgXG4gICAgICAvLyBcdUQ4M0RcdUREMTIgUFVMTyBETyBHQVRPIEFOVEktRVZBTFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgICBcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICAvLyBTZWd1cmFuXHUwMEU3YVxuICAgICAgICAgIGV2YWx1YXRlOiBmYWxzZSwgXG4gICAgICAgICAgdW5zYWZlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgY29tbWVudHM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJyxcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICAgaTE4bjogWydpMThuZXh0JywgJ3JlYWN0LWkxOG5leHQnXSxcbiAgICAgICAgICAgIG1vdGlvbjogWydmcmFtZXItbW90aW9uJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBQ2pELFFBQU0sZUFBZSxZQUFZLFdBQVcsU0FBUztBQUVyRCxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUE7QUFBQSxNQUVOLGdCQUFnQixnQkFBZ0I7QUFBQSxRQUM5QixXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUE7QUFBQSxRQUNYLGtCQUFrQjtBQUFBLE1BQ3BCLENBQUM7QUFBQSxJQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsSUFFaEIsV0FBVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNWCxNQUFNO0FBQUEsSUFFTixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFDTCxVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxNQUdSLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQSxNQUVYLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLGVBQWU7QUFBQTtBQUFBLFVBRWYsVUFBVTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLFVBQVU7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUFBLE1BRUEsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsY0FBYztBQUFBLFlBQ1osUUFBUSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUNqRCxNQUFNLENBQUMsV0FBVyxlQUFlO0FBQUEsWUFDakMsUUFBUSxDQUFDLGVBQWU7QUFBQSxVQUMxQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

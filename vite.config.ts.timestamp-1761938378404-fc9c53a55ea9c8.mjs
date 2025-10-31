// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///home/project/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///home/project/node_modules/autoprefixer/lib/autoprefixer.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss("./tailwind.config.js"),
        autoprefixer()
      ]
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // ✅ REMOVIDO: "external" (evita bloquear arquivos locais)
    // external: [ ... ] ← REMOVIDO
    rollupOptions: {
      // ✅ Input simples (Vite encontra o index.html automaticamente)
      input: resolve(__vite_injected_original_dirname, "index.html"),
      output: {
        // ✅ Code splitting (otimiza o carregamento)
        manualChunks: {
          react: ["react", "react-dom"]
        }
      }
    }
  },
  // ✅ ADICIONADO: Configuração para desenvolvimento local
  server: {
    open: true,
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdGFpbHdpbmRjc3MoJy4vdGFpbHdpbmQuY29uZmlnLmpzJyksXG4gICAgICAgIGF1dG9wcmVmaXhlcigpLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG5cbiAgICAvLyBcdTI3MDUgUkVNT1ZJRE86IFwiZXh0ZXJuYWxcIiAoZXZpdGEgYmxvcXVlYXIgYXJxdWl2b3MgbG9jYWlzKVxuICAgIC8vIGV4dGVybmFsOiBbIC4uLiBdIFx1MjE5MCBSRU1PVklET1xuXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgLy8gXHUyNzA1IElucHV0IHNpbXBsZXMgKFZpdGUgZW5jb250cmEgbyBpbmRleC5odG1sIGF1dG9tYXRpY2FtZW50ZSlcbiAgICAgIGlucHV0OiByZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcblxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIFx1MjcwNSBDb2RlIHNwbGl0dGluZyAob3RpbWl6YSBvIGNhcnJlZ2FtZW50bylcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cbiAgLy8gXHUyNzA1IEFESUNJT05BRE86IENvbmZpZ3VyYVx1MDBFN1x1MDBFM28gcGFyYSBkZXNlbnZvbHZpbWVudG8gbG9jYWxcbiAgc2VydmVyOiB7XG4gICAgb3BlbjogdHJ1ZSxcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMsZUFBZTtBQUx4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFFakIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1AsWUFBWSxzQkFBc0I7QUFBQSxRQUNsQyxhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUE7QUFBQTtBQUFBLElBS2IsZUFBZTtBQUFBO0FBQUEsTUFFYixPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BRXRDLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBLFVBQ1osT0FBTyxDQUFDLFNBQVMsV0FBVztBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

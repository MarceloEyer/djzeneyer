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
    // ✅ REMOVA "external" - causa problemas!
    // external: [ ... ] ← DELETE ISTO
    rollupOptions: {
      // ✅ Input simples (Vite encontra sozinho)
      input: resolve(__vite_injected_original_dirname, "index.html"),
      output: {
        // ✅ Code splitting (mantém, é bom)
        manualChunks: {
          react: ["react", "react-dom"]
        }
      }
    }
  },
  // ✅ ADICIONE isto para desenvolvimento local
  server: {
    open: true,
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICB0YWlsd2luZGNzcygnLi90YWlsd2luZC5jb25maWcuanMnKSxcbiAgICAgICAgYXV0b3ByZWZpeGVyKCksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBcbiAgICAvLyBcdTI3MDUgUkVNT1ZBIFwiZXh0ZXJuYWxcIiAtIGNhdXNhIHByb2JsZW1hcyFcbiAgICAvLyBleHRlcm5hbDogWyAuLi4gXSBcdTIxOTAgREVMRVRFIElTVE9cbiAgICBcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAvLyBcdTI3MDUgSW5wdXQgc2ltcGxlcyAoVml0ZSBlbmNvbnRyYSBzb3ppbmhvKVxuICAgICAgaW5wdXQ6IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gXHUyNzA1IENvZGUgc3BsaXR0aW5nIChtYW50XHUwMEU5bSwgXHUwMEU5IGJvbSlcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cbiAgLy8gXHUyNzA1IEFESUNJT05FIGlzdG8gcGFyYSBkZXNlbnZvbHZpbWVudG8gbG9jYWxcbiAgc2VydmVyOiB7XG4gICAgb3BlbjogdHJ1ZSxcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMsZUFBZTtBQUx4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFFakIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1AsWUFBWSxzQkFBc0I7QUFBQSxRQUNsQyxhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUE7QUFBQTtBQUFBLElBS2IsZUFBZTtBQUFBO0FBQUEsTUFFYixPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BRXRDLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBLFVBQ1osT0FBTyxDQUFDLFNBQVMsV0FBVztBQUFBLFFBQzlCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

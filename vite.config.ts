import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // Ми прибираємо жорстку прив'язку до папки client
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});

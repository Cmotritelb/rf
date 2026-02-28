import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    // Змінюємо шлях на стандартний для Vercel
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    // Додаємо вказівку на вхідний файл
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html"),
    },
  },
});

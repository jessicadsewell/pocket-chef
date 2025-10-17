import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../../dist/frontend",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy API routes to backend
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy auth routes to backend
      "/login": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/register": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy page routes to backend
      "/recipes": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/meal-plans": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/quiz": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

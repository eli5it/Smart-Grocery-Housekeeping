import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Plugins will be loaded dynamically to avoid type errors
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
  },
  server: {
    proxy: {
      "/api": "http://192.168.50.179:8001",
    },
  },
  esbuild: {
    // Ignore TypeScript errors during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});

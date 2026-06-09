import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackStart({
      target: "vercel",
    }),
    react(),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
  ],
});
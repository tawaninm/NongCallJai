import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "https://nongcalljai-api.onrender.com",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    basicSsl(),
  ],
});

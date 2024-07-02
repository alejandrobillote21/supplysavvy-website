import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "supplysavvy-website-api.vercel.app",
      "/uploads/": "supplysavvy-website-api.vercel.app",
    },
  },
});

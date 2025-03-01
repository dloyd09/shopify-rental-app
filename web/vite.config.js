import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist", // Ensures files are served correctly
      },
    server: {
        host: "0.0.0.0",
        port: 5173, // ✅ Default Vite port
        strictPort: true, // ✅ Prevents Vite from switching ports if 5173 is in use
        cors: true,
        hmr: {
            clientPort: 443, // ✅ Needed for ngrok
            protocol: "ws",
            host: "localhost",
        },
        allowedHosts: ['.ngrok-free.app'] // ✅ Allow all ngrok subdomains
    },
    resolve: {
        alias: {
            "@": "/src", // ✅ Allows `@/components/...` instead of `../../components/...`
        },
    },
});

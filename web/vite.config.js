import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // ✅ Default Vite port
        strictPort: true, // ✅ Prevents Vite from switching ports if 5173 is in use
    },
    resolve: {
        alias: {
            "@": "/src", // ✅ Allows `@/components/...` instead of `../../components/...`
        },
    },
});

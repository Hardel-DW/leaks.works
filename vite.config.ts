import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { content } from "./src/lib/content/plugin";

export default defineConfig({
    plugins: [content(), tailwindcss(), react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
            "@lib": fileURLToPath(new URL("./src/lib", import.meta.url))
        }
    }
});

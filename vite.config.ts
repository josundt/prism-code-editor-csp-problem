import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
    server: {
        port: 8082,
    },
    preview: {
        port: 8082,
    },
});

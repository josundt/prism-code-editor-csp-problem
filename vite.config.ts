import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true, // Ensures source maps are generated
    },
    server: {
        port: 8082,
    },
    preview: {
        port: 8082,
    },
    clearScreen: false,
});

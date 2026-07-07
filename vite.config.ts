import { defineConfig } from "vite";
import { csp } from "./content-security-policy.ts";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
    server: {
        port: 8082,
        headers: {
            "Content-Security-Policy": csp,
        },
    },
    preview: {
        port: 8082,
        headers: {
            "Content-Security-Policy": csp,
        },
    },
});

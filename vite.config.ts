import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  // Set base to "/<repo-name>/" if deploying to GitHub Pages under a project repo.
  // Example: base: "/sohan-terminal-portfolio/"
  base: "./",
  build: {
    target: "esnext",
    sourcemap: false,
    cssMinify: true,
  },
});

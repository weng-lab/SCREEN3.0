import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer",
      "@weng-lab/genomebrowser": path.resolve(__dirname, "../core/src/lib.ts"),
      "logo-test": path.resolve(__dirname, "./test/mocks/logo-test.tsx"),
    },
  },
  test: {
    environment: "node",
  },
});

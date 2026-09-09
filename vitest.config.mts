import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: {
      "logo-test": new URL("./node_modules/logo-test/dist/logo-test.es.js", import.meta.url).pathname,
      common: new URL("./src/common", import.meta.url).pathname,
    },
  },
  test: { include: ["src/common/components/GenomeBrowser/tests/**/*.test.ts"], environment: "node" },
});

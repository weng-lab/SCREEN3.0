import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  plugins: [
    react(),
    dts({
      exclude: ["**/*.stories.tsx", "./test"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib.ts"),
      name: "genomebrowser-ui",
      fileName: (format) => `genomebrowser-ui.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@weng-lab/genomebrowser",
        "@mui/material",
        "@emotion/react",
        "@emotion/styled",
        /^@mui\/.*/,
        /^@emotion\/.*/,
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@weng-lab/genomebrowser": "GenomeBrowser",
          "@mui/material": "MaterialUI",
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
        },
      },
    },
    sourcemap: true,
    cssCodeSplit: true,
    cssMinify: true,
  },
});

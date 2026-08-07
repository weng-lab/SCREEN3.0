import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import js from "@eslint/js";
// eslint-config-next v15+ ships a native flat config (an array), so it is spread
// directly. Routing it through FlatCompat crashes the legacy eslintrc loader.
// It already registers the react, react-hooks, import, jsx-a11y and @next/next
// plugins, plus @typescript-eslint for TypeScript source files.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    ignores: ["node_modules/**", ".next/**", ".vscode/**", ".yarn/**"],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  prettierRecommended,
  {
    // Next only registers this plugin for TypeScript files. This config itself is
    // an .mjs file, but it uses the plugin's recommended rules below.
    files: ["eslint.config.mjs"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    // Only plugins that eslint-config-next does not already register.
    plugins: {
      "unused-imports": unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    // Recommended rule sets are pulled in as plain rules rather than as configs,
    // because their configs would re-register plugins next already owns.
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "prettier/prettier": "warn",
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    // TypeScript already resolves identifiers and validates props, and core
    // `no-undef` does not understand TS globals or the modern JSX transform
    // (it reports `React` as undefined in every .tsx file). Both rules are
    // pure false-positive sources here.
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "no-undef": "off",
      "react/prop-types": "off",
    },
  },
]);

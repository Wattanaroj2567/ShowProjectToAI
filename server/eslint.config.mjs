import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import n from "eslint-plugin-n";

// ESLint Flat Config
// - Use @eslint/js recommended rules via js.configs.recommended (no extends in flat config)
// - Set sourceType to commonjs for the server codebase
// - Provide Node globals; tests removed so no Jest override
export default defineConfig([
  // Ignore linting the config file itself to avoid parser mode conflicts
  { ignores: ["eslint.config.mjs"] },

  // Base recommended JS rules
  js.configs.recommended,

  // Server files: Node globals + CommonJS modules (exclude .mjs)
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    plugins: {
      import: importPlugin,
      n,
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".cjs", ".json"] },
      },
    },
    rules: {
      // Catch missing/typo module paths like require("./src/config/confi")
      "import/no-unresolved": ["error", { commonjs: true, caseSensitive: true }],
      "n/no-missing-require": "error",
    },
  },

  // (Tests removed) — no Jest-specific override needed
]);

import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import jsonc from "eslint-plugin-jsonc";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.json", "**/*.jsonc", "**/*.json5"],
    plugins: {
      jsonc,
    },
    languageOptions: {
      parser: jsonc,
    },
    rules: {
      ...jsonc.configs["all"].rules,
      "jsonc/no-comments": "off",
      "jsonc/auto": "off",
      "jsonc/indent": ["error", 2, {}],
      "jsonc/array-element-newline": ["error", "consistent"],
      "jsonc/sort-keys": "off",
      "jsonc/key-name-casing": "off",
      "jsonc/comma-dangle": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.cjs", "**/*.mjs", "**/*.json"],
    ignores: ["node_modules/", ".git/"],
    plugins: {
      jsdoc,
      jsonc,
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        checkMount: "readonly",
        getDir: "readonly",
        hash_alg: "readonly",
        ko: "readonly",
        octoprintFullscreenVanillaPicker: "readonly",
        platform: "readonly",
        shell: "readonly",
        version: "readonly",
        win: "readonly",
        OCTOPRINT_VIEWMODELS: "readonly",
      },
    },
    rules: {
      semi: ["error", "always"],
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false,
        },
      ],
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs"],
      "one-var": ["error", "never"],
      eqeqeq: ["error", "smart"],
      "no-var": ["error"],
      "spaced-comment": ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": ["error"],
    },
  },
];

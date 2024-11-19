import eslint from "@eslint/js";
import eslintPluginSvelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import tsEslint from "typescript-eslint";

const tsParserOptions = {
  projectService: true,
  tsconfigRootDir: process.cwd(),
  extraFileExtensions: [".svelte"],
};
export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.strictTypeChecked,
  ...eslintPluginSvelte.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: tsParserOptions,
    },
    rules: {
      eqeqeq: ["error", "allow-null"],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/strict-boolean-expressions": ["warn"],
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
    },
  },

  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        ...tsParserOptions,
        parser: tsEslint.parser,
      },
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
    settings: {
      svelte: {
        // These need to be disabled in the templates as these are not fully typed.
        ignoreWarnings: [
          "@typescript-eslint/no-unsafe-assignment",
          "@typescript-eslint/no-unsafe-member-access",
          "@typescript-eslint/no-unsafe-call",
          "@typescript-eslint/no-unsafe-return",
          "@typescript-eslint/no-unsafe-argument",
          "@typescript-eslint/no-confusing-void-expression",
        ],
      },
    },
  },
  {
    ignores: [
      "eslint.config.mjs",
      "**/.svelte-kit",
      "**/.vercel",
      "**/build",
      "**/node_modules",
      "**/package",
    ],
  },
);

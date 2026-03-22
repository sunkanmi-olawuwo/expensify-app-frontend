import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importX from "eslint-plugin-import-x";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";
import unusedImports from "eslint-plugin-unused-imports";

const importOrderRule = [
  "error",
  {
    alphabetize: {
      order: "asc",
      caseInsensitive: true,
    },
    groups: [
      "builtin",
      "external",
      "internal",
      "parent",
      "sibling",
      "index",
      "type",
    ],
    "newlines-between": "always",
    pathGroups: [
      {
        pattern: "@/**",
        group: "internal",
        position: "after",
      },
    ],
    pathGroupsExcludedImportTypes: ["builtin"],
  },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "import-x": importX,
      "unused-imports": unusedImports,
    },
    settings: {
      "import-x/resolver": {
        node: true,
        typescript: true,
      },
    },
    rules: {
      "import-x/no-duplicates": "error",
      "import-x/order": importOrderRule,
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/ui/internal/shadcn/*"],
              message:
                "Import app-owned components from '@/ui/base' instead of raw shadcn primitives.",
            },
          ],
        },
      ],
      "sort-imports": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: [
      "src/ui/base/**/*.{ts,tsx}",
      "src/ui/internal/shadcn/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    files: ["src/test/**/*.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"],
    plugins: {
      "jest-dom": jestDom,
      "testing-library": testingLibrary,
    },
    rules: {
      "jest-dom/prefer-checked": "error",
      "jest-dom/prefer-enabled-disabled": "error",
      "testing-library/no-container": "error",
      "testing-library/no-debugging-utils": "warn",
      "testing-library/prefer-screen-queries": "error",
      "testing-library/render-result-naming-convention": "error",
    },
  },
]);

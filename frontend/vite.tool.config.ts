import { defineConfig } from 'vite-plus';
import type { UserConfig } from 'vite-plus';

export const lintConfig = {
  plugins: ['eslint', 'react', 'react-perf', 'typescript', 'import', 'unicorn', 'promise', 'oxc'],
  jsPlugins: ['@tanstack/eslint-plugin-query', { name: 'react-hooks-js', specifier: 'eslint-plugin-react-hooks' }],
  categories: {
    correctness: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  env: {
    builtin: true,
  },
  rules: {
    // Temporarily disable some after migrating from eslint to oxc, can re-enable later
    'no-children-prop': 'off',
    'no-useless-length-check': 'off',
    'no-useless-spread': 'off',
    'react/rules-of-hooks': 'off',
    'no-floating-promises': 'off',
    'await-thenable': 'off',
    'no-base-to-string': 'off',
    'restrict-template-expressions': 'off',
    'no-redundant-type-constituents': 'off',
    'require-array-sort-compare': 'off',
    // other ----------
    // Error on deprecated API usage
    '@typescript-eslint/no-deprecated': 'error',
    'react/exhaustive-deps': 'warn',
    // Native `react/*` handles the standard Hooks rules.
    // Keep the aliased JS plugin only for the extra React Compiler-style checks.
    'react-hooks-js/purity': 'error',
    'react-hooks-js/refs': 'error',
    'react-hooks-js/immutability': 'error',
    'react-hooks-js/set-state-in-render': 'error',

    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'warn',
    '@tanstack/query/stable-query-client': 'error',
    '@tanstack/query/no-unstable-deps': 'error',
    '@tanstack/query/infinite-query-property-order': 'error',
    '@tanstack/query/no-void-query-fn': 'error',
    '@tanstack/query/mutation-property-order': 'error',
  },
  ignorePatterns: ['dist', 'src/routeTree.gen.ts', '.storybook'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
    },
  ],
} satisfies NonNullable<UserConfig['lint']>;

export const fmtConfig = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  sortTailwindcss: {
    stylesheet: './src/styles/index.css',
  },
  sortPackageJson: true,
  ignorePatterns: ['dist', 'src/routeTree.gen.ts', 'pnpm-lock.yaml'],
} satisfies NonNullable<UserConfig['fmt']>;

export default defineConfig({
  lint: lintConfig,
  fmt: fmtConfig,
});

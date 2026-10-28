import { defineConfig } from 'vite-plus';
import type { UserConfig } from 'vite-plus';

import oxfmtConfig from '../.oxfmtrc.json';

export const lintConfig = {
  plugins: ['eslint', 'react', 'react-perf', 'typescript', 'import', 'unicorn', 'promise', 'oxc'],
  jsPlugins: [
    '@shadcn/lint',
    '@tanstack/eslint-plugin-query',
    { name: 'react-hooks-js', specifier: 'eslint-plugin-react-hooks' },
  ],
  categories: {
    correctness: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
    reportUnusedDisableDirectives: 'warn',
  },
  env: {
    builtin: true,
  },
  settings: {
    shadcn: { ui: '@/components/shared' },
  },
  rules: {
    'no-children-prop': 'error',
    // Error on deprecated API usage
    '@typescript-eslint/no-deprecated': 'error',
    'react/rules-of-hooks': 'error',
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

    'shadcn/no-unknown-classes': 'error',
    ...(process.env.LINT_DESIGN && {
      'shadcn/no-unknown-classes': 'warn',
      'shadcn/no-raw-colors': 'warn',
      'shadcn/no-arbitrary-values': 'warn',
      'shadcn/no-inline-styles': 'warn',
      'shadcn/no-restyle': ['warn', { allow: ['layout'] }],
      'shadcn/require-static-classes': 'warn',
    }),
  },
  ignorePatterns: ['dist', 'src/routeTree.gen.ts', 'src/api/generated', '.storybook'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
    },
    {
      files: ['src/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                regex: '(^|/)package\\.json(\\?.*)?$',
                message: 'Use the version and repository URL from `@/config` instead of importing package.json.',
              },
            ],
          },
        ],
      },
    },
  ],
} satisfies NonNullable<UserConfig['lint']>;

export const fmtConfig = {
  ...(oxfmtConfig as NonNullable<UserConfig['fmt']>),
  sortTailwindcss: {
    stylesheet: './src/styles/index.css',
  },
  ignorePatterns: ['dist', 'src/routeTree.gen.ts', 'src/api/generated'],
} satisfies NonNullable<UserConfig['fmt']>;

export default defineConfig({
  lint: lintConfig,
  fmt: fmtConfig,
});

import eslintReact from '@eslint-react/eslint-plugin';
import oxlint from 'eslint-plugin-oxlint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import storybook from 'eslint-plugin-storybook';
import tseslint, { plugin as tsPlugin } from 'typescript-eslint';

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'test-results/',
      'playwright-report/',
      'blob-report/',
      '.output',
      '**/*.gen.*',
      '.claude/**',
      '.agents/**',
      '.cursor/**',
      '.turbo',
      '**/routeTree.gen.ts',
      '**/bun.lock',
      '**/_generated/**',
      // Not part of the app tsconfig — exclude from typed linting
      'eslint.config.ts',
      '.storybook/**',
    ],
  },

  // @eslint-react: rules that oxlint cannot cover natively
  // (ESM-only plugin — cannot be loaded as an oxlint jsPlugin [yet!])
  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslintReact.configs['recommended-type-checked']],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // Turn off all rules already covered by oxlint to avoid duplicate warnings
      ...oxlint.configs['flat/react'][0].rules,
      ...oxlint.configs['flat/react-hooks'][0].rules,
      ...oxlint.configs['flat/typescript'][0].rules,
      ...oxlint.configs['flat/eslint'][0].rules,
    },
  },

  // Storybook: CSF format validation for story files
  // (ESM-only plugin — cannot be loaded as an oxlint jsPlugin)
  ...storybook.configs['flat/recommended']
);

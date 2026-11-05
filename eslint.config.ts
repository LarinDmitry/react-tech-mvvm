import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist', 'coverage', 'docs'] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  reactHooks.configs.flat['recommended-latest'],
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true },
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'no-console': 'error',
      'simple-import-sort/imports': [
        'error',
        { groups: [['^@?\\w'], ['^@/'], ['^\\u0000', '^\\.']] },
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // controllers are made with autoBind, so passing their methods around is safe
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['src/**/*.view.tsx', 'src/shared/ui/*.tsx'],
    ignores: ['**/*.test.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...['ConditionalExpression', 'LogicalExpression', 'BinaryExpression', 'IfStatement'].map(
          (selector) => ({ selector, message: 'Keep logic in the controller, not in the view' }),
        ),
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: { '@typescript-eslint/require-await': 'off' },
  },
  prettier,
);

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  js.configs.recommended,
  tseslint.configs.strict,
  reactHooks.configs.flat['recommended-latest'],
  {
    languageOptions: { globals: globals.browser },
    rules: { 'no-console': 'error' },
  },
  prettier,
);

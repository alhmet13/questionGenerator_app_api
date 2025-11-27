import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    root: true,
    ignores: ['node_modules/', 'dist/', '.git/', 'coverage/'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-var': 'error',
      semi: 'error',
      'no-console': 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'no-plusplus': 'off',
      'no-param-reassign': 'off',
      'no-await-in-loop': 'off',
      'no-unused-vars': 'off',
      'no-continue': 'off',
      'no-prototype-builtins': 'off',
    },
    settings: {
      prettier: {
        recommended: true,
      },
    },
  },
];

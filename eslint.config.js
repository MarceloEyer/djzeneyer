import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dist-debug',
      // Agent/tool workspace directories — each contains its own full TS project
      // and would cause typescript-eslint to find multiple tsconfigRootDir candidates
      '.claude',
      '.agents',
      '.bolt',
      '.gemini',
      '.jules',
      '.devcontainer',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-empty': 'warn',
      'no-case-declarations': 'warn',
      'no-useless-escape': 'warn',
    },
  }
);

import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import jest from 'eslint-plugin-jest';

export default [
  // Core ESLint configuration
  js.configs.recommended,
  { ignores: ['**/dist/**', '**/coverage/**', '**/build/**'] },
  // TypeScript configurations for type-checking and stylistic rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          './tsconfig.base.json',
          './client/tsconfig.json',
          './server/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.strictTypeChecked.rules,
      ...tseslint.configs.stylisticTypeChecked.rules,
    },
  },

  // General configuration for all files (JavaScript and TypeScript)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettier,
      '@stylistic': stylistic,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['error', { argsIgnorePattern: '^(_.*)$' }],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
    },
  },

  // Tests rules
  {
    files: ['**/__tests__/**/*.[jt]s?(x)'],
    plugins: {
      jest: jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...jest.environments.globals,
        globals: 'readonly',
      },
    },
  },
];

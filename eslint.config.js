const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh');
const stylisticTs = require('@stylistic/eslint-plugin-ts');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');
const jest = require('eslint-plugin-jest');

module.exports = [
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
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      '@stylistic/ts/indent': ['error', 2],
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
      quotes: ['error', 'single'],
      'prefer-const': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^(_|_req|_res|_next|)$' },
      ],
      'prettier/prettier': ['error', { singleQuote: true }],
      'no-confusing-arrow': 'off',
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...prettierConfig.rules,
    },
  },

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

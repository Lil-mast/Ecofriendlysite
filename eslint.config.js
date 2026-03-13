import path from 'path'

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': '@typescript-eslint/eslint-plugin',
      react: 'eslint-plugin-react',
      'react-hooks': 'eslint-plugin-react-hooks',
      'jsx-a11y': 'eslint-plugin-jsx-a11y',
      import: 'eslint-plugin-import',
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Optional: adjust to your team's style
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
]

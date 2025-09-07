import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      // Base
      ...(react.configs.recommended?.rules || {}),
      ...(reactHooks.configs.recommended?.rules || {}),
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
]

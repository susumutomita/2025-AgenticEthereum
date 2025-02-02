const tsEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const ymlPlugin = require('eslint-plugin-yml');
const yamlParser = require('yaml-eslint-parser');

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsEslint
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'semi': ['error', 'always'],
    }
  },
  {
    files: ['**/*.yml', '**/*.yaml'],
    languageOptions: {
      parser: yamlParser
    },
    plugins: {
      yml: ymlPlugin
    },
    rules: {
      'yml/no-empty-document': ['error'],
      'yml/no-empty-key': ['error'],
      'yml/no-empty-mapping-value': ['error'],
      'yml/indent': ['error', 2],
    }
  }
];

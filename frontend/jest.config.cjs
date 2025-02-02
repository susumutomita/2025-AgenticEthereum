// frontend/jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js プロジェクトのルートディレクトリ（app ディレクトリが含まれる場所）
  dir: './src',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
};

module.exports = createJestConfig(customJestConfig);

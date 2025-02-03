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
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest', // JS/JSX/MJSも変換対象に追加
  },
  // -------------------------------
  // 変換対象から除外するパターンを設定
  transformIgnorePatterns: [
    '/node_modules/(?!(@radix-ui/react-avatar|lucide-react|chart\\.js|ethers)/)', // 必要なモジュールのみ例外とする
  ],
};

module.exports = createJestConfig(customJestConfig);

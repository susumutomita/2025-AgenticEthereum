import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/app/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
};

export default createJestConfig(customJestConfig);

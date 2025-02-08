// jest.setup.js
jest.mock("../src/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

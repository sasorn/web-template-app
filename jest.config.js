module.exports = {
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.ts",
    "src/**/*.tsx",
    "!**/*.stories.js",
    "!**/*.stories.jsx",
    "!**/*.stories.ts",
    "!**/*.stories.tsx",
    "!src/testUtils/**"
  ],
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^(?!.*\\.(js|jsx|ts|tsx|mjs|json)$)":
      "<rootDir>/src/testUtils/jest/fileTransform.js"
  }
};

const config = {
  extends: [
    "plugin:react/recommended",
    "prettier",
    "plugin:react-hooks/recommended"
  ],
  parser: "@babel/eslint-parser",
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": "off", // Disable prop-types as we use TypeScript for type checking
    "jsx-quotes": ["error", "prefer-double"],
    semi: ["error", "always"]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};

module.exports = config;

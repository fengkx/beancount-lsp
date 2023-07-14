/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // root: true,
  extends: ["custom"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["./packages/tree-sitter-beancount/grammar.js"],
      globals: {
        grammar: "readonly",
        seq: "readonly",
        repeat: "readonly",
        repeat1: "readonly",
        optional: "readonly",
        token: "readonly",
        choice: "readonly",
        field: "readonly",
        alias: "readonly",
        prec: "readonly",
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "$",
          },
        ],
        "no-useless-escape": "off",
        "no-control-regex": "off",
        "no-dupe-keys": "warn",
      },
    },
  ],
};

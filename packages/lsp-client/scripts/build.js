/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

esbuild.build({
  entryPoints: [
    path.resolve(__dirname, "../src/extension.ts"),
    // path.resolve(__dirname, "../t.js"),
  ],
  platform: "node",
  target: "node16",
  bundle: true,
  outfile: path.resolve(__dirname, "../dist/main.js"),
  external: ["vscode"],
  sourcemap: "external",
  loader: {
    ".wasm": "binary",
    ".scm": "text",
  },
});

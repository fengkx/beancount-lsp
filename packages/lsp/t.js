const Parser = require("tree-sitter");
const Beancount = require("tree-sitter-beancount");
const fs = require("fs");

const parser = new Parser();
parser.setLanguage(Beancount);
const r = parser.parse(
  fs.readFileSync(
    require.resolve("tree-sitter-beancount/examples/example.beancount"),
    { encoding: "utf-8" }
  )
);

console.log(r.rootNode.toString());

const Parser = require("tree-sitter");
const Beancount = require("tree-sitter-beancount");
const fs = require("fs");

const { Query, QueryCursor } = Parser;

const parser = new Parser();
parser.setLanguage(Beancount);
const r = parser.parse(
  fs.readFileSync(
    require.resolve("tree-sitter-beancount/examples/example.beancount"),
    { encoding: "utf-8" }
  )
);

console.log(r.rootNode.toString());
const query = new Query(Beancount, "((date) @date)");

const matches = query.matches(r.rootNode);
console.log(matches[0]);

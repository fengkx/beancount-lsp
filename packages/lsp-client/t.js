const Parser = require("web-tree-sitter");
// const fs = require("fs");
// import Bean from "tree-sitter-beancount/tree-sitter-beancount.wasm";

// console.log(Bean);
async function main() {
  await Parser.init({
    locateFile(scriptName, scriptDirectory) {
      console.log({ scriptDirectory, scriptName });
      return require.resolve("web-tree-sitter/tree-sitter.wasm");
      // return scriptName;
    },
  });
  // const parser = new Parser();
  // const Beancount = await Parser.Language.load(Bean);
  // parser.setLanguage(Beancount);
  // const r = parser.parse(
  //   fs.readFileSync(
  //     require.resolve("tree-sitter-beancount/examples/example.beancount"),
  //     { encoding: "utf-8" }
  //   )
  // );

  // console.log(r.rootNode.toString());
  // const query = parser.getLanguage().query("((date) @date)");

  // const matches = query.matches(r.rootNode);
  // console.log(matches);
}

main();

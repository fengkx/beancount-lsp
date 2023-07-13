/* eslint-disable @typescript-eslint/no-var-requires */

const Parser = require("../shared/node_modules/web-tree-sitter");
const fs = require("fs");
// import Bean from "tree-sitter-beancount/tree-sitter-beancount.wasm";

// console.log(Bean);
async function main() {
  await Parser.init({
    locateFile(scriptName, scriptDirectory) {
      console.log({ scriptDirectory, scriptName });
      return require.resolve(
        "../shared/node_modules/web-tree-sitter/tree-sitter.wasm"
      );
      // return scriptName;
    },
  });
  const parser = new Parser();
  const Beancount = await Parser.Language.load(
    require.resolve("../tree-sitter-beancount/tree-sitter-beancount.wasm")
  );
  parser.setLanguage(Beancount);
  const r = parser.parse(
    `2023-07-12 * "扑扑超市" "牛奶物资"
  Expenses:Shopping:Home                    24.90 CNY
  Expenses:Food:Snack                       10.00 CNY
  Liabilities:CreditCard:CMB

2023-07-12 * "aaa" "`
  );

  // console.log(r.rootNode.toString());
  // const query = parser.getLanguage().query(`
  // (option
  //   key: (string) @key
  //   value: (string) @value
  //   ) @option`);

  // const matches = query.matches(r.rootNode);
  // console.log(matches);
}

main();

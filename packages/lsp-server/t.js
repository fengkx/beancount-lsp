/* eslint-disable @typescript-eslint/no-var-requires */
const { getParser } = require("@bean-lsp/shared/dist");

async function main() {
  const parser = await getParser();
  const r = parser.parse(
    `2023-07-12 * "扑扑超市" "牛奶物资"
    Expenses:Shopping:Home                    24.90 CNY
    Expenses:Food:Snack                       10.00 CNY
    Liabilities:CreditCard:CMB

2023-07-12 * "aaa" "bbb"

`
  );
  //   console.log(r.rootNode.toString());
  const n = r.rootNode.namedDescendantForPosition({ row: 6, column: 0 });

  console.log(n.namedDescendantForPosition({ row: 6, column: 0 }));
  //   console.log(n.previousNamedSibling.type);
  //   console.log(n.previousNamedSibling.previousNamedSibling.type);
}

main();

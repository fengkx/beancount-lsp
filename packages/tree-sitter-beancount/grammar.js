module.exports = grammar({
  name: "beancount",
  extras: ($) => [/( |\r|\t)+/],
  rules: {
    file: ($) => repeat(choice($.directive, $.new_line)),
    directive: ($) => choice($.open_directive, $.close_directive),
    open_directive: ($) =>
      seq(
        field("date", $.date),
        field("directive_type", token("open")),
        field("account_name", $.account_name),
        field(
          "currencies",
          optional(seq($.currency, repeat(seq(",", $.currency))))
        )
      ),
    close_directive: ($) =>
      seq(
        field("date", $.date),
        field("directive_type", token("close")),
        field("account_name", $.account_name)
      ),
    account_name: ($) =>
      seq($.account_type, repeat1(seq(":", /[A-Z][A-Za-z0-9\-]*/))),
    // account_name: ($) =>
    //   token(
    //     seq(
    //       /Assets|Liabilities|Equity|Income|Expenses/,
    //       repeat1(seq(":", /[\p{Lu}\p{N}][\p{L}\p{N}\-]*/))
    //     )
    //   ),
    account_type: ($) =>
      choice("Assets", "Expenses", "Liabilities", "Equity", "Income"),
    date: ($) => /\d{4}-\d{2}-\d{2}/,
    currency: ($) => token(/[A-Z][A-Z0-9\'\._\-]{0,22}[A-Z0-9]/),
    new_line: ($) => /\n/,
  },
});

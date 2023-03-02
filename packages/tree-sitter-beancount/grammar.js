module.exports = grammar({
  name: "beancount",
  extras: ($) => [/( |\r|\t)+/],
  words: ($) => [$._directive_type],
  rules: {
    file: ($) =>
      prec.right(2, repeat(choice($.directive, $._new_line, $.comment))),
    directive: ($) =>
      prec.right(
        3,
        seq(
          choice(
            $.open_directive,
            $.close_directive,
            $.event_directive,
            $.price_directive,
            $.note_directive,
            $.document_directive,
            $.option_directive,
            $.plugin_directive,
            $.include_directive
          ),
          repeat(choice($.metadata, $._new_line))
        )
      ),
    _directive_type: ($) =>
      choice(
        token("open"),
        token("event"),
        token("close"),
        token("price"),
        token("note"),
        token("document")
      ),
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
    price_directive: ($) =>
      seq(
        field("date", $.date),
        field("directive_type", token("price")),
        field("commodity", $.currency),
        field("price", $.decimal),
        field("currency", $.currency)
      ),
    note_directive: ($) =>
      seq(
        field("date", $.date),
        field("directive_type", token("note")),
        field("account_name", $.account_name),
        field("note", $.str)
      ),
    document_directive: ($) =>
      seq(
        field("date", $.date),
        field("directive_type", token("document")),
        field("account_name", $.account_name),
        field("document_path", $.str)
      ),
    event_directive: ($) =>
      seq(
        field("date", $.date),
        field("directive_type", token("event")),
        field("event_name", $.str),
        field("event_value", $.str)
      ),
    option_directive: ($) =>
      seq("option", field("option_name", $.str), field("option_value", $.str)),
    plugin_directive: ($) =>
      seq(
        "plugin",
        field("module_name", $.str),
        optional(field("plugin_config", $.str))
      ),
    include_directive: ($) => seq("include", field("file_name", $.str)),
    account_name: ($) =>
      seq($.account_type, repeat1(seq(":", /[A-Z][A-Za-z0-9-]*/))),
    // account_name: ($) =>
    //   token(
    //     seq(
    //       /Assets|Liabilities|Equity|Income|Expenses/,
    //       repeat1(seq(":", /[\p{Lu}\p{N}][\p{L}\p{N}\-]*/))
    //     )
    //   ),
    account_type: ($) =>
      choice("Assets", "Expenses", "Liabilities", "Equity", "Income"),
    txn: ($) => choice("txn", "!", "*", "#"), //TODO:
    metadata: ($) =>
      prec.left(
        seq(
          $.metadata_key,
          field("colon", $.colon),
          choice(
            $.str,
            $.decimal,
            $.date,
            $.currency,
            $.account_name,
            $.tag
            // TODO: more metadata type
          )
        )
      ),
    date: ($) => /\d{4}-\d{2}-\d{2}/,
    currency: ($) => token(/[A-Z][A-Z0-9'._-]{0,22}[A-Z0-9]/),
    decimal: ($) => /\d+(\.\d+)?/,
    metadata_key: ($) => seq(field("data_key", /[a-z][A-Za-z0-9-_]*/)),
    str: ($) => /"[^"]*"/,
    tag: ($) => token(/#[A-Za-z0-9\-_/.]+/),
    comment: ($) => /;[^\n]*/,
    _new_line: ($) => choice("\n", "\r"),
    colon: ($) => ":",
    // Keys must begin with a lowercase character from a-z and may contain (uppercase or lowercase) letters, numbers, dashes and underscores.
  },
});

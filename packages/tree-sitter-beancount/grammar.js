/// <reference types="tree-sitter-cli/dsl" />
/**
 * A tree-sitter grammar for Beancount.
 */

const COMMENT = /;.*/;
const FLAG = /[!&?%PSTCURM*#]/;
// Entries should always end with an EOL. To avoid parsing errors on
// whitespace in the following line, include it in the token.
const EOL = /\n([ \r\t]+\n)?/;
// the preceding newline is part of the indent token.
const INDENT = /\n[ \r\t]+/;

module.exports = grammar({
  name: "beancount",
  extras: () => [/[ \t\r]/],
  conflicts: ($) => [[$.posting], [$.metadata], [$.tags_and_links]],

  rules: {
    comment: () => COMMENT,
    // Each Beancount files consists of a list of (un)dated entries, some lines might be skipped.
    beancount_file: ($) =>
      repeat(
        choice($._skipped_lines, $._dated_directives, $._undated_directives),
      ),
    _skipped_lines: ($) =>
      choice(
        seq(FLAG, /.*/, EOL),
        seq(":", /.*/, EOL),
        EOL,
        seq($.comment, EOL),
      ),

    // =======================================================================
    // Undated directives
    // =======================================================================
    _undated_directives: ($) =>
      choice(
        $.include,
        $.option,
        $.plugin,
        $.popmeta,
        $.poptag,
        $.pushmeta,
        $.pushtag,
      ),
    include: ($) => seq(alias("include", "INCLUDE"), $.string, EOL),
    option: ($) =>
      seq(
        alias("option", "OPTION"),
        field("key", $.string),
        field("value", $.string),
        EOL,
      ),
    plugin: ($) =>
      seq(
        alias("plugin", "PLUGIN"),
        field("name", $.string),
        field("config", optional($.string)),
        EOL,
      ),
    pushtag: ($) => seq(alias("pushtag", "PUSHTAG"), field("tag", $.tag), EOL),
    poptag: ($) => seq(alias("poptag", "POPTAG"), field("tag", $.tag), EOL),
    pushmeta: ($) =>
      seq(alias("pushmeta", "PUSHMETA"), field("key_value", $.key_value), EOL),
    popmeta: ($) => seq(alias("popmeta", "POPMETA"), field("key", $.key), EOL),

    // =======================================================================
    // Dated directives
    // =======================================================================
    _dated_directives: ($) =>
      choice(
        $.balance,
        $.close,
        $.commodity,
        $.custom,
        $.document,
        $.event,
        $.note,
        $.open,
        $.pad,
        $.price,
        $.transaction,
        $.query,
      ),
    balance: ($) =>
      seq(
        field("date", $.date),
        alias("balance", "BALANCE"),
        field("account", $.account),
        field("amount", choice($.amount, $.amount_with_tolerance)),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    close: ($) =>
      seq(
        field("date", $.date),
        alias("close", "CLOSE"),
        field("account", $.account),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    commodity: ($) =>
      seq(
        field("date", $.date),
        alias("commodity", "COMMODITY"),
        field("currency", $.currency),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    custom: ($) =>
      seq(
        field("date", $.date),
        alias("custom", "CUSTOM"),
        field("name", $.string),
        repeat(
          choice($.string, $.date, $.account, $.bool, $.amount, $._num_expr),
        ),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    document: ($) =>
      seq(
        field("date", $.date),
        alias("document", "DOCUMENT"),
        field("account", $.account),
        field("filename", $.string),
        field("tags_and_links", optional($.tags_and_links)),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    event: ($) =>
      seq(
        field("date", $.date),
        alias("event", "EVENT"),
        field("type", $.string),
        field("description", $.string),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    note: ($) =>
      seq(
        field("date", $.date),
        alias("note", "NOTE"),
        field("account", $.account),
        field("note", $.string),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    open: ($) =>
      seq(
        field("date", $.date),
        alias("open", "OPEN"),
        field("account", $.account),
        field("currencies", optional($.currency_list)),
        field("booking", optional($.string)),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    pad: ($) =>
      seq(
        field("date", $.date),
        alias("pad", "PAD"),
        field("account", $.account),
        field("from_account", $.account),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    price: ($) =>
      seq(
        field("date", $.date),
        alias("price", "PRICE"),
        field("currency", $.currency),
        field("amount", $.amount),
        field("metadata", optional($.metadata)),
        EOL,
      ),
    transaction: ($) =>
      seq(
        field("date", $.date),
        field("flag", $.flag),
        optional(
          choice(
            seq(field("payee", $.string), field("narration", $.string)),
            seq(field("narration", $.string)),
          ),
        ),
        field("tags_and_links", optional($.tags_and_links)),
        field("metadata", optional($.metadata)),
        field("postings", $.postings),
        EOL,
      ),
    query: ($) =>
      seq(
        field("date", $.date),
        alias("query", "QUERY"),
        field("name", $.string),
        field("query", $.string),
        field("metadata", optional($.metadata)),
        EOL,
      ),

    // =======================================================================
    // Postings
    // =======================================================================
    cost: ($) =>
      seq("{", field("cost_comp_list", optional($._cost_comp_list)), "}"),
    total_cost: ($) =>
      seq("{{", field("cost_comp_list", optional($._cost_comp_list)), "}}"),
    _cost_comp_list: ($) => seq($._cost_comp, repeat(seq(",", $._cost_comp))),
    _cost_comp: ($) =>
      choice(
        field("merge", alias("*", $.merge)),
        field("date", $.date),
        field("string", $.string),
        field("compound_amount", $.compound_amount),
      ),
    compound_amount: ($) =>
      choice(
        seq(
          field("number_per", optional($._num_expr)),
          field("currency", $.currency),
        ),
        seq(
          field("number_per", $._num_expr),
          field("currency", optional($.currency)),
        ),
        seq(
          field("number_per", optional($._num_expr)),
          "#",
          field("number_total", optional($._num_expr)),
          field("currency", $.currency),
        ),
      ),
    incomplete_amount: ($) =>
      choice(field("number", $._num_expr), field("currency", $.currency)),
    price_annotation: ($) =>
      seq("@", optional(choice($.amount, $.incomplete_amount))),
    total_price_annotation: ($) =>
      seq("@@", optional(choice($.amount, $.incomplete_amount))),
    posting: ($) =>
      seq(
        INDENT,
        field("flag", optional($.flag)),
        field("account", $.account),
        field("amount", optional(choice($.amount, $.incomplete_amount))),
        field("cost_spec", optional(choice($.cost, $.total_cost))),
        field(
          "price_annotation",
          optional(choice($.price_annotation, $.total_price_annotation)),
        ),
        optional($.comment),
        field("metadata", optional($.metadata)),
      ),
    postings: ($) => repeat1(choice($.posting, seq(INDENT, $.comment))),

    // =======================================================================
    // Various building blocks
    // =======================================================================
    tags_and_links: ($) =>
      repeat1(seq(optional(INDENT), choice($.tag, $.link))),
    currency_list: ($) => seq($.currency, repeat(seq(",", $.currency))),
    metadata: ($) => repeat1(seq(INDENT, $.key_value)),
    key_value: ($) =>
      seq(
        field("key", $.key),
        field(
          "value",
          optional(
            choice(
              $.string,
              $.account,
              $.date,
              $.currency,
              $.tag,
              $.bool,
              $._num_expr,
              $.amount,
            ),
          ),
        ),
      ),
    amount: ($) =>
      seq(field("number", $._num_expr), field("currency", $.currency)),
    amount_with_tolerance: ($) =>
      seq(
        field("number", $._num_expr),
        "~",
        field("tolerance", $._num_expr),
        field("currency", $.currency),
      ),

    // =======================================================================
    // Numerical expressions
    // =======================================================================
    // Since the following node is hidden in the syntax trees, we need to ensure that it
    // always consists of one node. Otherwise, accessing the children by index
    // cannot work.
    _num_expr: ($) =>
      choice($.number, $.paren_num_expr, $.unary_num_expr, $.binary_num_expr),
    paren_num_expr: ($) => seq("(", $._num_expr, ")"),
    unary_num_expr: ($) =>
      prec(3, choice(seq("-", $._num_expr), seq("+", $._num_expr))),
    binary_num_expr: ($) =>
      choice(
        prec.left(2, seq($._num_expr, "*", $._num_expr)),
        prec.left(2, seq($._num_expr, "/", $._num_expr)),
        prec.left(1, seq($._num_expr, "+", $._num_expr)),
        prec.left(1, seq($._num_expr, "-", $._num_expr)),
      ),

    // =======================================================================
    // Tokens
    // =======================================================================
    bool: () => token(/TRUE|FALSE/),
    date: () => token(/[0-9][0-9][0-9][0-9][\-/][0-9][0-9][\-/][0-9][0-9]/),
    key: () => token(/[a-z][a-zA-Z0-9\-_]+:/),
    tag: () => token(/#[A-Za-z0-9\-_/.]+/),
    link: () => token(/\^[A-Za-z0-9\-_/.]+/),
    string: () => token(/"[^"]*"/),
    currency: () => token(/[A-Z][A-Z0-9\'\._\-]{0,22}[A-Z0-9]/),
    number: () => token(/([0-9]+|[0-9][0-9,]+[0-9])(\.[0-9]*)?/),
    flag: () => token(FLAG),
    account: () =>
      token(
        seq(
          /[A-Z]|[^\x00-\x7F]/,
          repeat(/[A-Za-z0-9\-]|[^\x00-\x7F]/),
          repeat1(
            seq(
              ":",
              /[A-Z0-9]|[^\x00-\x7F]/,
              repeat(/[A-Za-z0-9\-]|[^\x00-\x7F]/),
            ),
          ),
        ),
      ),
    // TODO:
    // "Correct" UTF-8-aware token rule for accounts. This could be feasible now:
    // https://github.com/tree-sitter/tree-sitter/issues/464
    // token(seq(/\p{Lu}[0-9\-\p{L}]*/u, repeat1(/:[0-9\p{Lu}][0-9\-\p{L}]*/u)));
  },
});

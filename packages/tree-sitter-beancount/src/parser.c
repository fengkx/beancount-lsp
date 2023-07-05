#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 82
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 67
#define ALIAS_COUNT 0
#define TOKEN_COUNT 39
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 22
#define MAX_ALIAS_SEQUENCE_LENGTH 5
#define PRODUCTION_ID_COUNT 17

enum {
  sym_identifier = 1,
  anon_sym_open = 2,
  anon_sym_event = 3,
  anon_sym_close = 4,
  anon_sym_price = 5,
  anon_sym_note = 6,
  anon_sym_document = 7,
  anon_sym_balance = 8,
  anon_sym_pad = 9,
  anon_sym_COMMA = 10,
  anon_sym_option = 11,
  anon_sym_plugin = 12,
  anon_sym_include = 13,
  anon_sym_COLON = 14,
  aux_sym_account_name_token1 = 15,
  anon_sym_Assets = 16,
  anon_sym_Expenses = 17,
  anon_sym_Liabilities = 18,
  anon_sym_Equity = 19,
  anon_sym_Income = 20,
  anon_sym_txn = 21,
  anon_sym_BANG = 22,
  anon_sym_STAR = 23,
  anon_sym_LPAREN = 24,
  anon_sym_RPAREN = 25,
  anon_sym_DASH = 26,
  anon_sym_PLUS = 27,
  anon_sym_SLASH = 28,
  sym_date = 29,
  sym_currency = 30,
  sym_number = 31,
  aux_sym_metadata_key_token1 = 32,
  sym_str = 33,
  sym_tag = 34,
  sym_link = 35,
  sym_comment = 36,
  anon_sym_LF = 37,
  anon_sym_CR = 38,
  sym_file = 39,
  sym_directive = 40,
  sym_pad_directive = 41,
  sym_balance_directive = 42,
  sym_open_directive = 43,
  sym_close_directive = 44,
  sym_price_directive = 45,
  sym_amount = 46,
  sym_note_directive = 47,
  sym_document_directive = 48,
  sym_event_directive = 49,
  sym_option_directive = 50,
  sym_plugin_directive = 51,
  sym_include_directive = 52,
  sym_account_name = 53,
  sym_account_type = 54,
  sym_metadata = 55,
  sym__num_expr = 56,
  sym_paren_num_expr = 57,
  sym_unary_num_expr = 58,
  sym_binary_num_expr = 59,
  sym_metadata_key = 60,
  sym__new_line = 61,
  sym_colon = 62,
  aux_sym_file_repeat1 = 63,
  aux_sym_directive_repeat1 = 64,
  aux_sym_open_directive_repeat1 = 65,
  aux_sym_account_name_repeat1 = 66,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym_identifier] = "identifier",
  [anon_sym_open] = "open",
  [anon_sym_event] = "event",
  [anon_sym_close] = "close",
  [anon_sym_price] = "price",
  [anon_sym_note] = "note",
  [anon_sym_document] = "document",
  [anon_sym_balance] = "balance",
  [anon_sym_pad] = "pad",
  [anon_sym_COMMA] = ",",
  [anon_sym_option] = "option",
  [anon_sym_plugin] = "plugin",
  [anon_sym_include] = "include",
  [anon_sym_COLON] = ":",
  [aux_sym_account_name_token1] = "account_name_token1",
  [anon_sym_Assets] = "Assets",
  [anon_sym_Expenses] = "Expenses",
  [anon_sym_Liabilities] = "Liabilities",
  [anon_sym_Equity] = "Equity",
  [anon_sym_Income] = "Income",
  [anon_sym_txn] = "txn",
  [anon_sym_BANG] = "!",
  [anon_sym_STAR] = "*",
  [anon_sym_LPAREN] = "(",
  [anon_sym_RPAREN] = ")",
  [anon_sym_DASH] = "-",
  [anon_sym_PLUS] = "+",
  [anon_sym_SLASH] = "/",
  [sym_date] = "date",
  [sym_currency] = "currency",
  [sym_number] = "number",
  [aux_sym_metadata_key_token1] = "metadata_key_token1",
  [sym_str] = "str",
  [sym_tag] = "tag",
  [sym_link] = "link",
  [sym_comment] = "comment",
  [anon_sym_LF] = "\n",
  [anon_sym_CR] = "\r",
  [sym_file] = "file",
  [sym_directive] = "directive",
  [sym_pad_directive] = "pad_directive",
  [sym_balance_directive] = "balance_directive",
  [sym_open_directive] = "open_directive",
  [sym_close_directive] = "close_directive",
  [sym_price_directive] = "price_directive",
  [sym_amount] = "amount",
  [sym_note_directive] = "note_directive",
  [sym_document_directive] = "document_directive",
  [sym_event_directive] = "event_directive",
  [sym_option_directive] = "option_directive",
  [sym_plugin_directive] = "plugin_directive",
  [sym_include_directive] = "include_directive",
  [sym_account_name] = "account_name",
  [sym_account_type] = "account_type",
  [sym_metadata] = "metadata",
  [sym__num_expr] = "_num_expr",
  [sym_paren_num_expr] = "paren_num_expr",
  [sym_unary_num_expr] = "unary_num_expr",
  [sym_binary_num_expr] = "binary_num_expr",
  [sym_metadata_key] = "metadata_key",
  [sym__new_line] = "_new_line",
  [sym_colon] = "colon",
  [aux_sym_file_repeat1] = "file_repeat1",
  [aux_sym_directive_repeat1] = "directive_repeat1",
  [aux_sym_open_directive_repeat1] = "open_directive_repeat1",
  [aux_sym_account_name_repeat1] = "account_name_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym_identifier] = sym_identifier,
  [anon_sym_open] = anon_sym_open,
  [anon_sym_event] = anon_sym_event,
  [anon_sym_close] = anon_sym_close,
  [anon_sym_price] = anon_sym_price,
  [anon_sym_note] = anon_sym_note,
  [anon_sym_document] = anon_sym_document,
  [anon_sym_balance] = anon_sym_balance,
  [anon_sym_pad] = anon_sym_pad,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [anon_sym_option] = anon_sym_option,
  [anon_sym_plugin] = anon_sym_plugin,
  [anon_sym_include] = anon_sym_include,
  [anon_sym_COLON] = anon_sym_COLON,
  [aux_sym_account_name_token1] = aux_sym_account_name_token1,
  [anon_sym_Assets] = anon_sym_Assets,
  [anon_sym_Expenses] = anon_sym_Expenses,
  [anon_sym_Liabilities] = anon_sym_Liabilities,
  [anon_sym_Equity] = anon_sym_Equity,
  [anon_sym_Income] = anon_sym_Income,
  [anon_sym_txn] = anon_sym_txn,
  [anon_sym_BANG] = anon_sym_BANG,
  [anon_sym_STAR] = anon_sym_STAR,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [anon_sym_DASH] = anon_sym_DASH,
  [anon_sym_PLUS] = anon_sym_PLUS,
  [anon_sym_SLASH] = anon_sym_SLASH,
  [sym_date] = sym_date,
  [sym_currency] = sym_currency,
  [sym_number] = sym_number,
  [aux_sym_metadata_key_token1] = aux_sym_metadata_key_token1,
  [sym_str] = sym_str,
  [sym_tag] = sym_tag,
  [sym_link] = sym_link,
  [sym_comment] = sym_comment,
  [anon_sym_LF] = anon_sym_LF,
  [anon_sym_CR] = anon_sym_CR,
  [sym_file] = sym_file,
  [sym_directive] = sym_directive,
  [sym_pad_directive] = sym_pad_directive,
  [sym_balance_directive] = sym_balance_directive,
  [sym_open_directive] = sym_open_directive,
  [sym_close_directive] = sym_close_directive,
  [sym_price_directive] = sym_price_directive,
  [sym_amount] = sym_amount,
  [sym_note_directive] = sym_note_directive,
  [sym_document_directive] = sym_document_directive,
  [sym_event_directive] = sym_event_directive,
  [sym_option_directive] = sym_option_directive,
  [sym_plugin_directive] = sym_plugin_directive,
  [sym_include_directive] = sym_include_directive,
  [sym_account_name] = sym_account_name,
  [sym_account_type] = sym_account_type,
  [sym_metadata] = sym_metadata,
  [sym__num_expr] = sym__num_expr,
  [sym_paren_num_expr] = sym_paren_num_expr,
  [sym_unary_num_expr] = sym_unary_num_expr,
  [sym_binary_num_expr] = sym_binary_num_expr,
  [sym_metadata_key] = sym_metadata_key,
  [sym__new_line] = sym__new_line,
  [sym_colon] = sym_colon,
  [aux_sym_file_repeat1] = aux_sym_file_repeat1,
  [aux_sym_directive_repeat1] = aux_sym_directive_repeat1,
  [aux_sym_open_directive_repeat1] = aux_sym_open_directive_repeat1,
  [aux_sym_account_name_repeat1] = aux_sym_account_name_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [sym_identifier] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_open] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_event] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_close] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_price] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_note] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_document] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_balance] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_pad] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COMMA] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_option] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_plugin] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_include] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_account_name_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_Assets] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Expenses] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Liabilities] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Equity] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Income] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_txn] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BANG] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_STAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DASH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PLUS] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SLASH] = {
    .visible = true,
    .named = false,
  },
  [sym_date] = {
    .visible = true,
    .named = true,
  },
  [sym_currency] = {
    .visible = true,
    .named = true,
  },
  [sym_number] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_metadata_key_token1] = {
    .visible = false,
    .named = false,
  },
  [sym_str] = {
    .visible = true,
    .named = true,
  },
  [sym_tag] = {
    .visible = true,
    .named = true,
  },
  [sym_link] = {
    .visible = true,
    .named = true,
  },
  [sym_comment] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_LF] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_CR] = {
    .visible = true,
    .named = false,
  },
  [sym_file] = {
    .visible = true,
    .named = true,
  },
  [sym_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_pad_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_balance_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_open_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_close_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_price_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_amount] = {
    .visible = true,
    .named = true,
  },
  [sym_note_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_document_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_event_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_option_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_plugin_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_include_directive] = {
    .visible = true,
    .named = true,
  },
  [sym_account_name] = {
    .visible = true,
    .named = true,
  },
  [sym_account_type] = {
    .visible = true,
    .named = true,
  },
  [sym_metadata] = {
    .visible = true,
    .named = true,
  },
  [sym__num_expr] = {
    .visible = false,
    .named = true,
  },
  [sym_paren_num_expr] = {
    .visible = true,
    .named = true,
  },
  [sym_unary_num_expr] = {
    .visible = true,
    .named = true,
  },
  [sym_binary_num_expr] = {
    .visible = true,
    .named = true,
  },
  [sym_metadata_key] = {
    .visible = true,
    .named = true,
  },
  [sym__new_line] = {
    .visible = false,
    .named = true,
  },
  [sym_colon] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_file_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_directive_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_open_directive_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_account_name_repeat1] = {
    .visible = false,
    .named = false,
  },
};

enum {
  field_account = 1,
  field_account_name = 2,
  field_amount = 3,
  field_colon = 4,
  field_commodity = 5,
  field_currencies = 6,
  field_currency = 7,
  field_data_key = 8,
  field_date = 9,
  field_directive_type = 10,
  field_document_path = 11,
  field_event_name = 12,
  field_event_value = 13,
  field_file_name = 14,
  field_from_account = 15,
  field_module_name = 16,
  field_note = 17,
  field_number = 18,
  field_option_name = 19,
  field_option_value = 20,
  field_plugin_config = 21,
  field_price = 22,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_account] = "account",
  [field_account_name] = "account_name",
  [field_amount] = "amount",
  [field_colon] = "colon",
  [field_commodity] = "commodity",
  [field_currencies] = "currencies",
  [field_currency] = "currency",
  [field_data_key] = "data_key",
  [field_date] = "date",
  [field_directive_type] = "directive_type",
  [field_document_path] = "document_path",
  [field_event_name] = "event_name",
  [field_event_value] = "event_value",
  [field_file_name] = "file_name",
  [field_from_account] = "from_account",
  [field_module_name] = "module_name",
  [field_note] = "note",
  [field_number] = "number",
  [field_option_name] = "option_name",
  [field_option_value] = "option_value",
  [field_plugin_config] = "plugin_config",
  [field_price] = "price",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 1},
  [2] = {.index = 1, .length = 1},
  [3] = {.index = 2, .length = 1},
  [4] = {.index = 3, .length = 2},
  [5] = {.index = 5, .length = 2},
  [6] = {.index = 7, .length = 3},
  [7] = {.index = 10, .length = 4},
  [8] = {.index = 14, .length = 4},
  [9] = {.index = 18, .length = 4},
  [10] = {.index = 22, .length = 4},
  [11] = {.index = 26, .length = 4},
  [12] = {.index = 30, .length = 4},
  [13] = {.index = 34, .length = 1},
  [14] = {.index = 35, .length = 5},
  [15] = {.index = 40, .length = 5},
  [16] = {.index = 45, .length = 2},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_module_name, 1},
  [1] =
    {field_file_name, 1},
  [2] =
    {field_data_key, 0},
  [3] =
    {field_option_name, 1},
    {field_option_value, 2},
  [5] =
    {field_module_name, 1},
    {field_plugin_config, 2},
  [7] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
  [10] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_date, 0},
    {field_directive_type, 1},
  [14] =
    {field_date, 0},
    {field_directive_type, 1},
    {field_event_name, 2},
    {field_event_value, 3},
  [18] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
    {field_note, 3},
  [22] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
    {field_document_path, 3},
  [26] =
    {field_account_name, 2},
    {field_amount, 3},
    {field_date, 0},
    {field_directive_type, 1},
  [30] =
    {field_account, 2},
    {field_date, 0},
    {field_directive_type, 1},
    {field_from_account, 3},
  [34] =
    {field_colon, 1},
  [35] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_currencies, 4},
    {field_date, 0},
    {field_directive_type, 1},
  [40] =
    {field_commodity, 2},
    {field_currency, 4},
    {field_date, 0},
    {field_directive_type, 1},
    {field_price, 3},
  [45] =
    {field_currency, 1},
    {field_number, 0},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 14,
  [16] = 16,
  [17] = 16,
  [18] = 18,
  [19] = 18,
  [20] = 20,
  [21] = 21,
  [22] = 22,
  [23] = 23,
  [24] = 24,
  [25] = 25,
  [26] = 26,
  [27] = 27,
  [28] = 28,
  [29] = 29,
  [30] = 30,
  [31] = 31,
  [32] = 32,
  [33] = 33,
  [34] = 34,
  [35] = 35,
  [36] = 36,
  [37] = 37,
  [38] = 38,
  [39] = 39,
  [40] = 40,
  [41] = 40,
  [42] = 42,
  [43] = 42,
  [44] = 44,
  [45] = 45,
  [46] = 46,
  [47] = 45,
  [48] = 39,
  [49] = 49,
  [50] = 50,
  [51] = 51,
  [52] = 52,
  [53] = 53,
  [54] = 54,
  [55] = 55,
  [56] = 8,
  [57] = 7,
  [58] = 6,
  [59] = 5,
  [60] = 60,
  [61] = 61,
  [62] = 62,
  [63] = 60,
  [64] = 64,
  [65] = 65,
  [66] = 65,
  [67] = 67,
  [68] = 68,
  [69] = 69,
  [70] = 70,
  [71] = 71,
  [72] = 72,
  [73] = 73,
  [74] = 74,
  [75] = 75,
  [76] = 76,
  [77] = 77,
  [78] = 78,
  [79] = 78,
  [80] = 80,
  [81] = 81,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(77);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (lookahead == '\n') ADVANCE(210);
      if (lookahead == '!') ADVANCE(151);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(74);
      if (lookahead == '(') ADVANCE(153);
      if (lookahead == ')') ADVANCE(154);
      if (lookahead == '*') ADVANCE(152);
      if (lookahead == '+') ADVANCE(157);
      if (lookahead == ',') ADVANCE(78);
      if (lookahead == '-') ADVANCE(156);
      if (lookahead == '/') ADVANCE(158);
      if (lookahead == ':') ADVANCE(85);
      if (lookahead == ';') ADVANCE(209);
      if (lookahead == 'A') ADVANCE(110);
      if (lookahead == 'E') ADVANCE(109);
      if (lookahead == 'I') ADVANCE(108);
      if (lookahead == 'L') ADVANCE(107);
      if (lookahead == '^') ADVANCE(75);
      if (lookahead == 'i') ADVANCE(220);
      if (lookahead == 'o') ADVANCE(224);
      if (lookahead == 'p') ADVANCE(218);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(186);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(111);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 1:
      if (lookahead == '"') ADVANCE(206);
      if (lookahead != 0) ADVANCE(1);
      END_STATE();
    case 2:
      if (lookahead == '-') ADVANCE(68);
      END_STATE();
    case 3:
      if (lookahead == '-') ADVANCE(69);
      END_STATE();
    case 4:
      if (lookahead == 'a') ADVANCE(5);
      END_STATE();
    case 5:
      if (lookahead == 'b') ADVANCE(14);
      END_STATE();
    case 6:
      if (lookahead == 'c') ADVANCE(23);
      END_STATE();
    case 7:
      if (lookahead == 'e') ADVANCE(35);
      END_STATE();
    case 8:
      if (lookahead == 'e') ADVANCE(22);
      END_STATE();
    case 9:
      if (lookahead == 'e') ADVANCE(149);
      END_STATE();
    case 10:
      if (lookahead == 'e') ADVANCE(31);
      END_STATE();
    case 11:
      if (lookahead == 'e') ADVANCE(32);
      END_STATE();
    case 12:
      if (lookahead == 'i') ADVANCE(4);
      END_STATE();
    case 13:
      if (lookahead == 'i') ADVANCE(4);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 14:
      if (lookahead == 'i') ADVANCE(18);
      END_STATE();
    case 15:
      if (lookahead == 'i') ADVANCE(34);
      END_STATE();
    case 16:
      if (lookahead == 'i') ADVANCE(36);
      END_STATE();
    case 17:
      if (lookahead == 'i') ADVANCE(11);
      END_STATE();
    case 18:
      if (lookahead == 'l') ADVANCE(16);
      END_STATE();
    case 19:
      if (lookahead == 'm') ADVANCE(9);
      END_STATE();
    case 20:
      if (lookahead == 'n') ADVANCE(6);
      END_STATE();
    case 21:
      if (lookahead == 'n') ADVANCE(6);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 22:
      if (lookahead == 'n') ADVANCE(33);
      END_STATE();
    case 23:
      if (lookahead == 'o') ADVANCE(19);
      END_STATE();
    case 24:
      if (lookahead == 'p') ADVANCE(8);
      END_STATE();
    case 25:
      if (lookahead == 'q') ADVANCE(37);
      if (lookahead == 'x') ADVANCE(24);
      END_STATE();
    case 26:
      if (lookahead == 'q') ADVANCE(37);
      if (lookahead == 'x') ADVANCE(24);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 27:
      if (lookahead == 's') ADVANCE(29);
      END_STATE();
    case 28:
      if (lookahead == 's') ADVANCE(29);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 29:
      if (lookahead == 's') ADVANCE(7);
      END_STATE();
    case 30:
      if (lookahead == 's') ADVANCE(141);
      END_STATE();
    case 31:
      if (lookahead == 's') ADVANCE(143);
      END_STATE();
    case 32:
      if (lookahead == 's') ADVANCE(145);
      END_STATE();
    case 33:
      if (lookahead == 's') ADVANCE(10);
      END_STATE();
    case 34:
      if (lookahead == 't') ADVANCE(38);
      END_STATE();
    case 35:
      if (lookahead == 't') ADVANCE(30);
      END_STATE();
    case 36:
      if (lookahead == 't') ADVANCE(17);
      END_STATE();
    case 37:
      if (lookahead == 'u') ADVANCE(15);
      END_STATE();
    case 38:
      if (lookahead == 'y') ADVANCE(147);
      END_STATE();
    case 39:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(39)
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(74);
      if (lookahead == '(') ADVANCE(153);
      if (lookahead == '+') ADVANCE(157);
      if (lookahead == '-') ADVANCE(156);
      if (lookahead == 'A') ADVANCE(28);
      if (lookahead == 'E') ADVANCE(26);
      if (lookahead == 'I') ADVANCE(21);
      if (lookahead == 'L') ADVANCE(13);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(186);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(43);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 40:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(40)
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '(') ADVANCE(153);
      if (lookahead == '+') ADVANCE(157);
      if (lookahead == '-') ADVANCE(156);
      if (lookahead == ':') ADVANCE(85);
      if (lookahead == 'A') ADVANCE(27);
      if (lookahead == 'E') ADVANCE(25);
      if (lookahead == 'I') ADVANCE(20);
      if (lookahead == 'L') ADVANCE(12);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(187);
      END_STATE();
    case 41:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(41)
      if (lookahead == ')') ADVANCE(154);
      if (lookahead == '*') ADVANCE(152);
      if (lookahead == '+') ADVANCE(157);
      if (lookahead == '-') ADVANCE(155);
      if (lookahead == '/') ADVANCE(158);
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(43);
      END_STATE();
    case 42:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(42)
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(140);
      END_STATE();
    case 43:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 44:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(73);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(182);
      END_STATE();
    case 45:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(161);
      END_STATE();
    case 46:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(164);
      END_STATE();
    case 47:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(162);
      END_STATE();
    case 48:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(166);
      END_STATE();
    case 49:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(163);
      END_STATE();
    case 50:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(168);
      END_STATE();
    case 51:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 52:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(170);
      END_STATE();
    case 53:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(167);
      END_STATE();
    case 54:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(172);
      END_STATE();
    case 55:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(169);
      END_STATE();
    case 56:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(174);
      END_STATE();
    case 57:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(171);
      END_STATE();
    case 58:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 59:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(173);
      END_STATE();
    case 60:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(61);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(178);
      END_STATE();
    case 61:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(175);
      END_STATE();
    case 62:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(180);
      END_STATE();
    case 63:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(177);
      END_STATE();
    case 64:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(179);
      END_STATE();
    case 65:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(188);
      END_STATE();
    case 66:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(3);
      END_STATE();
    case 67:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(159);
      END_STATE();
    case 68:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(66);
      END_STATE();
    case 69:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(67);
      END_STATE();
    case 70:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(2);
      END_STATE();
    case 71:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(70);
      END_STATE();
    case 72:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(71);
      END_STATE();
    case 73:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(160);
      END_STATE();
    case 74:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(207);
      END_STATE();
    case 75:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(208);
      END_STATE();
    case 76:
      if (eof) ADVANCE(77);
      if (lookahead == '\t' ||
          lookahead == ' ') SKIP(76)
      if (lookahead == '\n') ADVANCE(210);
      if (lookahead == '\r') ADVANCE(211);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '*') ADVANCE(152);
      if (lookahead == '+') ADVANCE(157);
      if (lookahead == ',') ADVANCE(78);
      if (lookahead == '-') ADVANCE(155);
      if (lookahead == '/') ADVANCE(158);
      if (lookahead == ':') ADVANCE(85);
      if (lookahead == ';') ADVANCE(209);
      if (lookahead == 'i') ADVANCE(197);
      if (lookahead == 'o') ADVANCE(201);
      if (lookahead == 'p') ADVANCE(195);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(72);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(43);
      END_STATE();
    case 77:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 78:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 79:
      ACCEPT_TOKEN(anon_sym_option);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 80:
      ACCEPT_TOKEN(anon_sym_option);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 81:
      ACCEPT_TOKEN(anon_sym_plugin);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 82:
      ACCEPT_TOKEN(anon_sym_plugin);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 83:
      ACCEPT_TOKEN(anon_sym_include);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 84:
      ACCEPT_TOKEN(anon_sym_include);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 85:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 86:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(139);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(73);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(139);
      END_STATE();
    case 87:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(86);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(86);
      END_STATE();
    case 88:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(87);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(87);
      END_STATE();
    case 89:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(90);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(90);
      END_STATE();
    case 90:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(88);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(88);
      END_STATE();
    case 91:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(92);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(92);
      END_STATE();
    case 92:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(89);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(89);
      END_STATE();
    case 93:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(94);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(94);
      END_STATE();
    case 94:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(91);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(91);
      END_STATE();
    case 95:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(96);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(96);
      END_STATE();
    case 96:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(93);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(93);
      END_STATE();
    case 97:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(98);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(98);
      END_STATE();
    case 98:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(95);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(95);
      END_STATE();
    case 99:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(100);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(100);
      END_STATE();
    case 100:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 101:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(102);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(102);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(99);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(99);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(104);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(60);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(104);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(101);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(61);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(101);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(106);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(106);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(103);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(103);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(105);
      if (lookahead == 'i') ADVANCE(112);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(105);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(105);
      if (lookahead == 'n') ADVANCE(114);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(105);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(105);
      if (lookahead == 'q') ADVANCE(137);
      if (lookahead == 'x') ADVANCE(128);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(105);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(105);
      if (lookahead == 's') ADVANCE(129);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(105);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(105);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(105);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'a') ADVANCE(113);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('b' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'b') ADVANCE(120);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'c') ADVANCE(127);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(135);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(126);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(150);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(131);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(132);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(124);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(134);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(136);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(119);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'l') ADVANCE(122);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'm') ADVANCE(117);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'n') ADVANCE(133);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'o') ADVANCE(125);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'p') ADVANCE(116);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(115);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(142);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(144);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(146);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(118);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(138);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(130);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(123);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'u') ADVANCE(121);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'y') ADVANCE(148);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(140);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_Assets);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(anon_sym_Assets);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(anon_sym_Expenses);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(anon_sym_Expenses);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(anon_sym_Equity);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(anon_sym_Equity);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(anon_sym_Income);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(anon_sym_Income);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(140);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(anon_sym_BANG);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(anon_sym_STAR);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(anon_sym_DASH);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(anon_sym_DASH);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(187);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(anon_sym_PLUS);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(anon_sym_SLASH);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(sym_date);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(sym_currency);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(73);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(182);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(161);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(164);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(162);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(166);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(163);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(168);
      END_STATE();
    case 168:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(170);
      END_STATE();
    case 170:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(167);
      END_STATE();
    case 171:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(172);
      END_STATE();
    case 172:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(169);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(174);
      END_STATE();
    case 174:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(171);
      END_STATE();
    case 175:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 176:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(173);
      END_STATE();
    case 177:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(61);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(178);
      END_STATE();
    case 178:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(175);
      END_STATE();
    case 179:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(180);
      END_STATE();
    case 180:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(177);
      END_STATE();
    case 181:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(179);
      END_STATE();
    case 182:
      ACCEPT_TOKEN(sym_currency);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(160);
      END_STATE();
    case 183:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '-') ADVANCE(68);
      if (lookahead == '.') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(187);
      END_STATE();
    case 184:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(183);
      END_STATE();
    case 185:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(184);
      END_STATE();
    case 186:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(185);
      END_STATE();
    case 187:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(187);
      END_STATE();
    case 188:
      ACCEPT_TOKEN(sym_number);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(188);
      END_STATE();
    case 189:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'c') ADVANCE(196);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 190:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'd') ADVANCE(191);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 191:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'e') ADVANCE(84);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 192:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'g') ADVANCE(194);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 193:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'i') ADVANCE(200);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 194:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'i') ADVANCE(199);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 195:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'l') ADVANCE(203);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 196:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'l') ADVANCE(204);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 197:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(189);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 198:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(80);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 199:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(82);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 200:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'o') ADVANCE(198);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 201:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'p') ADVANCE(202);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 202:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 't') ADVANCE(193);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 203:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'u') ADVANCE(192);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 204:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'u') ADVANCE(190);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 205:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(205);
      END_STATE();
    case 206:
      ACCEPT_TOKEN(sym_str);
      END_STATE();
    case 207:
      ACCEPT_TOKEN(sym_tag);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(207);
      END_STATE();
    case 208:
      ACCEPT_TOKEN(sym_link);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(208);
      END_STATE();
    case 209:
      ACCEPT_TOKEN(sym_comment);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(209);
      END_STATE();
    case 210:
      ACCEPT_TOKEN(anon_sym_LF);
      END_STATE();
    case 211:
      ACCEPT_TOKEN(anon_sym_CR);
      if (lookahead == '\r') ADVANCE(211);
      END_STATE();
    case 212:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'c') ADVANCE(219);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 213:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'd') ADVANCE(214);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 214:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'e') ADVANCE(83);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 215:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'g') ADVANCE(217);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 216:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'i') ADVANCE(223);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 217:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'i') ADVANCE(222);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 218:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'l') ADVANCE(226);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 219:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'l') ADVANCE(227);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 220:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'n') ADVANCE(212);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 221:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'n') ADVANCE(79);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 222:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'n') ADVANCE(81);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 223:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'o') ADVANCE(221);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 224:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'p') ADVANCE(225);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 225:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 't') ADVANCE(216);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 226:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'u') ADVANCE(215);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 227:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'u') ADVANCE(213);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    case 228:
      ACCEPT_TOKEN(sym_identifier);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(228);
      END_STATE();
    default:
      return false;
  }
}

static bool ts_lex_keywords(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (lookahead == 'b') ADVANCE(1);
      if (lookahead == 'c') ADVANCE(2);
      if (lookahead == 'd') ADVANCE(3);
      if (lookahead == 'e') ADVANCE(4);
      if (lookahead == 'n') ADVANCE(5);
      if (lookahead == 'o') ADVANCE(6);
      if (lookahead == 'p') ADVANCE(7);
      if (lookahead == 't') ADVANCE(8);
      END_STATE();
    case 1:
      if (lookahead == 'a') ADVANCE(9);
      END_STATE();
    case 2:
      if (lookahead == 'l') ADVANCE(10);
      END_STATE();
    case 3:
      if (lookahead == 'o') ADVANCE(11);
      END_STATE();
    case 4:
      if (lookahead == 'v') ADVANCE(12);
      END_STATE();
    case 5:
      if (lookahead == 'o') ADVANCE(13);
      END_STATE();
    case 6:
      if (lookahead == 'p') ADVANCE(14);
      END_STATE();
    case 7:
      if (lookahead == 'a') ADVANCE(15);
      if (lookahead == 'r') ADVANCE(16);
      END_STATE();
    case 8:
      if (lookahead == 'x') ADVANCE(17);
      END_STATE();
    case 9:
      if (lookahead == 'l') ADVANCE(18);
      END_STATE();
    case 10:
      if (lookahead == 'o') ADVANCE(19);
      END_STATE();
    case 11:
      if (lookahead == 'c') ADVANCE(20);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(21);
      END_STATE();
    case 13:
      if (lookahead == 't') ADVANCE(22);
      END_STATE();
    case 14:
      if (lookahead == 'e') ADVANCE(23);
      END_STATE();
    case 15:
      if (lookahead == 'd') ADVANCE(24);
      END_STATE();
    case 16:
      if (lookahead == 'i') ADVANCE(25);
      END_STATE();
    case 17:
      if (lookahead == 'n') ADVANCE(26);
      END_STATE();
    case 18:
      if (lookahead == 'a') ADVANCE(27);
      END_STATE();
    case 19:
      if (lookahead == 's') ADVANCE(28);
      END_STATE();
    case 20:
      if (lookahead == 'u') ADVANCE(29);
      END_STATE();
    case 21:
      if (lookahead == 'n') ADVANCE(30);
      END_STATE();
    case 22:
      if (lookahead == 'e') ADVANCE(31);
      END_STATE();
    case 23:
      if (lookahead == 'n') ADVANCE(32);
      END_STATE();
    case 24:
      ACCEPT_TOKEN(anon_sym_pad);
      END_STATE();
    case 25:
      if (lookahead == 'c') ADVANCE(33);
      END_STATE();
    case 26:
      ACCEPT_TOKEN(anon_sym_txn);
      END_STATE();
    case 27:
      if (lookahead == 'n') ADVANCE(34);
      END_STATE();
    case 28:
      if (lookahead == 'e') ADVANCE(35);
      END_STATE();
    case 29:
      if (lookahead == 'm') ADVANCE(36);
      END_STATE();
    case 30:
      if (lookahead == 't') ADVANCE(37);
      END_STATE();
    case 31:
      ACCEPT_TOKEN(anon_sym_note);
      END_STATE();
    case 32:
      ACCEPT_TOKEN(anon_sym_open);
      END_STATE();
    case 33:
      if (lookahead == 'e') ADVANCE(38);
      END_STATE();
    case 34:
      if (lookahead == 'c') ADVANCE(39);
      END_STATE();
    case 35:
      ACCEPT_TOKEN(anon_sym_close);
      END_STATE();
    case 36:
      if (lookahead == 'e') ADVANCE(40);
      END_STATE();
    case 37:
      ACCEPT_TOKEN(anon_sym_event);
      END_STATE();
    case 38:
      ACCEPT_TOKEN(anon_sym_price);
      END_STATE();
    case 39:
      if (lookahead == 'e') ADVANCE(41);
      END_STATE();
    case 40:
      if (lookahead == 'n') ADVANCE(42);
      END_STATE();
    case 41:
      ACCEPT_TOKEN(anon_sym_balance);
      END_STATE();
    case 42:
      if (lookahead == 't') ADVANCE(43);
      END_STATE();
    case 43:
      ACCEPT_TOKEN(anon_sym_document);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 76},
  [2] = {.lex_state = 76},
  [3] = {.lex_state = 76},
  [4] = {.lex_state = 39},
  [5] = {.lex_state = 76},
  [6] = {.lex_state = 76},
  [7] = {.lex_state = 76},
  [8] = {.lex_state = 76},
  [9] = {.lex_state = 76},
  [10] = {.lex_state = 76},
  [11] = {.lex_state = 39},
  [12] = {.lex_state = 76},
  [13] = {.lex_state = 76},
  [14] = {.lex_state = 76},
  [15] = {.lex_state = 40},
  [16] = {.lex_state = 40},
  [17] = {.lex_state = 76},
  [18] = {.lex_state = 40},
  [19] = {.lex_state = 76},
  [20] = {.lex_state = 76},
  [21] = {.lex_state = 76},
  [22] = {.lex_state = 76},
  [23] = {.lex_state = 76},
  [24] = {.lex_state = 76},
  [25] = {.lex_state = 76},
  [26] = {.lex_state = 76},
  [27] = {.lex_state = 76},
  [28] = {.lex_state = 76},
  [29] = {.lex_state = 76},
  [30] = {.lex_state = 76},
  [31] = {.lex_state = 76},
  [32] = {.lex_state = 76},
  [33] = {.lex_state = 76},
  [34] = {.lex_state = 76},
  [35] = {.lex_state = 76},
  [36] = {.lex_state = 76},
  [37] = {.lex_state = 40},
  [38] = {.lex_state = 76},
  [39] = {.lex_state = 40},
  [40] = {.lex_state = 40},
  [41] = {.lex_state = 40},
  [42] = {.lex_state = 40},
  [43] = {.lex_state = 40},
  [44] = {.lex_state = 40},
  [45] = {.lex_state = 40},
  [46] = {.lex_state = 39},
  [47] = {.lex_state = 40},
  [48] = {.lex_state = 40},
  [49] = {.lex_state = 39},
  [50] = {.lex_state = 39},
  [51] = {.lex_state = 39},
  [52] = {.lex_state = 39},
  [53] = {.lex_state = 39},
  [54] = {.lex_state = 39},
  [55] = {.lex_state = 39},
  [56] = {.lex_state = 41},
  [57] = {.lex_state = 41},
  [58] = {.lex_state = 41},
  [59] = {.lex_state = 41},
  [60] = {.lex_state = 41},
  [61] = {.lex_state = 41},
  [62] = {.lex_state = 41},
  [63] = {.lex_state = 41},
  [64] = {.lex_state = 0},
  [65] = {.lex_state = 0},
  [66] = {.lex_state = 0},
  [67] = {.lex_state = 0},
  [68] = {.lex_state = 0},
  [69] = {.lex_state = 39},
  [70] = {.lex_state = 0},
  [71] = {.lex_state = 0},
  [72] = {.lex_state = 0},
  [73] = {.lex_state = 0},
  [74] = {.lex_state = 39},
  [75] = {.lex_state = 0},
  [76] = {.lex_state = 0},
  [77] = {.lex_state = 0},
  [78] = {.lex_state = 42},
  [79] = {.lex_state = 42},
  [80] = {.lex_state = 0},
  [81] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym_identifier] = ACTIONS(1),
    [anon_sym_open] = ACTIONS(1),
    [anon_sym_event] = ACTIONS(1),
    [anon_sym_close] = ACTIONS(1),
    [anon_sym_price] = ACTIONS(1),
    [anon_sym_note] = ACTIONS(1),
    [anon_sym_document] = ACTIONS(1),
    [anon_sym_balance] = ACTIONS(1),
    [anon_sym_pad] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [anon_sym_option] = ACTIONS(1),
    [anon_sym_plugin] = ACTIONS(1),
    [anon_sym_include] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [aux_sym_account_name_token1] = ACTIONS(1),
    [anon_sym_Assets] = ACTIONS(1),
    [anon_sym_Expenses] = ACTIONS(1),
    [anon_sym_Liabilities] = ACTIONS(1),
    [anon_sym_Equity] = ACTIONS(1),
    [anon_sym_Income] = ACTIONS(1),
    [anon_sym_txn] = ACTIONS(1),
    [anon_sym_BANG] = ACTIONS(1),
    [anon_sym_STAR] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [anon_sym_DASH] = ACTIONS(1),
    [anon_sym_PLUS] = ACTIONS(1),
    [anon_sym_SLASH] = ACTIONS(1),
    [sym_date] = ACTIONS(1),
    [sym_currency] = ACTIONS(1),
    [sym_number] = ACTIONS(1),
    [sym_str] = ACTIONS(1),
    [sym_tag] = ACTIONS(1),
    [sym_link] = ACTIONS(1),
    [sym_comment] = ACTIONS(1),
    [anon_sym_LF] = ACTIONS(1),
  },
  [1] = {
    [sym_file] = STATE(71),
    [sym_directive] = STATE(2),
    [sym_pad_directive] = STATE(9),
    [sym_balance_directive] = STATE(9),
    [sym_open_directive] = STATE(9),
    [sym_close_directive] = STATE(9),
    [sym_price_directive] = STATE(9),
    [sym_note_directive] = STATE(9),
    [sym_document_directive] = STATE(9),
    [sym_event_directive] = STATE(9),
    [sym_option_directive] = STATE(9),
    [sym_plugin_directive] = STATE(9),
    [sym_include_directive] = STATE(9),
    [sym__new_line] = STATE(2),
    [aux_sym_file_repeat1] = STATE(2),
    [ts_builtin_sym_end] = ACTIONS(3),
    [anon_sym_option] = ACTIONS(5),
    [anon_sym_plugin] = ACTIONS(7),
    [anon_sym_include] = ACTIONS(9),
    [sym_date] = ACTIONS(11),
    [sym_comment] = ACTIONS(13),
    [anon_sym_LF] = ACTIONS(13),
    [anon_sym_CR] = ACTIONS(15),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 9,
    ACTIONS(5), 1,
      anon_sym_option,
    ACTIONS(7), 1,
      anon_sym_plugin,
    ACTIONS(9), 1,
      anon_sym_include,
    ACTIONS(11), 1,
      sym_date,
    ACTIONS(17), 1,
      ts_builtin_sym_end,
    ACTIONS(21), 1,
      anon_sym_CR,
    ACTIONS(19), 2,
      sym_comment,
      anon_sym_LF,
    STATE(3), 3,
      sym_directive,
      sym__new_line,
      aux_sym_file_repeat1,
    STATE(9), 11,
      sym_pad_directive,
      sym_balance_directive,
      sym_open_directive,
      sym_close_directive,
      sym_price_directive,
      sym_note_directive,
      sym_document_directive,
      sym_event_directive,
      sym_option_directive,
      sym_plugin_directive,
      sym_include_directive,
  [41] = 9,
    ACTIONS(23), 1,
      ts_builtin_sym_end,
    ACTIONS(25), 1,
      anon_sym_option,
    ACTIONS(28), 1,
      anon_sym_plugin,
    ACTIONS(31), 1,
      anon_sym_include,
    ACTIONS(34), 1,
      sym_date,
    ACTIONS(40), 1,
      anon_sym_CR,
    ACTIONS(37), 2,
      sym_comment,
      anon_sym_LF,
    STATE(3), 3,
      sym_directive,
      sym__new_line,
      aux_sym_file_repeat1,
    STATE(9), 11,
      sym_pad_directive,
      sym_balance_directive,
      sym_open_directive,
      sym_close_directive,
      sym_price_directive,
      sym_note_directive,
      sym_document_directive,
      sym_event_directive,
      sym_option_directive,
      sym_plugin_directive,
      sym_include_directive,
  [82] = 9,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(53), 1,
      sym_number,
    STATE(30), 1,
      sym_account_name,
    STATE(65), 1,
      sym_account_type,
    ACTIONS(51), 4,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
    STATE(13), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [120] = 3,
    ACTIONS(55), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(59), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(57), 9,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_DASH,
      anon_sym_PLUS,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [140] = 2,
    ACTIONS(55), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(57), 11,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_STAR,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [158] = 2,
    ACTIONS(61), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(63), 11,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_STAR,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [176] = 2,
    ACTIONS(65), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(67), 11,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_STAR,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [194] = 7,
    ACTIONS(69), 1,
      ts_builtin_sym_end,
    ACTIONS(73), 1,
      aux_sym_metadata_key_token1,
    ACTIONS(75), 1,
      anon_sym_LF,
    ACTIONS(77), 1,
      anon_sym_CR,
    STATE(64), 1,
      sym_metadata_key,
    STATE(12), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(71), 5,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
  [222] = 7,
    ACTIONS(79), 1,
      ts_builtin_sym_end,
    ACTIONS(83), 1,
      aux_sym_metadata_key_token1,
    ACTIONS(86), 1,
      anon_sym_LF,
    ACTIONS(89), 1,
      anon_sym_CR,
    STATE(64), 1,
      sym_metadata_key,
    STATE(10), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(81), 5,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
  [250] = 2,
    ACTIONS(94), 2,
      anon_sym_DASH,
      sym_number,
    ACTIONS(92), 11,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
  [268] = 5,
    ACTIONS(73), 1,
      aux_sym_metadata_key_token1,
    STATE(64), 1,
      sym_metadata_key,
    ACTIONS(96), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    STATE(10), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(98), 6,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
      anon_sym_LF,
  [292] = 4,
    ACTIONS(59), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(100), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(104), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
    ACTIONS(102), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [314] = 4,
    ACTIONS(110), 1,
      anon_sym_COLON,
    STATE(14), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(106), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(108), 8,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [335] = 4,
    ACTIONS(108), 1,
      anon_sym_DASH,
    ACTIONS(113), 1,
      anon_sym_COLON,
    STATE(15), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(106), 9,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_number,
      sym_str,
  [356] = 4,
    ACTIONS(116), 1,
      anon_sym_COLON,
    ACTIONS(120), 1,
      anon_sym_DASH,
    STATE(15), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(118), 9,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_number,
      sym_str,
  [377] = 4,
    ACTIONS(122), 1,
      anon_sym_COLON,
    STATE(14), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(118), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(120), 8,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [398] = 2,
    ACTIONS(108), 1,
      anon_sym_DASH,
    ACTIONS(106), 10,
      anon_sym_COLON,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_number,
      sym_str,
  [414] = 2,
    ACTIONS(106), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(108), 9,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_COLON,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [430] = 4,
    ACTIONS(126), 1,
      anon_sym_COMMA,
    STATE(22), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(124), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(128), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [450] = 4,
    ACTIONS(126), 1,
      anon_sym_COMMA,
    STATE(20), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(130), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(132), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [470] = 4,
    ACTIONS(136), 1,
      anon_sym_COMMA,
    STATE(22), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(134), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(139), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [490] = 2,
    ACTIONS(134), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(139), 8,
      anon_sym_COMMA,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [505] = 3,
    ACTIONS(145), 1,
      sym_currency,
    ACTIONS(141), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(143), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [522] = 3,
    ACTIONS(151), 1,
      sym_str,
    ACTIONS(147), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(149), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [539] = 2,
    ACTIONS(153), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(155), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [553] = 2,
    ACTIONS(157), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(159), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [567] = 2,
    ACTIONS(161), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(163), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [581] = 2,
    ACTIONS(165), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(167), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [595] = 2,
    ACTIONS(100), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(102), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [609] = 2,
    ACTIONS(169), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(171), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [623] = 2,
    ACTIONS(173), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(175), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [637] = 2,
    ACTIONS(177), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(179), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [651] = 2,
    ACTIONS(181), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(183), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [665] = 2,
    ACTIONS(185), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(187), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [679] = 2,
    ACTIONS(189), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(191), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [693] = 6,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(199), 1,
      sym_number,
    STATE(32), 1,
      sym_amount,
    STATE(62), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [715] = 2,
    ACTIONS(201), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(203), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [729] = 5,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(205), 1,
      sym_number,
    STATE(58), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [748] = 5,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(207), 1,
      sym_number,
    STATE(63), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [767] = 5,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(209), 1,
      sym_number,
    STATE(60), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [786] = 5,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(211), 1,
      sym_number,
    STATE(56), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [805] = 5,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(213), 1,
      sym_number,
    STATE(8), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [824] = 5,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(215), 1,
      sym_number,
    STATE(61), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [843] = 5,
    ACTIONS(193), 1,
      anon_sym_LPAREN,
    ACTIONS(195), 1,
      anon_sym_DASH,
    ACTIONS(197), 1,
      anon_sym_PLUS,
    ACTIONS(217), 1,
      sym_number,
    STATE(59), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [862] = 8,
    ACTIONS(219), 1,
      anon_sym_open,
    ACTIONS(221), 1,
      anon_sym_event,
    ACTIONS(223), 1,
      anon_sym_close,
    ACTIONS(225), 1,
      anon_sym_price,
    ACTIONS(227), 1,
      anon_sym_note,
    ACTIONS(229), 1,
      anon_sym_document,
    ACTIONS(231), 1,
      anon_sym_balance,
    ACTIONS(233), 1,
      anon_sym_pad,
  [887] = 5,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(235), 1,
      sym_number,
    STATE(5), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [906] = 5,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(237), 1,
      sym_number,
    STATE(6), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [925] = 3,
    STATE(24), 1,
      sym_account_name,
    STATE(65), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [939] = 3,
    STATE(31), 1,
      sym_account_name,
    STATE(65), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [953] = 3,
    STATE(33), 1,
      sym_account_name,
    STATE(65), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [967] = 3,
    STATE(66), 1,
      sym_account_type,
    STATE(80), 1,
      sym_account_name,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [981] = 3,
    STATE(66), 1,
      sym_account_type,
    STATE(81), 1,
      sym_account_name,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [995] = 3,
    STATE(37), 1,
      sym_account_name,
    STATE(66), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [1009] = 3,
    STATE(50), 1,
      sym_account_name,
    STATE(66), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [1023] = 1,
    ACTIONS(65), 6,
      anon_sym_STAR,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_currency,
  [1032] = 1,
    ACTIONS(61), 6,
      anon_sym_STAR,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_currency,
  [1041] = 1,
    ACTIONS(55), 6,
      anon_sym_STAR,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_currency,
  [1050] = 2,
    ACTIONS(239), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(55), 4,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      sym_currency,
  [1061] = 3,
    ACTIONS(241), 1,
      anon_sym_RPAREN,
    ACTIONS(239), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(243), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1073] = 3,
    ACTIONS(245), 1,
      sym_currency,
    ACTIONS(239), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(243), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1085] = 3,
    ACTIONS(247), 1,
      sym_currency,
    ACTIONS(239), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(243), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1097] = 3,
    ACTIONS(249), 1,
      anon_sym_RPAREN,
    ACTIONS(239), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(243), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1109] = 2,
    ACTIONS(251), 1,
      anon_sym_COLON,
    STATE(4), 1,
      sym_colon,
  [1116] = 2,
    ACTIONS(253), 1,
      anon_sym_COLON,
    STATE(17), 1,
      aux_sym_account_name_repeat1,
  [1123] = 2,
    ACTIONS(116), 1,
      anon_sym_COLON,
    STATE(16), 1,
      aux_sym_account_name_repeat1,
  [1130] = 1,
    ACTIONS(255), 1,
      sym_str,
  [1134] = 1,
    ACTIONS(257), 1,
      sym_str,
  [1138] = 1,
    ACTIONS(259), 1,
      sym_currency,
  [1142] = 1,
    ACTIONS(261), 1,
      sym_str,
  [1146] = 1,
    ACTIONS(263), 1,
      ts_builtin_sym_end,
  [1150] = 1,
    ACTIONS(265), 1,
      sym_str,
  [1154] = 1,
    ACTIONS(267), 1,
      anon_sym_COLON,
  [1158] = 1,
    ACTIONS(269), 1,
      sym_currency,
  [1162] = 1,
    ACTIONS(271), 1,
      sym_str,
  [1166] = 1,
    ACTIONS(273), 1,
      sym_str,
  [1170] = 1,
    ACTIONS(275), 1,
      anon_sym_COLON,
  [1174] = 1,
    ACTIONS(277), 1,
      aux_sym_account_name_token1,
  [1178] = 1,
    ACTIONS(279), 1,
      aux_sym_account_name_token1,
  [1182] = 1,
    ACTIONS(281), 1,
      sym_str,
  [1186] = 1,
    ACTIONS(283), 1,
      sym_str,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 41,
  [SMALL_STATE(4)] = 82,
  [SMALL_STATE(5)] = 120,
  [SMALL_STATE(6)] = 140,
  [SMALL_STATE(7)] = 158,
  [SMALL_STATE(8)] = 176,
  [SMALL_STATE(9)] = 194,
  [SMALL_STATE(10)] = 222,
  [SMALL_STATE(11)] = 250,
  [SMALL_STATE(12)] = 268,
  [SMALL_STATE(13)] = 292,
  [SMALL_STATE(14)] = 314,
  [SMALL_STATE(15)] = 335,
  [SMALL_STATE(16)] = 356,
  [SMALL_STATE(17)] = 377,
  [SMALL_STATE(18)] = 398,
  [SMALL_STATE(19)] = 414,
  [SMALL_STATE(20)] = 430,
  [SMALL_STATE(21)] = 450,
  [SMALL_STATE(22)] = 470,
  [SMALL_STATE(23)] = 490,
  [SMALL_STATE(24)] = 505,
  [SMALL_STATE(25)] = 522,
  [SMALL_STATE(26)] = 539,
  [SMALL_STATE(27)] = 553,
  [SMALL_STATE(28)] = 567,
  [SMALL_STATE(29)] = 581,
  [SMALL_STATE(30)] = 595,
  [SMALL_STATE(31)] = 609,
  [SMALL_STATE(32)] = 623,
  [SMALL_STATE(33)] = 637,
  [SMALL_STATE(34)] = 651,
  [SMALL_STATE(35)] = 665,
  [SMALL_STATE(36)] = 679,
  [SMALL_STATE(37)] = 693,
  [SMALL_STATE(38)] = 715,
  [SMALL_STATE(39)] = 729,
  [SMALL_STATE(40)] = 748,
  [SMALL_STATE(41)] = 767,
  [SMALL_STATE(42)] = 786,
  [SMALL_STATE(43)] = 805,
  [SMALL_STATE(44)] = 824,
  [SMALL_STATE(45)] = 843,
  [SMALL_STATE(46)] = 862,
  [SMALL_STATE(47)] = 887,
  [SMALL_STATE(48)] = 906,
  [SMALL_STATE(49)] = 925,
  [SMALL_STATE(50)] = 939,
  [SMALL_STATE(51)] = 953,
  [SMALL_STATE(52)] = 967,
  [SMALL_STATE(53)] = 981,
  [SMALL_STATE(54)] = 995,
  [SMALL_STATE(55)] = 1009,
  [SMALL_STATE(56)] = 1023,
  [SMALL_STATE(57)] = 1032,
  [SMALL_STATE(58)] = 1041,
  [SMALL_STATE(59)] = 1050,
  [SMALL_STATE(60)] = 1061,
  [SMALL_STATE(61)] = 1073,
  [SMALL_STATE(62)] = 1085,
  [SMALL_STATE(63)] = 1097,
  [SMALL_STATE(64)] = 1109,
  [SMALL_STATE(65)] = 1116,
  [SMALL_STATE(66)] = 1123,
  [SMALL_STATE(67)] = 1130,
  [SMALL_STATE(68)] = 1134,
  [SMALL_STATE(69)] = 1138,
  [SMALL_STATE(70)] = 1142,
  [SMALL_STATE(71)] = 1146,
  [SMALL_STATE(72)] = 1150,
  [SMALL_STATE(73)] = 1154,
  [SMALL_STATE(74)] = 1158,
  [SMALL_STATE(75)] = 1162,
  [SMALL_STATE(76)] = 1166,
  [SMALL_STATE(77)] = 1170,
  [SMALL_STATE(78)] = 1174,
  [SMALL_STATE(79)] = 1178,
  [SMALL_STATE(80)] = 1182,
  [SMALL_STATE(81)] = 1186,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 0),
  [5] = {.entry = {.count = 1, .reusable = false}}, SHIFT(72),
  [7] = {.entry = {.count = 1, .reusable = false}}, SHIFT(76),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(75),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(46),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(2),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [17] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 1),
  [19] = {.entry = {.count = 1, .reusable = false}}, SHIFT(3),
  [21] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [23] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2),
  [25] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(72),
  [28] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(76),
  [31] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(75),
  [34] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(46),
  [37] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(3),
  [40] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(3),
  [43] = {.entry = {.count = 1, .reusable = true}}, SHIFT(77),
  [45] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [47] = {.entry = {.count = 1, .reusable = false}}, SHIFT(43),
  [49] = {.entry = {.count = 1, .reusable = true}}, SHIFT(43),
  [51] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [53] = {.entry = {.count = 1, .reusable = false}}, SHIFT(13),
  [55] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_binary_num_expr, 3),
  [57] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_binary_num_expr, 3),
  [59] = {.entry = {.count = 1, .reusable = false}}, SHIFT(48),
  [61] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_paren_num_expr, 3),
  [63] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_paren_num_expr, 3),
  [65] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unary_num_expr, 2),
  [67] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unary_num_expr, 2),
  [69] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 1),
  [71] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_directive, 1),
  [73] = {.entry = {.count = 1, .reusable = false}}, SHIFT(73),
  [75] = {.entry = {.count = 1, .reusable = false}}, SHIFT(12),
  [77] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [79] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2),
  [81] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2),
  [83] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(73),
  [86] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(10),
  [89] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(10),
  [92] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_colon, 1),
  [94] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_colon, 1),
  [96] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 2),
  [98] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_directive, 2),
  [100] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata, 3, .production_id = 13),
  [102] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_metadata, 3, .production_id = 13),
  [104] = {.entry = {.count = 1, .reusable = false}}, SHIFT(47),
  [106] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [108] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [110] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(79),
  [113] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(78),
  [116] = {.entry = {.count = 1, .reusable = true}}, SHIFT(78),
  [118] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_name, 2),
  [120] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_account_name, 2),
  [122] = {.entry = {.count = 1, .reusable = false}}, SHIFT(79),
  [124] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 5, .production_id = 14),
  [126] = {.entry = {.count = 1, .reusable = false}}, SHIFT(74),
  [128] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 5, .production_id = 14),
  [130] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 4, .production_id = 7),
  [132] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 4, .production_id = 7),
  [134] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [136] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_open_directive_repeat1, 2), SHIFT_REPEAT(74),
  [139] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [141] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 3, .production_id = 6),
  [143] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 3, .production_id = 6),
  [145] = {.entry = {.count = 1, .reusable = false}}, SHIFT(21),
  [147] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_plugin_directive, 2, .production_id = 1),
  [149] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_plugin_directive, 2, .production_id = 1),
  [151] = {.entry = {.count = 1, .reusable = false}}, SHIFT(29),
  [153] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_amount, 2, .production_id = 16),
  [155] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_amount, 2, .production_id = 16),
  [157] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_price_directive, 5, .production_id = 15),
  [159] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_price_directive, 5, .production_id = 15),
  [161] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_option_directive, 3, .production_id = 4),
  [163] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_option_directive, 3, .production_id = 4),
  [165] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_plugin_directive, 3, .production_id = 5),
  [167] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_plugin_directive, 3, .production_id = 5),
  [169] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_pad_directive, 4, .production_id = 12),
  [171] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_pad_directive, 4, .production_id = 12),
  [173] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_balance_directive, 4, .production_id = 11),
  [175] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_balance_directive, 4, .production_id = 11),
  [177] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_close_directive, 3, .production_id = 6),
  [179] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_close_directive, 3, .production_id = 6),
  [181] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document_directive, 4, .production_id = 10),
  [183] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_document_directive, 4, .production_id = 10),
  [185] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_note_directive, 4, .production_id = 9),
  [187] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_note_directive, 4, .production_id = 9),
  [189] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_event_directive, 4, .production_id = 8),
  [191] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_event_directive, 4, .production_id = 8),
  [193] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [195] = {.entry = {.count = 1, .reusable = false}}, SHIFT(42),
  [197] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [199] = {.entry = {.count = 1, .reusable = true}}, SHIFT(62),
  [201] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_include_directive, 2, .production_id = 2),
  [203] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_include_directive, 2, .production_id = 2),
  [205] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [207] = {.entry = {.count = 1, .reusable = true}}, SHIFT(63),
  [209] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [211] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [213] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [215] = {.entry = {.count = 1, .reusable = true}}, SHIFT(61),
  [217] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [219] = {.entry = {.count = 1, .reusable = true}}, SHIFT(49),
  [221] = {.entry = {.count = 1, .reusable = true}}, SHIFT(68),
  [223] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [225] = {.entry = {.count = 1, .reusable = true}}, SHIFT(69),
  [227] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [229] = {.entry = {.count = 1, .reusable = true}}, SHIFT(53),
  [231] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [233] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [235] = {.entry = {.count = 1, .reusable = true}}, SHIFT(5),
  [237] = {.entry = {.count = 1, .reusable = true}}, SHIFT(6),
  [239] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [241] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [243] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [245] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [247] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [249] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [251] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [253] = {.entry = {.count = 1, .reusable = true}}, SHIFT(79),
  [255] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [257] = {.entry = {.count = 1, .reusable = true}}, SHIFT(67),
  [259] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [261] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [263] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [265] = {.entry = {.count = 1, .reusable = true}}, SHIFT(70),
  [267] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata_key, 1, .production_id = 3),
  [269] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [271] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [273] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [275] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_type, 1),
  [277] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [279] = {.entry = {.count = 1, .reusable = true}}, SHIFT(19),
  [281] = {.entry = {.count = 1, .reusable = true}}, SHIFT(35),
  [283] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef _WIN32
#define extern __declspec(dllexport)
#endif

extern const TSLanguage *tree_sitter_beancount(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .field_names = ts_field_names,
    .field_map_slices = ts_field_map_slices,
    .field_map_entries = ts_field_map_entries,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .keyword_lex_fn = ts_lex_keywords,
    .keyword_capture_token = sym_identifier,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif

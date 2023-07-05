#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 78
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 64
#define ALIAS_COUNT 0
#define TOKEN_COUNT 38
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 19
#define MAX_ALIAS_SEQUENCE_LENGTH 5
#define PRODUCTION_ID_COUNT 15

enum {
  sym_identifier = 1,
  anon_sym_open = 2,
  anon_sym_event = 3,
  anon_sym_close = 4,
  anon_sym_price = 5,
  anon_sym_note = 6,
  anon_sym_document = 7,
  anon_sym_balance = 8,
  anon_sym_COMMA = 9,
  anon_sym_option = 10,
  anon_sym_plugin = 11,
  anon_sym_include = 12,
  anon_sym_COLON = 13,
  aux_sym_account_name_token1 = 14,
  anon_sym_Assets = 15,
  anon_sym_Expenses = 16,
  anon_sym_Liabilities = 17,
  anon_sym_Equity = 18,
  anon_sym_Income = 19,
  anon_sym_txn = 20,
  anon_sym_BANG = 21,
  anon_sym_STAR = 22,
  anon_sym_LPAREN = 23,
  anon_sym_RPAREN = 24,
  anon_sym_DASH = 25,
  anon_sym_PLUS = 26,
  anon_sym_SLASH = 27,
  sym_date = 28,
  sym_currency = 29,
  sym_number = 30,
  aux_sym_metadata_key_token1 = 31,
  sym_str = 32,
  sym_tag = 33,
  sym_link = 34,
  sym_comment = 35,
  anon_sym_LF = 36,
  anon_sym_CR = 37,
  sym_file = 38,
  sym_directive = 39,
  sym_balance_directive = 40,
  sym_open_directive = 41,
  sym_close_directive = 42,
  sym_price_directive = 43,
  sym_note_directive = 44,
  sym_document_directive = 45,
  sym_event_directive = 46,
  sym_option_directive = 47,
  sym_plugin_directive = 48,
  sym_include_directive = 49,
  sym_account_name = 50,
  sym_account_type = 51,
  sym_metadata = 52,
  sym__num_expr = 53,
  sym_paren_num_expr = 54,
  sym_unary_num_expr = 55,
  sym_binary_num_expr = 56,
  sym_metadata_key = 57,
  sym__new_line = 58,
  sym_colon = 59,
  aux_sym_file_repeat1 = 60,
  aux_sym_directive_repeat1 = 61,
  aux_sym_open_directive_repeat1 = 62,
  aux_sym_account_name_repeat1 = 63,
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
  [sym_balance_directive] = "balance_directive",
  [sym_open_directive] = "open_directive",
  [sym_close_directive] = "close_directive",
  [sym_price_directive] = "price_directive",
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
  [sym_balance_directive] = sym_balance_directive,
  [sym_open_directive] = sym_open_directive,
  [sym_close_directive] = sym_close_directive,
  [sym_price_directive] = sym_price_directive,
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
  field_account_name = 1,
  field_amount = 2,
  field_colon = 3,
  field_commodity = 4,
  field_currencies = 5,
  field_currency = 6,
  field_data_key = 7,
  field_date = 8,
  field_directive_type = 9,
  field_document_path = 10,
  field_event_name = 11,
  field_event_value = 12,
  field_file_name = 13,
  field_module_name = 14,
  field_note = 15,
  field_option_name = 16,
  field_option_value = 17,
  field_plugin_config = 18,
  field_price = 19,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
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
  [field_module_name] = "module_name",
  [field_note] = "note",
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
  [11] = {.index = 26, .length = 1},
  [12] = {.index = 27, .length = 5},
  [13] = {.index = 32, .length = 5},
  [14] = {.index = 37, .length = 5},
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
    {field_colon, 1},
  [27] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_currencies, 4},
    {field_date, 0},
    {field_directive_type, 1},
  [32] =
    {field_commodity, 2},
    {field_currency, 4},
    {field_date, 0},
    {field_directive_type, 1},
    {field_price, 3},
  [37] =
    {field_account_name, 2},
    {field_amount, 3},
    {field_currency, 4},
    {field_date, 0},
    {field_directive_type, 1},
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
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
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
  [38] = 36,
  [39] = 34,
  [40] = 33,
  [41] = 41,
  [42] = 41,
  [43] = 43,
  [44] = 44,
  [45] = 45,
  [46] = 14,
  [47] = 47,
  [48] = 48,
  [49] = 49,
  [50] = 15,
  [51] = 17,
  [52] = 7,
  [53] = 6,
  [54] = 13,
  [55] = 11,
  [56] = 56,
  [57] = 57,
  [58] = 58,
  [59] = 58,
  [60] = 60,
  [61] = 60,
  [62] = 62,
  [63] = 63,
  [64] = 64,
  [65] = 65,
  [66] = 66,
  [67] = 67,
  [68] = 68,
  [69] = 69,
  [70] = 70,
  [71] = 71,
  [72] = 72,
  [73] = 73,
  [74] = 70,
  [75] = 75,
  [76] = 76,
  [77] = 77,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(72);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (lookahead == '\n') ADVANCE(205);
      if (lookahead == '!') ADVANCE(146);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(69);
      if (lookahead == '(') ADVANCE(148);
      if (lookahead == ')') ADVANCE(149);
      if (lookahead == '*') ADVANCE(147);
      if (lookahead == '+') ADVANCE(152);
      if (lookahead == ',') ADVANCE(73);
      if (lookahead == '-') ADVANCE(151);
      if (lookahead == '/') ADVANCE(153);
      if (lookahead == ':') ADVANCE(80);
      if (lookahead == ';') ADVANCE(204);
      if (lookahead == 'A') ADVANCE(105);
      if (lookahead == 'E') ADVANCE(104);
      if (lookahead == 'I') ADVANCE(103);
      if (lookahead == 'L') ADVANCE(102);
      if (lookahead == '^') ADVANCE(70);
      if (lookahead == 'i') ADVANCE(215);
      if (lookahead == 'o') ADVANCE(219);
      if (lookahead == 'p') ADVANCE(213);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(181);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(106);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 1:
      if (lookahead == '"') ADVANCE(201);
      if (lookahead != 0) ADVANCE(1);
      END_STATE();
    case 2:
      if (lookahead == '-') ADVANCE(63);
      END_STATE();
    case 3:
      if (lookahead == '-') ADVANCE(64);
      END_STATE();
    case 4:
      if (lookahead == 'a') ADVANCE(5);
      END_STATE();
    case 5:
      if (lookahead == 'b') ADVANCE(13);
      END_STATE();
    case 6:
      if (lookahead == 'c') ADVANCE(21);
      END_STATE();
    case 7:
      if (lookahead == 'e') ADVANCE(31);
      END_STATE();
    case 8:
      if (lookahead == 'e') ADVANCE(20);
      END_STATE();
    case 9:
      if (lookahead == 'e') ADVANCE(144);
      END_STATE();
    case 10:
      if (lookahead == 'e') ADVANCE(27);
      END_STATE();
    case 11:
      if (lookahead == 'e') ADVANCE(28);
      END_STATE();
    case 12:
      if (lookahead == 'i') ADVANCE(4);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 13:
      if (lookahead == 'i') ADVANCE(17);
      END_STATE();
    case 14:
      if (lookahead == 'i') ADVANCE(30);
      END_STATE();
    case 15:
      if (lookahead == 'i') ADVANCE(32);
      END_STATE();
    case 16:
      if (lookahead == 'i') ADVANCE(11);
      END_STATE();
    case 17:
      if (lookahead == 'l') ADVANCE(15);
      END_STATE();
    case 18:
      if (lookahead == 'm') ADVANCE(9);
      END_STATE();
    case 19:
      if (lookahead == 'n') ADVANCE(6);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 20:
      if (lookahead == 'n') ADVANCE(29);
      END_STATE();
    case 21:
      if (lookahead == 'o') ADVANCE(18);
      END_STATE();
    case 22:
      if (lookahead == 'p') ADVANCE(8);
      END_STATE();
    case 23:
      if (lookahead == 'q') ADVANCE(33);
      if (lookahead == 'x') ADVANCE(22);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 24:
      if (lookahead == 's') ADVANCE(25);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 25:
      if (lookahead == 's') ADVANCE(7);
      END_STATE();
    case 26:
      if (lookahead == 's') ADVANCE(136);
      END_STATE();
    case 27:
      if (lookahead == 's') ADVANCE(138);
      END_STATE();
    case 28:
      if (lookahead == 's') ADVANCE(140);
      END_STATE();
    case 29:
      if (lookahead == 's') ADVANCE(10);
      END_STATE();
    case 30:
      if (lookahead == 't') ADVANCE(34);
      END_STATE();
    case 31:
      if (lookahead == 't') ADVANCE(26);
      END_STATE();
    case 32:
      if (lookahead == 't') ADVANCE(16);
      END_STATE();
    case 33:
      if (lookahead == 'u') ADVANCE(14);
      END_STATE();
    case 34:
      if (lookahead == 'y') ADVANCE(142);
      END_STATE();
    case 35:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(35)
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(69);
      if (lookahead == '(') ADVANCE(148);
      if (lookahead == '+') ADVANCE(152);
      if (lookahead == '-') ADVANCE(151);
      if (lookahead == 'A') ADVANCE(24);
      if (lookahead == 'E') ADVANCE(23);
      if (lookahead == 'I') ADVANCE(19);
      if (lookahead == 'L') ADVANCE(12);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(181);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(38);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 36:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(36)
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '(') ADVANCE(148);
      if (lookahead == '+') ADVANCE(152);
      if (lookahead == '-') ADVANCE(151);
      if (lookahead == ':') ADVANCE(80);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(182);
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(135);
      END_STATE();
    case 37:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(37)
      if (lookahead == ')') ADVANCE(149);
      if (lookahead == '*') ADVANCE(147);
      if (lookahead == '+') ADVANCE(152);
      if (lookahead == '-') ADVANCE(150);
      if (lookahead == '/') ADVANCE(153);
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(38);
      END_STATE();
    case 38:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 39:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(68);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(177);
      END_STATE();
    case 40:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(39);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(156);
      END_STATE();
    case 41:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(42);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(159);
      END_STATE();
    case 42:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(40);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(157);
      END_STATE();
    case 43:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(161);
      END_STATE();
    case 44:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(41);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(158);
      END_STATE();
    case 45:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(163);
      END_STATE();
    case 46:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(43);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(160);
      END_STATE();
    case 47:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 48:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(162);
      END_STATE();
    case 49:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(167);
      END_STATE();
    case 50:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(164);
      END_STATE();
    case 51:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(169);
      END_STATE();
    case 52:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(166);
      END_STATE();
    case 53:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(171);
      END_STATE();
    case 54:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(168);
      END_STATE();
    case 55:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(173);
      END_STATE();
    case 56:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(170);
      END_STATE();
    case 57:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(175);
      END_STATE();
    case 58:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(172);
      END_STATE();
    case 59:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(174);
      END_STATE();
    case 60:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(183);
      END_STATE();
    case 61:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(3);
      END_STATE();
    case 62:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(154);
      END_STATE();
    case 63:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(61);
      END_STATE();
    case 64:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(62);
      END_STATE();
    case 65:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(2);
      END_STATE();
    case 66:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(65);
      END_STATE();
    case 67:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(66);
      END_STATE();
    case 68:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(155);
      END_STATE();
    case 69:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(202);
      END_STATE();
    case 70:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(203);
      END_STATE();
    case 71:
      if (eof) ADVANCE(72);
      if (lookahead == '\t' ||
          lookahead == ' ') SKIP(71)
      if (lookahead == '\n') ADVANCE(205);
      if (lookahead == '\r') ADVANCE(206);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '*') ADVANCE(147);
      if (lookahead == '+') ADVANCE(152);
      if (lookahead == ',') ADVANCE(73);
      if (lookahead == '-') ADVANCE(150);
      if (lookahead == '/') ADVANCE(153);
      if (lookahead == ':') ADVANCE(80);
      if (lookahead == ';') ADVANCE(204);
      if (lookahead == 'i') ADVANCE(192);
      if (lookahead == 'o') ADVANCE(196);
      if (lookahead == 'p') ADVANCE(190);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(67);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(38);
      END_STATE();
    case 72:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 73:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 74:
      ACCEPT_TOKEN(anon_sym_option);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 75:
      ACCEPT_TOKEN(anon_sym_option);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 76:
      ACCEPT_TOKEN(anon_sym_plugin);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 77:
      ACCEPT_TOKEN(anon_sym_plugin);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 78:
      ACCEPT_TOKEN(anon_sym_include);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 79:
      ACCEPT_TOKEN(anon_sym_include);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 80:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 81:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(134);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(68);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(134);
      END_STATE();
    case 82:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(81);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(39);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(81);
      END_STATE();
    case 83:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(82);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(40);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(82);
      END_STATE();
    case 84:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(85);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(41);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(85);
      END_STATE();
    case 85:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(83);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(42);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(83);
      END_STATE();
    case 86:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(87);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(43);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(87);
      END_STATE();
    case 87:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(84);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(84);
      END_STATE();
    case 88:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(89);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(89);
      END_STATE();
    case 89:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(86);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(86);
      END_STATE();
    case 90:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(91);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(91);
      END_STATE();
    case 91:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(88);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(88);
      END_STATE();
    case 92:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(93);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(93);
      END_STATE();
    case 93:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(90);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(90);
      END_STATE();
    case 94:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(95);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(95);
      END_STATE();
    case 95:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(92);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(92);
      END_STATE();
    case 96:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 97:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(94);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(94);
      END_STATE();
    case 98:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(99);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(99);
      END_STATE();
    case 99:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(96);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(96);
      END_STATE();
    case 100:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(101);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(101);
      END_STATE();
    case 101:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(98);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(98);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(100);
      if (lookahead == 'i') ADVANCE(107);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(100);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(100);
      if (lookahead == 'n') ADVANCE(109);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(100);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(100);
      if (lookahead == 'q') ADVANCE(132);
      if (lookahead == 'x') ADVANCE(123);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(100);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(100);
      if (lookahead == 's') ADVANCE(124);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(100);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(100);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(100);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'a') ADVANCE(108);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('b' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'b') ADVANCE(115);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'c') ADVANCE(122);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(130);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(121);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(145);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(126);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(127);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(119);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(129);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(131);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(114);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'l') ADVANCE(117);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'm') ADVANCE(112);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'n') ADVANCE(128);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'o') ADVANCE(120);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'p') ADVANCE(111);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(110);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(137);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(139);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(141);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(113);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(133);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(125);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(118);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'u') ADVANCE(116);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'y') ADVANCE(143);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(135);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(anon_sym_Assets);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(anon_sym_Assets);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_Expenses);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_Expenses);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(anon_sym_Equity);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(anon_sym_Equity);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(anon_sym_Income);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(anon_sym_Income);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(anon_sym_BANG);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(anon_sym_STAR);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(anon_sym_DASH);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(anon_sym_DASH);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(182);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(anon_sym_PLUS);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(anon_sym_SLASH);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(sym_date);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(sym_currency);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(68);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(177);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(39);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(156);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(42);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(159);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(40);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(157);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(161);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(41);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(158);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(163);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(43);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(160);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(162);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(167);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(164);
      END_STATE();
    case 168:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(169);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(166);
      END_STATE();
    case 170:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(171);
      END_STATE();
    case 171:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(168);
      END_STATE();
    case 172:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(173);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(170);
      END_STATE();
    case 174:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(175);
      END_STATE();
    case 175:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(172);
      END_STATE();
    case 176:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(174);
      END_STATE();
    case 177:
      ACCEPT_TOKEN(sym_currency);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(155);
      END_STATE();
    case 178:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '-') ADVANCE(63);
      if (lookahead == '.') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(182);
      END_STATE();
    case 179:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(178);
      END_STATE();
    case 180:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(179);
      END_STATE();
    case 181:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(180);
      END_STATE();
    case 182:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(182);
      END_STATE();
    case 183:
      ACCEPT_TOKEN(sym_number);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(183);
      END_STATE();
    case 184:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'c') ADVANCE(191);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 185:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'd') ADVANCE(186);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 186:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'e') ADVANCE(79);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 187:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'g') ADVANCE(189);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 188:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'i') ADVANCE(195);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 189:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'i') ADVANCE(194);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 190:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'l') ADVANCE(198);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 191:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'l') ADVANCE(199);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 192:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(184);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 193:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(75);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 194:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(77);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 195:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'o') ADVANCE(193);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 196:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'p') ADVANCE(197);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 197:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 't') ADVANCE(188);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 198:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'u') ADVANCE(187);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 199:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'u') ADVANCE(185);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 200:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 201:
      ACCEPT_TOKEN(sym_str);
      END_STATE();
    case 202:
      ACCEPT_TOKEN(sym_tag);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(202);
      END_STATE();
    case 203:
      ACCEPT_TOKEN(sym_link);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(203);
      END_STATE();
    case 204:
      ACCEPT_TOKEN(sym_comment);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(204);
      END_STATE();
    case 205:
      ACCEPT_TOKEN(anon_sym_LF);
      END_STATE();
    case 206:
      ACCEPT_TOKEN(anon_sym_CR);
      if (lookahead == '\r') ADVANCE(206);
      END_STATE();
    case 207:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'c') ADVANCE(214);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 208:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'd') ADVANCE(209);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 209:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'e') ADVANCE(78);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 210:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'g') ADVANCE(212);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 211:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'i') ADVANCE(218);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 212:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'i') ADVANCE(217);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 213:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'l') ADVANCE(221);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 214:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'l') ADVANCE(222);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 215:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'n') ADVANCE(207);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 216:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'n') ADVANCE(74);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 217:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'n') ADVANCE(76);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 218:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'o') ADVANCE(216);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 219:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'p') ADVANCE(220);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 220:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 't') ADVANCE(211);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 221:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'u') ADVANCE(210);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 222:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'u') ADVANCE(208);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
      END_STATE();
    case 223:
      ACCEPT_TOKEN(sym_identifier);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(223);
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
      if (lookahead == 'r') ADVANCE(15);
      END_STATE();
    case 8:
      if (lookahead == 'x') ADVANCE(16);
      END_STATE();
    case 9:
      if (lookahead == 'l') ADVANCE(17);
      END_STATE();
    case 10:
      if (lookahead == 'o') ADVANCE(18);
      END_STATE();
    case 11:
      if (lookahead == 'c') ADVANCE(19);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(20);
      END_STATE();
    case 13:
      if (lookahead == 't') ADVANCE(21);
      END_STATE();
    case 14:
      if (lookahead == 'e') ADVANCE(22);
      END_STATE();
    case 15:
      if (lookahead == 'i') ADVANCE(23);
      END_STATE();
    case 16:
      if (lookahead == 'n') ADVANCE(24);
      END_STATE();
    case 17:
      if (lookahead == 'a') ADVANCE(25);
      END_STATE();
    case 18:
      if (lookahead == 's') ADVANCE(26);
      END_STATE();
    case 19:
      if (lookahead == 'u') ADVANCE(27);
      END_STATE();
    case 20:
      if (lookahead == 'n') ADVANCE(28);
      END_STATE();
    case 21:
      if (lookahead == 'e') ADVANCE(29);
      END_STATE();
    case 22:
      if (lookahead == 'n') ADVANCE(30);
      END_STATE();
    case 23:
      if (lookahead == 'c') ADVANCE(31);
      END_STATE();
    case 24:
      ACCEPT_TOKEN(anon_sym_txn);
      END_STATE();
    case 25:
      if (lookahead == 'n') ADVANCE(32);
      END_STATE();
    case 26:
      if (lookahead == 'e') ADVANCE(33);
      END_STATE();
    case 27:
      if (lookahead == 'm') ADVANCE(34);
      END_STATE();
    case 28:
      if (lookahead == 't') ADVANCE(35);
      END_STATE();
    case 29:
      ACCEPT_TOKEN(anon_sym_note);
      END_STATE();
    case 30:
      ACCEPT_TOKEN(anon_sym_open);
      END_STATE();
    case 31:
      if (lookahead == 'e') ADVANCE(36);
      END_STATE();
    case 32:
      if (lookahead == 'c') ADVANCE(37);
      END_STATE();
    case 33:
      ACCEPT_TOKEN(anon_sym_close);
      END_STATE();
    case 34:
      if (lookahead == 'e') ADVANCE(38);
      END_STATE();
    case 35:
      ACCEPT_TOKEN(anon_sym_event);
      END_STATE();
    case 36:
      ACCEPT_TOKEN(anon_sym_price);
      END_STATE();
    case 37:
      if (lookahead == 'e') ADVANCE(39);
      END_STATE();
    case 38:
      if (lookahead == 'n') ADVANCE(40);
      END_STATE();
    case 39:
      ACCEPT_TOKEN(anon_sym_balance);
      END_STATE();
    case 40:
      if (lookahead == 't') ADVANCE(41);
      END_STATE();
    case 41:
      ACCEPT_TOKEN(anon_sym_document);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 71},
  [2] = {.lex_state = 71},
  [3] = {.lex_state = 71},
  [4] = {.lex_state = 35},
  [5] = {.lex_state = 71},
  [6] = {.lex_state = 71},
  [7] = {.lex_state = 71},
  [8] = {.lex_state = 71},
  [9] = {.lex_state = 71},
  [10] = {.lex_state = 35},
  [11] = {.lex_state = 71},
  [12] = {.lex_state = 71},
  [13] = {.lex_state = 71},
  [14] = {.lex_state = 71},
  [15] = {.lex_state = 71},
  [16] = {.lex_state = 71},
  [17] = {.lex_state = 71},
  [18] = {.lex_state = 71},
  [19] = {.lex_state = 71},
  [20] = {.lex_state = 71},
  [21] = {.lex_state = 71},
  [22] = {.lex_state = 71},
  [23] = {.lex_state = 71},
  [24] = {.lex_state = 71},
  [25] = {.lex_state = 71},
  [26] = {.lex_state = 71},
  [27] = {.lex_state = 71},
  [28] = {.lex_state = 71},
  [29] = {.lex_state = 71},
  [30] = {.lex_state = 71},
  [31] = {.lex_state = 71},
  [32] = {.lex_state = 71},
  [33] = {.lex_state = 36},
  [34] = {.lex_state = 36},
  [35] = {.lex_state = 36},
  [36] = {.lex_state = 36},
  [37] = {.lex_state = 36},
  [38] = {.lex_state = 36},
  [39] = {.lex_state = 36},
  [40] = {.lex_state = 36},
  [41] = {.lex_state = 36},
  [42] = {.lex_state = 36},
  [43] = {.lex_state = 35},
  [44] = {.lex_state = 35},
  [45] = {.lex_state = 35},
  [46] = {.lex_state = 36},
  [47] = {.lex_state = 35},
  [48] = {.lex_state = 35},
  [49] = {.lex_state = 35},
  [50] = {.lex_state = 36},
  [51] = {.lex_state = 36},
  [52] = {.lex_state = 37},
  [53] = {.lex_state = 37},
  [54] = {.lex_state = 37},
  [55] = {.lex_state = 37},
  [56] = {.lex_state = 37},
  [57] = {.lex_state = 37},
  [58] = {.lex_state = 37},
  [59] = {.lex_state = 37},
  [60] = {.lex_state = 0},
  [61] = {.lex_state = 0},
  [62] = {.lex_state = 0},
  [63] = {.lex_state = 0},
  [64] = {.lex_state = 0},
  [65] = {.lex_state = 0},
  [66] = {.lex_state = 0},
  [67] = {.lex_state = 0},
  [68] = {.lex_state = 35},
  [69] = {.lex_state = 35},
  [70] = {.lex_state = 36},
  [71] = {.lex_state = 0},
  [72] = {.lex_state = 0},
  [73] = {.lex_state = 0},
  [74] = {.lex_state = 36},
  [75] = {.lex_state = 0},
  [76] = {.lex_state = 0},
  [77] = {.lex_state = 0},
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
    [sym_file] = STATE(67),
    [sym_directive] = STATE(3),
    [sym_balance_directive] = STATE(8),
    [sym_open_directive] = STATE(8),
    [sym_close_directive] = STATE(8),
    [sym_price_directive] = STATE(8),
    [sym_note_directive] = STATE(8),
    [sym_document_directive] = STATE(8),
    [sym_event_directive] = STATE(8),
    [sym_option_directive] = STATE(8),
    [sym_plugin_directive] = STATE(8),
    [sym_include_directive] = STATE(8),
    [sym__new_line] = STATE(3),
    [aux_sym_file_repeat1] = STATE(3),
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
    ACTIONS(17), 1,
      ts_builtin_sym_end,
    ACTIONS(19), 1,
      anon_sym_option,
    ACTIONS(22), 1,
      anon_sym_plugin,
    ACTIONS(25), 1,
      anon_sym_include,
    ACTIONS(28), 1,
      sym_date,
    ACTIONS(34), 1,
      anon_sym_CR,
    ACTIONS(31), 2,
      sym_comment,
      anon_sym_LF,
    STATE(2), 3,
      sym_directive,
      sym__new_line,
      aux_sym_file_repeat1,
    STATE(8), 10,
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
  [40] = 9,
    ACTIONS(5), 1,
      anon_sym_option,
    ACTIONS(7), 1,
      anon_sym_plugin,
    ACTIONS(9), 1,
      anon_sym_include,
    ACTIONS(11), 1,
      sym_date,
    ACTIONS(37), 1,
      ts_builtin_sym_end,
    ACTIONS(41), 1,
      anon_sym_CR,
    ACTIONS(39), 2,
      sym_comment,
      anon_sym_LF,
    STATE(2), 3,
      sym_directive,
      sym__new_line,
      aux_sym_file_repeat1,
    STATE(8), 10,
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
  [80] = 9,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(53), 1,
      sym_number,
    STATE(29), 1,
      sym_account_name,
    STATE(60), 1,
      sym_account_type,
    ACTIONS(51), 4,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
    STATE(5), 4,
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
  [118] = 4,
    ACTIONS(55), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(59), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(61), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
    ACTIONS(57), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [140] = 2,
    ACTIONS(63), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(65), 11,
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
    ACTIONS(67), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(69), 11,
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
  [176] = 7,
    ACTIONS(71), 1,
      ts_builtin_sym_end,
    ACTIONS(75), 1,
      aux_sym_metadata_key_token1,
    ACTIONS(77), 1,
      anon_sym_LF,
    ACTIONS(79), 1,
      anon_sym_CR,
    STATE(62), 1,
      sym_metadata_key,
    STATE(12), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(73), 5,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
  [204] = 7,
    ACTIONS(81), 1,
      ts_builtin_sym_end,
    ACTIONS(85), 1,
      aux_sym_metadata_key_token1,
    ACTIONS(88), 1,
      anon_sym_LF,
    ACTIONS(91), 1,
      anon_sym_CR,
    STATE(62), 1,
      sym_metadata_key,
    STATE(9), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(83), 5,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
  [232] = 2,
    ACTIONS(96), 2,
      anon_sym_DASH,
      sym_number,
    ACTIONS(94), 11,
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
  [250] = 3,
    ACTIONS(59), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(98), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(100), 9,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_DASH,
      anon_sym_PLUS,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [270] = 5,
    ACTIONS(75), 1,
      aux_sym_metadata_key_token1,
    STATE(62), 1,
      sym_metadata_key,
    ACTIONS(102), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    STATE(9), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(104), 6,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
      anon_sym_LF,
  [294] = 2,
    ACTIONS(98), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(100), 11,
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
  [312] = 4,
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
  [333] = 4,
    ACTIONS(117), 1,
      anon_sym_COLON,
    STATE(14), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(113), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(115), 8,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [354] = 4,
    ACTIONS(121), 1,
      anon_sym_COMMA,
    STATE(16), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(119), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(124), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [374] = 2,
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
  [390] = 4,
    ACTIONS(128), 1,
      anon_sym_COMMA,
    STATE(16), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(126), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(130), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [410] = 4,
    ACTIONS(128), 1,
      anon_sym_COMMA,
    STATE(18), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(132), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(134), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [430] = 2,
    ACTIONS(119), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(124), 8,
      anon_sym_COMMA,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [445] = 3,
    ACTIONS(140), 1,
      sym_str,
    ACTIONS(136), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(138), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [462] = 3,
    ACTIONS(146), 1,
      sym_currency,
    ACTIONS(142), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(144), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [479] = 2,
    ACTIONS(148), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(150), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [493] = 2,
    ACTIONS(152), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(154), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [507] = 2,
    ACTIONS(156), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(158), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [521] = 2,
    ACTIONS(160), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(162), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [535] = 2,
    ACTIONS(164), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(166), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [549] = 2,
    ACTIONS(168), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(170), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [563] = 2,
    ACTIONS(55), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(57), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [577] = 2,
    ACTIONS(172), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(174), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [591] = 2,
    ACTIONS(176), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(178), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [605] = 2,
    ACTIONS(180), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(182), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [619] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(190), 1,
      sym_number,
    STATE(52), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [638] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(192), 1,
      sym_number,
    STATE(55), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [657] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(194), 1,
      sym_number,
    STATE(56), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [676] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(196), 1,
      sym_number,
    STATE(54), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [695] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(198), 1,
      sym_number,
    STATE(57), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [714] = 5,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(200), 1,
      sym_number,
    STATE(13), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [733] = 5,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(202), 1,
      sym_number,
    STATE(11), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [752] = 5,
    ACTIONS(45), 1,
      anon_sym_LPAREN,
    ACTIONS(47), 1,
      anon_sym_DASH,
    ACTIONS(49), 1,
      anon_sym_PLUS,
    ACTIONS(204), 1,
      sym_number,
    STATE(7), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [771] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(206), 1,
      sym_number,
    STATE(58), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [790] = 5,
    ACTIONS(184), 1,
      anon_sym_LPAREN,
    ACTIONS(186), 1,
      anon_sym_DASH,
    ACTIONS(188), 1,
      anon_sym_PLUS,
    ACTIONS(208), 1,
      sym_number,
    STATE(59), 4,
      sym__num_expr,
      sym_paren_num_expr,
      sym_unary_num_expr,
      sym_binary_num_expr,
  [809] = 3,
    STATE(61), 1,
      sym_account_type,
    STATE(73), 1,
      sym_account_name,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [823] = 3,
    STATE(61), 1,
      sym_account_type,
    STATE(75), 1,
      sym_account_name,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [837] = 3,
    STATE(37), 1,
      sym_account_name,
    STATE(61), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [851] = 4,
    ACTIONS(108), 1,
      anon_sym_DASH,
    ACTIONS(210), 1,
      anon_sym_COLON,
    STATE(46), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(106), 4,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_number,
      sym_str,
  [867] = 3,
    STATE(32), 1,
      sym_account_name,
    STATE(60), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [881] = 7,
    ACTIONS(213), 1,
      anon_sym_open,
    ACTIONS(215), 1,
      anon_sym_event,
    ACTIONS(217), 1,
      anon_sym_close,
    ACTIONS(219), 1,
      anon_sym_price,
    ACTIONS(221), 1,
      anon_sym_note,
    ACTIONS(223), 1,
      anon_sym_document,
    ACTIONS(225), 1,
      anon_sym_balance,
  [903] = 3,
    STATE(22), 1,
      sym_account_name,
    STATE(60), 1,
      sym_account_type,
    ACTIONS(43), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [917] = 4,
    ACTIONS(115), 1,
      anon_sym_DASH,
    ACTIONS(227), 1,
      anon_sym_COLON,
    STATE(46), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(113), 4,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_number,
      sym_str,
  [933] = 2,
    ACTIONS(108), 1,
      anon_sym_DASH,
    ACTIONS(106), 5,
      anon_sym_COLON,
      anon_sym_LPAREN,
      anon_sym_PLUS,
      sym_number,
      sym_str,
  [944] = 1,
    ACTIONS(67), 6,
      anon_sym_STAR,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_currency,
  [953] = 1,
    ACTIONS(63), 6,
      anon_sym_STAR,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_currency,
  [962] = 1,
    ACTIONS(98), 6,
      anon_sym_STAR,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      anon_sym_SLASH,
      sym_currency,
  [971] = 2,
    ACTIONS(229), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(98), 4,
      anon_sym_RPAREN,
      anon_sym_DASH,
      anon_sym_PLUS,
      sym_currency,
  [982] = 3,
    ACTIONS(233), 1,
      sym_currency,
    ACTIONS(229), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(231), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [994] = 3,
    ACTIONS(235), 1,
      sym_currency,
    ACTIONS(229), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(231), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1006] = 3,
    ACTIONS(237), 1,
      anon_sym_RPAREN,
    ACTIONS(229), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(231), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1018] = 3,
    ACTIONS(239), 1,
      anon_sym_RPAREN,
    ACTIONS(229), 2,
      anon_sym_STAR,
      anon_sym_SLASH,
    ACTIONS(231), 2,
      anon_sym_DASH,
      anon_sym_PLUS,
  [1030] = 2,
    ACTIONS(241), 1,
      anon_sym_COLON,
    STATE(15), 1,
      aux_sym_account_name_repeat1,
  [1037] = 2,
    ACTIONS(227), 1,
      anon_sym_COLON,
    STATE(50), 1,
      aux_sym_account_name_repeat1,
  [1044] = 2,
    ACTIONS(243), 1,
      anon_sym_COLON,
    STATE(4), 1,
      sym_colon,
  [1051] = 1,
    ACTIONS(245), 1,
      sym_str,
  [1055] = 1,
    ACTIONS(247), 1,
      sym_str,
  [1059] = 1,
    ACTIONS(249), 1,
      sym_str,
  [1063] = 1,
    ACTIONS(251), 1,
      anon_sym_COLON,
  [1067] = 1,
    ACTIONS(253), 1,
      ts_builtin_sym_end,
  [1071] = 1,
    ACTIONS(255), 1,
      sym_currency,
  [1075] = 1,
    ACTIONS(257), 1,
      sym_currency,
  [1079] = 1,
    ACTIONS(259), 1,
      aux_sym_account_name_token1,
  [1083] = 1,
    ACTIONS(261), 1,
      sym_str,
  [1087] = 1,
    ACTIONS(263), 1,
      sym_str,
  [1091] = 1,
    ACTIONS(265), 1,
      sym_str,
  [1095] = 1,
    ACTIONS(267), 1,
      aux_sym_account_name_token1,
  [1099] = 1,
    ACTIONS(269), 1,
      sym_str,
  [1103] = 1,
    ACTIONS(271), 1,
      sym_str,
  [1107] = 1,
    ACTIONS(273), 1,
      anon_sym_COLON,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 40,
  [SMALL_STATE(4)] = 80,
  [SMALL_STATE(5)] = 118,
  [SMALL_STATE(6)] = 140,
  [SMALL_STATE(7)] = 158,
  [SMALL_STATE(8)] = 176,
  [SMALL_STATE(9)] = 204,
  [SMALL_STATE(10)] = 232,
  [SMALL_STATE(11)] = 250,
  [SMALL_STATE(12)] = 270,
  [SMALL_STATE(13)] = 294,
  [SMALL_STATE(14)] = 312,
  [SMALL_STATE(15)] = 333,
  [SMALL_STATE(16)] = 354,
  [SMALL_STATE(17)] = 374,
  [SMALL_STATE(18)] = 390,
  [SMALL_STATE(19)] = 410,
  [SMALL_STATE(20)] = 430,
  [SMALL_STATE(21)] = 445,
  [SMALL_STATE(22)] = 462,
  [SMALL_STATE(23)] = 479,
  [SMALL_STATE(24)] = 493,
  [SMALL_STATE(25)] = 507,
  [SMALL_STATE(26)] = 521,
  [SMALL_STATE(27)] = 535,
  [SMALL_STATE(28)] = 549,
  [SMALL_STATE(29)] = 563,
  [SMALL_STATE(30)] = 577,
  [SMALL_STATE(31)] = 591,
  [SMALL_STATE(32)] = 605,
  [SMALL_STATE(33)] = 619,
  [SMALL_STATE(34)] = 638,
  [SMALL_STATE(35)] = 657,
  [SMALL_STATE(36)] = 676,
  [SMALL_STATE(37)] = 695,
  [SMALL_STATE(38)] = 714,
  [SMALL_STATE(39)] = 733,
  [SMALL_STATE(40)] = 752,
  [SMALL_STATE(41)] = 771,
  [SMALL_STATE(42)] = 790,
  [SMALL_STATE(43)] = 809,
  [SMALL_STATE(44)] = 823,
  [SMALL_STATE(45)] = 837,
  [SMALL_STATE(46)] = 851,
  [SMALL_STATE(47)] = 867,
  [SMALL_STATE(48)] = 881,
  [SMALL_STATE(49)] = 903,
  [SMALL_STATE(50)] = 917,
  [SMALL_STATE(51)] = 933,
  [SMALL_STATE(52)] = 944,
  [SMALL_STATE(53)] = 953,
  [SMALL_STATE(54)] = 962,
  [SMALL_STATE(55)] = 971,
  [SMALL_STATE(56)] = 982,
  [SMALL_STATE(57)] = 994,
  [SMALL_STATE(58)] = 1006,
  [SMALL_STATE(59)] = 1018,
  [SMALL_STATE(60)] = 1030,
  [SMALL_STATE(61)] = 1037,
  [SMALL_STATE(62)] = 1044,
  [SMALL_STATE(63)] = 1051,
  [SMALL_STATE(64)] = 1055,
  [SMALL_STATE(65)] = 1059,
  [SMALL_STATE(66)] = 1063,
  [SMALL_STATE(67)] = 1067,
  [SMALL_STATE(68)] = 1071,
  [SMALL_STATE(69)] = 1075,
  [SMALL_STATE(70)] = 1079,
  [SMALL_STATE(71)] = 1083,
  [SMALL_STATE(72)] = 1087,
  [SMALL_STATE(73)] = 1091,
  [SMALL_STATE(74)] = 1095,
  [SMALL_STATE(75)] = 1099,
  [SMALL_STATE(76)] = 1103,
  [SMALL_STATE(77)] = 1107,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 0),
  [5] = {.entry = {.count = 1, .reusable = false}}, SHIFT(63),
  [7] = {.entry = {.count = 1, .reusable = false}}, SHIFT(72),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(71),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(48),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(3),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [17] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2),
  [19] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(63),
  [22] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(72),
  [25] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(71),
  [28] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(48),
  [31] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(2),
  [34] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(2),
  [37] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 1),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(2),
  [41] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [43] = {.entry = {.count = 1, .reusable = true}}, SHIFT(77),
  [45] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [47] = {.entry = {.count = 1, .reusable = false}}, SHIFT(40),
  [49] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [51] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [53] = {.entry = {.count = 1, .reusable = false}}, SHIFT(5),
  [55] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata, 3, .production_id = 11),
  [57] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_metadata, 3, .production_id = 11),
  [59] = {.entry = {.count = 1, .reusable = false}}, SHIFT(38),
  [61] = {.entry = {.count = 1, .reusable = false}}, SHIFT(39),
  [63] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_paren_num_expr, 3),
  [65] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_paren_num_expr, 3),
  [67] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_unary_num_expr, 2),
  [69] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_unary_num_expr, 2),
  [71] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 1),
  [73] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_directive, 1),
  [75] = {.entry = {.count = 1, .reusable = false}}, SHIFT(66),
  [77] = {.entry = {.count = 1, .reusable = false}}, SHIFT(12),
  [79] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [81] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2),
  [83] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2),
  [85] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(66),
  [88] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(9),
  [91] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(9),
  [94] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_colon, 1),
  [96] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_colon, 1),
  [98] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_binary_num_expr, 3),
  [100] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_binary_num_expr, 3),
  [102] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 2),
  [104] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_directive, 2),
  [106] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [108] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [110] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(70),
  [113] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_name, 2),
  [115] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_account_name, 2),
  [117] = {.entry = {.count = 1, .reusable = false}}, SHIFT(70),
  [119] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [121] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_open_directive_repeat1, 2), SHIFT_REPEAT(69),
  [124] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [126] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 5, .production_id = 12),
  [128] = {.entry = {.count = 1, .reusable = false}}, SHIFT(69),
  [130] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 5, .production_id = 12),
  [132] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 4, .production_id = 7),
  [134] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 4, .production_id = 7),
  [136] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_plugin_directive, 2, .production_id = 1),
  [138] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_plugin_directive, 2, .production_id = 1),
  [140] = {.entry = {.count = 1, .reusable = false}}, SHIFT(28),
  [142] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 3, .production_id = 6),
  [144] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 3, .production_id = 6),
  [146] = {.entry = {.count = 1, .reusable = false}}, SHIFT(19),
  [148] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_balance_directive, 5, .production_id = 14),
  [150] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_balance_directive, 5, .production_id = 14),
  [152] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_event_directive, 4, .production_id = 8),
  [154] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_event_directive, 4, .production_id = 8),
  [156] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_include_directive, 2, .production_id = 2),
  [158] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_include_directive, 2, .production_id = 2),
  [160] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_price_directive, 5, .production_id = 13),
  [162] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_price_directive, 5, .production_id = 13),
  [164] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_option_directive, 3, .production_id = 4),
  [166] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_option_directive, 3, .production_id = 4),
  [168] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_plugin_directive, 3, .production_id = 5),
  [170] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_plugin_directive, 3, .production_id = 5),
  [172] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document_directive, 4, .production_id = 10),
  [174] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_document_directive, 4, .production_id = 10),
  [176] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_note_directive, 4, .production_id = 9),
  [178] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_note_directive, 4, .production_id = 9),
  [180] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_close_directive, 3, .production_id = 6),
  [182] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_close_directive, 3, .production_id = 6),
  [184] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [186] = {.entry = {.count = 1, .reusable = false}}, SHIFT(33),
  [188] = {.entry = {.count = 1, .reusable = true}}, SHIFT(33),
  [190] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [192] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [194] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [196] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [198] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [200] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [202] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [204] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [206] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [208] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [210] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(74),
  [213] = {.entry = {.count = 1, .reusable = true}}, SHIFT(49),
  [215] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [217] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [219] = {.entry = {.count = 1, .reusable = true}}, SHIFT(68),
  [221] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [223] = {.entry = {.count = 1, .reusable = true}}, SHIFT(43),
  [225] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [227] = {.entry = {.count = 1, .reusable = true}}, SHIFT(74),
  [229] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [231] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
  [233] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [235] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [237] = {.entry = {.count = 1, .reusable = true}}, SHIFT(53),
  [239] = {.entry = {.count = 1, .reusable = true}}, SHIFT(6),
  [241] = {.entry = {.count = 1, .reusable = true}}, SHIFT(70),
  [243] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [245] = {.entry = {.count = 1, .reusable = true}}, SHIFT(64),
  [247] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [249] = {.entry = {.count = 1, .reusable = true}}, SHIFT(76),
  [251] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata_key, 1, .production_id = 3),
  [253] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [255] = {.entry = {.count = 1, .reusable = true}}, SHIFT(35),
  [257] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [259] = {.entry = {.count = 1, .reusable = true}}, SHIFT(17),
  [261] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [263] = {.entry = {.count = 1, .reusable = true}}, SHIFT(21),
  [265] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [267] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [269] = {.entry = {.count = 1, .reusable = true}}, SHIFT(31),
  [271] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [273] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_type, 1),
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

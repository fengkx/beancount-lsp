#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 55
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 52
#define ALIAS_COUNT 0
#define TOKEN_COUNT 31
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 18
#define MAX_ALIAS_SEQUENCE_LENGTH 5
#define PRODUCTION_ID_COUNT 14

enum {
  anon_sym_open = 1,
  anon_sym_event = 2,
  anon_sym_close = 3,
  anon_sym_price = 4,
  anon_sym_note = 5,
  anon_sym_document = 6,
  anon_sym_COMMA = 7,
  anon_sym_option = 8,
  anon_sym_plugin = 9,
  anon_sym_include = 10,
  anon_sym_COLON = 11,
  aux_sym_account_name_token1 = 12,
  anon_sym_Assets = 13,
  anon_sym_Expenses = 14,
  anon_sym_Liabilities = 15,
  anon_sym_Equity = 16,
  anon_sym_Income = 17,
  anon_sym_txn = 18,
  anon_sym_BANG = 19,
  anon_sym_STAR = 20,
  anon_sym_POUND = 21,
  sym_date = 22,
  sym_currency = 23,
  sym_decimal = 24,
  aux_sym_metadata_key_token1 = 25,
  sym_str = 26,
  sym_tag = 27,
  sym_comment = 28,
  anon_sym_LF = 29,
  anon_sym_CR = 30,
  sym_file = 31,
  sym_directive = 32,
  sym_open_directive = 33,
  sym_close_directive = 34,
  sym_price_directive = 35,
  sym_note_directive = 36,
  sym_document_directive = 37,
  sym_event_directive = 38,
  sym_option_directive = 39,
  sym_plugin_directive = 40,
  sym_include_directive = 41,
  sym_account_name = 42,
  sym_account_type = 43,
  sym_metadata = 44,
  sym_metadata_key = 45,
  sym__new_line = 46,
  sym_colon = 47,
  aux_sym_file_repeat1 = 48,
  aux_sym_directive_repeat1 = 49,
  aux_sym_open_directive_repeat1 = 50,
  aux_sym_account_name_repeat1 = 51,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [anon_sym_open] = "open",
  [anon_sym_event] = "event",
  [anon_sym_close] = "close",
  [anon_sym_price] = "price",
  [anon_sym_note] = "note",
  [anon_sym_document] = "document",
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
  [anon_sym_POUND] = "#",
  [sym_date] = "date",
  [sym_currency] = "currency",
  [sym_decimal] = "decimal",
  [aux_sym_metadata_key_token1] = "metadata_key_token1",
  [sym_str] = "str",
  [sym_tag] = "tag",
  [sym_comment] = "comment",
  [anon_sym_LF] = "\n",
  [anon_sym_CR] = "\r",
  [sym_file] = "file",
  [sym_directive] = "directive",
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
  [anon_sym_open] = anon_sym_open,
  [anon_sym_event] = anon_sym_event,
  [anon_sym_close] = anon_sym_close,
  [anon_sym_price] = anon_sym_price,
  [anon_sym_note] = anon_sym_note,
  [anon_sym_document] = anon_sym_document,
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
  [anon_sym_POUND] = anon_sym_POUND,
  [sym_date] = sym_date,
  [sym_currency] = sym_currency,
  [sym_decimal] = sym_decimal,
  [aux_sym_metadata_key_token1] = aux_sym_metadata_key_token1,
  [sym_str] = sym_str,
  [sym_tag] = sym_tag,
  [sym_comment] = sym_comment,
  [anon_sym_LF] = anon_sym_LF,
  [anon_sym_CR] = anon_sym_CR,
  [sym_file] = sym_file,
  [sym_directive] = sym_directive,
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
  [anon_sym_POUND] = {
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
  [sym_decimal] = {
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
  field_colon = 2,
  field_commodity = 3,
  field_currencies = 4,
  field_currency = 5,
  field_data_key = 6,
  field_date = 7,
  field_directive_type = 8,
  field_document_path = 9,
  field_event_name = 10,
  field_event_value = 11,
  field_file_name = 12,
  field_module_name = 13,
  field_note = 14,
  field_option_name = 15,
  field_option_value = 16,
  field_plugin_config = 17,
  field_price = 18,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_account_name] = "account_name",
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
  [32] = 8,
  [33] = 9,
  [34] = 34,
  [35] = 13,
  [36] = 34,
  [37] = 37,
  [38] = 38,
  [39] = 39,
  [40] = 40,
  [41] = 41,
  [42] = 42,
  [43] = 43,
  [44] = 44,
  [45] = 45,
  [46] = 46,
  [47] = 47,
  [48] = 48,
  [49] = 49,
  [50] = 50,
  [51] = 51,
  [52] = 52,
  [53] = 53,
  [54] = 47,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(110);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (lookahead == '\n') ADVANCE(244);
      if (lookahead == '!') ADVANCE(191);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(193);
      if (lookahead == '*') ADVANCE(192);
      if (lookahead == ',') ADVANCE(117);
      if (lookahead == ':') ADVANCE(124);
      if (lookahead == ';') ADVANCE(243);
      if (lookahead == 'A') ADVANCE(149);
      if (lookahead == 'E') ADVANCE(148);
      if (lookahead == 'I') ADVANCE(147);
      if (lookahead == 'L') ADVANCE(146);
      if (lookahead == 'c') ADVANCE(33);
      if (lookahead == 'd') ADVANCE(47);
      if (lookahead == 'e') ADVANCE(72);
      if (lookahead == 'i') ADVANCE(42);
      if (lookahead == 'n') ADVANCE(48);
      if (lookahead == 'o') ADVANCE(52);
      if (lookahead == 'p') ADVANCE(32);
      if (lookahead == 't') ADVANCE(73);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(221);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(150);
      END_STATE();
    case 1:
      if (lookahead == '"') ADVANCE(241);
      if (lookahead != 0) ADVANCE(1);
      END_STATE();
    case 2:
      if (lookahead == '-') ADVANCE(102);
      END_STATE();
    case 3:
      if (lookahead == '-') ADVANCE(103);
      END_STATE();
    case 4:
      if (lookahead == 'a') ADVANCE(5);
      END_STATE();
    case 5:
      if (lookahead == 'b') ADVANCE(25);
      END_STATE();
    case 6:
      if (lookahead == 'c') ADVANCE(34);
      END_STATE();
    case 7:
      if (lookahead == 'c') ADVANCE(69);
      END_STATE();
    case 8:
      if (lookahead == 'c') ADVANCE(13);
      END_STATE();
    case 9:
      if (lookahead == 'c') ADVANCE(50);
      END_STATE();
    case 10:
      if (lookahead == 'd') ADVANCE(14);
      END_STATE();
    case 11:
      if (lookahead == 'e') ADVANCE(115);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(113);
      END_STATE();
    case 13:
      if (lookahead == 'e') ADVANCE(114);
      END_STATE();
    case 14:
      if (lookahead == 'e') ADVANCE(122);
      END_STATE();
    case 15:
      if (lookahead == 'e') ADVANCE(188);
      END_STATE();
    case 16:
      if (lookahead == 'e') ADVANCE(43);
      END_STATE();
    case 17:
      if (lookahead == 'e') ADVANCE(56);
      END_STATE();
    case 18:
      if (lookahead == 'e') ADVANCE(39);
      if (lookahead == 't') ADVANCE(27);
      END_STATE();
    case 19:
      if (lookahead == 'e') ADVANCE(66);
      END_STATE();
    case 20:
      if (lookahead == 'e') ADVANCE(57);
      END_STATE();
    case 21:
      if (lookahead == 'e') ADVANCE(44);
      END_STATE();
    case 22:
      if (lookahead == 'e') ADVANCE(46);
      END_STATE();
    case 23:
      if (lookahead == 'g') ADVANCE(29);
      END_STATE();
    case 24:
      if (lookahead == 'i') ADVANCE(4);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(216);
      END_STATE();
    case 25:
      if (lookahead == 'i') ADVANCE(35);
      END_STATE();
    case 26:
      if (lookahead == 'i') ADVANCE(8);
      END_STATE();
    case 27:
      if (lookahead == 'i') ADVANCE(51);
      END_STATE();
    case 28:
      if (lookahead == 'i') ADVANCE(64);
      END_STATE();
    case 29:
      if (lookahead == 'i') ADVANCE(41);
      END_STATE();
    case 30:
      if (lookahead == 'i') ADVANCE(67);
      END_STATE();
    case 31:
      if (lookahead == 'i') ADVANCE(20);
      END_STATE();
    case 32:
      if (lookahead == 'l') ADVANCE(68);
      if (lookahead == 'r') ADVANCE(26);
      END_STATE();
    case 33:
      if (lookahead == 'l') ADVANCE(49);
      END_STATE();
    case 34:
      if (lookahead == 'l') ADVANCE(70);
      END_STATE();
    case 35:
      if (lookahead == 'l') ADVANCE(30);
      END_STATE();
    case 36:
      if (lookahead == 'm') ADVANCE(15);
      END_STATE();
    case 37:
      if (lookahead == 'm') ADVANCE(21);
      END_STATE();
    case 38:
      if (lookahead == 'n') ADVANCE(190);
      END_STATE();
    case 39:
      if (lookahead == 'n') ADVANCE(111);
      END_STATE();
    case 40:
      if (lookahead == 'n') ADVANCE(118);
      END_STATE();
    case 41:
      if (lookahead == 'n') ADVANCE(120);
      END_STATE();
    case 42:
      if (lookahead == 'n') ADVANCE(6);
      END_STATE();
    case 43:
      if (lookahead == 'n') ADVANCE(62);
      END_STATE();
    case 44:
      if (lookahead == 'n') ADVANCE(63);
      END_STATE();
    case 45:
      if (lookahead == 'n') ADVANCE(9);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(216);
      END_STATE();
    case 46:
      if (lookahead == 'n') ADVANCE(60);
      END_STATE();
    case 47:
      if (lookahead == 'o') ADVANCE(7);
      END_STATE();
    case 48:
      if (lookahead == 'o') ADVANCE(65);
      END_STATE();
    case 49:
      if (lookahead == 'o') ADVANCE(58);
      END_STATE();
    case 50:
      if (lookahead == 'o') ADVANCE(36);
      END_STATE();
    case 51:
      if (lookahead == 'o') ADVANCE(40);
      END_STATE();
    case 52:
      if (lookahead == 'p') ADVANCE(18);
      END_STATE();
    case 53:
      if (lookahead == 'p') ADVANCE(22);
      END_STATE();
    case 54:
      if (lookahead == 'q') ADVANCE(71);
      if (lookahead == 'x') ADVANCE(53);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(216);
      END_STATE();
    case 55:
      if (lookahead == 's') ADVANCE(180);
      END_STATE();
    case 56:
      if (lookahead == 's') ADVANCE(182);
      END_STATE();
    case 57:
      if (lookahead == 's') ADVANCE(184);
      END_STATE();
    case 58:
      if (lookahead == 's') ADVANCE(12);
      END_STATE();
    case 59:
      if (lookahead == 's') ADVANCE(19);
      END_STATE();
    case 60:
      if (lookahead == 's') ADVANCE(17);
      END_STATE();
    case 61:
      if (lookahead == 's') ADVANCE(59);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(216);
      END_STATE();
    case 62:
      if (lookahead == 't') ADVANCE(112);
      END_STATE();
    case 63:
      if (lookahead == 't') ADVANCE(116);
      END_STATE();
    case 64:
      if (lookahead == 't') ADVANCE(74);
      END_STATE();
    case 65:
      if (lookahead == 't') ADVANCE(11);
      END_STATE();
    case 66:
      if (lookahead == 't') ADVANCE(55);
      END_STATE();
    case 67:
      if (lookahead == 't') ADVANCE(31);
      END_STATE();
    case 68:
      if (lookahead == 'u') ADVANCE(23);
      END_STATE();
    case 69:
      if (lookahead == 'u') ADVANCE(37);
      END_STATE();
    case 70:
      if (lookahead == 'u') ADVANCE(10);
      END_STATE();
    case 71:
      if (lookahead == 'u') ADVANCE(28);
      END_STATE();
    case 72:
      if (lookahead == 'v') ADVANCE(16);
      END_STATE();
    case 73:
      if (lookahead == 'x') ADVANCE(38);
      END_STATE();
    case 74:
      if (lookahead == 'y') ADVANCE(186);
      END_STATE();
    case 75:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(75)
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(108);
      if (lookahead == 'A') ADVANCE(61);
      if (lookahead == 'E') ADVANCE(54);
      if (lookahead == 'I') ADVANCE(45);
      if (lookahead == 'L') ADVANCE(24);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(221);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(77);
      END_STATE();
    case 76:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(76)
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(179);
      END_STATE();
    case 77:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(216);
      END_STATE();
    case 78:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(107);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(217);
      END_STATE();
    case 79:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(78);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(196);
      END_STATE();
    case 80:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(81);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(199);
      END_STATE();
    case 81:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(79);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(197);
      END_STATE();
    case 82:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(83);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(201);
      END_STATE();
    case 83:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(80);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(198);
      END_STATE();
    case 84:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(85);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(203);
      END_STATE();
    case 85:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(200);
      END_STATE();
    case 86:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(87);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(205);
      END_STATE();
    case 87:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(202);
      END_STATE();
    case 88:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(89);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(207);
      END_STATE();
    case 89:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(86);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(204);
      END_STATE();
    case 90:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(91);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(209);
      END_STATE();
    case 91:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(88);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(206);
      END_STATE();
    case 92:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(93);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(211);
      END_STATE();
    case 93:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(90);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(208);
      END_STATE();
    case 94:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(95);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(213);
      END_STATE();
    case 95:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(92);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(210);
      END_STATE();
    case 96:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(97);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(215);
      END_STATE();
    case 97:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(94);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(212);
      END_STATE();
    case 98:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(96);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(214);
      END_STATE();
    case 99:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(223);
      END_STATE();
    case 100:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(3);
      END_STATE();
    case 101:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(194);
      END_STATE();
    case 102:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(100);
      END_STATE();
    case 103:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(101);
      END_STATE();
    case 104:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(2);
      END_STATE();
    case 105:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(104);
      END_STATE();
    case 106:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(105);
      END_STATE();
    case 107:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(195);
      END_STATE();
    case 108:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(242);
      END_STATE();
    case 109:
      if (eof) ADVANCE(110);
      if (lookahead == '\t' ||
          lookahead == ' ') SKIP(109)
      if (lookahead == '\n') ADVANCE(244);
      if (lookahead == '\r') ADVANCE(245);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == ',') ADVANCE(117);
      if (lookahead == ':') ADVANCE(124);
      if (lookahead == ';') ADVANCE(243);
      if (lookahead == 'i') ADVANCE(232);
      if (lookahead == 'o') ADVANCE(236);
      if (lookahead == 'p') ADVANCE(230);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(106);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(77);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(anon_sym_open);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(anon_sym_event);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(anon_sym_close);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(anon_sym_price);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(anon_sym_note);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(anon_sym_document);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(anon_sym_option);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(anon_sym_option);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(anon_sym_plugin);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(anon_sym_plugin);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(anon_sym_include);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(anon_sym_include);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(178);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(107);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(178);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(125);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(78);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(125);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(126);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(79);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(126);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(129);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(80);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(129);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(127);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(81);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(127);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(131);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(131);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(128);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(83);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(128);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(133);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(84);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(133);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(130);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(85);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(130);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(135);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(86);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(135);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(132);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(87);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(132);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(137);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(88);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(137);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(134);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(89);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(134);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(139);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(90);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(139);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(136);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(91);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(136);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(141);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(92);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(141);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(138);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(93);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(138);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(143);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(94);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(143);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(140);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(95);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(140);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(145);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(96);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(145);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(142);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(97);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(142);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(144);
      if (lookahead == 'i') ADVANCE(151);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(144);
      if (lookahead == 'n') ADVANCE(153);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(144);
      if (lookahead == 'q') ADVANCE(176);
      if (lookahead == 'x') ADVANCE(167);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(144);
      if (lookahead == 's') ADVANCE(168);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(144);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(98);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'a') ADVANCE(152);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('b' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'b') ADVANCE(159);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'c') ADVANCE(166);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(174);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(165);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(189);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(170);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(171);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(163);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(173);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(175);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(158);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'l') ADVANCE(161);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'm') ADVANCE(156);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'n') ADVANCE(172);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'o') ADVANCE(164);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'p') ADVANCE(155);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 168:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(154);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(181);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 170:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(183);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 171:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(185);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 172:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(157);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(177);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 174:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(169);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 175:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(162);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 176:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'u') ADVANCE(160);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 177:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'y') ADVANCE(187);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 178:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(179);
      END_STATE();
    case 179:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 180:
      ACCEPT_TOKEN(anon_sym_Assets);
      END_STATE();
    case 181:
      ACCEPT_TOKEN(anon_sym_Assets);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 182:
      ACCEPT_TOKEN(anon_sym_Expenses);
      END_STATE();
    case 183:
      ACCEPT_TOKEN(anon_sym_Expenses);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 184:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      END_STATE();
    case 185:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 186:
      ACCEPT_TOKEN(anon_sym_Equity);
      END_STATE();
    case 187:
      ACCEPT_TOKEN(anon_sym_Equity);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 188:
      ACCEPT_TOKEN(anon_sym_Income);
      END_STATE();
    case 189:
      ACCEPT_TOKEN(anon_sym_Income);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(179);
      END_STATE();
    case 190:
      ACCEPT_TOKEN(anon_sym_txn);
      END_STATE();
    case 191:
      ACCEPT_TOKEN(anon_sym_BANG);
      END_STATE();
    case 192:
      ACCEPT_TOKEN(anon_sym_STAR);
      END_STATE();
    case 193:
      ACCEPT_TOKEN(anon_sym_POUND);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(242);
      END_STATE();
    case 194:
      ACCEPT_TOKEN(sym_date);
      END_STATE();
    case 195:
      ACCEPT_TOKEN(sym_currency);
      END_STATE();
    case 196:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(107);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(217);
      END_STATE();
    case 197:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(78);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(196);
      END_STATE();
    case 198:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(81);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(199);
      END_STATE();
    case 199:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(79);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(197);
      END_STATE();
    case 200:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(83);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(201);
      END_STATE();
    case 201:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(80);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(198);
      END_STATE();
    case 202:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(85);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(203);
      END_STATE();
    case 203:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(200);
      END_STATE();
    case 204:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(87);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(205);
      END_STATE();
    case 205:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(202);
      END_STATE();
    case 206:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(89);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(207);
      END_STATE();
    case 207:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(86);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(204);
      END_STATE();
    case 208:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(91);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(209);
      END_STATE();
    case 209:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(88);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(206);
      END_STATE();
    case 210:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(93);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(211);
      END_STATE();
    case 211:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(90);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(208);
      END_STATE();
    case 212:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(95);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(213);
      END_STATE();
    case 213:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(92);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(210);
      END_STATE();
    case 214:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(97);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(215);
      END_STATE();
    case 215:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(94);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(212);
      END_STATE();
    case 216:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(96);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(214);
      END_STATE();
    case 217:
      ACCEPT_TOKEN(sym_currency);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(195);
      END_STATE();
    case 218:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '-') ADVANCE(102);
      if (lookahead == '.') ADVANCE(99);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(222);
      END_STATE();
    case 219:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(99);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(218);
      END_STATE();
    case 220:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(99);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(219);
      END_STATE();
    case 221:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(99);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(220);
      END_STATE();
    case 222:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(99);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(222);
      END_STATE();
    case 223:
      ACCEPT_TOKEN(sym_decimal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(223);
      END_STATE();
    case 224:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'c') ADVANCE(231);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 225:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'd') ADVANCE(226);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 226:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'e') ADVANCE(123);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 227:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'g') ADVANCE(229);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 228:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'i') ADVANCE(235);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 229:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'i') ADVANCE(234);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 230:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'l') ADVANCE(238);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 231:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'l') ADVANCE(239);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 232:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(224);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 233:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(119);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 234:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'n') ADVANCE(121);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 235:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'o') ADVANCE(233);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 236:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'p') ADVANCE(237);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 237:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 't') ADVANCE(228);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 238:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'u') ADVANCE(227);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 239:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == 'u') ADVANCE(225);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 240:
      ACCEPT_TOKEN(aux_sym_metadata_key_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(240);
      END_STATE();
    case 241:
      ACCEPT_TOKEN(sym_str);
      END_STATE();
    case 242:
      ACCEPT_TOKEN(sym_tag);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(242);
      END_STATE();
    case 243:
      ACCEPT_TOKEN(sym_comment);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(243);
      END_STATE();
    case 244:
      ACCEPT_TOKEN(anon_sym_LF);
      END_STATE();
    case 245:
      ACCEPT_TOKEN(anon_sym_CR);
      if (lookahead == '\r') ADVANCE(245);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 109},
  [2] = {.lex_state = 109},
  [3] = {.lex_state = 109},
  [4] = {.lex_state = 109},
  [5] = {.lex_state = 109},
  [6] = {.lex_state = 109},
  [7] = {.lex_state = 75},
  [8] = {.lex_state = 109},
  [9] = {.lex_state = 109},
  [10] = {.lex_state = 109},
  [11] = {.lex_state = 109},
  [12] = {.lex_state = 109},
  [13] = {.lex_state = 109},
  [14] = {.lex_state = 109},
  [15] = {.lex_state = 75},
  [16] = {.lex_state = 109},
  [17] = {.lex_state = 109},
  [18] = {.lex_state = 109},
  [19] = {.lex_state = 109},
  [20] = {.lex_state = 109},
  [21] = {.lex_state = 109},
  [22] = {.lex_state = 109},
  [23] = {.lex_state = 109},
  [24] = {.lex_state = 109},
  [25] = {.lex_state = 109},
  [26] = {.lex_state = 109},
  [27] = {.lex_state = 75},
  [28] = {.lex_state = 75},
  [29] = {.lex_state = 75},
  [30] = {.lex_state = 75},
  [31] = {.lex_state = 0},
  [32] = {.lex_state = 0},
  [33] = {.lex_state = 0},
  [34] = {.lex_state = 0},
  [35] = {.lex_state = 0},
  [36] = {.lex_state = 0},
  [37] = {.lex_state = 0},
  [38] = {.lex_state = 0},
  [39] = {.lex_state = 0},
  [40] = {.lex_state = 75},
  [41] = {.lex_state = 75},
  [42] = {.lex_state = 0},
  [43] = {.lex_state = 75},
  [44] = {.lex_state = 0},
  [45] = {.lex_state = 0},
  [46] = {.lex_state = 0},
  [47] = {.lex_state = 76},
  [48] = {.lex_state = 0},
  [49] = {.lex_state = 0},
  [50] = {.lex_state = 0},
  [51] = {.lex_state = 0},
  [52] = {.lex_state = 0},
  [53] = {.lex_state = 0},
  [54] = {.lex_state = 76},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [anon_sym_open] = ACTIONS(1),
    [anon_sym_event] = ACTIONS(1),
    [anon_sym_close] = ACTIONS(1),
    [anon_sym_price] = ACTIONS(1),
    [anon_sym_note] = ACTIONS(1),
    [anon_sym_document] = ACTIONS(1),
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
    [anon_sym_POUND] = ACTIONS(1),
    [sym_date] = ACTIONS(1),
    [sym_currency] = ACTIONS(1),
    [sym_decimal] = ACTIONS(1),
    [sym_str] = ACTIONS(1),
    [sym_tag] = ACTIONS(1),
    [sym_comment] = ACTIONS(1),
    [anon_sym_LF] = ACTIONS(1),
  },
  [1] = {
    [sym_file] = STATE(46),
    [sym_directive] = STATE(3),
    [sym_open_directive] = STATE(6),
    [sym_close_directive] = STATE(6),
    [sym_price_directive] = STATE(6),
    [sym_note_directive] = STATE(6),
    [sym_document_directive] = STATE(6),
    [sym_event_directive] = STATE(6),
    [sym_option_directive] = STATE(6),
    [sym_plugin_directive] = STATE(6),
    [sym_include_directive] = STATE(6),
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
    STATE(6), 9,
      sym_open_directive,
      sym_close_directive,
      sym_price_directive,
      sym_note_directive,
      sym_document_directive,
      sym_event_directive,
      sym_option_directive,
      sym_plugin_directive,
      sym_include_directive,
  [39] = 9,
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
    STATE(6), 9,
      sym_open_directive,
      sym_close_directive,
      sym_price_directive,
      sym_note_directive,
      sym_document_directive,
      sym_event_directive,
      sym_option_directive,
      sym_plugin_directive,
      sym_include_directive,
  [78] = 5,
    ACTIONS(47), 1,
      aux_sym_metadata_key_token1,
    STATE(37), 1,
      sym_metadata_key,
    ACTIONS(43), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    STATE(5), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(45), 6,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
      anon_sym_LF,
  [102] = 7,
    ACTIONS(49), 1,
      ts_builtin_sym_end,
    ACTIONS(53), 1,
      aux_sym_metadata_key_token1,
    ACTIONS(56), 1,
      anon_sym_LF,
    ACTIONS(59), 1,
      anon_sym_CR,
    STATE(37), 1,
      sym_metadata_key,
    STATE(5), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(51), 5,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
  [130] = 7,
    ACTIONS(47), 1,
      aux_sym_metadata_key_token1,
    ACTIONS(62), 1,
      ts_builtin_sym_end,
    ACTIONS(66), 1,
      anon_sym_LF,
    ACTIONS(68), 1,
      anon_sym_CR,
    STATE(37), 1,
      sym_metadata_key,
    STATE(4), 3,
      sym_metadata,
      sym__new_line,
      aux_sym_directive_repeat1,
    ACTIONS(64), 5,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_comment,
  [158] = 5,
    ACTIONS(74), 1,
      sym_decimal,
    STATE(19), 1,
      sym_account_name,
    STATE(36), 1,
      sym_account_type,
    ACTIONS(72), 4,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
    ACTIONS(70), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [181] = 4,
    ACTIONS(80), 1,
      anon_sym_COLON,
    STATE(8), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(76), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(78), 8,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [202] = 4,
    ACTIONS(87), 1,
      anon_sym_COLON,
    STATE(8), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(83), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(85), 8,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [223] = 4,
    ACTIONS(91), 1,
      anon_sym_COMMA,
    STATE(12), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(89), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(93), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [243] = 4,
    ACTIONS(97), 1,
      anon_sym_COMMA,
    STATE(11), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(95), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(100), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [263] = 4,
    ACTIONS(91), 1,
      anon_sym_COMMA,
    STATE(11), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(102), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(104), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [283] = 2,
    ACTIONS(76), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(78), 9,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      anon_sym_COLON,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [299] = 3,
    ACTIONS(110), 1,
      sym_str,
    ACTIONS(106), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(108), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [316] = 2,
    ACTIONS(114), 1,
      sym_decimal,
    ACTIONS(112), 9,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
  [331] = 2,
    ACTIONS(95), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(100), 8,
      anon_sym_COMMA,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [346] = 3,
    ACTIONS(120), 1,
      sym_currency,
    ACTIONS(116), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(118), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [363] = 2,
    ACTIONS(122), 2,
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
  [377] = 2,
    ACTIONS(126), 2,
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
  [391] = 2,
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
  [405] = 2,
    ACTIONS(134), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(136), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [419] = 2,
    ACTIONS(138), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(140), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [433] = 2,
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
  [447] = 2,
    ACTIONS(146), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(148), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [461] = 2,
    ACTIONS(150), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(152), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [475] = 2,
    ACTIONS(154), 2,
      ts_builtin_sym_end,
      anon_sym_CR,
    ACTIONS(156), 7,
      anon_sym_option,
      anon_sym_plugin,
      anon_sym_include,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
      anon_sym_LF,
  [489] = 3,
    STATE(26), 1,
      sym_account_name,
    STATE(36), 1,
      sym_account_type,
    ACTIONS(70), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [503] = 3,
    STATE(34), 1,
      sym_account_type,
    STATE(52), 1,
      sym_account_name,
    ACTIONS(70), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [517] = 3,
    STATE(17), 1,
      sym_account_name,
    STATE(36), 1,
      sym_account_type,
    ACTIONS(70), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [531] = 3,
    STATE(34), 1,
      sym_account_type,
    STATE(53), 1,
      sym_account_name,
    ACTIONS(70), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [545] = 6,
    ACTIONS(158), 1,
      anon_sym_open,
    ACTIONS(160), 1,
      anon_sym_event,
    ACTIONS(162), 1,
      anon_sym_close,
    ACTIONS(164), 1,
      anon_sym_price,
    ACTIONS(166), 1,
      anon_sym_note,
    ACTIONS(168), 1,
      anon_sym_document,
  [564] = 3,
    ACTIONS(76), 1,
      sym_str,
    ACTIONS(170), 1,
      anon_sym_COLON,
    STATE(32), 1,
      aux_sym_account_name_repeat1,
  [574] = 3,
    ACTIONS(83), 1,
      sym_str,
    ACTIONS(173), 1,
      anon_sym_COLON,
    STATE(32), 1,
      aux_sym_account_name_repeat1,
  [584] = 2,
    ACTIONS(173), 1,
      anon_sym_COLON,
    STATE(33), 1,
      aux_sym_account_name_repeat1,
  [591] = 1,
    ACTIONS(76), 2,
      anon_sym_COLON,
      sym_str,
  [596] = 2,
    ACTIONS(175), 1,
      anon_sym_COLON,
    STATE(9), 1,
      aux_sym_account_name_repeat1,
  [603] = 2,
    ACTIONS(177), 1,
      anon_sym_COLON,
    STATE(7), 1,
      sym_colon,
  [610] = 1,
    ACTIONS(179), 1,
      anon_sym_COLON,
  [614] = 1,
    ACTIONS(181), 1,
      anon_sym_COLON,
  [618] = 1,
    ACTIONS(183), 1,
      sym_currency,
  [622] = 1,
    ACTIONS(185), 1,
      sym_currency,
  [626] = 1,
    ACTIONS(187), 1,
      sym_str,
  [630] = 1,
    ACTIONS(189), 1,
      sym_currency,
  [634] = 1,
    ACTIONS(191), 1,
      sym_decimal,
  [638] = 1,
    ACTIONS(193), 1,
      sym_str,
  [642] = 1,
    ACTIONS(195), 1,
      ts_builtin_sym_end,
  [646] = 1,
    ACTIONS(197), 1,
      aux_sym_account_name_token1,
  [650] = 1,
    ACTIONS(199), 1,
      sym_str,
  [654] = 1,
    ACTIONS(201), 1,
      sym_str,
  [658] = 1,
    ACTIONS(203), 1,
      sym_str,
  [662] = 1,
    ACTIONS(205), 1,
      sym_str,
  [666] = 1,
    ACTIONS(207), 1,
      sym_str,
  [670] = 1,
    ACTIONS(209), 1,
      sym_str,
  [674] = 1,
    ACTIONS(211), 1,
      aux_sym_account_name_token1,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 39,
  [SMALL_STATE(4)] = 78,
  [SMALL_STATE(5)] = 102,
  [SMALL_STATE(6)] = 130,
  [SMALL_STATE(7)] = 158,
  [SMALL_STATE(8)] = 181,
  [SMALL_STATE(9)] = 202,
  [SMALL_STATE(10)] = 223,
  [SMALL_STATE(11)] = 243,
  [SMALL_STATE(12)] = 263,
  [SMALL_STATE(13)] = 283,
  [SMALL_STATE(14)] = 299,
  [SMALL_STATE(15)] = 316,
  [SMALL_STATE(16)] = 331,
  [SMALL_STATE(17)] = 346,
  [SMALL_STATE(18)] = 363,
  [SMALL_STATE(19)] = 377,
  [SMALL_STATE(20)] = 391,
  [SMALL_STATE(21)] = 405,
  [SMALL_STATE(22)] = 419,
  [SMALL_STATE(23)] = 433,
  [SMALL_STATE(24)] = 447,
  [SMALL_STATE(25)] = 461,
  [SMALL_STATE(26)] = 475,
  [SMALL_STATE(27)] = 489,
  [SMALL_STATE(28)] = 503,
  [SMALL_STATE(29)] = 517,
  [SMALL_STATE(30)] = 531,
  [SMALL_STATE(31)] = 545,
  [SMALL_STATE(32)] = 564,
  [SMALL_STATE(33)] = 574,
  [SMALL_STATE(34)] = 584,
  [SMALL_STATE(35)] = 591,
  [SMALL_STATE(36)] = 596,
  [SMALL_STATE(37)] = 603,
  [SMALL_STATE(38)] = 610,
  [SMALL_STATE(39)] = 614,
  [SMALL_STATE(40)] = 618,
  [SMALL_STATE(41)] = 622,
  [SMALL_STATE(42)] = 626,
  [SMALL_STATE(43)] = 630,
  [SMALL_STATE(44)] = 634,
  [SMALL_STATE(45)] = 638,
  [SMALL_STATE(46)] = 642,
  [SMALL_STATE(47)] = 646,
  [SMALL_STATE(48)] = 650,
  [SMALL_STATE(49)] = 654,
  [SMALL_STATE(50)] = 658,
  [SMALL_STATE(51)] = 662,
  [SMALL_STATE(52)] = 666,
  [SMALL_STATE(53)] = 670,
  [SMALL_STATE(54)] = 674,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 0),
  [5] = {.entry = {.count = 1, .reusable = false}}, SHIFT(50),
  [7] = {.entry = {.count = 1, .reusable = false}}, SHIFT(49),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(48),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(31),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(3),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [17] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2),
  [19] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(50),
  [22] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(49),
  [25] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(48),
  [28] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(31),
  [31] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(2),
  [34] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(2),
  [37] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 1),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(2),
  [41] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [43] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 2),
  [45] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_directive, 2),
  [47] = {.entry = {.count = 1, .reusable = false}}, SHIFT(39),
  [49] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2),
  [51] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2),
  [53] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(39),
  [56] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(5),
  [59] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(5),
  [62] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 1),
  [64] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_directive, 1),
  [66] = {.entry = {.count = 1, .reusable = false}}, SHIFT(4),
  [68] = {.entry = {.count = 1, .reusable = true}}, SHIFT(4),
  [70] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [72] = {.entry = {.count = 1, .reusable = true}}, SHIFT(19),
  [74] = {.entry = {.count = 1, .reusable = false}}, SHIFT(19),
  [76] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [78] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [80] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(47),
  [83] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_name, 2),
  [85] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_account_name, 2),
  [87] = {.entry = {.count = 1, .reusable = false}}, SHIFT(47),
  [89] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 4, .production_id = 7),
  [91] = {.entry = {.count = 1, .reusable = false}}, SHIFT(43),
  [93] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 4, .production_id = 7),
  [95] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [97] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_open_directive_repeat1, 2), SHIFT_REPEAT(43),
  [100] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [102] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 5, .production_id = 12),
  [104] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 5, .production_id = 12),
  [106] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_plugin_directive, 2, .production_id = 1),
  [108] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_plugin_directive, 2, .production_id = 1),
  [110] = {.entry = {.count = 1, .reusable = false}}, SHIFT(25),
  [112] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_colon, 1),
  [114] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_colon, 1),
  [116] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 3, .production_id = 6),
  [118] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_open_directive, 3, .production_id = 6),
  [120] = {.entry = {.count = 1, .reusable = false}}, SHIFT(10),
  [122] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_include_directive, 2, .production_id = 2),
  [124] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_include_directive, 2, .production_id = 2),
  [126] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata, 3, .production_id = 11),
  [128] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_metadata, 3, .production_id = 11),
  [130] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document_directive, 4, .production_id = 10),
  [132] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_document_directive, 4, .production_id = 10),
  [134] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_note_directive, 4, .production_id = 9),
  [136] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_note_directive, 4, .production_id = 9),
  [138] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_event_directive, 4, .production_id = 8),
  [140] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_event_directive, 4, .production_id = 8),
  [142] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_price_directive, 5, .production_id = 13),
  [144] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_price_directive, 5, .production_id = 13),
  [146] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_option_directive, 3, .production_id = 4),
  [148] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_option_directive, 3, .production_id = 4),
  [150] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_plugin_directive, 3, .production_id = 5),
  [152] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_plugin_directive, 3, .production_id = 5),
  [154] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_close_directive, 3, .production_id = 6),
  [156] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_close_directive, 3, .production_id = 6),
  [158] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [160] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [162] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [164] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [166] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [168] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [170] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(54),
  [173] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [175] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [177] = {.entry = {.count = 1, .reusable = true}}, SHIFT(15),
  [179] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_type, 1),
  [181] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata_key, 1, .production_id = 3),
  [183] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [185] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [187] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [189] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [191] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [193] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [195] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [197] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [199] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [201] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [203] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [205] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [207] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [209] = {.entry = {.count = 1, .reusable = true}}, SHIFT(21),
  [211] = {.entry = {.count = 1, .reusable = true}}, SHIFT(35),
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
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif

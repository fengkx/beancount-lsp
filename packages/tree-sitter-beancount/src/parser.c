#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 42
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 43
#define ALIAS_COUNT 0
#define TOKEN_COUNT 26
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 13
#define MAX_ALIAS_SEQUENCE_LENGTH 5
#define PRODUCTION_ID_COUNT 10

enum {
  anon_sym_open = 1,
  anon_sym_event = 2,
  anon_sym_close = 3,
  anon_sym_price = 4,
  anon_sym_note = 5,
  anon_sym_document = 6,
  anon_sym_COMMA = 7,
  anon_sym_COLON = 8,
  aux_sym_account_name_token1 = 9,
  anon_sym_Assets = 10,
  anon_sym_Expenses = 11,
  anon_sym_Liabilities = 12,
  anon_sym_Equity = 13,
  anon_sym_Income = 14,
  anon_sym_txn = 15,
  anon_sym_BANG = 16,
  anon_sym_STAR = 17,
  anon_sym_POUND = 18,
  sym_date = 19,
  sym_currency = 20,
  sym_decimal = 21,
  aux_sym_metadata_key_token1 = 22,
  sym_str = 23,
  sym_tag = 24,
  sym_comment = 25,
  sym_file = 26,
  sym_directive = 27,
  sym_open_directive = 28,
  sym_close_directive = 29,
  sym_price_directive = 30,
  sym_note_directive = 31,
  sym_document_directive = 32,
  sym_event_directive = 33,
  sym_account_name = 34,
  sym_account_type = 35,
  sym_metadata = 36,
  sym_metadata_key = 37,
  sym_colon = 38,
  aux_sym_file_repeat1 = 39,
  aux_sym_directive_repeat1 = 40,
  aux_sym_open_directive_repeat1 = 41,
  aux_sym_account_name_repeat1 = 42,
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
  [sym_file] = "file",
  [sym_directive] = "directive",
  [sym_open_directive] = "open_directive",
  [sym_close_directive] = "close_directive",
  [sym_price_directive] = "price_directive",
  [sym_note_directive] = "note_directive",
  [sym_document_directive] = "document_directive",
  [sym_event_directive] = "event_directive",
  [sym_account_name] = "account_name",
  [sym_account_type] = "account_type",
  [sym_metadata] = "metadata",
  [sym_metadata_key] = "metadata_key",
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
  [sym_file] = sym_file,
  [sym_directive] = sym_directive,
  [sym_open_directive] = sym_open_directive,
  [sym_close_directive] = sym_close_directive,
  [sym_price_directive] = sym_price_directive,
  [sym_note_directive] = sym_note_directive,
  [sym_document_directive] = sym_document_directive,
  [sym_event_directive] = sym_event_directive,
  [sym_account_name] = sym_account_name,
  [sym_account_type] = sym_account_type,
  [sym_metadata] = sym_metadata,
  [sym_metadata_key] = sym_metadata_key,
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
  field_eventName = 10,
  field_eventValue = 11,
  field_note = 12,
  field_price = 13,
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
  [field_eventName] = "eventName",
  [field_eventValue] = "eventValue",
  [field_note] = "note",
  [field_price] = "price",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 1},
  [2] = {.index = 1, .length = 3},
  [3] = {.index = 4, .length = 4},
  [4] = {.index = 8, .length = 4},
  [5] = {.index = 12, .length = 4},
  [6] = {.index = 16, .length = 4},
  [7] = {.index = 20, .length = 1},
  [8] = {.index = 21, .length = 5},
  [9] = {.index = 26, .length = 5},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_data_key, 0},
  [1] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
  [4] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_date, 0},
    {field_directive_type, 1},
  [8] =
    {field_date, 0},
    {field_directive_type, 1},
    {field_eventName, 2},
    {field_eventValue, 3},
  [12] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
    {field_note, 3},
  [16] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
    {field_document_path, 3},
  [20] =
    {field_colon, 1},
  [21] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_currencies, 4},
    {field_date, 0},
    {field_directive_type, 1},
  [26] =
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
  [32] = 32,
  [33] = 33,
  [34] = 34,
  [35] = 35,
  [36] = 36,
  [37] = 37,
  [38] = 38,
  [39] = 39,
  [40] = 40,
  [41] = 41,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(92);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (lookahead == '!') ADVANCE(167);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(169);
      if (lookahead == '*') ADVANCE(168);
      if (lookahead == ',') ADVANCE(99);
      if (lookahead == ':') ADVANCE(100);
      if (lookahead == ';') ADVANCE(203);
      if (lookahead == 'A') ADVANCE(125);
      if (lookahead == 'E') ADVANCE(124);
      if (lookahead == 'I') ADVANCE(123);
      if (lookahead == 'L') ADVANCE(122);
      if (lookahead == 'c') ADVANCE(25);
      if (lookahead == 'd') ADVANCE(35);
      if (lookahead == 'e') ADVANCE(58);
      if (lookahead == 'n') ADVANCE(36);
      if (lookahead == 'o') ADVANCE(39);
      if (lookahead == 'p') ADVANCE(42);
      if (lookahead == 't') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(197);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(126);
      END_STATE();
    case 1:
      if (lookahead == '"') ADVANCE(201);
      if (lookahead != 0) ADVANCE(1);
      END_STATE();
    case 2:
      if (lookahead == '-') ADVANCE(88);
      END_STATE();
    case 3:
      if (lookahead == 'a') ADVANCE(4);
      END_STATE();
    case 4:
      if (lookahead == 'b') ADVANCE(20);
      END_STATE();
    case 5:
      if (lookahead == 'c') ADVANCE(56);
      END_STATE();
    case 6:
      if (lookahead == 'c') ADVANCE(38);
      END_STATE();
    case 7:
      if (lookahead == 'c') ADVANCE(10);
      END_STATE();
    case 8:
      if (lookahead == 'e') ADVANCE(97);
      END_STATE();
    case 9:
      if (lookahead == 'e') ADVANCE(95);
      END_STATE();
    case 10:
      if (lookahead == 'e') ADVANCE(96);
      END_STATE();
    case 11:
      if (lookahead == 'e') ADVANCE(164);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(31);
      END_STATE();
    case 13:
      if (lookahead == 'e') ADVANCE(30);
      END_STATE();
    case 14:
      if (lookahead == 'e') ADVANCE(44);
      END_STATE();
    case 15:
      if (lookahead == 'e') ADVANCE(54);
      END_STATE();
    case 16:
      if (lookahead == 'e') ADVANCE(33);
      END_STATE();
    case 17:
      if (lookahead == 'e') ADVANCE(45);
      END_STATE();
    case 18:
      if (lookahead == 'e') ADVANCE(34);
      END_STATE();
    case 19:
      if (lookahead == 'i') ADVANCE(3);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(192);
      END_STATE();
    case 20:
      if (lookahead == 'i') ADVANCE(26);
      END_STATE();
    case 21:
      if (lookahead == 'i') ADVANCE(7);
      END_STATE();
    case 22:
      if (lookahead == 'i') ADVANCE(52);
      END_STATE();
    case 23:
      if (lookahead == 'i') ADVANCE(55);
      END_STATE();
    case 24:
      if (lookahead == 'i') ADVANCE(17);
      END_STATE();
    case 25:
      if (lookahead == 'l') ADVANCE(37);
      END_STATE();
    case 26:
      if (lookahead == 'l') ADVANCE(23);
      END_STATE();
    case 27:
      if (lookahead == 'm') ADVANCE(11);
      END_STATE();
    case 28:
      if (lookahead == 'm') ADVANCE(16);
      END_STATE();
    case 29:
      if (lookahead == 'n') ADVANCE(166);
      END_STATE();
    case 30:
      if (lookahead == 'n') ADVANCE(93);
      END_STATE();
    case 31:
      if (lookahead == 'n') ADVANCE(50);
      END_STATE();
    case 32:
      if (lookahead == 'n') ADVANCE(6);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(192);
      END_STATE();
    case 33:
      if (lookahead == 'n') ADVANCE(51);
      END_STATE();
    case 34:
      if (lookahead == 'n') ADVANCE(48);
      END_STATE();
    case 35:
      if (lookahead == 'o') ADVANCE(5);
      END_STATE();
    case 36:
      if (lookahead == 'o') ADVANCE(53);
      END_STATE();
    case 37:
      if (lookahead == 'o') ADVANCE(46);
      END_STATE();
    case 38:
      if (lookahead == 'o') ADVANCE(27);
      END_STATE();
    case 39:
      if (lookahead == 'p') ADVANCE(13);
      END_STATE();
    case 40:
      if (lookahead == 'p') ADVANCE(18);
      END_STATE();
    case 41:
      if (lookahead == 'q') ADVANCE(57);
      if (lookahead == 'x') ADVANCE(40);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(192);
      END_STATE();
    case 42:
      if (lookahead == 'r') ADVANCE(21);
      END_STATE();
    case 43:
      if (lookahead == 's') ADVANCE(156);
      END_STATE();
    case 44:
      if (lookahead == 's') ADVANCE(158);
      END_STATE();
    case 45:
      if (lookahead == 's') ADVANCE(160);
      END_STATE();
    case 46:
      if (lookahead == 's') ADVANCE(9);
      END_STATE();
    case 47:
      if (lookahead == 's') ADVANCE(15);
      END_STATE();
    case 48:
      if (lookahead == 's') ADVANCE(14);
      END_STATE();
    case 49:
      if (lookahead == 's') ADVANCE(47);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(192);
      END_STATE();
    case 50:
      if (lookahead == 't') ADVANCE(94);
      END_STATE();
    case 51:
      if (lookahead == 't') ADVANCE(98);
      END_STATE();
    case 52:
      if (lookahead == 't') ADVANCE(60);
      END_STATE();
    case 53:
      if (lookahead == 't') ADVANCE(8);
      END_STATE();
    case 54:
      if (lookahead == 't') ADVANCE(43);
      END_STATE();
    case 55:
      if (lookahead == 't') ADVANCE(24);
      END_STATE();
    case 56:
      if (lookahead == 'u') ADVANCE(28);
      END_STATE();
    case 57:
      if (lookahead == 'u') ADVANCE(22);
      END_STATE();
    case 58:
      if (lookahead == 'v') ADVANCE(12);
      END_STATE();
    case 59:
      if (lookahead == 'x') ADVANCE(29);
      END_STATE();
    case 60:
      if (lookahead == 'y') ADVANCE(162);
      END_STATE();
    case 61:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(192);
      END_STATE();
    case 62:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(89);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(193);
      END_STATE();
    case 63:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(172);
      END_STATE();
    case 64:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(175);
      END_STATE();
    case 65:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(173);
      END_STATE();
    case 66:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(67);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(177);
      END_STATE();
    case 67:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(174);
      END_STATE();
    case 68:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(69);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(179);
      END_STATE();
    case 69:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(66);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 70:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(71);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 71:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(68);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(178);
      END_STATE();
    case 72:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(73);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(183);
      END_STATE();
    case 73:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(70);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(180);
      END_STATE();
    case 74:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(75);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(185);
      END_STATE();
    case 75:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(72);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(182);
      END_STATE();
    case 76:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(77);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(187);
      END_STATE();
    case 77:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(74);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(184);
      END_STATE();
    case 78:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(79);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(189);
      END_STATE();
    case 79:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(76);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(186);
      END_STATE();
    case 80:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(81);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(191);
      END_STATE();
    case 81:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(78);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(188);
      END_STATE();
    case 82:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(80);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(190);
      END_STATE();
    case 83:
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(83)
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(155);
      END_STATE();
    case 84:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(199);
      END_STATE();
    case 85:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(2);
      END_STATE();
    case 86:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(170);
      END_STATE();
    case 87:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(85);
      END_STATE();
    case 88:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(86);
      END_STATE();
    case 89:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(171);
      END_STATE();
    case 90:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(202);
      END_STATE();
    case 91:
      if (eof) ADVANCE(92);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(91)
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(90);
      if (lookahead == ',') ADVANCE(99);
      if (lookahead == ':') ADVANCE(100);
      if (lookahead == ';') ADVANCE(203);
      if (lookahead == 'A') ADVANCE(49);
      if (lookahead == 'E') ADVANCE(41);
      if (lookahead == 'I') ADVANCE(32);
      if (lookahead == 'L') ADVANCE(19);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(197);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(61);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(200);
      END_STATE();
    case 92:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 93:
      ACCEPT_TOKEN(anon_sym_open);
      END_STATE();
    case 94:
      ACCEPT_TOKEN(anon_sym_event);
      END_STATE();
    case 95:
      ACCEPT_TOKEN(anon_sym_close);
      END_STATE();
    case 96:
      ACCEPT_TOKEN(anon_sym_price);
      END_STATE();
    case 97:
      ACCEPT_TOKEN(anon_sym_note);
      END_STATE();
    case 98:
      ACCEPT_TOKEN(anon_sym_document);
      END_STATE();
    case 99:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 100:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 101:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(154);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(89);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(154);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(101);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(101);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(102);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(102);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(105);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(105);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(103);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(65);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(103);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(107);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(66);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(107);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(104);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(67);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(104);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(109);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(68);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(109);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(106);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(69);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(106);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(111);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(70);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(111);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(108);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(71);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(108);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(113);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(72);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(113);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(110);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(73);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(110);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(115);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(74);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(115);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(112);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(75);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(112);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(117);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(76);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(117);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(114);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(77);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(114);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(119);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(78);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(119);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(116);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(79);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(116);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(121);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(80);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(121);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(118);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(81);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(118);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(120);
      if (lookahead == 'i') ADVANCE(127);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(120);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(120);
      if (lookahead == 'n') ADVANCE(129);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(120);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(120);
      if (lookahead == 'q') ADVANCE(152);
      if (lookahead == 'x') ADVANCE(143);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(120);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(120);
      if (lookahead == 's') ADVANCE(144);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(120);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(120);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(82);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(120);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'a') ADVANCE(128);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('b' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'b') ADVANCE(135);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'c') ADVANCE(142);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(150);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(141);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(165);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(146);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(147);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(139);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(149);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(151);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(134);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'l') ADVANCE(137);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'm') ADVANCE(132);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'n') ADVANCE(148);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'o') ADVANCE(140);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'p') ADVANCE(131);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(130);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(157);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(159);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(161);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(133);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(153);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(145);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(138);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'u') ADVANCE(136);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'y') ADVANCE(163);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(155);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(anon_sym_Assets);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(anon_sym_Assets);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(anon_sym_Expenses);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(anon_sym_Expenses);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(anon_sym_Equity);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(anon_sym_Equity);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(anon_sym_Income);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(anon_sym_Income);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(155);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(anon_sym_txn);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(anon_sym_BANG);
      END_STATE();
    case 168:
      ACCEPT_TOKEN(anon_sym_STAR);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(anon_sym_POUND);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(202);
      END_STATE();
    case 170:
      ACCEPT_TOKEN(sym_date);
      END_STATE();
    case 171:
      ACCEPT_TOKEN(sym_currency);
      END_STATE();
    case 172:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(89);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(193);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(172);
      END_STATE();
    case 174:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(65);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(175);
      END_STATE();
    case 175:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(173);
      END_STATE();
    case 176:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(67);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(177);
      END_STATE();
    case 177:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(64);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(174);
      END_STATE();
    case 178:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(69);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(179);
      END_STATE();
    case 179:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(66);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(176);
      END_STATE();
    case 180:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(71);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(181);
      END_STATE();
    case 181:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(68);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(178);
      END_STATE();
    case 182:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(73);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(183);
      END_STATE();
    case 183:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(70);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(180);
      END_STATE();
    case 184:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(75);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(185);
      END_STATE();
    case 185:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(72);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(182);
      END_STATE();
    case 186:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(77);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(187);
      END_STATE();
    case 187:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(74);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(184);
      END_STATE();
    case 188:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(79);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(189);
      END_STATE();
    case 189:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(76);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(186);
      END_STATE();
    case 190:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(81);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(191);
      END_STATE();
    case 191:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(78);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(188);
      END_STATE();
    case 192:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(80);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(190);
      END_STATE();
    case 193:
      ACCEPT_TOKEN(sym_currency);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(171);
      END_STATE();
    case 194:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '-') ADVANCE(87);
      if (lookahead == '.') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(198);
      END_STATE();
    case 195:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(194);
      END_STATE();
    case 196:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(195);
      END_STATE();
    case 197:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(196);
      END_STATE();
    case 198:
      ACCEPT_TOKEN(sym_decimal);
      if (lookahead == '.') ADVANCE(84);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(198);
      END_STATE();
    case 199:
      ACCEPT_TOKEN(sym_decimal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(199);
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
      ACCEPT_TOKEN(sym_comment);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(203);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 91},
  [3] = {.lex_state = 0},
  [4] = {.lex_state = 0},
  [5] = {.lex_state = 91},
  [6] = {.lex_state = 91},
  [7] = {.lex_state = 91},
  [8] = {.lex_state = 91},
  [9] = {.lex_state = 91},
  [10] = {.lex_state = 91},
  [11] = {.lex_state = 91},
  [12] = {.lex_state = 91},
  [13] = {.lex_state = 91},
  [14] = {.lex_state = 91},
  [15] = {.lex_state = 91},
  [16] = {.lex_state = 91},
  [17] = {.lex_state = 91},
  [18] = {.lex_state = 0},
  [19] = {.lex_state = 91},
  [20] = {.lex_state = 91},
  [21] = {.lex_state = 91},
  [22] = {.lex_state = 91},
  [23] = {.lex_state = 91},
  [24] = {.lex_state = 91},
  [25] = {.lex_state = 91},
  [26] = {.lex_state = 91},
  [27] = {.lex_state = 91},
  [28] = {.lex_state = 0},
  [29] = {.lex_state = 0},
  [30] = {.lex_state = 0},
  [31] = {.lex_state = 0},
  [32] = {.lex_state = 0},
  [33] = {.lex_state = 0},
  [34] = {.lex_state = 0},
  [35] = {.lex_state = 83},
  [36] = {.lex_state = 91},
  [37] = {.lex_state = 91},
  [38] = {.lex_state = 0},
  [39] = {.lex_state = 0},
  [40] = {.lex_state = 91},
  [41] = {.lex_state = 0},
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
  },
  [1] = {
    [sym_file] = STATE(32),
    [sym_directive] = STATE(4),
    [sym_open_directive] = STATE(8),
    [sym_close_directive] = STATE(8),
    [sym_price_directive] = STATE(8),
    [sym_note_directive] = STATE(8),
    [sym_document_directive] = STATE(8),
    [sym_event_directive] = STATE(8),
    [aux_sym_file_repeat1] = STATE(4),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_date] = ACTIONS(5),
    [sym_comment] = ACTIONS(7),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 5,
    ACTIONS(13), 1,
      sym_decimal,
    STATE(26), 1,
      sym_account_name,
    STATE(28), 1,
      sym_account_type,
    ACTIONS(11), 4,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [23] = 5,
    ACTIONS(15), 1,
      ts_builtin_sym_end,
    ACTIONS(17), 1,
      sym_date,
    ACTIONS(20), 1,
      sym_comment,
    STATE(3), 2,
      sym_directive,
      aux_sym_file_repeat1,
    STATE(8), 6,
      sym_open_directive,
      sym_close_directive,
      sym_price_directive,
      sym_note_directive,
      sym_document_directive,
      sym_event_directive,
  [45] = 5,
    ACTIONS(5), 1,
      sym_date,
    ACTIONS(23), 1,
      ts_builtin_sym_end,
    ACTIONS(25), 1,
      sym_comment,
    STATE(3), 2,
      sym_directive,
      aux_sym_file_repeat1,
    STATE(8), 6,
      sym_open_directive,
      sym_close_directive,
      sym_price_directive,
      sym_note_directive,
      sym_document_directive,
      sym_event_directive,
  [67] = 2,
    ACTIONS(29), 1,
      sym_decimal,
    ACTIONS(27), 9,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
      sym_date,
      sym_currency,
      sym_str,
      sym_tag,
  [82] = 3,
    ACTIONS(33), 1,
      anon_sym_COLON,
    STATE(6), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(31), 6,
      ts_builtin_sym_end,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_str,
      sym_comment,
  [97] = 3,
    ACTIONS(38), 1,
      anon_sym_COLON,
    STATE(6), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(36), 6,
      ts_builtin_sym_end,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_str,
      sym_comment,
  [112] = 4,
    ACTIONS(42), 1,
      aux_sym_metadata_key_token1,
    STATE(29), 1,
      sym_metadata_key,
    STATE(14), 2,
      sym_metadata,
      aux_sym_directive_repeat1,
    ACTIONS(40), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_comment,
  [128] = 3,
    STATE(21), 1,
      sym_account_name,
    STATE(28), 1,
      sym_account_type,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [142] = 3,
    STATE(22), 1,
      sym_account_name,
    STATE(28), 1,
      sym_account_type,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [156] = 3,
    STATE(28), 1,
      sym_account_type,
    STATE(31), 1,
      sym_account_name,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [170] = 3,
    STATE(28), 1,
      sym_account_type,
    STATE(30), 1,
      sym_account_name,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [184] = 1,
    ACTIONS(31), 7,
      ts_builtin_sym_end,
      anon_sym_COLON,
      sym_date,
      sym_currency,
      aux_sym_metadata_key_token1,
      sym_str,
      sym_comment,
  [194] = 4,
    ACTIONS(42), 1,
      aux_sym_metadata_key_token1,
    STATE(29), 1,
      sym_metadata_key,
    STATE(15), 2,
      sym_metadata,
      aux_sym_directive_repeat1,
    ACTIONS(44), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_comment,
  [210] = 4,
    ACTIONS(48), 1,
      aux_sym_metadata_key_token1,
    STATE(29), 1,
      sym_metadata_key,
    STATE(15), 2,
      sym_metadata,
      aux_sym_directive_repeat1,
    ACTIONS(46), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_comment,
  [226] = 3,
    ACTIONS(53), 1,
      anon_sym_COMMA,
    STATE(19), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(51), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [239] = 3,
    ACTIONS(53), 1,
      anon_sym_COMMA,
    STATE(16), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(55), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [252] = 6,
    ACTIONS(57), 1,
      anon_sym_open,
    ACTIONS(59), 1,
      anon_sym_event,
    ACTIONS(61), 1,
      anon_sym_close,
    ACTIONS(63), 1,
      anon_sym_price,
    ACTIONS(65), 1,
      anon_sym_note,
    ACTIONS(67), 1,
      anon_sym_document,
  [271] = 3,
    ACTIONS(71), 1,
      anon_sym_COMMA,
    STATE(19), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(69), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [284] = 1,
    ACTIONS(69), 5,
      ts_builtin_sym_end,
      anon_sym_COMMA,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [292] = 2,
    ACTIONS(76), 1,
      sym_currency,
    ACTIONS(74), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [302] = 1,
    ACTIONS(78), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [309] = 1,
    ACTIONS(80), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [316] = 1,
    ACTIONS(82), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [323] = 1,
    ACTIONS(84), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [330] = 1,
    ACTIONS(86), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [337] = 1,
    ACTIONS(88), 4,
      ts_builtin_sym_end,
      sym_date,
      aux_sym_metadata_key_token1,
      sym_comment,
  [344] = 2,
    ACTIONS(38), 1,
      anon_sym_COLON,
    STATE(7), 1,
      aux_sym_account_name_repeat1,
  [351] = 2,
    ACTIONS(90), 1,
      anon_sym_COLON,
    STATE(2), 1,
      sym_colon,
  [358] = 1,
    ACTIONS(92), 1,
      sym_str,
  [362] = 1,
    ACTIONS(94), 1,
      sym_str,
  [366] = 1,
    ACTIONS(96), 1,
      ts_builtin_sym_end,
  [370] = 1,
    ACTIONS(98), 1,
      sym_decimal,
  [374] = 1,
    ACTIONS(100), 1,
      sym_str,
  [378] = 1,
    ACTIONS(102), 1,
      aux_sym_account_name_token1,
  [382] = 1,
    ACTIONS(104), 1,
      sym_currency,
  [386] = 1,
    ACTIONS(106), 1,
      sym_currency,
  [390] = 1,
    ACTIONS(108), 1,
      anon_sym_COLON,
  [394] = 1,
    ACTIONS(110), 1,
      anon_sym_COLON,
  [398] = 1,
    ACTIONS(112), 1,
      sym_currency,
  [402] = 1,
    ACTIONS(114), 1,
      sym_str,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 23,
  [SMALL_STATE(4)] = 45,
  [SMALL_STATE(5)] = 67,
  [SMALL_STATE(6)] = 82,
  [SMALL_STATE(7)] = 97,
  [SMALL_STATE(8)] = 112,
  [SMALL_STATE(9)] = 128,
  [SMALL_STATE(10)] = 142,
  [SMALL_STATE(11)] = 156,
  [SMALL_STATE(12)] = 170,
  [SMALL_STATE(13)] = 184,
  [SMALL_STATE(14)] = 194,
  [SMALL_STATE(15)] = 210,
  [SMALL_STATE(16)] = 226,
  [SMALL_STATE(17)] = 239,
  [SMALL_STATE(18)] = 252,
  [SMALL_STATE(19)] = 271,
  [SMALL_STATE(20)] = 284,
  [SMALL_STATE(21)] = 292,
  [SMALL_STATE(22)] = 302,
  [SMALL_STATE(23)] = 309,
  [SMALL_STATE(24)] = 316,
  [SMALL_STATE(25)] = 323,
  [SMALL_STATE(26)] = 330,
  [SMALL_STATE(27)] = 337,
  [SMALL_STATE(28)] = 344,
  [SMALL_STATE(29)] = 351,
  [SMALL_STATE(30)] = 358,
  [SMALL_STATE(31)] = 362,
  [SMALL_STATE(32)] = 366,
  [SMALL_STATE(33)] = 370,
  [SMALL_STATE(34)] = 374,
  [SMALL_STATE(35)] = 378,
  [SMALL_STATE(36)] = 382,
  [SMALL_STATE(37)] = 386,
  [SMALL_STATE(38)] = 390,
  [SMALL_STATE(39)] = 394,
  [SMALL_STATE(40)] = 398,
  [SMALL_STATE(41)] = 402,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(4),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [11] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(26),
  [15] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2),
  [17] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(18),
  [20] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(3),
  [23] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 1),
  [25] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [27] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_colon, 1),
  [29] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_colon, 1),
  [31] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [33] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(35),
  [36] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_name, 2),
  [38] = {.entry = {.count = 1, .reusable = true}}, SHIFT(35),
  [40] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 1),
  [42] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [44] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 2),
  [46] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2),
  [48] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_directive_repeat1, 2), SHIFT_REPEAT(39),
  [51] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 5, .production_id = 8),
  [53] = {.entry = {.count = 1, .reusable = true}}, SHIFT(37),
  [55] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 4, .production_id = 3),
  [57] = {.entry = {.count = 1, .reusable = true}}, SHIFT(9),
  [59] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [61] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [63] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [65] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [67] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [69] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [71] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2), SHIFT_REPEAT(37),
  [74] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 3, .production_id = 2),
  [76] = {.entry = {.count = 1, .reusable = true}}, SHIFT(17),
  [78] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_close_directive, 3, .production_id = 2),
  [80] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_event_directive, 4, .production_id = 4),
  [82] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_note_directive, 4, .production_id = 5),
  [84] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_document_directive, 4, .production_id = 6),
  [86] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata, 3, .production_id = 7),
  [88] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_price_directive, 5, .production_id = 9),
  [90] = {.entry = {.count = 1, .reusable = true}}, SHIFT(5),
  [92] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [94] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [96] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [98] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [100] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [102] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [104] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [106] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [108] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_type, 1),
  [110] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_metadata_key, 1, .production_id = 1),
  [112] = {.entry = {.count = 1, .reusable = true}}, SHIFT(33),
  [114] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
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

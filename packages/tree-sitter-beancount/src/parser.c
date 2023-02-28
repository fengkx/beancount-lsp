#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 22
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 23
#define ALIAS_COUNT 0
#define TOKEN_COUNT 14
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 4
#define MAX_ALIAS_SEQUENCE_LENGTH 5
#define PRODUCTION_ID_COUNT 4

enum {
  anon_sym_open = 1,
  anon_sym_COMMA = 2,
  anon_sym_close = 3,
  anon_sym_COLON = 4,
  aux_sym_account_name_token1 = 5,
  anon_sym_Assets = 6,
  anon_sym_Expenses = 7,
  anon_sym_Liabilities = 8,
  anon_sym_Equity = 9,
  anon_sym_Income = 10,
  sym_date = 11,
  sym_currency = 12,
  sym_new_line = 13,
  sym_file = 14,
  sym_directive = 15,
  sym_open_directive = 16,
  sym_close_directive = 17,
  sym_account_name = 18,
  sym_account_type = 19,
  aux_sym_file_repeat1 = 20,
  aux_sym_open_directive_repeat1 = 21,
  aux_sym_account_name_repeat1 = 22,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [anon_sym_open] = "open",
  [anon_sym_COMMA] = ",",
  [anon_sym_close] = "close",
  [anon_sym_COLON] = ":",
  [aux_sym_account_name_token1] = "account_name_token1",
  [anon_sym_Assets] = "Assets",
  [anon_sym_Expenses] = "Expenses",
  [anon_sym_Liabilities] = "Liabilities",
  [anon_sym_Equity] = "Equity",
  [anon_sym_Income] = "Income",
  [sym_date] = "date",
  [sym_currency] = "currency",
  [sym_new_line] = "new_line",
  [sym_file] = "file",
  [sym_directive] = "directive",
  [sym_open_directive] = "open_directive",
  [sym_close_directive] = "close_directive",
  [sym_account_name] = "account_name",
  [sym_account_type] = "account_type",
  [aux_sym_file_repeat1] = "file_repeat1",
  [aux_sym_open_directive_repeat1] = "open_directive_repeat1",
  [aux_sym_account_name_repeat1] = "account_name_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [anon_sym_open] = anon_sym_open,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [anon_sym_close] = anon_sym_close,
  [anon_sym_COLON] = anon_sym_COLON,
  [aux_sym_account_name_token1] = aux_sym_account_name_token1,
  [anon_sym_Assets] = anon_sym_Assets,
  [anon_sym_Expenses] = anon_sym_Expenses,
  [anon_sym_Liabilities] = anon_sym_Liabilities,
  [anon_sym_Equity] = anon_sym_Equity,
  [anon_sym_Income] = anon_sym_Income,
  [sym_date] = sym_date,
  [sym_currency] = sym_currency,
  [sym_new_line] = sym_new_line,
  [sym_file] = sym_file,
  [sym_directive] = sym_directive,
  [sym_open_directive] = sym_open_directive,
  [sym_close_directive] = sym_close_directive,
  [sym_account_name] = sym_account_name,
  [sym_account_type] = sym_account_type,
  [aux_sym_file_repeat1] = aux_sym_file_repeat1,
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
  [anon_sym_COMMA] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_close] = {
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
  [sym_date] = {
    .visible = true,
    .named = true,
  },
  [sym_currency] = {
    .visible = true,
    .named = true,
  },
  [sym_new_line] = {
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
  [sym_account_name] = {
    .visible = true,
    .named = true,
  },
  [sym_account_type] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_file_repeat1] = {
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
  field_currencies = 2,
  field_date = 3,
  field_directive_type = 4,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_account_name] = "account_name",
  [field_currencies] = "currencies",
  [field_date] = "date",
  [field_directive_type] = "directive_type",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 3},
  [2] = {.index = 3, .length = 4},
  [3] = {.index = 7, .length = 5},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_account_name, 2},
    {field_date, 0},
    {field_directive_type, 1},
  [3] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_date, 0},
    {field_directive_type, 1},
  [7] =
    {field_account_name, 2},
    {field_currencies, 3},
    {field_currencies, 4},
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
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(73);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (lookahead == '\n') ADVANCE(167);
      if (lookahead == ',') ADVANCE(75);
      if (lookahead == ':') ADVANCE(77);
      if (lookahead == 'A') ADVANCE(102);
      if (lookahead == 'E') ADVANCE(101);
      if (lookahead == 'I') ADVANCE(100);
      if (lookahead == 'L') ADVANCE(99);
      if (lookahead == 'c') ADVANCE(18);
      if (lookahead == 'o') ADVANCE(26);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(68);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(103);
      END_STATE();
    case 1:
      if (lookahead == '-') ADVANCE(67);
      END_STATE();
    case 2:
      if (lookahead == '-') ADVANCE(70);
      END_STATE();
    case 3:
      if (lookahead == 'a') ADVANCE(4);
      END_STATE();
    case 4:
      if (lookahead == 'b') ADVANCE(14);
      END_STATE();
    case 5:
      if (lookahead == 'c') ADVANCE(25);
      END_STATE();
    case 6:
      if (lookahead == 'e') ADVANCE(21);
      END_STATE();
    case 7:
      if (lookahead == 'e') ADVANCE(76);
      END_STATE();
    case 8:
      if (lookahead == 'e') ADVANCE(37);
      END_STATE();
    case 9:
      if (lookahead == 'e') ADVANCE(141);
      END_STATE();
    case 10:
      if (lookahead == 'e') ADVANCE(23);
      END_STATE();
    case 11:
      if (lookahead == 'e') ADVANCE(30);
      END_STATE();
    case 12:
      if (lookahead == 'e') ADVANCE(31);
      END_STATE();
    case 13:
      if (lookahead == 'i') ADVANCE(3);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 14:
      if (lookahead == 'i') ADVANCE(19);
      END_STATE();
    case 15:
      if (lookahead == 'i') ADVANCE(36);
      END_STATE();
    case 16:
      if (lookahead == 'i') ADVANCE(38);
      END_STATE();
    case 17:
      if (lookahead == 'i') ADVANCE(12);
      END_STATE();
    case 18:
      if (lookahead == 'l') ADVANCE(24);
      END_STATE();
    case 19:
      if (lookahead == 'l') ADVANCE(16);
      END_STATE();
    case 20:
      if (lookahead == 'm') ADVANCE(9);
      END_STATE();
    case 21:
      if (lookahead == 'n') ADVANCE(74);
      END_STATE();
    case 22:
      if (lookahead == 'n') ADVANCE(5);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 23:
      if (lookahead == 'n') ADVANCE(34);
      END_STATE();
    case 24:
      if (lookahead == 'o') ADVANCE(32);
      END_STATE();
    case 25:
      if (lookahead == 'o') ADVANCE(20);
      END_STATE();
    case 26:
      if (lookahead == 'p') ADVANCE(6);
      END_STATE();
    case 27:
      if (lookahead == 'p') ADVANCE(10);
      END_STATE();
    case 28:
      if (lookahead == 'q') ADVANCE(39);
      if (lookahead == 'x') ADVANCE(27);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 29:
      if (lookahead == 's') ADVANCE(133);
      END_STATE();
    case 30:
      if (lookahead == 's') ADVANCE(135);
      END_STATE();
    case 31:
      if (lookahead == 's') ADVANCE(137);
      END_STATE();
    case 32:
      if (lookahead == 's') ADVANCE(7);
      END_STATE();
    case 33:
      if (lookahead == 's') ADVANCE(8);
      END_STATE();
    case 34:
      if (lookahead == 's') ADVANCE(11);
      END_STATE();
    case 35:
      if (lookahead == 's') ADVANCE(33);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 36:
      if (lookahead == 't') ADVANCE(40);
      END_STATE();
    case 37:
      if (lookahead == 't') ADVANCE(29);
      END_STATE();
    case 38:
      if (lookahead == 't') ADVANCE(17);
      END_STATE();
    case 39:
      if (lookahead == 'u') ADVANCE(15);
      END_STATE();
    case 40:
      if (lookahead == 'y') ADVANCE(139);
      END_STATE();
    case 41:
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(41)
      if (('A' <= lookahead && lookahead <= 'Z')) ADVANCE(132);
      END_STATE();
    case 42:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(165);
      END_STATE();
    case 43:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(71);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(166);
      END_STATE();
    case 44:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(43);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(145);
      END_STATE();
    case 45:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(148);
      END_STATE();
    case 46:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(146);
      END_STATE();
    case 47:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(150);
      END_STATE();
    case 48:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(147);
      END_STATE();
    case 49:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(152);
      END_STATE();
    case 50:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(149);
      END_STATE();
    case 51:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(154);
      END_STATE();
    case 52:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(151);
      END_STATE();
    case 53:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(156);
      END_STATE();
    case 54:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(153);
      END_STATE();
    case 55:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(158);
      END_STATE();
    case 56:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(155);
      END_STATE();
    case 57:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(160);
      END_STATE();
    case 58:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(157);
      END_STATE();
    case 59:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(162);
      END_STATE();
    case 60:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(159);
      END_STATE();
    case 61:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(164);
      END_STATE();
    case 62:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(161);
      END_STATE();
    case 63:
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(61);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(163);
      END_STATE();
    case 64:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(2);
      END_STATE();
    case 65:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(143);
      END_STATE();
    case 66:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(64);
      END_STATE();
    case 67:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(65);
      END_STATE();
    case 68:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(66);
      END_STATE();
    case 69:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(1);
      END_STATE();
    case 70:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(69);
      END_STATE();
    case 71:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 72:
      if (eof) ADVANCE(73);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(72)
      if (lookahead == '\n') ADVANCE(167);
      if (lookahead == ':') ADVANCE(77);
      if (lookahead == 'A') ADVANCE(35);
      if (lookahead == 'E') ADVANCE(28);
      if (lookahead == 'I') ADVANCE(22);
      if (lookahead == 'L') ADVANCE(13);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(68);
      if (('B' <= lookahead && lookahead <= 'Z')) ADVANCE(42);
      END_STATE();
    case 73:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 74:
      ACCEPT_TOKEN(anon_sym_open);
      END_STATE();
    case 75:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 76:
      ACCEPT_TOKEN(anon_sym_close);
      END_STATE();
    case 77:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 78:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(131);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(71);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(131);
      END_STATE();
    case 79:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(78);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(43);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(78);
      END_STATE();
    case 80:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(79);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(79);
      END_STATE();
    case 81:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(82);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(82);
      END_STATE();
    case 82:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(80);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(80);
      END_STATE();
    case 83:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(84);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(84);
      END_STATE();
    case 84:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(81);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(81);
      END_STATE();
    case 85:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(86);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(86);
      END_STATE();
    case 86:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(83);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(83);
      END_STATE();
    case 87:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(88);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(88);
      END_STATE();
    case 88:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(85);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(85);
      END_STATE();
    case 89:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(90);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(90);
      END_STATE();
    case 90:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(87);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(87);
      END_STATE();
    case 91:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(92);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(92);
      END_STATE();
    case 92:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(89);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(89);
      END_STATE();
    case 93:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(94);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(94);
      END_STATE();
    case 94:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(91);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(91);
      END_STATE();
    case 95:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(96);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(96);
      END_STATE();
    case 96:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(93);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(60);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(93);
      END_STATE();
    case 97:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(98);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(61);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(98);
      END_STATE();
    case 98:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(95);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(95);
      END_STATE();
    case 99:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == 'i') ADVANCE(104);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 100:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == 'n') ADVANCE(106);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 101:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == 'q') ADVANCE(129);
      if (lookahead == 'x') ADVANCE(120);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == 's') ADVANCE(121);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-') ADVANCE(97);
      if (lookahead == '\'' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(63);
      if (('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(97);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'a') ADVANCE(105);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('b' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'b') ADVANCE(112);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'c') ADVANCE(119);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(127);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(118);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(142);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(123);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'e') ADVANCE(124);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(116);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(126);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(128);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'i') ADVANCE(111);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'l') ADVANCE(114);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'm') ADVANCE(109);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'n') ADVANCE(125);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'o') ADVANCE(117);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'p') ADVANCE(108);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(107);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(134);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(136);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(138);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 's') ADVANCE(110);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(130);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(122);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 't') ADVANCE(115);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'u') ADVANCE(113);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == 'y') ADVANCE(140);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(132);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(aux_sym_account_name_token1);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(anon_sym_Assets);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(anon_sym_Assets);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(anon_sym_Expenses);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(anon_sym_Expenses);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_Liabilities);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_Equity);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(anon_sym_Equity);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_Income);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(anon_sym_Income);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(132);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(sym_date);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(sym_currency);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(71);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(166);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(43);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(145);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(46);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(148);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(44);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(146);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(48);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(150);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(45);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(147);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(50);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(152);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(47);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(149);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(52);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(154);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(49);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(151);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(54);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(156);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(51);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(153);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(56);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(158);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(53);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(155);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(58);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(160);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(55);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(157);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(60);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(162);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(57);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(159);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(62);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(164);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(59);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(161);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(sym_currency);
      if (lookahead == '\'' ||
          lookahead == '-' ||
          lookahead == '.' ||
          lookahead == '_') ADVANCE(61);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(163);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(sym_currency);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z')) ADVANCE(144);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(sym_new_line);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 72},
  [3] = {.lex_state = 72},
  [4] = {.lex_state = 0},
  [5] = {.lex_state = 0},
  [6] = {.lex_state = 72},
  [7] = {.lex_state = 72},
  [8] = {.lex_state = 0},
  [9] = {.lex_state = 0},
  [10] = {.lex_state = 72},
  [11] = {.lex_state = 0},
  [12] = {.lex_state = 72},
  [13] = {.lex_state = 0},
  [14] = {.lex_state = 0},
  [15] = {.lex_state = 0},
  [16] = {.lex_state = 0},
  [17] = {.lex_state = 0},
  [18] = {.lex_state = 0},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 41},
  [21] = {.lex_state = 72},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [anon_sym_open] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [anon_sym_close] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [aux_sym_account_name_token1] = ACTIONS(1),
    [anon_sym_Assets] = ACTIONS(1),
    [anon_sym_Expenses] = ACTIONS(1),
    [anon_sym_Liabilities] = ACTIONS(1),
    [anon_sym_Equity] = ACTIONS(1),
    [anon_sym_Income] = ACTIONS(1),
    [sym_date] = ACTIONS(1),
    [sym_currency] = ACTIONS(1),
    [sym_new_line] = ACTIONS(1),
  },
  [1] = {
    [sym_file] = STATE(18),
    [sym_directive] = STATE(5),
    [sym_open_directive] = STATE(14),
    [sym_close_directive] = STATE(14),
    [aux_sym_file_repeat1] = STATE(5),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_date] = ACTIONS(5),
    [sym_new_line] = ACTIONS(7),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 3,
    STATE(12), 1,
      sym_account_name,
    STATE(16), 1,
      sym_account_type,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [14] = 3,
    STATE(15), 1,
      sym_account_name,
    STATE(16), 1,
      sym_account_type,
    ACTIONS(9), 5,
      anon_sym_Assets,
      anon_sym_Expenses,
      anon_sym_Liabilities,
      anon_sym_Equity,
      anon_sym_Income,
  [28] = 5,
    ACTIONS(11), 1,
      ts_builtin_sym_end,
    ACTIONS(13), 1,
      sym_date,
    ACTIONS(16), 1,
      sym_new_line,
    STATE(4), 2,
      sym_directive,
      aux_sym_file_repeat1,
    STATE(14), 2,
      sym_open_directive,
      sym_close_directive,
  [46] = 5,
    ACTIONS(5), 1,
      sym_date,
    ACTIONS(19), 1,
      ts_builtin_sym_end,
    ACTIONS(21), 1,
      sym_new_line,
    STATE(4), 2,
      sym_directive,
      aux_sym_file_repeat1,
    STATE(14), 2,
      sym_open_directive,
      sym_close_directive,
  [64] = 3,
    ACTIONS(25), 1,
      anon_sym_COLON,
    STATE(7), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(23), 4,
      ts_builtin_sym_end,
      sym_date,
      sym_currency,
      sym_new_line,
  [77] = 3,
    ACTIONS(29), 1,
      anon_sym_COLON,
    STATE(7), 1,
      aux_sym_account_name_repeat1,
    ACTIONS(27), 4,
      ts_builtin_sym_end,
      sym_date,
      sym_currency,
      sym_new_line,
  [90] = 3,
    ACTIONS(34), 1,
      anon_sym_COMMA,
    STATE(9), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(32), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_new_line,
  [102] = 3,
    ACTIONS(34), 1,
      anon_sym_COMMA,
    STATE(11), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(36), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_new_line,
  [114] = 1,
    ACTIONS(27), 5,
      ts_builtin_sym_end,
      anon_sym_COLON,
      sym_date,
      sym_currency,
      sym_new_line,
  [122] = 3,
    ACTIONS(40), 1,
      anon_sym_COMMA,
    STATE(11), 1,
      aux_sym_open_directive_repeat1,
    ACTIONS(38), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_new_line,
  [134] = 2,
    ACTIONS(45), 1,
      sym_currency,
    ACTIONS(43), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_new_line,
  [143] = 1,
    ACTIONS(38), 4,
      ts_builtin_sym_end,
      anon_sym_COMMA,
      sym_date,
      sym_new_line,
  [150] = 1,
    ACTIONS(47), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_new_line,
  [156] = 1,
    ACTIONS(49), 3,
      ts_builtin_sym_end,
      sym_date,
      sym_new_line,
  [162] = 2,
    ACTIONS(25), 1,
      anon_sym_COLON,
    STATE(6), 1,
      aux_sym_account_name_repeat1,
  [169] = 2,
    ACTIONS(51), 1,
      anon_sym_open,
    ACTIONS(53), 1,
      anon_sym_close,
  [176] = 1,
    ACTIONS(55), 1,
      ts_builtin_sym_end,
  [180] = 1,
    ACTIONS(57), 1,
      anon_sym_COLON,
  [184] = 1,
    ACTIONS(59), 1,
      aux_sym_account_name_token1,
  [188] = 1,
    ACTIONS(61), 1,
      sym_currency,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 14,
  [SMALL_STATE(4)] = 28,
  [SMALL_STATE(5)] = 46,
  [SMALL_STATE(6)] = 64,
  [SMALL_STATE(7)] = 77,
  [SMALL_STATE(8)] = 90,
  [SMALL_STATE(9)] = 102,
  [SMALL_STATE(10)] = 114,
  [SMALL_STATE(11)] = 122,
  [SMALL_STATE(12)] = 134,
  [SMALL_STATE(13)] = 143,
  [SMALL_STATE(14)] = 150,
  [SMALL_STATE(15)] = 156,
  [SMALL_STATE(16)] = 162,
  [SMALL_STATE(17)] = 169,
  [SMALL_STATE(18)] = 176,
  [SMALL_STATE(19)] = 180,
  [SMALL_STATE(20)] = 184,
  [SMALL_STATE(21)] = 188,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(17),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(5),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(19),
  [11] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2),
  [13] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(17),
  [16] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_file_repeat1, 2), SHIFT_REPEAT(4),
  [19] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_file, 1),
  [21] = {.entry = {.count = 1, .reusable = true}}, SHIFT(4),
  [23] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_name, 2),
  [25] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [27] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2),
  [29] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_account_name_repeat1, 2), SHIFT_REPEAT(20),
  [32] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 4, .production_id = 2),
  [34] = {.entry = {.count = 1, .reusable = true}}, SHIFT(21),
  [36] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 5, .production_id = 3),
  [38] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2),
  [40] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_open_directive_repeat1, 2), SHIFT_REPEAT(21),
  [43] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_open_directive, 3, .production_id = 1),
  [45] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [47] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_directive, 1),
  [49] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_close_directive, 3, .production_id = 1),
  [51] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [53] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [55] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [57] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_account_type, 1),
  [59] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [61] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
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

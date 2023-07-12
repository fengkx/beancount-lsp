#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 4
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 43
#define ALIAS_COUNT 0
#define TOKEN_COUNT 42
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 0
#define MAX_ALIAS_SEQUENCE_LENGTH 1
#define PRODUCTION_ID_COUNT 1

enum {
  aux_sym_comment_token1 = 1,
  aux_sym__skipped_lines_token1 = 2,
  aux_sym__skipped_lines_token3 = 3,
  anon_sym_COLON = 4,
  anon_sym_include = 5,
  anon_sym_option = 6,
  anon_sym_plugin = 7,
  anon_sym_pushtag = 8,
  anon_sym_poptag = 9,
  anon_sym_pushmeta = 10,
  anon_sym_popmeta = 11,
  anon_sym_balance = 12,
  anon_sym_close = 13,
  anon_sym_commodity = 14,
  anon_sym_custom = 15,
  anon_sym_document = 16,
  anon_sym_event = 17,
  anon_sym_note = 18,
  anon_sym_open = 19,
  anon_sym_pad = 20,
  anon_sym_price = 21,
  anon_sym_query = 22,
  anon_sym_LBRACE = 23,
  anon_sym_RBRACE = 24,
  anon_sym_LBRACE_LBRACE = 25,
  anon_sym_RBRACE_RBRACE = 26,
  anon_sym_COMMA = 27,
  anon_sym_STAR = 28,
  anon_sym_POUND = 29,
  anon_sym_AT = 30,
  anon_sym_AT_AT = 31,
  aux_sym_posting_token1 = 32,
  anon_sym_TILDE = 33,
  anon_sym_LPAREN = 34,
  anon_sym_RPAREN = 35,
  anon_sym_DASH = 36,
  anon_sym_PLUS = 37,
  anon_sym_SLASH = 38,
  sym_link = 39,
  sym_string = 40,
  sym_number = 41,
  sym_comment = 42,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [aux_sym_comment_token1] = "comment_token1",
  [aux_sym__skipped_lines_token1] = "_skipped_lines_token1",
  [aux_sym__skipped_lines_token3] = "_skipped_lines_token3",
  [anon_sym_COLON] = ":",
  [anon_sym_include] = "INCLUDE",
  [anon_sym_option] = "OPTION",
  [anon_sym_plugin] = "PLUGIN",
  [anon_sym_pushtag] = "PUSHTAG",
  [anon_sym_poptag] = "POPTAG",
  [anon_sym_pushmeta] = "PUSHMETA",
  [anon_sym_popmeta] = "POPMETA",
  [anon_sym_balance] = "BALANCE",
  [anon_sym_close] = "CLOSE",
  [anon_sym_commodity] = "COMMODITY",
  [anon_sym_custom] = "CUSTOM",
  [anon_sym_document] = "DOCUMENT",
  [anon_sym_event] = "EVENT",
  [anon_sym_note] = "NOTE",
  [anon_sym_open] = "OPEN",
  [anon_sym_pad] = "PAD",
  [anon_sym_price] = "PRICE",
  [anon_sym_query] = "QUERY",
  [anon_sym_LBRACE] = "{",
  [anon_sym_RBRACE] = "}",
  [anon_sym_LBRACE_LBRACE] = "{{",
  [anon_sym_RBRACE_RBRACE] = "}}",
  [anon_sym_COMMA] = ",",
  [anon_sym_STAR] = "*",
  [anon_sym_POUND] = "#",
  [anon_sym_AT] = "@",
  [anon_sym_AT_AT] = "@@",
  [aux_sym_posting_token1] = "posting_token1",
  [anon_sym_TILDE] = "~",
  [anon_sym_LPAREN] = "(",
  [anon_sym_RPAREN] = ")",
  [anon_sym_DASH] = "-",
  [anon_sym_PLUS] = "+",
  [anon_sym_SLASH] = "/",
  [sym_link] = "link",
  [sym_string] = "string",
  [sym_number] = "number",
  [sym_comment] = "comment",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [aux_sym_comment_token1] = aux_sym_comment_token1,
  [aux_sym__skipped_lines_token1] = aux_sym__skipped_lines_token1,
  [aux_sym__skipped_lines_token3] = aux_sym__skipped_lines_token3,
  [anon_sym_COLON] = anon_sym_COLON,
  [anon_sym_include] = anon_sym_include,
  [anon_sym_option] = anon_sym_option,
  [anon_sym_plugin] = anon_sym_plugin,
  [anon_sym_pushtag] = anon_sym_pushtag,
  [anon_sym_poptag] = anon_sym_poptag,
  [anon_sym_pushmeta] = anon_sym_pushmeta,
  [anon_sym_popmeta] = anon_sym_popmeta,
  [anon_sym_balance] = anon_sym_balance,
  [anon_sym_close] = anon_sym_close,
  [anon_sym_commodity] = anon_sym_commodity,
  [anon_sym_custom] = anon_sym_custom,
  [anon_sym_document] = anon_sym_document,
  [anon_sym_event] = anon_sym_event,
  [anon_sym_note] = anon_sym_note,
  [anon_sym_open] = anon_sym_open,
  [anon_sym_pad] = anon_sym_pad,
  [anon_sym_price] = anon_sym_price,
  [anon_sym_query] = anon_sym_query,
  [anon_sym_LBRACE] = anon_sym_LBRACE,
  [anon_sym_RBRACE] = anon_sym_RBRACE,
  [anon_sym_LBRACE_LBRACE] = anon_sym_LBRACE_LBRACE,
  [anon_sym_RBRACE_RBRACE] = anon_sym_RBRACE_RBRACE,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [anon_sym_STAR] = anon_sym_STAR,
  [anon_sym_POUND] = anon_sym_POUND,
  [anon_sym_AT] = anon_sym_AT,
  [anon_sym_AT_AT] = anon_sym_AT_AT,
  [aux_sym_posting_token1] = aux_sym_posting_token1,
  [anon_sym_TILDE] = anon_sym_TILDE,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [anon_sym_DASH] = anon_sym_DASH,
  [anon_sym_PLUS] = anon_sym_PLUS,
  [anon_sym_SLASH] = anon_sym_SLASH,
  [sym_link] = sym_link,
  [sym_string] = sym_string,
  [sym_number] = sym_number,
  [sym_comment] = sym_comment,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [aux_sym_comment_token1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym__skipped_lines_token1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym__skipped_lines_token3] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_include] = {
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
  [anon_sym_pushtag] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_poptag] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_pushmeta] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_popmeta] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_balance] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_close] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_commodity] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_custom] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_document] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_event] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_note] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_open] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_pad] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_price] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_query] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LBRACE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RBRACE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LBRACE_LBRACE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RBRACE_RBRACE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COMMA] = {
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
  [anon_sym_AT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AT_AT] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_posting_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_TILDE] = {
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
  [sym_link] = {
    .visible = true,
    .named = true,
  },
  [sym_string] = {
    .visible = true,
    .named = true,
  },
  [sym_number] = {
    .visible = true,
    .named = true,
  },
  [sym_comment] = {
    .visible = true,
    .named = true,
  },
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
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(79);
      if (lookahead == '\n') ADVANCE(83);
      if (lookahead == '"') ADVANCE(1);
      if (lookahead == '#') ADVANCE(109);
      if (lookahead == '(') ADVANCE(114);
      if (lookahead == ')') ADVANCE(115);
      if (lookahead == '*') ADVANCE(108);
      if (lookahead == '+') ADVANCE(117);
      if (lookahead == ',') ADVANCE(107);
      if (lookahead == '-') ADVANCE(116);
      if (lookahead == '/') ADVANCE(118);
      if (lookahead == ':') ADVANCE(84);
      if (lookahead == ';') ADVANCE(80);
      if (lookahead == '@') ADVANCE(110);
      if (lookahead == '^') ADVANCE(78);
      if (lookahead == 'b') ADVANCE(3);
      if (lookahead == 'c') ADVANCE(37);
      if (lookahead == 'd') ADVANCE(52);
      if (lookahead == 'e') ADVANCE(75);
      if (lookahead == 'i') ADVANCE(48);
      if (lookahead == 'n') ADVANCE(53);
      if (lookahead == 'o') ADVANCE(58);
      if (lookahead == 'p') ADVANCE(4);
      if (lookahead == 'q') ADVANCE(72);
      if (lookahead == '{') ADVANCE(103);
      if (lookahead == '}') ADVANCE(104);
      if (lookahead == '~') ADVANCE(113);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(121);
      if (lookahead == '!' ||
          lookahead == '%' ||
          lookahead == '&' ||
          lookahead == '?' ||
          lookahead == 'C' ||
          lookahead == 'M' ||
          lookahead == 'P' ||
          ('R' <= lookahead && lookahead <= 'U')) ADVANCE(81);
      END_STATE();
    case 1:
      if (lookahead == '"') ADVANCE(120);
      if (lookahead != 0) ADVANCE(1);
      END_STATE();
    case 2:
      if (lookahead == ',') ADVANCE(2);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(121);
      END_STATE();
    case 3:
      if (lookahead == 'a') ADVANCE(36);
      END_STATE();
    case 4:
      if (lookahead == 'a') ADVANCE(14);
      if (lookahead == 'l') ADVANCE(71);
      if (lookahead == 'o') ADVANCE(59);
      if (lookahead == 'r') ADVANCE(32);
      if (lookahead == 'u') ADVANCE(61);
      END_STATE();
    case 5:
      if (lookahead == 'a') ADVANCE(91);
      END_STATE();
    case 6:
      if (lookahead == 'a') ADVANCE(90);
      END_STATE();
    case 7:
      if (lookahead == 'a') ADVANCE(28);
      END_STATE();
    case 8:
      if (lookahead == 'a') ADVANCE(29);
      END_STATE();
    case 9:
      if (lookahead == 'a') ADVANCE(51);
      END_STATE();
    case 10:
      if (lookahead == 'c') ADVANCE(38);
      END_STATE();
    case 11:
      if (lookahead == 'c') ADVANCE(73);
      END_STATE();
    case 12:
      if (lookahead == 'c') ADVANCE(20);
      END_STATE();
    case 13:
      if (lookahead == 'c') ADVANCE(21);
      END_STATE();
    case 14:
      if (lookahead == 'd') ADVANCE(100);
      END_STATE();
    case 15:
      if (lookahead == 'd') ADVANCE(34);
      END_STATE();
    case 16:
      if (lookahead == 'd') ADVANCE(22);
      END_STATE();
    case 17:
      if (lookahead == 'e') ADVANCE(60);
      END_STATE();
    case 18:
      if (lookahead == 'e') ADVANCE(98);
      END_STATE();
    case 19:
      if (lookahead == 'e') ADVANCE(93);
      END_STATE();
    case 20:
      if (lookahead == 'e') ADVANCE(101);
      END_STATE();
    case 21:
      if (lookahead == 'e') ADVANCE(92);
      END_STATE();
    case 22:
      if (lookahead == 'e') ADVANCE(85);
      END_STATE();
    case 23:
      if (lookahead == 'e') ADVANCE(49);
      END_STATE();
    case 24:
      if (lookahead == 'e') ADVANCE(45);
      if (lookahead == 't') ADVANCE(35);
      END_STATE();
    case 25:
      if (lookahead == 'e') ADVANCE(68);
      END_STATE();
    case 26:
      if (lookahead == 'e') ADVANCE(50);
      END_STATE();
    case 27:
      if (lookahead == 'e') ADVANCE(70);
      END_STATE();
    case 28:
      if (lookahead == 'g') ADVANCE(89);
      END_STATE();
    case 29:
      if (lookahead == 'g') ADVANCE(88);
      END_STATE();
    case 30:
      if (lookahead == 'g') ADVANCE(33);
      END_STATE();
    case 31:
      if (lookahead == 'h') ADVANCE(43);
      END_STATE();
    case 32:
      if (lookahead == 'i') ADVANCE(12);
      END_STATE();
    case 33:
      if (lookahead == 'i') ADVANCE(47);
      END_STATE();
    case 34:
      if (lookahead == 'i') ADVANCE(66);
      END_STATE();
    case 35:
      if (lookahead == 'i') ADVANCE(56);
      END_STATE();
    case 36:
      if (lookahead == 'l') ADVANCE(9);
      END_STATE();
    case 37:
      if (lookahead == 'l') ADVANCE(55);
      if (lookahead == 'o') ADVANCE(40);
      if (lookahead == 'u') ADVANCE(62);
      END_STATE();
    case 38:
      if (lookahead == 'l') ADVANCE(74);
      END_STATE();
    case 39:
      if (lookahead == 'm') ADVANCE(95);
      END_STATE();
    case 40:
      if (lookahead == 'm') ADVANCE(41);
      END_STATE();
    case 41:
      if (lookahead == 'm') ADVANCE(54);
      END_STATE();
    case 42:
      if (lookahead == 'm') ADVANCE(25);
      if (lookahead == 't') ADVANCE(7);
      END_STATE();
    case 43:
      if (lookahead == 'm') ADVANCE(27);
      if (lookahead == 't') ADVANCE(8);
      END_STATE();
    case 44:
      if (lookahead == 'm') ADVANCE(26);
      END_STATE();
    case 45:
      if (lookahead == 'n') ADVANCE(99);
      END_STATE();
    case 46:
      if (lookahead == 'n') ADVANCE(86);
      END_STATE();
    case 47:
      if (lookahead == 'n') ADVANCE(87);
      END_STATE();
    case 48:
      if (lookahead == 'n') ADVANCE(10);
      END_STATE();
    case 49:
      if (lookahead == 'n') ADVANCE(64);
      END_STATE();
    case 50:
      if (lookahead == 'n') ADVANCE(65);
      END_STATE();
    case 51:
      if (lookahead == 'n') ADVANCE(13);
      END_STATE();
    case 52:
      if (lookahead == 'o') ADVANCE(11);
      END_STATE();
    case 53:
      if (lookahead == 'o') ADVANCE(67);
      END_STATE();
    case 54:
      if (lookahead == 'o') ADVANCE(15);
      END_STATE();
    case 55:
      if (lookahead == 'o') ADVANCE(63);
      END_STATE();
    case 56:
      if (lookahead == 'o') ADVANCE(46);
      END_STATE();
    case 57:
      if (lookahead == 'o') ADVANCE(39);
      END_STATE();
    case 58:
      if (lookahead == 'p') ADVANCE(24);
      END_STATE();
    case 59:
      if (lookahead == 'p') ADVANCE(42);
      END_STATE();
    case 60:
      if (lookahead == 'r') ADVANCE(76);
      END_STATE();
    case 61:
      if (lookahead == 's') ADVANCE(31);
      END_STATE();
    case 62:
      if (lookahead == 's') ADVANCE(69);
      END_STATE();
    case 63:
      if (lookahead == 's') ADVANCE(19);
      END_STATE();
    case 64:
      if (lookahead == 't') ADVANCE(97);
      END_STATE();
    case 65:
      if (lookahead == 't') ADVANCE(96);
      END_STATE();
    case 66:
      if (lookahead == 't') ADVANCE(77);
      END_STATE();
    case 67:
      if (lookahead == 't') ADVANCE(18);
      END_STATE();
    case 68:
      if (lookahead == 't') ADVANCE(5);
      END_STATE();
    case 69:
      if (lookahead == 't') ADVANCE(57);
      END_STATE();
    case 70:
      if (lookahead == 't') ADVANCE(6);
      END_STATE();
    case 71:
      if (lookahead == 'u') ADVANCE(30);
      END_STATE();
    case 72:
      if (lookahead == 'u') ADVANCE(17);
      END_STATE();
    case 73:
      if (lookahead == 'u') ADVANCE(44);
      END_STATE();
    case 74:
      if (lookahead == 'u') ADVANCE(16);
      END_STATE();
    case 75:
      if (lookahead == 'v') ADVANCE(23);
      END_STATE();
    case 76:
      if (lookahead == 'y') ADVANCE(102);
      END_STATE();
    case 77:
      if (lookahead == 'y') ADVANCE(94);
      END_STATE();
    case 78:
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(119);
      END_STATE();
    case 79:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 80:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(80);
      END_STATE();
    case 81:
      ACCEPT_TOKEN(aux_sym__skipped_lines_token1);
      END_STATE();
    case 82:
      ACCEPT_TOKEN(aux_sym__skipped_lines_token3);
      END_STATE();
    case 83:
      ACCEPT_TOKEN(aux_sym__skipped_lines_token3);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(112);
      END_STATE();
    case 84:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 85:
      ACCEPT_TOKEN(anon_sym_include);
      END_STATE();
    case 86:
      ACCEPT_TOKEN(anon_sym_option);
      END_STATE();
    case 87:
      ACCEPT_TOKEN(anon_sym_plugin);
      END_STATE();
    case 88:
      ACCEPT_TOKEN(anon_sym_pushtag);
      END_STATE();
    case 89:
      ACCEPT_TOKEN(anon_sym_poptag);
      END_STATE();
    case 90:
      ACCEPT_TOKEN(anon_sym_pushmeta);
      END_STATE();
    case 91:
      ACCEPT_TOKEN(anon_sym_popmeta);
      END_STATE();
    case 92:
      ACCEPT_TOKEN(anon_sym_balance);
      END_STATE();
    case 93:
      ACCEPT_TOKEN(anon_sym_close);
      END_STATE();
    case 94:
      ACCEPT_TOKEN(anon_sym_commodity);
      END_STATE();
    case 95:
      ACCEPT_TOKEN(anon_sym_custom);
      END_STATE();
    case 96:
      ACCEPT_TOKEN(anon_sym_document);
      END_STATE();
    case 97:
      ACCEPT_TOKEN(anon_sym_event);
      END_STATE();
    case 98:
      ACCEPT_TOKEN(anon_sym_note);
      END_STATE();
    case 99:
      ACCEPT_TOKEN(anon_sym_open);
      END_STATE();
    case 100:
      ACCEPT_TOKEN(anon_sym_pad);
      END_STATE();
    case 101:
      ACCEPT_TOKEN(anon_sym_price);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(anon_sym_query);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(anon_sym_LBRACE);
      if (lookahead == '{') ADVANCE(105);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(anon_sym_RBRACE);
      if (lookahead == '}') ADVANCE(106);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(anon_sym_LBRACE_LBRACE);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(anon_sym_RBRACE_RBRACE);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(anon_sym_STAR);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(anon_sym_POUND);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(anon_sym_AT);
      if (lookahead == '@') ADVANCE(111);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(anon_sym_AT_AT);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(aux_sym_posting_token1);
      if (lookahead == '\n') ADVANCE(82);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(112);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(anon_sym_TILDE);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(anon_sym_DASH);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(anon_sym_PLUS);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(anon_sym_SLASH);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(sym_link);
      if (('-' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(119);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(sym_string);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == ',') ADVANCE(2);
      if (lookahead == '.') ADVANCE(122);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(121);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(sym_number);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(122);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 0},
  [3] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [aux_sym_comment_token1] = ACTIONS(1),
    [aux_sym__skipped_lines_token1] = ACTIONS(1),
    [aux_sym__skipped_lines_token3] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [anon_sym_include] = ACTIONS(1),
    [anon_sym_option] = ACTIONS(1),
    [anon_sym_plugin] = ACTIONS(1),
    [anon_sym_pushtag] = ACTIONS(1),
    [anon_sym_poptag] = ACTIONS(1),
    [anon_sym_pushmeta] = ACTIONS(1),
    [anon_sym_popmeta] = ACTIONS(1),
    [anon_sym_balance] = ACTIONS(1),
    [anon_sym_close] = ACTIONS(1),
    [anon_sym_commodity] = ACTIONS(1),
    [anon_sym_custom] = ACTIONS(1),
    [anon_sym_document] = ACTIONS(1),
    [anon_sym_event] = ACTIONS(1),
    [anon_sym_note] = ACTIONS(1),
    [anon_sym_open] = ACTIONS(1),
    [anon_sym_pad] = ACTIONS(1),
    [anon_sym_price] = ACTIONS(1),
    [anon_sym_query] = ACTIONS(1),
    [anon_sym_LBRACE] = ACTIONS(1),
    [anon_sym_RBRACE] = ACTIONS(1),
    [anon_sym_LBRACE_LBRACE] = ACTIONS(1),
    [anon_sym_RBRACE_RBRACE] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [anon_sym_STAR] = ACTIONS(1),
    [anon_sym_POUND] = ACTIONS(1),
    [anon_sym_AT] = ACTIONS(1),
    [anon_sym_AT_AT] = ACTIONS(1),
    [aux_sym_posting_token1] = ACTIONS(1),
    [anon_sym_TILDE] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [anon_sym_DASH] = ACTIONS(1),
    [anon_sym_PLUS] = ACTIONS(1),
    [anon_sym_SLASH] = ACTIONS(1),
    [sym_link] = ACTIONS(1),
    [sym_string] = ACTIONS(1),
    [sym_number] = ACTIONS(1),
  },
  [1] = {
    [sym_comment] = STATE(3),
    [aux_sym_comment_token1] = ACTIONS(3),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 1,
    ACTIONS(5), 1,
      ts_builtin_sym_end,
  [4] = 1,
    ACTIONS(7), 1,
      ts_builtin_sym_end,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 4,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [5] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 1),
  [7] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
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

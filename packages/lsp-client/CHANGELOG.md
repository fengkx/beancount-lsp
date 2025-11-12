# Changelog

## v0.0.146

- chore: update lsp-client version to 0.0.146 ([e36fcfc](https://github.com/fengkx/beancount-lsp/commit/e36fcfc))
- feat: enhance diagnostics feature with balance line validation ([1dce6fb](https://github.com/fengkx/beancount-lsp/commit/1dce6fb))

## v0.0.144

- chore: update lsp-client version to 0.0.144 ([a3b508c](https://github.com/fengkx/beancount-lsp/commit/a3b508c))
- feat: add linked editing range feature to LSP server ([f34f3d7](https://github.com/fengkx/beancount-lsp/commit/f34f3d7))
- refactor: improve number string handling in CodeActionFeature ([383ebf5](https://github.com/fengkx/beancount-lsp/commit/383ebf5))
- feat: add expression calculation action to CodeAction feature ([d45d729](https://github.com/fengkx/beancount-lsp/commit/d45d729))
- chore: update dependencies and package versions ([6f0b15f](https://github.com/fengkx/beancount-lsp/commit/6f0b15f))
- refactor: use new vite api ([a35936a](https://github.com/fengkx/beancount-lsp/commit/a35936a))
- feat: enhance CodeAction feature with normalization for transaction postings ([8d5834a](https://github.com/fengkx/beancount-lsp/commit/8d5834a))
- feat: add CodeAction feature for incomplete balance lines ([9cf3d94](https://github.com/fengkx/beancount-lsp/commit/9cf3d94))

## v0.0.142

- chore: update lsp-client version to 0.0.142 ([6e2cb1f](https://github.com/fengkx/beancount-lsp/commit/6e2cb1f))

## v0.0.141

- chore: update lsp-client version to 0.0.141 ([75ca2a5](https://github.com/fengkx/beancount-lsp/commit/75ca2a5))
- fix: cache across tree with node id cause memory out of bound ([67cbf53](https://github.com/fengkx/beancount-lsp/commit/67cbf53))
- Ignore empty narration (#155) ([5d24b96](https://github.com/fengkx/beancount-lsp/commit/5d24b96))

## v0.0.139

- chore: update lsp-client version to 0.0.139 ([5826a38](https://github.com/fengkx/beancount-lsp/commit/5826a38))
- refactor: clean up symbol-extractors by removing unused functions and optimizing imports ([dd4eda7](https://github.com/fengkx/beancount-lsp/commit/dd4eda7))
- fix: enhance error handling in reparseWithPlaceholder function ([91d40a2](https://github.com/fengkx/beancount-lsp/commit/91d40a2))
- feat: implement semantic token aggregation for improved token extraction ([a22a8d3](https://github.com/fengkx/beancount-lsp/commit/a22a8d3))
- refactor: update findAllTransactions to be asynchronous and improve transaction extraction ([79b05dd](https://github.com/fengkx/beancount-lsp/commit/79b05dd))
- fix: support renaming and finding references for narrations (#146) ([d5c890c](https://github.com/fengkx/beancount-lsp/commit/d5c890c))
- feat: configurable pinyin fuzzy ([ef140ba](https://github.com/fengkx/beancount-lsp/commit/ef140ba))
- perf: improve symbol-extractors performance (#148) ([0781347](https://github.com/fengkx/beancount-lsp/commit/0781347))
- fix: add missing prepare rename for links (#144) ([1098316](https://github.com/fengkx/beancount-lsp/commit/1098316))
- fix: skip initing mainBeanFile second time (#150) ([d3db1e6](https://github.com/fengkx/beancount-lsp/commit/d3db1e6))
- perf: remove code that triggers indexing of included files (#149) ([58f46c3](https://github.com/fengkx/beancount-lsp/commit/58f46c3))
- refactor: lower priority of a log message sending document text (#145) ([3566548](https://github.com/fengkx/beancount-lsp/commit/3566548))

## v0.0.138

- chore: bump lsp-client version to 0.0.138 ([7eca414](https://github.com/fengkx/beancount-lsp/commit/7eca414))
- update submodule ([ef9da7f](https://github.com/fengkx/beancount-lsp/commit/ef9da7f))
- feat: backport upstream tree sitter (#142) ([01d3181](https://github.com/fengkx/beancount-lsp/commit/01d3181))

## v0.0.136

- chore(deps): bump eslint-plugin-unused-imports from 4.2.0 to 4.3.0 (#141) ([3993446](https://github.com/fengkx/beancount-lsp/commit/3993446))
- chore: bump lsp-client version to 0.0.136 ([627ff4c](https://github.com/fengkx/beancount-lsp/commit/627ff4c))
- feat: implement dynamic timeout adjustment for symbol indexing ([41f1c65](https://github.com/fengkx/beancount-lsp/commit/41f1c65))
- feat: enhance document parsing and completion context detection ([208e250](https://github.com/fengkx/beancount-lsp/commit/208e250))
- chore: update dependencies and package versions ([9cf3e56](https://github.com/fengkx/beancount-lsp/commit/9cf3e56))

## v0.0.134

- chore: bump lsp-client version to 0.0.134 ([52abb99](https://github.com/fengkx/beancount-lsp/commit/52abb99))
- feat: implement debounced content change handling in startServer ([e53de5e](https://github.com/fengkx/beancount-lsp/commit/e53de5e))
- feat: enhance completion context detection with new placeholder handling ([8d383a4](https://github.com/fengkx/beancount-lsp/commit/8d383a4))

## v0.0.133

- chore: bump lsp-client version to 0.0.133 ([7f19e26](https://github.com/fengkx/beancount-lsp/commit/7f19e26))
- feat: implement placeholder reparse for enhanced completion context detection (#131) ([e84d205](https://github.com/fengkx/beancount-lsp/commit/e84d205))
- chore: remove nominal-types dependency from lsp-server ([6f2af64](https://github.com/fengkx/beancount-lsp/commit/6f2af64))
- chore: add _typos.toml configuration file and fix typos in various files ([e44662e](https://github.com/fengkx/beancount-lsp/commit/e44662e))

## v0.0.132

- chore: update lsp-client version to 0.0.132 and configure default formatter in VSCode settings ([42bd658](https://github.com/fengkx/beancount-lsp/commit/42bd658))
- fix: double response because of static and dyamic register at the same time ([cfc3f40](https://github.com/fengkx/beancount-lsp/commit/cfc3f40))
- chore: update dependencies ([373e135](https://github.com/fengkx/beancount-lsp/commit/373e135))

## v0.0.130

- chore: bump lsp-client version to 0.0.130 ([5429bd6](https://github.com/fengkx/beancount-lsp/commit/5429bd6))
- fix: update TypeScript configuration and improve completion logic ([0303696](https://github.com/fengkx/beancount-lsp/commit/0303696))

## v0.0.128

- chore: bump lsp-client version to 0.0.128 ([cb58131](https://github.com/fengkx/beancount-lsp/commit/cb58131))
- refactor(formatter): improve whitespace handling and add normalization for currency formatting ([2ba95ba](https://github.com/fengkx/beancount-lsp/commit/2ba95ba))
- fix: account usage tags ([41bdbd6](https://github.com/fengkx/beancount-lsp/commit/41bdbd6))
- chore: update dependencies ([b4156a8](https://github.com/fengkx/beancount-lsp/commit/b4156a8))

## v0.0.127

- chore: bump lsp-client version to 0.0.127 ([a3a67e8](https://github.com/fengkx/beancount-lsp/commit/a3a67e8))
- feat(client): Use semanticTokenScopes instead of hardcoding colors (#126) ([ea8bcd6](https://github.com/fengkx/beancount-lsp/commit/ea8bcd6))
- feat: add support for aligning price and custom directives in formatter based on currency or decimal point settings ([f1ce863](https://github.com/fengkx/beancount-lsp/commit/f1ce863))
- fix: improve whitespace handling for currency alignment in formatter ([177ee10](https://github.com/fengkx/beancount-lsp/commit/177ee10))
- feat: enhance formatter to support currency alignment and balance formatting ([2a05529](https://github.com/fengkx/beancount-lsp/commit/2a05529))
- fix: update regex for completion item label filtering ([9f12881](https://github.com/fengkx/beancount-lsp/commit/9f12881))
- feat: pkg pr new ([975f3b8](https://github.com/fengkx/beancount-lsp/commit/975f3b8))

## v0.0.126

- chore: bump lsp-client and lsp-server versions to 0.0.126 and 0.0.5 respectively ([3cc8838](https://github.com/fengkx/beancount-lsp/commit/3cc8838))
- fix: precision tolerances align with beancount ([7812ebe](https://github.com/fengkx/beancount-lsp/commit/7812ebe))
- chore: update dependencies and package versions to latest releases ([2b030f7](https://github.com/fengkx/beancount-lsp/commit/2b030f7))

## v0.0.124

- chore: bump lsp-client version to 0.0.124 ([af3e980](https://github.com/fengkx/beancount-lsp/commit/af3e980))

## v0.0.123

- chore: bump lsp-client version to 0.0.123 ([f224387](https://github.com/fengkx/beancount-lsp/commit/f224387))
- Fix duplicate diagnostics (#95) ([2d7a4ff](https://github.com/fengkx/beancount-lsp/commit/2d7a4ff))
- Make account completion work in transactions (#100) ([2dbe0b1](https://github.com/fengkx/beancount-lsp/commit/2dbe0b1))
- chore: update submodule ([194f77a](https://github.com/fengkx/beancount-lsp/commit/194f77a))
- chore: update dependencies and package versions across the project ([33b2a2e](https://github.com/fengkx/beancount-lsp/commit/33b2a2e))

## v0.0.122

- chore: bump lsp-client version to 0.0.122 ([a6a4ba0](https://github.com/fengkx/beancount-lsp/commit/a6a4ba0))
- fix: token color customizations for Beancount in lsp-client package.json #89 ([2f7899a](https://github.com/fengkx/beancount-lsp/commit/2f7899a))

## v0.0.120

- chore: bump lsp-client version to 0.0.120 ([7b116f3](https://github.com/fengkx/beancount-lsp/commit/7b116f3))
- fix: rename payee issue ([f4d5135](https://github.com/fengkx/beancount-lsp/commit/f4d5135))

## v0.0.118

- chore: bump lsp-client version to 0.0.118 ([37bda8c](https://github.com/fengkx/beancount-lsp/commit/37bda8c))
- feat: extend parseCostSpec to include optional date field and adjust TypeScript configuration ([6bd1729](https://github.com/fengkx/beancount-lsp/commit/6bd1729))

## v0.0.116

- chore: add npm build script and update dependencies in turbo.json ([dcd2d30](https://github.com/fengkx/beancount-lsp/commit/dcd2d30))
- chore: bump lsp-server version to 0.0.4 ([f4a1d10](https://github.com/fengkx/beancount-lsp/commit/f4a1d10))
- chore: bump lsp-client version to 0.0.116 ([d2bd7ba](https://github.com/fengkx/beancount-lsp/commit/d2bd7ba))
- refactor: enhance default tolerance algorithm in diagnostics to skip integer amounts and clarify precision handling ([d111b82](https://github.com/fengkx/beancount-lsp/commit/d111b82))

## v0.0.114

- chore: bump lsp-client version to 0.0.114 ([9c4353b](https://github.com/fengkx/beancount-lsp/commit/9c4353b))
- feat: implement Beancount's default tolerance algorithm in diagnostics ([886003d](https://github.com/fengkx/beancount-lsp/commit/886003d))

## v0.0.112

- chore: bump lsp-client version to 0.0.112 ([039aa50](https://github.com/fengkx/beancount-lsp/commit/039aa50))
- fix: improve precision calculation for imbalance messages in DiagnosticsFeature ([35c98b7](https://github.com/fengkx/beancount-lsp/commit/35c98b7))

## v0.0.110

- chore: bump lsp-client version to 0.0.110 ([70d0406](https://github.com/fengkx/beancount-lsp/commit/70d0406))
- fix: add error handling and logging for folding range retrieval in FoldingRangeFeature ([765b4fb](https://github.com/fengkx/beancount-lsp/commit/765b4fb))
- chore: update package.json and pnpm-lock.yaml for dependency upgrades and build script adjustments ([918bba0](https://github.com/fengkx/beancount-lsp/commit/918bba0))
- feat: add support for payee and narration definitions in DefinitionFeature ([ac6b10c](https://github.com/fengkx/beancount-lsp/commit/ac6b10c))

## v0.0.108

- chore: bump lsp-client version to 0.0.108 ([ce5cbb9](https://github.com/fengkx/beancount-lsp/commit/ce5cbb9))
- fix: enhance completion item scoring and refactor account filtering logic ([c93369c](https://github.com/fengkx/beancount-lsp/commit/c93369c))

## v0.0.106

- chore: update package versions and dependencies to latest releases ([87e9897](https://github.com/fengkx/beancount-lsp/commit/87e9897))
- chore: bump lsp-client version to 0.0.106 ([1c42669](https://github.com/fengkx/beancount-lsp/commit/1c42669))
- fix: improve integer part extraction in formatter and enhance logger message formatting ([0556796](https://github.com/fengkx/beancount-lsp/commit/0556796))
- chore: update dependencies and package versions across the project ([eb7cb17](https://github.com/fengkx/beancount-lsp/commit/eb7cb17))
- chore: bump lsp-server version to 0.0.3 ([f964daa](https://github.com/fengkx/beancount-lsp/commit/f964daa))

## v0.0.104

- chore: bump lsp-client version to 0.0.104 and update lsp.mdc with capabilities handler requirement ([0aa7f11](https://github.com/fengkx/beancount-lsp/commit/0aa7f11))
- fix: code lens register ([d65dbfa](https://github.com/fengkx/beancount-lsp/commit/d65dbfa))

## v0.0.102

- fix: type error ([3523a3b](https://github.com/fengkx/beancount-lsp/commit/3523a3b))
- fix: code lens error ([5a83d3d](https://github.com/fengkx/beancount-lsp/commit/5a83d3d))

## v0.0.100

- chore: bump lsp-client version to 0.0.100 ([39dbe72](https://github.com/fengkx/beancount-lsp/commit/39dbe72))
- fix: code lens error ([228d550](https://github.com/fengkx/beancount-lsp/commit/228d550))

## v0.0.98

- chore: bump lsp-client version to 0.0.98 and update VSCode settings ([de5949a](https://github.com/fengkx/beancount-lsp/commit/de5949a))
- feat: add CodeLens feature for account balance display in LSP server (#81) ([b52c9b4](https://github.com/fengkx/beancount-lsp/commit/b52c9b4))
- perf: optimize runtime speed ([3edc216](https://github.com/fengkx/beancount-lsp/commit/3edc216))
- chore: update package dependencies to latest versions ([6eedbb6](https://github.com/fengkx/beancount-lsp/commit/6eedbb6))

## v0.0.96

- chore: bump lsp-client version to 0.0.96 ([2d8be49](https://github.com/fengkx/beancount-lsp/commit/2d8be49))
- feat: enhance inlay hint feature with text edits ([ecffc2c](https://github.com/fengkx/beancount-lsp/commit/ecffc2c))
- chore: update package dependencies and versions to latest releases ([5b8c31d](https://github.com/fengkx/beancount-lsp/commit/5b8c31d))
- refactor: optimize symbol indexing and improve currency definitions insertion ([a21852b](https://github.com/fengkx/beancount-lsp/commit/a21852b))

## v0.0.94

- chore: bump lsp-client version to 0.0.94 ([1c29771](https://github.com/fengkx/beancount-lsp/commit/1c29771))
- fix: reading number from undefined ([c6778ba](https://github.com/fengkx/beancount-lsp/commit/c6778ba))
- chore: bump lsp-client version to 0.0.92 ([14a07a2](https://github.com/fengkx/beancount-lsp/commit/14a07a2))
- fix: improve Windows compatibility for Beancount check execution by using tmp file ([cfb3c15](https://github.com/fengkx/beancount-lsp/commit/cfb3c15))
- chore: update package dependencies and versions ([9792f06](https://github.com/fengkx/beancount-lsp/commit/9792f06))

## v0.0.90

- chore: bump lsp-client version to 0.0.90 ([0900721](https://github.com/fengkx/beancount-lsp/commit/0900721))
- fix: absolute path compatible with windows path ([aeaa4ab](https://github.com/fengkx/beancount-lsp/commit/aeaa4ab))
- chore: update dependencies ([9aeea40](https://github.com/fengkx/beancount-lsp/commit/9aeea40))
- chore: bump lsp-client version to 0.0.88 ([30965ef](https://github.com/fengkx/beancount-lsp/commit/30965ef))
- feat: add python3Path configuration option for Beancount ([1ec2cfd](https://github.com/fengkx/beancount-lsp/commit/1ec2cfd))
- chore: update dependencies in lsp-client and lsp-server packages ([1dbd944](https://github.com/fengkx/beancount-lsp/commit/1dbd944))

## v0.0.86

- chore: bump lsp-client version to 0.0.86 ([05a8db5](https://github.com/fengkx/beancount-lsp/commit/05a8db5))
- fix: total cost with negative units ([4eb97e3](https://github.com/fengkx/beancount-lsp/commit/4eb97e3))
- chore: update mocha to version 11.5.0 and bump rollup to 4.41.1 ([cc96e99](https://github.com/fengkx/beancount-lsp/commit/cc96e99))

## v0.0.84

- chore: update .vscodeignore to exclude .turbo directory ([d539a6a](https://github.com/fengkx/beancount-lsp/commit/d539a6a))
- chore: bump lsp-client version to 0.0.84 ([0c23cb3](https://github.com/fengkx/beancount-lsp/commit/0c23cb3))
- feat: add Beancount snippets and update package configuration ([a5097d5](https://github.com/fengkx/beancount-lsp/commit/a5097d5))
- refactor: enhance build outputs and clean up code ([5501397](https://github.com/fengkx/beancount-lsp/commit/5501397))
- refactor: update imports and make references directly to ts code ([db05553](https://github.com/fengkx/beancount-lsp/commit/db05553))
- feat: update package manager and implement indexing improvements ([e4cee84](https://github.com/fengkx/beancount-lsp/commit/e4cee84))

## v0.0.82

- chore: bump lsp-client version to 0.0.82 ([9ec66c6](https://github.com/fengkx/beancount-lsp/commit/9ec66c6))

## v0.0.81

- chore: bump lsp-client version to 0.0.81 ([d2f9283](https://github.com/fengkx/beancount-lsp/commit/d2f9283))
- fix: update package reference and clean up storage code ([f38e0d1](https://github.com/fengkx/beancount-lsp/commit/f38e0d1))
- feat: improving performance for building indexes ([6ed8c87](https://github.com/fengkx/beancount-lsp/commit/6ed8c87))
- fix: add 'util' to browserConfig in tsup configuration ([6b504e0](https://github.com/fengkx/beancount-lsp/commit/6b504e0))
- refactor: replace nedb with custom storage which is faster for heavy write workload ([f9a922c](https://github.com/fengkx/beancount-lsp/commit/f9a922c))

## v0.0.80

- chore: bump lsp-client version to 0.0.80 ([f6c6504](https://github.com/fengkx/beancount-lsp/commit/f6c6504))
- feat: add scheduler-polyfill dependency and integrate into lsp-server ([92d7c99](https://github.com/fengkx/beancount-lsp/commit/92d7c99))

## v0.0.79

- refactor: remove unused imports from symbol-index.ts ([7d4073c](https://github.com/fengkx/beancount-lsp/commit/7d4073c))
- chore: bump lsp-client version to 0.0.79 ([d59388b](https://github.com/fengkx/beancount-lsp/commit/d59388b))
- feat: optimize startup response time ([07bf14d](https://github.com/fengkx/beancount-lsp/commit/07bf14d))
- feat: remove history context tool and related functionality for memory performance ([d30067f](https://github.com/fengkx/beancount-lsp/commit/d30067f))

## v0.0.78

- chore: bump lsp-client version to 0.0.78 ([5ffcb37](https://github.com/fengkx/beancount-lsp/commit/5ffcb37))
- fix: update events module configuration in tsup for LSP server ([51cdd80](https://github.com/fengkx/beancount-lsp/commit/51cdd80))

## v0.0.76

- fix: set platform to 'node' in tsup configuration for LSP server ([1b822e2](https://github.com/fengkx/beancount-lsp/commit/1b822e2))
- chore: bump lsp-client version to 0.0.76 ([842ff2b](https://github.com/fengkx/beancount-lsp/commit/842ff2b))
- chore: update dependencies in pnpm-lock.yaml and package.json ([b20b575](https://github.com/fengkx/beancount-lsp/commit/b20b575))
- refactor: simplify build process by removing npm package preparation script ([d5da460](https://github.com/fengkx/beancount-lsp/commit/d5da460))
- feat: embedding python code to LSP server without external dep ([1a60761](https://github.com/fengkx/beancount-lsp/commit/1a60761))
- refactor: update input schema modification logic in update-input-schema.spec.mts ([76b7675](https://github.com/fengkx/beancount-lsp/commit/76b7675))

## v0.0.74

- chore: bump lsp-client version to 0.0.74 ([9fe2878](https://github.com/fengkx/beancount-lsp/commit/9fe2878))
- docs: remove webTreeSitterWasmPath reference from README.md ([add24d5](https://github.com/fengkx/beancount-lsp/commit/add24d5))

## v0.0.73

- chore: bump lsp-client version to 0.0.73 ([a0a3b40](https://github.com/fengkx/beancount-lsp/commit/a0a3b40))
- refactor: remove webTreeSitterWasmPath dependency from Trees and language modules ([fd9d996](https://github.com/fengkx/beancount-lsp/commit/fd9d996))
- fix(changelog): update git log command to exclude package path for changelog generation ([1f452c6](https://github.com/fengkx/beancount-lsp/commit/1f452c6))
- docs: update CHANGELOG.md for v0.0.72 ([c9aad59](https://github.com/fengkx/beancount-lsp/commit/c9aad59))
- chore: bump lsp-client version to 0.0.72 ([8f80ea6](https://github.com/fengkx/beancount-lsp/commit/8f80ea6))
- fix(formatter): improve account formatting logic and enhance wide character handling ([7758170](https://github.com/fengkx/beancount-lsp/commit/7758170))
- chore(deps): bump eslint-plugin-turbo from 2.5.2 to 2.5.3 (#63) ([e3b87c0](https://github.com/fengkx/beancount-lsp/commit/e3b87c0))
- feat: add bug report issue template for improved issue tracking ([7a8e4cd](https://github.com/fengkx/beancount-lsp/commit/7a8e4cd))
- chore: update deps ([da2c515](https://github.com/fengkx/beancount-lsp/commit/da2c515))

## v0.0.72

- chore: bump lsp-client version to 0.0.72 ([8f80ea6](https://github.com/fengkx/beancount-lsp/commit/8f80ea6))
- fix(formatter): improve account formatting logic and enhance wide character handling ([7758170](https://github.com/fengkx/beancount-lsp/commit/7758170))
- chore(deps): bump eslint-plugin-turbo from 2.5.2 to 2.5.3 (#63) ([e3b87c0](https://github.com/fengkx/beancount-lsp/commit/e3b87c0))
- feat: add bug report issue template for improved issue tracking ([7a8e4cd](https://github.com/fengkx/beancount-lsp/commit/7a8e4cd))
- chore: update deps ([da2c515](https://github.com/fengkx/beancount-lsp/commit/da2c515))

## v0.0.70

- chore: bump lsp-client version to 0.0.70 ([79b9f43](https://github.com/fengkx/beancount-lsp/commit/79b9f43))
- feat: add support for cjk account name ([b77640d](https://github.com/fengkx/beancount-lsp/commit/b77640d))
- chore: update dependencies in lsp-client and lsp-server ([c2f7d4d](https://github.com/fengkx/beancount-lsp/commit/c2f7d4d))
- feat: better word pattern using regexpu ([b36eafb](https://github.com/fengkx/beancount-lsp/commit/b36eafb))

## v0.0.68

- chore: bump lsp-client version to 0.0.68 ([3112cad](https://github.com/fengkx/beancount-lsp/commit/3112cad))
- fix: enhance word pattern to support unicode characters and improve text edit handling in completions ([ec2b7b1](https://github.com/fengkx/beancount-lsp/commit/ec2b7b1))
- chore: update @types/node and type-fest to latest versions ([2e9ed14](https://github.com/fengkx/beancount-lsp/commit/2e9ed14))
- chore: update package dependencies to latest versions ([e01671b](https://github.com/fengkx/beancount-lsp/commit/e01671b))

## v0.0.66

- chore: bump lsp-client version to 0.0.66 ([04b19ed](https://github.com/fengkx/beancount-lsp/commit/04b19ed))
- refactor: clean up TypeScript configurations and improve type imports ([e9b62c3](https://github.com/fengkx/beancount-lsp/commit/e9b62c3))
- refactor: enhance type definitions and improve code readability ([17b6c75](https://github.com/fengkx/beancount-lsp/commit/17b6c75))
- chore: update dependencies in package.json files ([22985b4](https://github.com/fengkx/beancount-lsp/commit/22985b4))
- docs: update readme ([42a17d6](https://github.com/fengkx/beancount-lsp/commit/42a17d6))

## v0.0.64

- chore: bump lsp-client version to 0.0.64 ([6af7eb9](https://github.com/fengkx/beancount-lsp/commit/6af7eb9))
- docs: replace image url ([59c9c97](https://github.com/fengkx/beancount-lsp/commit/59c9c97))
- Try support vim (#46) ([c68a7f3](https://github.com/fengkx/beancount-lsp/commit/c68a7f3))
- chore: update changelog ([01964f9](https://github.com/fengkx/beancount-lsp/commit/01964f9))
- chore: bump lsp-client version to 0.0.62 ([fefe775](https://github.com/fengkx/beancount-lsp/commit/fefe775))
- fix: correct configuration property name in DocumentStore ([ef05566](https://github.com/fengkx/beancount-lsp/commit/ef05566))
- chore: update dependencies in package.json files ([ea57ffe](https://github.com/fengkx/beancount-lsp/commit/ea57ffe))

## v0.0.62

- chore: bump lsp-client version to 0.0.62 ([fefe775](https://github.com/fengkx/beancount-lsp/commit/fefe775))
- fix: correct configuration property name in DocumentStore ([ef05566](https://github.com/fengkx/beancount-lsp/commit/ef05566))
- chore: update dependencies in package.json files ([ea57ffe](https://github.com/fengkx/beancount-lsp/commit/ea57ffe))

## v0.0.60

- chore: bump lsp-client version to 0.0.60 ([7fb03fe](https://github.com/fengkx/beancount-lsp/commit/7fb03fe))

## v0.0.58

- chore: bump lsp-client version to 0.0.58 ([1a47834](https://github.com/fengkx/beancount-lsp/commit/1a47834))

## v0.0.57

- chore: update tsup config ([92c87dc](https://github.com/fengkx/beancount-lsp/commit/92c87dc))
- chore: bump lsp-client version to 0.0.57 ([b2d192e](https://github.com/fengkx/beancount-lsp/commit/b2d192e))
- feat: add tools for retrieving Beancount payees and narrations, and implement bean-query execution ([8500628](https://github.com/fengkx/beancount-lsp/commit/8500628))
- feat: improve changelog generate ([e50b867](https://github.com/fengkx/beancount-lsp/commit/e50b867))
- refactor: simplify tool initialization by removing unnecessary client parameter ([59d5b6e](https://github.com/fengkx/beancount-lsp/commit/59d5b6e))
- fix: update ClientOptions type to include BaseLanguageClient for better compatibility ([29e187c](https://github.com/fengkx/beancount-lsp/commit/29e187c))

## v0.0.56

- docs: update CHANGELOG.md for v0.0.56 ([532d8d1](https://github.com/fengkx/beancount-lsp/commit/532d8d1))
- chore: bump lsp-client version to 0.0.56 ([7b5eb91](https://github.com/fengkx/beancount-lsp/commit/7b5eb91))
- feat: Try to add AI Assistant Integration with Language Model Tools (#37) ([a0f929e](https://github.com/fengkx/beancount-lsp/commit/a0f929e))
- fix: changelog pipeline ([21957f8](https://github.com/fengkx/beancount-lsp/commit/21957f8))

## v0.0.55

- chore: bump lsp-client version to 0.0.55 ([9e5c688](https://github.com/fengkx/beancount-lsp/commit/9e5c688))
- chore: refactor ESLint configuration and remove deprecated files ([233c598](https://github.com/fengkx/beancount-lsp/commit/233c598))
- feat: add changelog generate pipeline ([3dba643](https://github.com/fengkx/beancount-lsp/commit/3dba643))

## v0.0.54

- chore: bump lsp-client version to 0.0.54 ([9cab99f](https://github.com/fengkx/beancount-lsp/commit/9cab99f))
- chore: update publish workflow to include CHANGELOG generation and commit ([126c5be](https://github.com/fengkx/beancount-lsp/commit/126c5be))
- Include subaccount balances when hovering (#35) ([cb01314](https://github.com/fengkx/beancount-lsp/commit/cb01314))
- feat: Run beancount on startup and save instead of on every call to getBalance (#30) ([2ff9555](https://github.com/fengkx/beancount-lsp/commit/2ff9555))
- chore: bump lsp-client version to 0.0.53 ([0c784e4](https://github.com/fengkx/beancount-lsp/commit/0c784e4))
- chore: update dependencies and version numbers ([cfa00f4](https://github.com/fengkx/beancount-lsp/commit/cfa00f4))
- chore: update dependencies for improved compatibility ([0c04bdc](https://github.com/fengkx/beancount-lsp/commit/0c04bdc))
- chore: fix publish problem ([4bc8865](https://github.com/fengkx/beancount-lsp/commit/4bc8865))
- chore: bump LSP client version to 0.0.51 ([3f8d9ba](https://github.com/fengkx/beancount-lsp/commit/3f8d9ba))
- feat: add command to restart Beancount Language Server ([119411c](https://github.com/fengkx/beancount-lsp/commit/119411c))
- chore: update dependencies in lsp-client and lsp-server ([41a1062](https://github.com/fengkx/beancount-lsp/commit/41a1062))
- chore: update dependencies across packages ([0d82142](https://github.com/fengkx/beancount-lsp/commit/0d82142))
- chore: bump LSP client version to 0.0.49 ([3925f1e](https://github.com/fengkx/beancount-lsp/commit/3925f1e))
- feat: add document formatting feature for Beancount files (#25) ([b572baa](https://github.com/fengkx/beancount-lsp/commit/b572baa))
- chore: mark packages as private and update lsp-server version ([13ecbe1](https://github.com/fengkx/beancount-lsp/commit/13ecbe1))
- docs: update README to reflect feature completion and support options ([6136654](https://github.com/fengkx/beancount-lsp/commit/6136654))
- chore: bump LSP client version to 0.0.49 ([078781a](https://github.com/fengkx/beancount-lsp/commit/078781a))
- refactor: make linter and typescript happier ([084385c](https://github.com/fengkx/beancount-lsp/commit/084385c))
- chore: bump LSP client version to 0.0.48 ([15913a4](https://github.com/fengkx/beancount-lsp/commit/15913a4))
- feat: add warning for incomplete transactions in diagnostics ([c13af05](https://github.com/fengkx/beancount-lsp/commit/c13af05))
- feat: make inlay hint aligned (#21) ([3b795bc](https://github.com/fengkx/beancount-lsp/commit/3b795bc))
- chore: bump LSP client version to 0.0.47 ([5395370](https://github.com/fengkx/beancount-lsp/commit/5395370))
- chore: bump LSP client version to 0.0.46 ([e08c3c3](https://github.com/fengkx/beancount-lsp/commit/e08c3c3))
- chore: bump LSP client version to 0.0.45 ([1fff965](https://github.com/fengkx/beancount-lsp/commit/1fff965))
- feat: integrate Beancount manager for balance retrieval ([9eee086](https://github.com/fengkx/beancount-lsp/commit/9eee086))
- feat: add prerelease option to VSIX publishing workflow ([880a13e](https://github.com/fengkx/beancount-lsp/commit/880a13e))
- chore: bump LSP client version to 0.0.43 ([3e20252](https://github.com/fengkx/beancount-lsp/commit/3e20252))
- chore: bump LSP client version to 0.0.42 ([6ef0a89](https://github.com/fengkx/beancount-lsp/commit/6ef0a89))
- feat: enhance completion feature with new identifier completions ([fb473a7](https://github.com/fengkx/beancount-lsp/commit/fb473a7))
- chore: bump LSP client version to 0.0.41 ([014ed09](https://github.com/fengkx/beancount-lsp/commit/014ed09))
- fix: refine wordPattern in language-configuration.json ([fb27150](https://github.com/fengkx/beancount-lsp/commit/fb27150))
- docs: update README.md links to point to the latest LSP specification ([c2a4f8e](https://github.com/fengkx/beancount-lsp/commit/c2a4f8e))
- chore: bump LSP client version to 0.0.40 ([b2c9aca](https://github.com/fengkx/beancount-lsp/commit/b2c9aca))
- fix: update wordPattern and completion return type ([3a16aa5](https://github.com/fengkx/beancount-lsp/commit/3a16aa5))
- chore: bump LSP client version to 0.0.39 ([7bbaf2b](https://github.com/fengkx/beancount-lsp/commit/7bbaf2b))
- chore: bump LSP client version to 0.0.38 ([cc76e88](https://github.com/fengkx/beancount-lsp/commit/cc76e88))
- chore: bump LSP client version to 0.0.37 ([b69870f](https://github.com/fengkx/beancount-lsp/commit/b69870f))
- chore: bump LSP client version to 0.0.36 ([7d1e419](https://github.com/fengkx/beancount-lsp/commit/7d1e419))
- chore: bump LSP client version to 0.0.35 ([b866194](https://github.com/fengkx/beancount-lsp/commit/b866194))
- chore: bump LSP client version to 0.0.34 ([cb54717](https://github.com/fengkx/beancount-lsp/commit/cb54717))
- refactor: simplify tsup configuration by introducing common options ([9225c61](https://github.com/fengkx/beancount-lsp/commit/9225c61))
- chore: eslint config ([068419b](https://github.com/fengkx/beancount-lsp/commit/068419b))
- chore: bump LSP client version to 0.0.32 ([27612b6](https://github.com/fengkx/beancount-lsp/commit/27612b6))
- chore: update dependencies and configuration for LSP client ([0169532](https://github.com/fengkx/beancount-lsp/commit/0169532))
- feat: implement dynamic file exclusion based on .gitignore and user settings ([28ef330](https://github.com/fengkx/beancount-lsp/commit/28ef330))
- refactor: clean up completion scoring functions and improve ESLint ignore settings ([66714d2](https://github.com/fengkx/beancount-lsp/commit/66714d2))
- chore: update test transaction and bump LSP client version to 0.0.31 ([c72ca84](https://github.com/fengkx/beancount-lsp/commit/c72ca84))
- feat: enhance file exclusion and completion handling in LSP ([9e9fc73](https://github.com/fengkx/beancount-lsp/commit/9e9fc73))
- chore: bump LSP client version to 0.0.30 ([61bbe32](https://github.com/fengkx/beancount-lsp/commit/61bbe32))
- chore: bump LSP client version to 0.0.29 ([fd32223](https://github.com/fengkx/beancount-lsp/commit/fd32223))
- feat: Enhance LSP completions with link references and language configuration ([b7629a3](https://github.com/fengkx/beancount-lsp/commit/b7629a3))
- fix: type error ([09fd692](https://github.com/fengkx/beancount-lsp/commit/09fd692))
- chore: bump LSP client version to 0.0.28 ([ca9c2ce](https://github.com/fengkx/beancount-lsp/commit/ca9c2ce))
- chore: bump LSP client version to 0.0.27 ([f3a4dbf](https://github.com/fengkx/beancount-lsp/commit/f3a4dbf))
- feat: change settings id ([bfa781b](https://github.com/fengkx/beancount-lsp/commit/bfa781b))
- chore: bump LSP client version and add symbol index for storage ([6298632](https://github.com/fengkx/beancount-lsp/commit/6298632))
- chore: bump LSP client version to 0.0.25 ([22960e4](https://github.com/fengkx/beancount-lsp/commit/22960e4))
- chore: bump LSP client version to 0.0.24 ([f39bb44](https://github.com/fengkx/beancount-lsp/commit/f39bb44))
- chore: update README ([76b09a5](https://github.com/fengkx/beancount-lsp/commit/76b09a5))
- chore: bump LSP client version to 0.0.22 ([c8f7b11](https://github.com/fengkx/beancount-lsp/commit/c8f7b11))
- docs: update README with new configuration options and feature descriptions ([0de2b9b](https://github.com/fengkx/beancount-lsp/commit/0de2b9b))
- feat: add currency configuration and advanced price conversion support ([3948395](https://github.com/fengkx/beancount-lsp/commit/3948395))
- feat: add price declaration symbol extraction and indexing ([ad9ffb9](https://github.com/fengkx/beancount-lsp/commit/ad9ffb9))
- feat: add inlay hints for transaction balance calculations ([ab6fb63](https://github.com/fengkx/beancount-lsp/commit/ab6fb63))
- feat: enhance LSP logging and configuration options ([4000181](https://github.com/fengkx/beancount-lsp/commit/4000181))
- chore: bump LSP client version to 0.0.20 ([38e39da](https://github.com/fengkx/beancount-lsp/commit/38e39da))
- chore: add test script and configuration to turbo and package configs ([1ccfc6e](https://github.com/fengkx/beancount-lsp/commit/1ccfc6e))
- refactor: simplify server asset and worker path management ([7a6374f](https://github.com/fengkx/beancount-lsp/commit/7a6374f))
- chore: bump LSP client version to 0.0.19 ([924103c](https://github.com/fengkx/beancount-lsp/commit/924103c))
- feat: add transaction balance diagnostics for Beancount LSP ([e476dd4](https://github.com/fengkx/beancount-lsp/commit/e476dd4))
- chore: bump LSP client version to 0.0.18 ([708553a](https://github.com/fengkx/beancount-lsp/commit/708553a))
- feat: add Stale-While-Revalidate (SWR) caching for symbol index ([8925b1b](https://github.com/fengkx/beancount-lsp/commit/8925b1b))
- feat: add global storage support for LSP server and client ([0e74c94](https://github.com/fengkx/beancount-lsp/commit/0e74c94))
- chore: bump LSP client version to 0.0.15 ([e033797](https://github.com/fengkx/beancount-lsp/commit/e033797))
- chore: remove @abraham/reflection and clean up imports ([18567e7](https://github.com/fengkx/beancount-lsp/commit/18567e7))
- chore: bump LSP client version to 0.0.14 ([1f99c32](https://github.com/fengkx/beancount-lsp/commit/1f99c32))
- refactor: improve type safety and code quality across LSP client ([64973fc](https://github.com/fengkx/beancount-lsp/commit/64973fc))
- chore: bump LSP client version to 0.0.13 ([cb82779](https://github.com/fengkx/beancount-lsp/commit/cb82779))
- chore: bump LSP client version to 0.0.12 ([306b30b](https://github.com/fengkx/beancount-lsp/commit/306b30b))
- fix: add autoload for nedb ([ece4377](https://github.com/fengkx/beancount-lsp/commit/ece4377))
- chore: bump LSP client version to 0.0.10 ([2e18a86](https://github.com/fengkx/beancount-lsp/commit/2e18a86))
- feat: enhance LSP client with web and browser support ([02cfa3e](https://github.com/fengkx/beancount-lsp/commit/02cfa3e))
- chore: bump lsp-client to 0.0.3 ([4aa1625](https://github.com/fengkx/beancount-lsp/commit/4aa1625))
- chore: update pnpm lockfile and add esbuild node modules polyfill ([077b118](https://github.com/fengkx/beancount-lsp/commit/077b118))
- feat: try to implement web extension ([9b2ae56](https://github.com/fengkx/beancount-lsp/commit/9b2ae56))
- feat: add browser support for LSP server and client ([586be6f](https://github.com/fengkx/beancount-lsp/commit/586be6f))
- feat: add browser and node extension support for LSP client ([bc13789](https://github.com/fengkx/beancount-lsp/commit/bc13789))
- chore: bump extension version to 0.0.2 ([e22652b](https://github.com/fengkx/beancount-lsp/commit/e22652b))
- refactor: simplify path resolution using vscode.Uri methods ([f8a37a9](https://github.com/fengkx/beancount-lsp/commit/f8a37a9))
- docs: add comprehensive README with configuration details and example settings ([3637e59](https://github.com/fengkx/beancount-lsp/commit/3637e59))
- chore: add publisher to package.json for extension metadata ([b22c245](https://github.com/fengkx/beancount-lsp/commit/b22c245))
- feat: enable auto completion and improve extension metadata ([c293ac7](https://github.com/fengkx/beancount-lsp/commit/c293ac7))
- feat: add comprehensive logging infrastructure with configurable log levels ([3dc9299](https://github.com/fengkx/beancount-lsp/commit/3dc9299))
- feat: enhance Beancount language support in VS Code ([5fadbfe](https://github.com/fengkx/beancount-lsp/commit/5fadbfe))
- chore: update extension icon ([253e284](https://github.com/fengkx/beancount-lsp/commit/253e284))
- feat: prepare VSCode extension for publishing ([7cf57be](https://github.com/fengkx/beancount-lsp/commit/7cf57be))
- feat: enhance semantic token styling and support for account definitions ([f7d4ce4](https://github.com/fengkx/beancount-lsp/commit/f7d4ce4))
- style: format code ([5ef917c](https://github.com/fengkx/beancount-lsp/commit/5ef917c))
- chore: add dprint ([9f8ed3d](https://github.com/fengkx/beancount-lsp/commit/9f8ed3d))
- feat: wip symbol index, todo: scheduler ([2372adb](https://github.com/fengkx/beancount-lsp/commit/2372adb))
- chore: clean up code ([2ffdd03](https://github.com/fengkx/beancount-lsp/commit/2ffdd03))
- chore: update deps ([afa21d1](https://github.com/fengkx/beancount-lsp/commit/afa21d1))
- chore: cache linter ([7a893ce](https://github.com/fengkx/beancount-lsp/commit/7a893ce))
- chore: lint and typecheck tasks ([d383ec9](https://github.com/fengkx/beancount-lsp/commit/d383ec9))
- sync ([72a19ce](https://github.com/fengkx/beancount-lsp/commit/72a19ce))
- feat: server ([6f5857d](https://github.com/fengkx/beancount-lsp/commit/6f5857d))
- server ([7bd509f](https://github.com/fengkx/beancount-lsp/commit/7bd509f))
- server ([c95d266](https://github.com/fengkx/beancount-lsp/commit/c95d266))
- server ([3243f4c](https://github.com/fengkx/beancount-lsp/commit/3243f4c))
- server ([131cf5a](https://github.com/fengkx/beancount-lsp/commit/131cf5a))
- wip ([1c642db](https://github.com/fengkx/beancount-lsp/commit/1c642db))

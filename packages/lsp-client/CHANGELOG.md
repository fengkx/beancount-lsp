# Changelog

## v0.0.81

- chore: bump lsp-client version to 0.0.81 ([d2f9283](https://github.com/fengkx/beancount-lsp/commit/d2f9283))
- fix: update package reference and clean up storage code ([f38e0d1](https://github.com/fengkx/beancount-lsp/commit/f38e0d1))
- feat: improving performance for building indexes ([6ed8c87](https://github.com/fengkx/beancount-lsp/commit/6ed8c87))
- fix: add 'util' to browserConfig in tsup configuration ([6b504e0](https://github.com/fengkx/beancount-lsp/commit/6b504e0))
- refactor: replace nedb with custom storage which is faster for heavy write wrokload ([f9a922c](https://github.com/fengkx/beancount-lsp/commit/f9a922c))

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
- feat: embeding python code to LSP server without external dep ([1a60761](https://github.com/fengkx/beancount-lsp/commit/1a60761))
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
- docs: udpate readme ([42a17d6](https://github.com/fengkx/beancount-lsp/commit/42a17d6))

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

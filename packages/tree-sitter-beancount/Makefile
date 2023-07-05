default:
	npm run generate
	npx tree-sitter build-wasm
	npm test
	./node_modules/.bin/tree-sitter parse examples/example.beancount > tmp
	diff examples/example.tree tmp
	@rm tmp
	./node_modules/.bin/tree-sitter parse --quiet examples/long-example.beancount

.PHONY: update
update:
	./node_modules/.bin/tree-sitter parse examples/example.beancount > examples/example.tree

.PHONY: lint
lint:
	npm run lint

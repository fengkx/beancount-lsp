// import { join } from 'path';
// import { URI } from 'vscode-uri';
import DataStore from '@bean-lsp/storage';
import { SymbolKey } from '../common/features/symbol-extractors';
import type { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory<unknown> = {
	// @ts-expect-error - TODO: fix this
	async create(_name, _prefix = '') {
		const db = new DataStore<unknown>({});

		db.ensureIndexAsync('_uri');
		db.ensureIndexAsync(SymbolKey.TYPE);

		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

import Db from '@bean-lsp/storage';
import { SymbolKey } from '../common/features/symbol-extractors';
import type { IStorageFactory, StorageInstance } from '../common/startServer';

export const factory: IStorageFactory<unknown> = {
	async create<T>(): Promise<StorageInstance<T>> {
		const db = new Db<T>({});

		db.ensureIndexAsync('_uri');
		db.ensureIndexAsync(SymbolKey.TYPE);
		db.ensureIndexAsync('name');

		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

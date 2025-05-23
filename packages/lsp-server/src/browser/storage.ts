import Db from '@bean-lsp/storage';
import { SymbolKey } from '../common/features/symbol-extractors';
import { IStorageFactory, StorageInstance } from '../common/startServer';
/**
 * Browser implementation of StorageFactory using in-memory database
 * Note: This does not persist data between sessions
 */
class BrowserStorageFactory<T> implements IStorageFactory<T> {
	private dbs = new Map<string, StorageInstance<T>>();

	async create<T>(name: string): Promise<StorageInstance<T>> {
		const db = new Db<T>({});
		db.ensureIndexAsync('_uri');
		db.ensureIndexAsync(SymbolKey.TYPE);

		// @ts-expect-error - Type mismatch, but this is safe in practice
		this.dbs.set(name, db);

		return db;
	}

	async destroy(index: StorageInstance<T>): Promise<void> {
		// Find the name of the database
		let dbName: string | undefined;

		for (const [name, db] of this.dbs.entries()) {
			if (db === index) {
				dbName = name;
				break;
			}
		}

		if (dbName) {
			this.dbs.delete(dbName);
		}

		// No need to explicitly close the database in memory-only mode
	}
}

export const factory: IStorageFactory<unknown> = new BrowserStorageFactory();

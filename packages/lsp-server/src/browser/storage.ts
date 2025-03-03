import Db from '@seald-io/nedb';
import { IStorageFactory, SymbolInfoStorage } from '../common/startServer';

/**
 * Browser implementation of StorageFactory using in-memory database
 * Note: This does not persist data between sessions
 */
class BrowserStorageFactory implements IStorageFactory {
	private dbs = new Map<string, SymbolInfoStorage>();

	async create(name: string): Promise<SymbolInfoStorage> {
		// For browser, we create an in-memory database
		const db = new Db<any>({ inMemoryOnly: true });

		// Store the database instance
		this.dbs.set(name, db);

		return db;
	}

	async destroy(index: SymbolInfoStorage): Promise<void> {
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

export const factory = new BrowserStorageFactory();

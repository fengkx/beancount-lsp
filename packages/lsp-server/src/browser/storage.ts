import Db from '@seald-io/nedb';
import { IStorageFactory, StorageInstance } from '../common/startServer';

/**
 * Browser implementation of StorageFactory using in-memory database
 * Note: This does not persist data between sessions
 */
class BrowserStorageFactory<T> implements IStorageFactory<T> {
	private dbs = new Map<string, StorageInstance<T>>();

	async create<T>(name: string): Promise<StorageInstance<T>> {
		// Create the database with the given name as filename
		// Use inMemoryOnly: true to ensure we don't try to persist to disk in browser environment
		const db = new Db({
			// filename: name,
			// autoload: true,
			inMemoryOnly: true,
		});

		// Store the database instance
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

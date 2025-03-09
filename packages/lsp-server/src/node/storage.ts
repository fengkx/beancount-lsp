import NeDb from '@seald-io/nedb';
// import { join } from 'path';
// import { URI } from 'vscode-uri';
import { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory = {
	async create(name, prefix = '') {
		const db = new NeDb({
			// filename: URI.parse(join(prefix, name)).fsPath,
			// autoload: true,
			inMemoryOnly: true,
		});
		await db.ensureIndex({ fieldName: 'symbol' });

		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

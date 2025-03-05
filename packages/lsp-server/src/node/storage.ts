import NeDb from '@seald-io/nedb';
import { join } from 'path';
import { URI } from 'vscode-uri';
import { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory = {
	async create(name, prefix = '') {
		const db = new NeDb({
			filename: URI.parse(join(prefix, name)).fsPath,
			autoload: true,
		});
		// // Add indexes to optimize query performance
		db.ensureIndexAsync({ fieldName: '_symType' });

		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

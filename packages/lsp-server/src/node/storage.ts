import NeDb from '@seald-io/nedb';
import { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory = {
	async create(name) {
		const db = new NeDb({
			filename: name,
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

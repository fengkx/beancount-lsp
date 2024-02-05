import NeDb from '@seald-io/nedb';
import { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory = {
	async create(name) {
		const db = new NeDb({});
		db.ensureIndexAsync({ fieldName: ['_uri'] });
		db.ensureIndexAsync({ fieldName: ['name'] });
		// db.ensureIndexAsync({ fieldName: ['_uri', '_symType'] })
		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

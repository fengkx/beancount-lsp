import NeDb from '@seald-io/nedb';
import { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory = {
	async create(name) {
		const db = new NeDb({
			filename: name,
			autoload: true,
		});
		// Add indexes to optimize query performance
		// These indexes match the ones in the node implementation
		await db.ensureIndexAsync({ fieldName: '_uri' });
		await db.ensureIndexAsync({ fieldName: 'name' });
		await db.ensureIndexAsync({ fieldName: '_symType' });

		// Additional compound index for common query patterns
		// This helps with queries that filter by both URI and symbol type
		await db.ensureIndexAsync({ fieldName: ['_uri', '_symType'] });

		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

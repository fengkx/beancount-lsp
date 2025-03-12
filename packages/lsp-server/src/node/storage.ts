import NeDb from '@seald-io/nedb';
// import { join } from 'path';
// import { URI } from 'vscode-uri';
import { IStorageFactory } from '../common/startServer';

export const factory: IStorageFactory = {
	async create(_name, _prefix = '') {
		const db = new NeDb({
			// filename: URI.parse(join(prefix, name)).fsPath,
			// autoload: true,
			inMemoryOnly: true,
		});

		return db;
	},
	destroy(index) {
		return index.dropDatabaseAsync();
	},
};

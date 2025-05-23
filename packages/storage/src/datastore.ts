import { customAlphabet } from 'nanoid/non-secure';
import { Index } from './data-index';
import type { Document, IndexableValue } from './types';

type DataStoreOptions = {
	/**
	 * Automatically create indices for fields mentioned in this array
	 */
	indices?: string[];
};

// MongoDB-like query operators with better typing
type ComparisonOperator<T> = {
	$gt?: T;
	$gte?: T;
	$lt?: T;
	$lte?: T;
	$ne?: T;
	$in?: T[];
	$nin?: T[];
};

type QueryValue<T = any> = T | ComparisonOperator<T>;

type Query<T = any> =
	& {
		[K in keyof T]?: QueryValue<T[K]>;
	}
	& {
		[key: string]: QueryValue;
	};

class DataStore<Schema = Record<string, any>> {
	private data = new Map<string, Document<Schema>>();
	// Change to use the new Index class
	private indices: Map<string, Index<Schema>> = new Map();

	private idGenerator = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

	private generateId(): string {
		return this.idGenerator(10);
	}

	constructor(options: DataStoreOptions = {}) {
		// Create indices for any fields specified in options
		if (options.indices) {
			for (const field of options.indices) {
				this.ensureIndexAsync(field);
			}
		}
	}

	/**
	 * Ensures an index exists for the specified field
	 * @param fieldName Field to create an index for
	 */
	ensureIndexAsync(fieldName: string): void {
		if (!this.indices.has(fieldName)) {
			this.indices.set(fieldName, new Index<Schema>(fieldName));
		}
	}

	/**
	 * Get the discreteness value for a specific index
	 * @param fieldName The field name of the index
	 * @returns Discreteness value between 0 and 1, or -1 if index doesn't exist
	 */
	getIndexDiscreteness(fieldName: string): number {
		const index = this.indices.get(fieldName);
		if (!index) return -1;

		return index.getDiscreteness();
	}

	/**
	 * Insert multiple documents into the datastore
	 * @param docs Documents to insert
	 * @returns Array of inserted documents with IDs
	 */
	async insertAsync<T extends Schema>(docs: T[]): Promise<Document<T>[]> {
		const insertedDocs: Document<T>[] = [];
		for (const doc of docs) {
			insertedDocs.push(this.insertOne(doc));
		}
		return insertedDocs;
	}

	/**
	 * Insert a single document
	 * @param doc Document to insert
	 * @returns Inserted document with ID
	 */
	private insertOne<T extends Schema>(doc: T): Document<T> {
		const _id = this.generateId();
		const newDoc = { ...doc, _id } as Document<T>;
		this.data.set(_id, newDoc);

		// Update indices
		for (const [field, index] of this.indices.entries()) {
			const value = doc[field as keyof Schema];
			index.add(_id, value);
		}

		return newDoc;
	}

	/**
	 * Remove a single document by ID
	 * @param id Document ID to remove
	 */
	private removeOne(id: string): void {
		const doc = this.data.get(id);
		if (doc) {
			this.data.delete(id);
			// Update indices
			for (const [field, index] of this.indices.entries()) {
				const value = doc[field as keyof Schema];
				index.remove(id, value);
			}
		}
	}

	public async findAsync(query: Query<Schema>): Promise<Document<Schema>[]> {
		return this.findSync(query);
	}

	public removeSync(query: Query<Schema>): void {
		const docs = this.findSync(query);
		for (const doc of docs) {
			this.removeOne(doc._id);
		}
	}

	/**
	 * Remove multiple documents by their IDs
	 * @param ids Array of document IDs to remove
	 */
	public async removeAsync(query: Query<Schema>): Promise<void> {
		const docs = this.findSync(query);
		for (const doc of docs) {
			this.removeOne(doc._id);
		}
	}

	/**
	 * Check if a document field matches a query value, handling MongoDB-like operators
	 * @param docValue Document field value
	 * @param queryValue Query value or operator
	 */
	private matchesValue(docValue: any, queryValue: QueryValue): boolean {
		// Direct comparison for non-operator values
		if (queryValue === null || typeof queryValue !== 'object' || Array.isArray(queryValue)) {
			return docValue === queryValue;
		}

		// Handle comparison operators
		for (const [op, opValue] of Object.entries(queryValue as Record<string, any>)) {
			switch (op) {
				case '$gt':
					if (!(docValue > opValue)) return false;
					break;
				case '$gte':
					if (!(docValue >= opValue)) return false;
					break;
				case '$lt':
					if (!(docValue < opValue)) return false;
					break;
				case '$lte':
					if (!(docValue <= opValue)) return false;
					break;
				case '$ne':
					if (docValue === opValue) return false;
					break;
				case '$in':
					if (!Array.isArray(opValue) || !opValue.includes(docValue)) return false;
					break;
				case '$nin':
					if (!Array.isArray(opValue) || opValue.includes(docValue)) return false;
					break;
				default:
					// For fields that are not operators, treat as regular field comparison
					if (op[0] !== '$' && docValue?.[op] !== opValue) return false;
			}
		}

		return true;
	}

	/**
	 * Find documents matching the query
	 * @param query MongoDB-like query object
	 * @returns Array of matching documents
	 */

	public findSync(query: Query<Schema>): Document<Schema>[] {
		const results: Document<Schema>[] = [];

		// Check if we can use any indexed field for the query
		const indexedQueryEntries = Object.entries(query)
			.filter(([key]) => this.indices.has(key));

		if (indexedQueryEntries.length > 0) {
			// Find the most efficient index to use
			let bestCandidateIds: Set<string> | null = null;

			for (const [field, queryValue] of indexedQueryEntries) {
				const index = this.indices.get(field);
				if (!index) continue;

				// For simple equality queries
				if (index.isIndexable(queryValue)) {
					const ids = index.getIds(queryValue as IndexableValue);
					if (ids && (bestCandidateIds === null || ids.size < bestCandidateIds.size)) {
						bestCandidateIds = ids;
					}
					continue;
				}

				// For range queries on numeric fields
				if (typeof queryValue === 'object' && !Array.isArray(queryValue)) {
					// Get all keys in the index (these are all possible values for this field)
					const indexKeys = Array.from(index.keys());

					// Only apply range optimization for numeric fields
					if (indexKeys.length > 0) {
						const comparableKeys = indexKeys.filter(k =>
							typeof k === 'number' || typeof k === 'bigint' || typeof k === 'string' && !isNaN(Number(k))
						) as Array<number | bigint | string>;

						// Sort numeric keys for range operations
						comparableKeys.sort((a, b) => {
							if (a > b) return 1;
							if (a < b) return -1;
							return 0;
						});

						let candidateIds = new Set<string>();
						let hasRangeOperator = false;

						// Extract range operators
						const opValue = queryValue as ComparisonOperator<number | bigint | string>;

						// Handle $gt
						if (opValue.$gt !== undefined) {
							hasRangeOperator = true;
							const matchingKeys = comparableKeys.filter(k => k > opValue.$gt!);
							for (const key of matchingKeys) {
								const ids = index.getIds(key);
								if (ids) {
									ids.forEach(id => candidateIds.add(id));
								}
							}
						}

						// Handle $gte
						if (opValue.$gte !== undefined) {
							hasRangeOperator = true;
							const matchingKeys = comparableKeys.filter(k => k >= opValue.$gte!);
							for (const key of matchingKeys) {
								const ids = index.getIds(key);
								if (ids) {
									ids.forEach(id => candidateIds.add(id));
								}
							}
						}

						// Handle $lt
						if (opValue.$lt !== undefined) {
							hasRangeOperator = true;
							const matchingKeys = comparableKeys.filter(k => k < opValue.$lt!);
							for (const key of matchingKeys) {
								const ids = index.getIds(key);
								if (ids) {
									ids.forEach(id => candidateIds.add(id));
								}
							}
						}

						// Handle $lte
						if (opValue.$lte !== undefined) {
							hasRangeOperator = true;
							const matchingKeys = comparableKeys.filter(k => k <= opValue.$lte!);
							for (const key of matchingKeys) {
								const ids = index.getIds(key);
								if (ids) {
									ids.forEach(id => candidateIds.add(id));
								}
							}
						}

						if (
							hasRangeOperator && (bestCandidateIds === null || candidateIds.size < bestCandidateIds.size)
						) {
							bestCandidateIds = candidateIds;
						}
					}
				}
			}

			// If we found a usable index
			if (bestCandidateIds !== null) {
				// Check all documents that match the indexed field
				for (const id of bestCandidateIds) {
					const doc = this.data.get(id);
					if (!doc) continue;

					let match = true;
					// Check all conditions in the query
					for (const [key, queryValue] of Object.entries(query)) {
						if (!this.matchesValue(doc[key as keyof Schema], queryValue)) {
							match = false;
							break;
						}
					}

					if (match) {
						results.push(doc);
					}
				}

				return results as Document<Schema>[];
			}
		}

		// Fallback to scanning all documents if no index is available
		for (const doc of this.data.values()) {
			let match = true;
			for (const [key, queryValue] of Object.entries(query)) {
				if (!this.matchesValue(doc[key as keyof Schema], queryValue)) {
					match = false;
					break;
				}
			}
			if (match) {
				results.push(doc);
			}
		}

		return results;
	}

	/**
	 * Count documents matching the query
	 * @param query MongoDB-like query object
	 * @returns Number of matching documents
	 */
	async countAsync(query: Query<Schema> = {}): Promise<number> {
		const results = await this.findSync(query);
		return results.length;
	}

	/**
	 * Get all documents in the datastore
	 * @returns Array of all documents
	 */
	async getAllAsync(): Promise<Document<Schema>[]> {
		// Cast the result to the expected Document<Schema>[] type
		return Array.from(this.data.values()) as Document<Schema>[];
	}

	async dropDatabaseAsync(): Promise<void> {
		this.data.clear();
		this.indices.clear();
	}
}

export default DataStore;

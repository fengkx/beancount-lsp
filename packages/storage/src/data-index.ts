import type { IndexableValue } from './types';

const emptySet: ReadonlySet<string> = new Set<string>();

export class Index<Schema> {
	constructor(public readonly fieldName: string) {}

	// Map of field values to document IDs
	private indexMap: Map<IndexableValue, Set<string>> = new Map();

	private documentsSize: number = 0;

	/**
	 * Add a document to the index
	 * @param id Document ID
	 * @param value Field value to index
	 */
	add(id: string, value: Schema[keyof Schema]): void {
		if (!this.isIndexable(value)) return;

		if (!this.indexMap.has(value)) {
			this.indexMap.set(value, new Set());
		}
		this.indexMap.get(value)?.add(id);
		this.documentsSize++;
	}

	/**
	 * Remove a document from the index
	 * @param id Document ID
	 * @param value Field value to remove from index
	 */
	remove(id: string, value: IndexableValue): void {
		if (!this.isIndexable(value)) return;

		this.indexMap.get(value)?.delete(id);
		// Clean up empty sets
		if (this.indexMap.get(value)?.size === 0) {
			this.indexMap.delete(value);
		}
		this.documentsSize--;
	}

	/**
	 * Get all document IDs for a specific value
	 * @param value Value to look up
	 */
	getIds(value: IndexableValue): ReadonlySet<string> | undefined {
		return this.indexMap.get(value) ?? emptySet;
	}

	/**
	 * Get all keys in the index
	 */
	keys(): IterableIterator<IndexableValue> {
		return this.indexMap.keys();
	}

	/**
	 * Check if a value can be used as an index key
	 */
	isIndexable(value: unknown): value is IndexableValue {
		return value === null
			|| typeof value === 'string'
			|| typeof value === 'number'
			|| typeof value === 'boolean';
	}

	/**
	 * Get the entire index map
	 */
	get map(): Map<IndexableValue, Set<string>> {
		return this.indexMap;
	}

	/**
	 * Get the discreteness of the index (cardinality divided by total documents)
	 * Higher values indicate more unique values, with 1.0 being completely unique
	 * @param totalDocuments Total number of documents in the collection
	 */
	getDiscreteness(): number {
		// Count unique values in the index
		const uniqueValues = this.indexMap.size;

		// Calculate discreteness as the ratio of unique values to total documents
		return uniqueValues / this.documentsSize;
	}
}

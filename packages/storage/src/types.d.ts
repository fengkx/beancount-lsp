export type Document<T> = Readonly<
	T & {
		_id: string;
	}
>;

// Supported field types for indexing
export type IndexableValue = string | number | boolean | null | bigint;

import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import type { LiteralUnion } from 'type-fest';
import { Emitter } from 'vscode-languageserver';
import { parseExpression } from './expression-parser';

// Create a logger for the options manager
const logger = new Logger('BeancountOptions');

export type SupportedOption =
	| 'infer_tolerance_from_cost'
	| 'inferred_tolerance_multiplier'
	| 'name_assets'
	| 'name_liabilities'
	| 'name_equity'
	| 'name_income'
	| 'name_expenses';
type OptionKeys = LiteralUnion<SupportedOption, string>;

/**
 * Interface representing a Beancount option with its value and metadata
 */
export interface IBeancountOption {
	/** The option value */
	value: string;
	/** The file where the option was defined */
	source?: string | undefined;
	/** Whether the option was defined explicitly or is using a default value */
	isDefault: boolean;

	asBoolean(): boolean;
	asDecimal(): Big;
	asString(): string;
}

class BeancountOption implements IBeancountOption {
	public value: string;
	public source: string | undefined;
	public isDefault: boolean;
	constructor(option: { value: string; source?: string | undefined; isDefault: boolean }) {
		this.value = option.value;
		this.source = option.source;
		this.isDefault = option.isDefault;
	}

	public asBoolean(): boolean {
		return this.value.toLocaleUpperCase() === 'TRUE';
	}

	public asDecimal(): Big {
		return new Big(parseExpression(this.value));
	}

	public asString(): string {
		return String(this.value);
	}
}

/**
 * Event emitted when options change
 */
export interface OptionsChangeEvent {
	/** The name of the option that changed */
	name: string;
	/** The new option value and metadata */
	option: BeancountOption;
	/** The previous option value and metadata, if any */
	previousOption: BeancountOption | undefined;
}

/**
 * Class to manage Beancount options, providing default values and tracking changes
 */
export class BeancountOptionsManager {
	private static _instance: BeancountOptionsManager;
	private sourceOptions: Map<string, Map<string, string>> = new Map();
	private effectiveOptions: Map<SupportedOption, BeancountOption> = new Map();
	private _onOptionChange = new Emitter<OptionsChangeEvent>();
	private workspaceUris: string[] = [];
	private workspaceMainFiles = new Map<string, string>();

	/** Event fired when an option changes */
	public readonly onOptionChange = this._onOptionChange.event.bind(this._onOptionChange);

	/**
	 * Default Beancount options
	 * From: https://beancount.github.io/docs/beancount_options_reference.html
	 */
	private readonly DEFAULT_OPTIONS: Record<OptionKeys, string> = {
		'allow_deprecated_none_for_tags_links': 'FALSE',
		'allow_pipe_separator': 'FALSE',
		'booking_method': 'STRICT',
		'infer_tolerance_from_cost': 'FALSE',
		'inferred_tolerance_default': '0.005',
		'inferred_tolerance_multiplier': '0.5',
		'insert_pythonpath': 'FALSE',
		'long_string_maxlines': '64',
		'plugin_processing_mode': 'default',
		'render_commas': 'FALSE',
		'operating_currency': '',
		'name_assets': 'Assets',
		'name_liabilities': 'Liabilities',
		'name_equity': 'Equity',
		'name_income': 'Income',
		'name_expenses': 'Expenses',
	};

	/**
	 * Get the singleton instance of the options manager
	 */
	public static getInstance(): BeancountOptionsManager {
		if (!BeancountOptionsManager._instance) {
			BeancountOptionsManager._instance = new BeancountOptionsManager();
		}
		return BeancountOptionsManager._instance;
	}

	public setWorkspaceFolders(workspaceUris: string[]): void {
		this.workspaceUris = [...workspaceUris].sort((a, b) => b.length - a.length);
	}

	public setWorkspaceMainFiles(contexts: readonly { workspaceUri: string; mainFileUri: string }[]): void {
		this.workspaceMainFiles = new Map(
			contexts.map(context => [context.workspaceUri, context.mainFileUri]),
		);
	}

	/**
	 * Get the value of a Beancount option
	 * @param name The option name
	 * @returns The option value, or undefined if not found
	 */
	public getOption(name: SupportedOption, scopeUri?: string): BeancountOption {
		if (scopeUri) {
			return this.getScopedOption(name, scopeUri) ?? this.getDefaultOption(name);
		}
		return this.effectiveOptions.get(name) ?? this.getDefaultOption(name);
	}

	private getDefaultOption(name: SupportedOption): BeancountOption {
		return new BeancountOption({
			value: this.DEFAULT_OPTIONS[name],
			source: undefined,
			isDefault: true,
		});
	}

	private getScopedOption(name: SupportedOption, scopeUri: string): BeancountOption | undefined {
		const workspaceUri = this.workspaceUris.find(uri => {
			const root = uri.endsWith('/') ? uri : `${uri}/`;
			return scopeUri === uri || scopeUri.startsWith(root);
		});
		const source = workspaceUri ? this.workspaceMainFiles.get(workspaceUri) : scopeUri;
		if (!source) return undefined;
		const value = this.sourceOptions.get(source)?.get(name);
		return value === undefined
			? undefined
			: new BeancountOption({ value, source, isDefault: false });
	}

	/**
	 * Set a Beancount option value
	 * @param name The option name
	 * @param value The option value
	 * @param source Optional source file where the option was defined
	 */
	public setOption(name: SupportedOption, value: string, source?: string): void {
		const sourceKey = source ?? '__legacy__';
		const existing = new Map(this.sourceOptions.get(sourceKey) ?? []);
		existing.set(name, value);
		this.replaceOptionsForSource(sourceKey, existing);
		logger.info(`Beancount option "${name}" set to "${value}"`);
	}

	public replaceOptionsForSource(source: string, options: Map<string, string>): void {
		const previous = this.sourceOptions.get(source) ?? new Map<string, string>();
		this.sourceOptions.set(source, new Map(options));
		const emitted = this.recomputeEffectiveOptions();
		this.emitScopedSourceChanges(source, previous, options, emitted);
	}

	public clearOptionsForSource(source: string): void {
		const previous = this.sourceOptions.get(source);
		if (!this.sourceOptions.delete(source)) {
			return;
		}
		const emitted = this.recomputeEffectiveOptions();
		this.emitScopedSourceChanges(source, previous!, new Map(), emitted);
	}

	private isSupportedOption(name: string): name is SupportedOption {
		return name in this.DEFAULT_OPTIONS;
	}

	private optionsEqual(a: BeancountOption | undefined, b: BeancountOption | undefined): boolean {
		if (!a && !b) return true;
		if (!a || !b) return false;
		return a.value === b.value && a.source === b.source && a.isDefault === b.isDefault;
	}

	private emitScopedSourceChanges(
		source: string,
		previous: Map<string, string>,
		next: Map<string, string>,
		alreadyEmitted: ReadonlySet<SupportedOption>,
	): void {
		if (![...this.workspaceMainFiles.values()].includes(source)) return;
		for (const name of new Set([...previous.keys(), ...next.keys()])) {
			if (!this.isSupportedOption(name) || alreadyEmitted.has(name)) continue;
			const previousValue = previous.get(name);
			const nextValue = next.get(name);
			if (previousValue === nextValue) continue;
			this._onOptionChange.fire({
				name,
				option: nextValue === undefined
					? this.getDefaultOption(name)
					: new BeancountOption({ value: nextValue, source, isDefault: false }),
				previousOption: previousValue === undefined
					? undefined
					: new BeancountOption({ value: previousValue, source, isDefault: false }),
			});
		}
	}

	private recomputeEffectiveOptions(): Set<SupportedOption> {
		const next = new Map<SupportedOption, BeancountOption>();
		const sources = Array.from(this.sourceOptions.keys()).sort((a, b) => a.localeCompare(b));
		for (const source of sources) {
			const options = this.sourceOptions.get(source);
			if (!options) continue;
			for (const [name, value] of options.entries()) {
				if (!this.isSupportedOption(name)) continue;
				next.set(name, new BeancountOption({ value, source, isDefault: false }));
			}
		}

		const changed = new Set<SupportedOption>([
			...Array.from(this.effectiveOptions.keys()),
			...Array.from(next.keys()),
		]);
		const emitted = new Set<SupportedOption>();
		for (const name of changed) {
			const previousOption = this.effectiveOptions.get(name);
			const nextOption = next.get(name) ?? new BeancountOption({
				value: this.DEFAULT_OPTIONS[name],
				source: undefined,
				isDefault: true,
			});
			const prevComparable = previousOption ?? new BeancountOption({
				value: this.DEFAULT_OPTIONS[name],
				source: undefined,
				isDefault: true,
			});
			if (this.optionsEqual(prevComparable, nextOption)) {
				continue;
			}
			this._onOptionChange.fire({
				name,
				option: nextOption,
				previousOption,
			});
			emitted.add(name);
		}

		this.effectiveOptions = next;
		return emitted;
	}

	/**
	 * Get the set of valid root account names based on current options
	 * @returns Set of valid root account names
	 */
	public getValidRootAccounts(scopeUri?: string): Set<string> {
		return new Set([
			this.getOption('name_assets', scopeUri).asString(),
			this.getOption('name_liabilities', scopeUri).asString(),
			this.getOption('name_equity', scopeUri).asString(),
			this.getOption('name_income', scopeUri).asString(),
			this.getOption('name_expenses', scopeUri).asString(),
		]);
	}
}

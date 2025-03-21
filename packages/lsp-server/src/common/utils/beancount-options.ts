import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import type { LiteralUnion } from 'type-fest';
import { Emitter } from 'vscode-languageserver';
import { parseExpression } from './expression-parser';

// Create a logger for the options manager
const logger = new Logger('BeancountOptions');

export type SupportedOption = 'infer_tolerance_from_cost' | 'inferred_tolerance_multiplier';
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
	private _options: Map<SupportedOption, BeancountOption> = new Map();
	private _onOptionChange = new Emitter<OptionsChangeEvent>();

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

	/**
	 * Get the value of a Beancount option
	 * @param name The option name
	 * @returns The option value, or undefined if not found
	 */
	public getOption(name: SupportedOption): BeancountOption {
		return this._options.get(name) ?? new BeancountOption({
			value: this.DEFAULT_OPTIONS[name],
			source: undefined,
			isDefault: true,
		});
	}

	/**
	 * Set a Beancount option value
	 * @param name The option name
	 * @param value The option value
	 * @param source Optional source file where the option was defined
	 */
	public setOption(name: SupportedOption, value: string, source?: string): void {
		const previousOption = this._options.get(name);

		const newOption = new BeancountOption({
			value,
			source,
			isDefault: false,
		});

		this._options.set(name, newOption);

		// Emit change event
		this._onOptionChange.fire({
			name,
			option: newOption,
			previousOption,
		});

		logger.info(`Beancount option "${name}" set to "${value}"`);
	}
}

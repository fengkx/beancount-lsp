import { shouldSuppressCurrencyForCurrentToken } from './completion-context';

export type TriggerInfoLike = {
	triggerCharacter: string | undefined;
	currentType: string;
	parentType: string | undefined;
	previousSiblingType: string | undefined;
	previousPreviousSiblingType: string | undefined;
};

export type IntentCompletionTextContextLike = {
	linePrefix: string;
	tokenText: string;
	inOpenQuote: boolean;
	afterHash: boolean;
	afterCaret: boolean;
};

type AddPayeesAndNarrationsParamsLike = {
	shouldIncludePayees: boolean;
	quotationStyle: 'none' | 'end' | 'both';
	addSpaceAfter: boolean;
};

export type CompletionIntentLike =
	| { type: 'date' }
	| { type: 'identifier' }
	| { type: 'tag' }
	| { type: 'link' }
	| { type: 'currency' }
	| { type: 'account' }
	| { type: 'payeeNarration'; params: AddPayeesAndNarrationsParamsLike };

export function resolveCompletionIntent(
	info: TriggerInfoLike,
	textCtx: IntentCompletionTextContextLike,
): CompletionIntentLike[] {
	const intents: CompletionIntentLike[] = [];
	const numberExprTypes = new Set(['unary_number_expr', 'number', 'binary_number_expr']);
	const trimmedPrefix = textCtx.linePrefix.trim();
	const suppressCurrencyForCurrentToken = shouldSuppressCurrencyForCurrentToken(textCtx.linePrefix);

	if (trimmedPrefix.length > 0 && /^\d{0,4}$/.test(trimmedPrefix)) {
		intents.push({ type: 'date' });
	}
	if (info.currentType === 'identifier' && info.previousSiblingType === 'date') {
		intents.push({ type: 'identifier' });
	}
	if (info.triggerCharacter === '#' || info.currentType === '#' || textCtx.afterHash) {
		intents.push({ type: 'tag' });
	}
	if (info.triggerCharacter === '^' || textCtx.afterCaret) {
		intents.push({ type: 'link' });
	}
	if (
		(numberExprTypes.has(info.previousSiblingType || '') && info.previousPreviousSiblingType === 'account')
		|| (
			info.currentType === 'flag'
			&& info.previousSiblingType === 'account'
			&& /^PSTCURM$/.test(textCtx.tokenText)
		)
		|| (
			info.currentType === 'currency'
			&& numberExprTypes.has(info.previousSiblingType || '')
		)
	) {
		if (!suppressCurrencyForCurrentToken) {
			intents.push({ type: 'currency' });
		}
	}

	if (
		(
			info.triggerCharacter === '"'
			&& (
				info.previousSiblingType === 'txn'
				|| info.currentType === 'payee'
				|| (
					info.previousSiblingType === 'txn'
					&& info.previousPreviousSiblingType === 'date'
				)
			)
		)
		|| (
			textCtx.inOpenQuote
			&& (info.previousSiblingType === 'txn' || info.currentType === 'payee')
		)
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'end',
				addSpaceAfter: true,
			},
		});
	}
	if (
		(
			info.triggerCharacter === '"'
			&& (info.previousSiblingType === 'payee' || info.previousSiblingType === 'string')
		)
		|| (
			textCtx.inOpenQuote
			&& (info.previousSiblingType === 'payee' || info.previousSiblingType === 'string')
		)
		|| (
			info.currentType === 'ERROR'
			&& info.previousSiblingType === 'string'
			&& info.previousPreviousSiblingType === 'txn'
			&& (info.triggerCharacter === '"' || textCtx.inOpenQuote)
		)
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: false,
				quotationStyle: 'end',
				addSpaceAfter: false,
			},
		});
	}
	if (
		(
			info.triggerCharacter === '"'
			&& info.currentType === 'narration'
		)
		|| (textCtx.inOpenQuote && info.currentType === 'narration')
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'both',
				addSpaceAfter: false,
			},
		});
	}
	if (
		info.currentType === 'ERROR'
		&& info.previousSiblingType === 'txn'
		&& info.previousPreviousSiblingType === 'date'
		&& (info.triggerCharacter === '"' || textCtx.inOpenQuote)
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'end',
				addSpaceAfter: true,
			},
		});
	}
	if (info.currentType === 'narration') {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'both',
				addSpaceAfter: true,
			},
		});
	}
	if (info.currentType === 'account' && info.parentType === 'posting') {
		intents.push({ type: 'account' });
	}

	if (intents.length === 0) {
		if (textCtx.inOpenQuote) {
			intents.push({
				type: 'payeeNarration',
				params: {
					shouldIncludePayees: true,
					quotationStyle: 'end',
					addSpaceAfter: true,
				},
			});
		}
		if (textCtx.afterHash) {
			intents.push({ type: 'tag' });
		}
		if (textCtx.afterCaret) {
			intents.push({ type: 'link' });
		}
		if (/^[AEIL][:A-Za-z0-9._/-]*$/i.test(textCtx.tokenText)) {
			intents.push({ type: 'account' });
		}
	}

	const seen = new Set<string>();
	return intents.filter((intent) => {
		const key = JSON.stringify(intent);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

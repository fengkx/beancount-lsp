import { CustomMessages, CustomMessagesSchema } from '@bean-lsp/shared/messages';
import * as vscode from 'vscode';
import { z } from 'zod';
import { ToolImpl } from './tool';

const GetHistoryContextSchema = CustomMessagesSchema.GetHistoryContext;
type Request = z.infer<typeof GetHistoryContextSchema.request>;
type Response = z.infer<typeof GetHistoryContextSchema.response>;

export class GetHistoryContextTool extends ToolImpl<Request> {
	public static readonly name = 'get-beancount-history-context';

	public static get inputZodSchema(): z.ZodSchema {
		return GetHistoryContextSchema.request;
	}

	public static get outputZodSchema(): z.ZodSchema {
		return GetHistoryContextSchema.response;
	}

	public static get displayName(): string {
		return 'Beancount History Context';
	}

	public static get modelDescription(): string {
		return 'Retrieves historical transaction context including payee, narration and accounts. When generating transaction, use this tool to get the historical context. Reuse payee and narration when suitable. IMPORTANT: You must only use existing accounts from the returned results, do not make up new accounts.';
	}

	public static get userDescription(): string {
		return 'Get historical transaction context from your Beancount ledger';
	}

	public static get canBeReferencedInPrompt(): boolean {
		return true;
	}

	public static get toolReferenceName(): string {
		return 'beancountHistoryContext';
	}

	public static get icon(): string {
		return '$(history)';
	}

	public static get tags(): string[] {
		return ['beancount', 'finance', 'history'];
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<Request>,
		_token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult> {
		const history = await this.ctx.client.sendRequest<Response>(
			CustomMessages.GetHistoryContext,
			options.input,
		);
		const parts = history.map((h) => {
			return new vscode.LanguageModelTextPart(
				`Payee: ${h.payee}\nNarration: ${h.narration}\nAccounts: ${h.accounts.join(', ')}` + '\n\n',
			);
		});
		return {
			content: [
				...parts,
				new vscode.LanguageModelTextPart(
					`When generating new transactions, please try to reuse existing payee and narration from above examples if they match semantically.\n`
						+ `IMPORTANT: You must ONLY use accounts that appear in the examples above. DO NOT make up or create new accounts.`,
				),
			],
		};
	}
}

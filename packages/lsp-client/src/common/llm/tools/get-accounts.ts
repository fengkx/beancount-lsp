import { CustomMessages, CustomMessagesSchema } from '@bean-lsp/shared/messages';
import * as vscode from 'vscode';
import { z } from 'zod';
import { ToolImpl } from './tool';

const GetAccountsSchema = CustomMessagesSchema.GetAccounts;
type Request = z.infer<typeof GetAccountsSchema.request>;
type Response = z.infer<typeof GetAccountsSchema.response>;

export class GetAccountsTool extends ToolImpl<Request> {
	public static readonly name = 'get-beancount-accounts';

	public static get inputZodSchema(): z.ZodSchema {
		return GetAccountsSchema.request;
	}

	public static get outputZodSchema(): z.ZodSchema {
		return GetAccountsSchema.response;
	}

	public static get displayName(): string {
		return 'Get Beancount Accounts';
	}

	public static get modelDescription(): string {
		return 'Retrieves a list of all accounts, response in plain text, each line is an account';
	}

	public static get userDescription(): string {
		return 'Get a list of accounts from your Beancount ledger';
	}

	public static get canBeReferencedInPrompt(): boolean {
		return true;
	}

	public static get toolReferenceName(): string {
		return 'beancountAccounts';
	}

	public static get icon(): string {
		return '$(account)';
	}

	public static get tags(): string[] {
		return ['beancount', 'finance'];
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<Request>,
		_token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult> {
		const accounts = await this.ctx.client.sendRequest<Response>(CustomMessages.GetAccounts, options.input);
		return {
			content: [
				new vscode.LanguageModelTextPart(accounts.join('\n')),
			],
		};
	}
}

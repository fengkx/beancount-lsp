import { CustomMessages, CustomMessagesSchema } from '@bean-lsp/shared';
import * as vscode from 'vscode';
import { z } from 'zod';
import { ToolImpl } from './tool';

const GetAccountsSchema = CustomMessagesSchema.GetAccounts;
type Request = z.infer<typeof GetAccountsSchema.request>;
type Response = z.infer<typeof GetAccountsSchema.response>;
export class GetAccountsTool extends ToolImpl<Request> {
	public readonly name = 'get-beancount-accounts';

	register() {
		this.ctx.subscriptions.push(vscode.lm.registerTool(this.name, this));
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<Request>,
		token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult> {
		const accounts = await this.client.sendRequest<Response>(CustomMessages.GetAccounts, options.input);
		return {
			content: [
				new vscode.LanguageModelTextPart(`Accounts: ${accounts.accounts.join(', ')}`),
			],
		};
	}
}

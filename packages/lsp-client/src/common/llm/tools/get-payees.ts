import { CustomMessages, CustomMessagesSchema } from '@bean-lsp/shared/messages';
import * as vscode from 'vscode';
import { z } from 'zod';
import { ToolImpl } from './tool';

const GetPayeesSchema = CustomMessagesSchema.GetPayees;
type Request = z.infer<typeof GetPayeesSchema.request>;
type Response = z.infer<typeof GetPayeesSchema.response>;

export class GetPayeesTool extends ToolImpl<Request> {
	public static readonly name = 'get-beancount-payees';

	public static get inputZodSchema(): z.ZodSchema {
		return GetPayeesSchema.request;
	}

	public static get outputZodSchema(): z.ZodSchema {
		return GetPayeesSchema.response;
	}

	public static get displayName(): string {
		return 'Get Beancount Payees';
	}

	public static get modelDescription(): string {
		return 'Retrieves a list of all payees used in transactions, response in plain text, each line is a payee';
	}

	public static get userDescription(): string {
		return 'Get a list of payees from your Beancount ledger';
	}

	public static get canBeReferencedInPrompt(): boolean {
		return true;
	}

	public static get toolReferenceName(): string {
		return 'beancountPayees';
	}

	public static get icon(): string {
		return '$(person)';
	}

	public static get tags(): string[] {
		return ['beancount', 'finance'];
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<Request>,
		_token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult> {
		const payees = await this.ctx.client.sendRequest<Response>(CustomMessages.GetPayees, options.input);
		return {
			content: [
				new vscode.LanguageModelTextPart(payees.join('\n')),
			],
		};
	}
}

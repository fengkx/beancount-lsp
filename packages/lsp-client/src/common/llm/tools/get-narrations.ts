import { CustomMessages, CustomMessagesSchema } from '@bean-lsp/shared/messages';
import * as vscode from 'vscode';
import { z } from 'zod';
import { ToolImpl } from './tool';

const GetNarrationsSchema = CustomMessagesSchema.GetNarrations;
type Request = z.infer<typeof GetNarrationsSchema.request>;
type Response = z.infer<typeof GetNarrationsSchema.response>;

export class GetNarrationsTool extends ToolImpl<Request> {
	public static readonly name = 'get-narrations';

	public static get inputZodSchema(): z.ZodSchema {
		return GetNarrationsSchema.request;
	}

	public static get outputZodSchema(): z.ZodSchema {
		return GetNarrationsSchema.response;
	}

	public static get displayName(): string {
		return 'Get Beancount Narrations';
	}

	public static get modelDescription(): string {
		return 'Retrieves a list of all narrations used in transactions, response in plain text, each line is a narration';
	}

	public static get userDescription(): string {
		return 'Get a list of narrations from your Beancount ledger';
	}

	public static get canBeReferencedInPrompt(): boolean {
		return true;
	}

	public static get toolReferenceName(): string {
		return 'beancountNarrations';
	}

	public static get icon(): string {
		return '$(note)';
	}

	public static get tags(): string[] {
		return ['beancount', 'finance'];
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<Request>,
		_token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult> {
		const narrations = await this.ctx.client.sendRequest<Response>(CustomMessages.GetNarrations, options.input);
		return {
			content: [
				new vscode.LanguageModelTextPart(narrations.join('\n')),
			],
		};
	}
}

import { BQL_QUERY_EXAMPLES, BQL_SYNTAX } from '@bean-lsp/shared/constraint/bean-query-doc';
import { CustomMessages, CustomMessagesSchema } from '@bean-lsp/shared/messages';
import * as vscode from 'vscode';
import { z } from 'zod';
import { ToolImpl } from './tool';

const RunBeanQuerySchema = CustomMessagesSchema.RunBeanQuery;
type Request = z.infer<typeof RunBeanQuerySchema.request>;
type Response = z.infer<typeof RunBeanQuerySchema.response>;

export class RunBeanQueryTool extends ToolImpl<Request> {
	public static readonly name = 'run-bean-query';

	public static get inputZodSchema(): z.ZodSchema {
		return RunBeanQuerySchema.request;
	}

	public static get outputZodSchema(): z.ZodSchema {
		return RunBeanQuerySchema.response;
	}

	public static get displayName(): string {
		return 'Run Beancount SQL Query';
	}

	public static get modelDescription(): string {
		return BQL_SYNTAX + '\n\n' + BQL_QUERY_EXAMPLES;
	}

	public static get userDescription(): string {
		return 'Run a SQL query against your Beancount ledger using bean-query';
	}

	public static get canBeReferencedInPrompt(): boolean {
		return true;
	}

	public static get toolReferenceName(): string {
		return 'beancountQuery';
	}

	public static get icon(): string {
		return '$(database)';
	}

	public static get tags(): string[] {
		return ['beancount', 'finance', 'query', 'sql'];
	}

	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<Request>,
		_token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult> {
		try {
			const response = await this.ctx.client.sendRequest<Response>(
				CustomMessages.RunBeanQuery,
				options.input,
			);

			if (!response.success) {
				return {
					content: [
						new vscode.LanguageModelTextPart(`Error executing query: ${response.error || 'Unknown error'}`),
					],
				};
			}

			if (!response.output || response.output.trim() === '') {
				return {
					content: [
						new vscode.LanguageModelTextPart('Query executed successfully, but returned no output.'),
					],
				};
			}

			return {
				content: [
					new vscode.LanguageModelTextPart(response.output),
				],
			};
		} catch (error) {
			console.error('Error running bean-query:', error);
			return {
				content: [
					new vscode.LanguageModelTextPart(
						`Error: ${error instanceof Error ? error.message : String(error)}`,
					),
				],
			};
		}
	}
}

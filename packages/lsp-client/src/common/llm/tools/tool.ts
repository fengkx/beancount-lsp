import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import type { LanguageModelTool } from 'vscode';
import type { BaseLanguageClient } from 'vscode-languageclient';
export abstract class ToolImpl<T> implements LanguageModelTool<T> {
	constructor(protected readonly ctx: ExtensionContext, protected readonly client: BaseLanguageClient) {
	}

	public abstract readonly name: string;
	public abstract invoke(
		options: vscode.LanguageModelToolInvocationOptions<T>,
		token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult>;

	public register() {
		this.ctx.subscriptions.push(vscode.lm.registerTool(this.name, this));
	}
}

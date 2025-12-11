import * as vscode from 'vscode';
import type { LanguageModelTool } from 'vscode';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import type { ExtensionContext } from '../../types';
export abstract class ToolImpl<T> implements LanguageModelTool<T> {
	constructor(
		protected readonly ctx: ExtensionContext<'browser' | 'node'>,
	) {
	}

	public static readonly name: string;

	public get name(): string {
		return this.constructor.name;
	}

	public static get inputZodSchema(): z.ZodType {
		throw new Error(`${this.name} must implement inputZodSchema`);
	}

	public static get outputZodSchema(): z.ZodSchema {
		throw new Error(`${this.name} must implement outputZodSchema`);
	}

	public static get displayName(): string {
		throw new Error(`${this.name} must implement displayName`);
	}

	public static get modelDescription(): string {
		throw new Error(`${this.name} must implement modelDescription`);
	}

	public static get userDescription(): string {
		throw new Error(`${this.name} must implement userDescription`);
	}

	public static get canBeReferencedInPrompt(): boolean {
		throw new Error(`${this.name} must implement canBeReferencedInPrompt`);
	}

	public static get toolReferenceName(): string {
		throw new Error(`${this.name} must implement toolReferenceName`);
	}

	public static get icon(): string {
		throw new Error(`${this.name} must implement icon`);
	}

	public static get tags(): string[] {
		throw new Error(`${this.name} must implement tags`);
	}

	public static get inputSchema(): Record<string, unknown> {
		// @ts-expect-error bypass
		return zodToJsonSchema(this.inputZodSchema);
	}

	public abstract invoke(
		options: vscode.LanguageModelToolInvocationOptions<T>,
		token: vscode.CancellationToken,
	): Promise<vscode.LanguageModelToolResult>;

	public register() {
		this.ctx.context.subscriptions.push(vscode.lm.registerTool(this.name, this));
	}
}

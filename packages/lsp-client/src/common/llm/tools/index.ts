import { GetAccountsTool } from './get-accounts';
import { GetHistoryContextTool } from './get-history-context';
import { ToolImpl } from './tool';

export const tools: Array<new(ctx: any, client: any) => ToolImpl<unknown>> = [
	GetAccountsTool,
	GetHistoryContextTool,
];

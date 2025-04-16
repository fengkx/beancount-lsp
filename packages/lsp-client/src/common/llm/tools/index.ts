import { ExtensionContext } from 'src/common/types';
import { GetAccountsTool } from './get-accounts';
import { GetHistoryContextTool } from './get-history-context';
import { ToolImpl } from './tool';

export const tools: Array<new(ctx: ExtensionContext<'browser' | 'node'>) => ToolImpl<unknown>> = [
	GetAccountsTool,
	GetHistoryContextTool,
];

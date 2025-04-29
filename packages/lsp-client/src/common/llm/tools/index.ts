import type { ExtensionContext } from '../../types';
import { GetAccountsTool } from './get-accounts';
import { GetHistoryContextTool } from './get-history-context';
import { GetNarrationsTool } from './get-narrations';
import { GetPayeesTool } from './get-payees';
import { RunBeanQueryTool } from './run-bean-query';
import { ToolImpl } from './tool';

export const tools: Array<new(ctx: ExtensionContext<'browser' | 'node'>) => ToolImpl<unknown>> = [
	GetAccountsTool,
	GetHistoryContextTool,
	GetPayeesTool,
	GetNarrationsTool,
	RunBeanQueryTool,
];

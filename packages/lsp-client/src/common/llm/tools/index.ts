import type { ExtensionContext } from '../../types';
import { GetAccountsTool } from './get-accounts';
import { GetNarrationsTool } from './get-narrations';
import { GetPayeesTool } from './get-payees';
import { RunBeanQueryTool } from './run-bean-query';
import { ToolImpl } from './tool';

export const tools: Array<new(ctx: ExtensionContext<'browser' | 'node'>) => ToolImpl<unknown>> = [
	GetAccountsTool,
	GetPayeesTool,
	GetNarrationsTool,
	RunBeanQueryTool,
];

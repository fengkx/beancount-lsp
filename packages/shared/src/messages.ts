/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';
import { BQL_COLUMNS, BQL_FUNCTIONS } from './constraint/bean-query-doc';

export namespace CustomMessages {
	export const FileRead = 'beanLspCustom/fileRead' as const;
	export const ListBeanFile = 'beanLsPCustom/listBeanFile' as const;

	export const QueueInit = 'beanLspCustom/queueInit' as const;
	export const GetAccounts = 'beanLspCustom/getAccounts' as const;
	export const GetHistoryContext = 'beanLspCustom/getHistoryContext' as const;
	export const GetPayees = 'beanLspCustom/getPayees' as const;
	export const GetNarrations = 'beanLspCustom/getNarrations' as const;
	export const RunBeanQuery = 'beanLspCustom/runBeanQuery' as const;
}

export namespace CustomMessagesSchema {
	export const GetAccounts = {
		request: z.object({
			query: z.string().optional().describe(
				'optional query keyword to filter accounts, if not provided, all accounts will be returned',
			),
		}),
		response: z.array(z.string()),
	};

	export const GetHistoryContext = {
		request: z.object({}),
		response: z.array(z.object({
			payee: z.string(),
			narration: z.string(),
			accounts: z.array(z.string()),
		})),
	};

	export const GetPayees = {
		request: z.object({
			query: z.string().optional().describe(
				'optional query keyword to filter payees, if not provided, all payees will be returned',
			),
		}),
		response: z.array(z.string()),
	};

	export const GetNarrations = {
		request: z.object({
			query: z.string().optional().describe(
				'optional query keyword to filter narrations, if not provided, all narrations will be returned',
			),
		}),
		response: z.array(z.string()),
	};

	export const RunBeanQuery = {
		request: z.object({
			query: z.string().describe(`The bean-query SQL query to execute. ${BQL_COLUMNS} \n\n ${BQL_FUNCTIONS}`),
		}),
		response: z.object({
			success: z.boolean(),
			output: z.string().optional(),
			error: z.string().optional(),
		}),
	};
}

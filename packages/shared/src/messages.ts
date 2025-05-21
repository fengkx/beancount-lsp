import { z } from 'zod';
import { BQL_COLUMNS, BQL_FUNCTIONS } from './constraint/bean-query-doc';

export const CustomMessages = {
	FileRead: 'beanLspCustom/fileRead' as const,
	ListBeanFile: 'beanLsPCustom/listBeanFile' as const,
	QueueInit: 'beanLspCustom/queueInit' as const,
	GetAccounts: 'beanLspCustom/getAccounts' as const,
	GetPayees: 'beanLspCustom/getPayees' as const,
	GetNarrations: 'beanLspCustom/getNarrations' as const,
	RunBeanQuery: 'beanLspCustom/runBeanQuery' as const,
};

export const GetAccountsSchema = {
	request: z.object({
		query: z.string().optional().describe(
			'optional query keyword to filter accounts, if not provided, all accounts will be returned',
		),
	}),
	response: z.array(z.string()),
};

export const GetPayeesSchema = {
	request: z.object({
		query: z.string().optional().describe(
			'optional query keyword to filter payees, if not provided, all payees will be returned',
		),
	}),
	response: z.array(z.string()),
};

export const GetNarrationsSchema = {
	request: z.object({
		query: z.string().optional().describe(
			'optional query keyword to filter narrations, if not provided, all narrations will be returned',
		),
	}),
	response: z.array(z.string()),
};

export const RunBeanQuerySchema = {
	request: z.object({
		query: z.string().describe(`The bean-query SQL query to execute. ${BQL_COLUMNS} \n\n ${BQL_FUNCTIONS}`),
	}),
	response: z.object({
		success: z.boolean(),
		output: z.string().optional(),
		error: z.string().optional(),
	}),
};

export const CustomMessagesSchema = {
	GetAccounts: GetAccountsSchema,
	GetPayees: GetPayeesSchema,
	GetNarrations: GetNarrationsSchema,
	RunBeanQuery: RunBeanQuerySchema,
};

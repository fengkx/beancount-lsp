/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

export namespace CustomMessages {
	export const FileRead = 'beanLspCustom/fileRead' as const;
	export const ListBeanFile = 'beanLsPCustom/listBeanFile' as const;

	export const QueueInit = 'beanLspCustom/queueInit' as const;
	export const GetAccounts = 'beanLspCustom/getAccounts' as const;
	export const GetHistoryContext = 'beanLspCustom/getHistoryContext' as const;
}

export namespace CustomMessagesSchema {
	export const GetAccounts = {
		request: z.object({
			query: z.string().optional(),
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
}

import * as fs from 'fs';
import * as path from 'path';
import { CompletionTriggerKind, CompletionType, TrainingExample } from '../src/model/neural-network';

/**
 * Generate training data for Beancount completion neural network
 *
 * This script creates realistic training examples for different completion types
 * in Beancount files. The data is saved in JSONL format in the train directory.
 *
 * Training data is optimized based on VSCode completion trigger mechanisms:
 * 1. TriggerCharacter - Completion triggered by specific characters
 * 2. Invoked - Completion triggered manually (Ctrl+Space)
 *    - Respects wordPattern in language-configuration.json
 * 3. TriggerForIncompleteCompletions - When current completion list is incomplete
 */

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'train');
const NUM_EXAMPLES = 400; // 增加到400个训练样本

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// VSCode trigger characters (derived from language-server implementation)
const TRIGGER_CHARS = {
	ACCOUNT: [' ', ':'], // Space or colon can trigger account completion
	CURRENCY: [' '], // Space after amount can trigger currency
	PAYEE: ['"'], // Quote can trigger payee
	NARRATION: ['"'], // Quote can trigger narration
	TAG: ['#'], // Hash can trigger tag
	LINK: ['^'], // Caret can trigger link
	DATE: ['2'], // Numeric digit can trigger date (usually years start with 2)
};

// 更多样化的Beancount账户名，包含中英文混合的通用场景
const accounts = [
	// 资产账户 - Assets
	'Assets:Bank:BankA',
	'Assets:Bank:BankB',
	'Assets:Bank:BankC',
	'Assets:Bank:BankD',
	'Assets:Bank:NetBank',
	'Assets:Cash',
	'Assets:DigitalWallet:WalletA',
	'Assets:DigitalWallet:WalletB',
	'Assets:FinanceProduct:BankA',
	'Assets:FinanceProduct:BankB',
	'Assets:Funds',
	'Assets:Stock:BrokerA:Shares',
	'Assets:Stock:BrokerA:Cash',
	'Assets:Stock:BrokerB:Shares',
	'Assets:Stock:BrokerB:Cash:USD',
	'Assets:Stock:BrokerB:Cash:HKD',
	'Assets:Gold',
	'Assets:Limited:HousingFund',
	'Assets:Limited:Medical',

	// 负债账户 - Liabilities
	'Liabilities:CreditCard:BankA',
	'Liabilities:CreditCard:BankB',
	'Liabilities:CreditCard:BankC',
	'Liabilities:CreditCard:BankD',
	'Liabilities:Loan:Mortgage',
	'Liabilities:Loan:Car',

	// 费用账户 - Expenses
	'Expenses:Food',
	'Expenses:Food:Snack',
	'Expenses:Shopping:Home',
	'Expenses:Shopping:Production',
	'Expenses:Traffic',
	'Expenses:Health:Outpatient',
	'Expenses:Health:Examination',
	'Expenses:Travel',
	'Expenses:Entertainment',
	'Expenses:Government:IncomeTax',
	'Expenses:Government:Pension',
	'Expenses:Government:Unemployment',
	'Expenses:Trades:Fee',

	// 收入账户 - Income
	'Income:Salary:CompanyA',
	'Income:Invest',
	'Income:Invest:Dividend',
	'Income:Invest:PnL',
	'Income:Bonus',

	// 权益账户 - Equity
	'Equity:HousingFund:CompanyA',
	'Equity:Medical:National',
	'Equity:Opening-Balances',
];

// 更多货币种类，包括加密货币和股票代码
const currencies = [
	// 法定货币
	'USD',
	'CNY',
	'HKD',
	'EUR',
	'JPY',
	'GBP',
	'CAD',
	'AUD',
	'CHF',
	// 加密货币
	'BTC',
	'ETH',
	// 股票代码
	'STKA',
	'STKB',
	'STKC',
	'STKD',
	'ETFA',
	'ETFB',
	'SH_123456',
];

// 基于通用数据的商户名
const payees = [
	// 餐饮类
	'超市A',
	'外卖平台A',
	'外卖平台B',
	'外卖平台C',
	'餐厅A',
	'餐厅B',
	'餐厅C',
	'快餐店A',
	'餐馆A',
	'餐馆B',
	'咖啡店A',
	'面馆A',
	'小吃店A',
	'披萨店A',
	'便利店A',
	'便利店B',

	// 购物类
	'SaaS服务A',
	'电商平台A',
	'超市B',

	// 金融类
	'银行A信用卡',
	'银行B信用卡',
	'银行C信用卡',
	'银行D信用卡还款',
	'券商A',
	'券商B',
	'网络银行A',

	// 公司
	'公司A',
	'个人',
	'公积金中心',

	// 基金
	'基金公司A产品1',
	'基金公司B产品1',
	'基金公司C产品1',
	'基金公司D产品1',
	'基金公司E产品1',
	'基金公司F产品1',
	'基金公司G产品1',
	'基金公司H产品1',

	// 交通出行
	'交通卡A',
	'打车平台A',

	// 医疗
	'医院A',
];

// 基于通用数据的交易描述
const narrations = [
	// 基础消费
	'午餐',
	'晚餐',
	'早餐',
	'宵夜',
	'零食',
	'水',
	'咖啡',
	'饮料',

	// 财务操作
	'还款',
	'定投',
	'基金购买',
	'转账',
	'货币转换',
	'活期理财',
	'理财收益',
	'买入',
	'卖出',
	'分红',

	// 交通
	'地铁',
	'公交车',
	'拼车',

	// 工作相关
	'工资',
	'公积金缴纳',
	'公积金提取',

	// 其他
	'月费',
	'看病',
	'日用品',
	'物资',
	'门票',
	'促销活动',
];

// 基于通用数据的标签
const tags = [
	'trip_tokyo',
	'food',
	'transport',
	'medical',
	'salary',
	'dividend',
	'shopping',
	'entertainment',
	'housing',
	'investment',
	'expense',
	'gift',
	'education',
	'business',
	'personal',
];

// 链接示例
const links = [
	'trip-2023',
	'trip-tokyo',
	'medical-2023',
	'salary-march',
	'dividend-q1',
	'shopping-online',
	'vacation-summer',
	'work-expense',
	'family-event',
];

/**
 * Helper function to get a random item from an array
 */
function getRandomItem<T>(items: T[]): T {
	if (items.length === 0) {
		throw new Error('Cannot get random item from empty array');
	}
	const index = Math.floor(Math.random() * items.length);
	return items[index]!;
}

/**
 * Helper function to get a random date string in Beancount format (YYYY-MM-DD)
 */
function getRandomDate(): string {
	const year = 2020 + Math.floor(Math.random() * 6); // 2020-2025
	const month = 1 + Math.floor(Math.random() * 12);
	const day = 1 + Math.floor(Math.random() * 28);

	return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

/**
 * Generate a random amount with 2 decimal places
 */
function getRandomAmount(): string {
	const amount = (Math.random() * 1000).toFixed(2);
	return amount;
}

/**
 * Generate training examples for account completion
 * Accounts match pattern: ([A-Z][A-Za-z0-9\-]*)(:[A-Z][A-Za-z0-9\-]*)+
 */
function generateAccountExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// 单行上下文，不包含任何换行符
	const singleLineContexts = [
		// Basic transaction context
		(date: string) => `${date} * "Some Payee" "Some Narration"`,
		// After another account (posting context) - 单行表示
		(date: string) => `    Assets:Checking 10 USD`,
		// With tags and links
		(date: string) => `${date} * "Some Payee" "Some Narration" #tag ^link`,
		// With metadata - 单行表示
		(date: string) => `    ; This is a comment`,
		// 中文商家和描述 - 单行表示
		(date: string) => `    `,
		// 中英文混合账户名场景 - 单行表示
		(date: string) => `    Income:Salary:CompanyA -12345.00 CNY`,
	];

	// Generate examples for account completion
	for (let i = 0; i < singleLineContexts.length; i++) {
		const date = getRandomDate();
		const contextFn = singleLineContexts[i];
		if (contextFn) {
			// 确保上下文不包含换行符
			const currentLine = contextFn(date).replace(/\n/g, ' ').trim();

			// 1. TriggerCharacter: Space triggers account completion
			const spaceChar = TRIGGER_CHARS.ACCOUNT[0];
			if (spaceChar) {
				examples.push({
					triggerChar: spaceChar,
					triggerKind: CompletionTriggerKind.TriggerCharacter,
					line: `${currentLine} `,
					completionType: CompletionType.ACCOUNT,
				});
			}

			// 2. TriggerCharacter: Colon triggers account completion (matches wordPattern)
			const colonChar = TRIGGER_CHARS.ACCOUNT[1];
			if (colonChar) {
				examples.push({
					triggerChar: colonChar,
					triggerKind: CompletionTriggerKind.TriggerCharacter,
					line: `${currentLine} Assets:`,
					completionType: CompletionType.ACCOUNT,
				});
			}

			// 3. Invoked: Partial account name (matches wordPattern)
			const partialAccounts = [
				'A',
				'As',
				'Ass',
				'Asse',
				'Asset',
				'Assets',
				'L',
				'Li',
				'Lia',
				'Liab',
				'E',
				'Ex',
				'Exp',
				'Expe',
				'I',
				'In',
				'Inc',
				'Inco',
				'Eq',
				'Equ',
				'Equi',
			];

			examples.push({
				triggerChar: null,
				triggerKind: CompletionTriggerKind.Invoked,
				line: `${currentLine} ${getRandomItem(partialAccounts)}`,
				completionType: CompletionType.ACCOUNT,
			});

			// 4. Invoked: Partial sub-account (matches wordPattern)
			examples.push({
				triggerChar: null,
				triggerKind: CompletionTriggerKind.Invoked,
				line: `${currentLine} Assets:B`,
				completionType: CompletionType.ACCOUNT,
			});

			// 5. TriggerForIncompleteCompletions: Refining completions
			examples.push({
				triggerChar: null,
				triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
				line: `${currentLine} Assets:Bank:`,
				completionType: CompletionType.ACCOUNT,
			});
		}
	}

	// 6. 中文环境下的账户补全 - 单行
	examples.push({
		triggerChar: TRIGGER_CHARS.ACCOUNT[0] || null,
		triggerKind: CompletionTriggerKind.TriggerCharacter,
		line: `${getRandomDate()} * "网络银行A" "活期理财" `,
		completionType: CompletionType.ACCOUNT,
	});

	return examples;
}

/**
 * Generate training examples for currency completion
 * Currencies match pattern: [A-Z][A-Z0-9\\'._\\-]*
 */
function generateCurrencyExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// 单行上下文
	const singleLineContexts = [
		// 账户和金额后的补全
		(date: string, account: string, amount: string) => `    ${account} ${amount}`,

		// 带注释的交易最后一行
		(date: string, account: string, amount: string) => `    ${account} ${amount} ; comment`,

		// 带标签的交易最后一行
		(date: string, account: string, amount: string) => `    ${account} ${amount} #tag`,

		// 多货币交易最后一行
		(date: string, account: string, amount: string) => `    ${account} ${amount}`,

		// 中文环境下的货币补全
		(date: string, account: string, amount: string) => `    ${account} ${amount}`,

		// 股票交易场景
		(date: string, account: string, amount: string) => `    ${account} 10 `,
	];

	// Generate examples for currency completion
	for (let i = 0; i < singleLineContexts.length; i++) {
		const date = getRandomDate();
		const account = getRandomItem(accounts);
		const amount = getRandomAmount();
		const contextFn = singleLineContexts[i];
		if (contextFn) {
			// 确保不包含换行符
			const currentLine = contextFn(date, account, amount).replace(/\n/g, ' ').trim();

			// 1. TriggerCharacter: Space after amount triggers currency completion
			const spaceChar = TRIGGER_CHARS.CURRENCY[0];
			if (spaceChar) {
				examples.push({
					triggerChar: spaceChar,
					triggerKind: CompletionTriggerKind.TriggerCharacter,
					line: `${currentLine} `,
					completionType: CompletionType.CURRENCY,
				});
			}

			// 2. Invoked: Partial currency (matches wordPattern)
			const partialCurrencies = ['U', 'US', 'C', 'CN', 'H', 'HK', 'G', 'GB', 'B', 'BT', 'ET', 'GO', 'TS'];

			examples.push({
				triggerChar: null,
				triggerKind: CompletionTriggerKind.Invoked,
				line: `${currentLine} ${getRandomItem(partialCurrencies)}`,
				completionType: CompletionType.CURRENCY,
			});

			// 3. TriggerForIncompleteCompletions: Refining currency
			examples.push({
				triggerChar: null,
				triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
				line: `${currentLine} CN`,
				completionType: CompletionType.CURRENCY,
			});
		}
	}

	// 4. 股票代码补全 - 单行
	examples.push({
		triggerChar: null,
		triggerKind: CompletionTriggerKind.Invoked,
		line: `    Assets:Stock:STKB:Shares 100 SH_`,
		completionType: CompletionType.CURRENCY,
	});

	return examples;
}

/**
 * Generate training examples for payee completion
 */
function generatePayeeExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// 额外的开头上下文 - 确保只取最后一行
	const prefixes = [
		'', // 直接开始
		'# ', // 注释后
		'// 上次交易 ', // 上个交易后的注释
	];

	// Generate examples for payee completion
	for (let i = 0; i < payees.length / 3; i++) {
		const date = getRandomDate();
		const prefix = getRandomItem(prefixes);

		// 构建单行示例
		const currentLine = `${prefix}${date} * "`;

		// 1. TriggerCharacter: Quote triggers payee completion
		const quoteChar = TRIGGER_CHARS.PAYEE[0];
		if (quoteChar) {
			examples.push({
				triggerChar: quoteChar,
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				line: currentLine,
				completionType: CompletionType.PAYEE,
			});
		}

		// 2. Invoked: Partial payee - 中文
		const partialChinesePayees = [
			'超',
			'外',
			'餐',
			'咖',
			'公',
			'网',
			'交',
			'银',
			'券',
			'基',
			'医',
		];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${prefix}${date} * "${getRandomItem(partialChinesePayees)}`,
			completionType: CompletionType.PAYEE,
		});

		// 3. Invoked: Partial payee - 英文
		const partialEnglishPayees = ['L', 'Lo', 'c', 'cu', '7', '71'];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${prefix}${date} * "${getRandomItem(partialEnglishPayees)}`,
			completionType: CompletionType.PAYEE,
		});

		// 4. TriggerForIncompleteCompletions: Refining payee
		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
			line: `${prefix}${date} * "外卖`,
			completionType: CompletionType.PAYEE,
		});
	}

	return examples;
}

/**
 * Generate training examples for narration completion
 */
function generateNarrationExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// Generate examples for narration completion
	for (let i = 0; i < narrations.length / 3; i++) {
		const date = getRandomDate();
		const payee = getRandomItem(payees);

		// 构建单行示例
		const currentLine = `${date} * "${payee}" "`;

		// 1. TriggerCharacter: Quote triggers narration completion
		if (TRIGGER_CHARS.NARRATION[0]) {
			examples.push({
				triggerChar: TRIGGER_CHARS.NARRATION[0] || null,
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				line: currentLine,
				completionType: CompletionType.NARRATION,
			});
		}

		// 2. Invoked: Partial narration - 中文
		const partialChineseNarrations = ['午', '晚', '早', '还', '定', '转', '买', '卖'];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${date} * "${payee}" "${getRandomItem(partialChineseNarrations)}`,
			completionType: CompletionType.NARRATION,
		});

		// 3. Invoked: Partial narration - 英文
		const partialEnglishNarrations = ['d', 'di', 'l', 'lu', 'b', 'br'];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${date} * "券商B" "${getRandomItem(partialEnglishNarrations)}`,
			completionType: CompletionType.NARRATION,
		});

		// 4. TriggerForIncompleteCompletions: Refining narration
		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
			line: `${date} * "${payee}" "定投`,
			completionType: CompletionType.NARRATION,
		});
	}

	return examples;
}

/**
 * Generate training examples for tag completion
 * Tags match pattern: #[\w\-]+
 */
function generateTagExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// 单行上下文
	const singleLineContexts = [
		// Basic transaction
		(date: string, payee: string, narration: string) => `${date} * "${payee}" "${narration}"`,

		// After another tag
		(date: string, payee: string, narration: string) => `${date} * "${payee}" "${narration}" #food`,

		// 带交易数据的行 - 单行表示
		(date: string, payee: string, narration: string) => `${date} * "${payee}" "${narration}" ; with posting`,

		// 中文交易上下文
		(date: string, payee: string, narration: string) => `${date} * "${payee || '旅游A'}" "${narration || '门票'}"`,
	];

	// Generate examples for tag completion
	for (let i = 0; i < singleLineContexts.length; i++) {
		const date = getRandomDate();
		const payee = getRandomItem(payees);
		const narration = getRandomItem(narrations);
		const contextFn = singleLineContexts[i];

		if (!contextFn) continue;

		// 确保不包含换行符
		const currentLine = contextFn(date, payee, narration).replace(/\n/g, ' ').trim();

		// 1. TriggerCharacter: Hash triggers tag completion
		if (TRIGGER_CHARS.TAG[0]) {
			examples.push({
				triggerChar: TRIGGER_CHARS.TAG[0] || null,
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				line: `${currentLine} #`,
				completionType: CompletionType.TAG,
			});
		}

		// 2. Invoked: Partial tag (matches wordPattern)
		const partialTags = ['t', 'tr', 's', 'sh', 'm', 'me', 'f', 'fo', 'i', 'in'];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${currentLine} #${getRandomItem(partialTags)}`,
			completionType: CompletionType.TAG,
		});

		// 3. TriggerForIncompleteCompletions: Refining tag
		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
			line: `${currentLine} #trip_`,
			completionType: CompletionType.TAG,
		});
	}

	return examples;
}

/**
 * Generate training examples for link completion
 * Links match pattern: \^[\w\-]+
 */
function generateLinkExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// 单行上下文
	const singleLineContexts = [
		// Basic transaction
		(date: string, payee: string, narration: string) => `${date} * "${payee}" "${narration}"`,

		// After a tag
		(date: string, payee: string, narration: string) => `${date} * "${payee}" "${narration}" #food`,

		// After another link
		(date: string, payee: string, narration: string) => `${date} * "${payee}" "${narration}" ^trip-2023`,

		// 中文交易场景
		(date: string, payee: string, narration: string) =>
			`${date} * "${payee || '医院A'}" "${narration || '看病'}" #medical`,
	];

	// Generate examples for link completion
	for (let i = 0; i < singleLineContexts.length; i++) {
		const date = getRandomDate();
		const payee = getRandomItem(payees);
		const narration = getRandomItem(narrations);
		const contextFn = singleLineContexts[i];

		if (!contextFn) continue;

		// 确保不包含换行符
		const currentLine = contextFn(date, payee, narration).replace(/\n/g, ' ').trim();

		// 1. TriggerCharacter: Caret triggers link completion
		if (TRIGGER_CHARS.LINK[0]) {
			examples.push({
				triggerChar: TRIGGER_CHARS.LINK[0] || null,
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				line: `${currentLine} ^`,
				completionType: CompletionType.LINK,
			});
		}

		// 2. Invoked: Partial link (matches wordPattern)
		const partialLinks = ['t', 'tr', 'm', 'me', 's', 'sa', 'd', 'di', 'v', 'va'];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${currentLine} ^${getRandomItem(partialLinks)}`,
			completionType: CompletionType.LINK,
		});

		// 3. TriggerForIncompleteCompletions: Refining link
		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
			line: `${currentLine} ^medical-`,
			completionType: CompletionType.LINK,
		});
	}

	return examples;
}

/**
 * Generate training examples for date completion
 * Dates match pattern: -?\d*\.?\d+
 */
function generateDateExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// Various contexts where date completion might be triggered - 简化为单行
	const dateContexts = [
		// Start of line (new transaction)
		() => ``,

		// After a comment
		() => `; 上一笔交易 `,

		// After another transaction (简化为一行注释)
		() => `; 上个交易结束 `,

		// 在注释中的balance语句前
		() => `; 需要添加一个balance断言 `,
	];

	// Generate examples for date completion
	for (let i = 0; i < dateContexts.length; i++) {
		let contextFn = dateContexts[i];
		if (!contextFn) continue;

		const currentLine = contextFn();

		// 1. TriggerCharacter: Digit 2 (common year prefix) triggers date completion
		if (TRIGGER_CHARS.DATE[0]) {
			examples.push({
				triggerChar: TRIGGER_CHARS.DATE[0] || null,
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				line: `${currentLine}2`,
				completionType: CompletionType.DATE,
			});
		}

		// 2. Invoked: Partial date (matches wordPattern)
		const partialDates = ['2', '20', '202', '2023', '2023-', '2023-0', '2023-03-'];

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `${currentLine}${getRandomItem(partialDates)}`,
			completionType: CompletionType.DATE,
		});

		// 3. TriggerForIncompleteCompletions: Refining date
		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
			line: `${currentLine}2025-0`,
			completionType: CompletionType.DATE,
		});

		// 4. pad或balance语句中的日期 - 简化为单行
		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: `2023-03-01 balance Assets:Bank:BankA `,
			completionType: CompletionType.DATE,
		});
	}

	return examples;
}

/**
 * Generate training examples where no completion should be provided
 */
function generateNoneExamples(): TrainingExample[] {
	const examples: TrainingExample[] = [];

	// Various contexts where no completion should be triggered - 简化为单行
	const noneContexts = [
		// Comments
		() => `;`,
		() => `; 这是一条注释`,

		// Option directives
		() => `option`,
		() => `option "title"`,

		// Plugin directives
		() => `plugin`,
		() => `plugin "beancount.plugins.something"`,

		// In the middle of dates (not word boundary)
		() => `2021-01-0`,

		// After complete transaction (简化为注释)
		() => `; 已完成的交易`,

		// balance语句
		() => `2025-03-10 balance Assets:Bank:BankA 13425.39 CNY`,

		// pad语句
		() => `2025-03-09 pad Assets:Bank:BankA Income:Invest`,
	];

	// Generate examples for no completion
	for (let i = 0; i < noneContexts.length; i++) {
		let contextFn = noneContexts[i];
		if (!contextFn) continue;

		const currentLine = contextFn();

		examples.push({
			triggerChar: null,
			triggerKind: CompletionTriggerKind.Invoked,
			line: currentLine,
			completionType: CompletionType.NONE,
		});

		// Add some variations with different trigger kinds
		if (i % 2 === 0) {
			examples.push({
				triggerChar: ' ',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				line: `${currentLine} `,
				completionType: CompletionType.NONE,
			});
		}
	}

	return examples;
}

/**
 * 添加一个帮助函数，确保字符串不包含换行符
 */
function ensureSingleLine(text: string): string {
	return text.replace(/\n/g, ' ').trim();
}

/**
 * Main function to generate and save training data
 */
function generateTrainingData() {
	console.log(`Generating training data for Beancount completion...`);

	// Collect all examples
	let allExamples: TrainingExample[] = [
		...generateAccountExamples(),
		...generateCurrencyExamples(),
		...generatePayeeExamples(),
		...generateNarrationExamples(),
		...generateTagExamples(),
		...generateLinkExamples(),
		...generateDateExamples(),
		...generateNoneExamples(),
	];

	// 确保所有示例都不包含换行符
	allExamples = allExamples.map(example => ({
		...example,
		line: ensureSingleLine(example.line),
	}));

	// Shuffle examples
	allExamples = shuffleArray(allExamples);

	// Cap at NUM_EXAMPLES if we have more
	if (allExamples.length > NUM_EXAMPLES) {
		allExamples = allExamples.slice(0, NUM_EXAMPLES);
	}

	// Balance examples by type
	allExamples = balanceExamplesByType(allExamples);

	// 最终验证确保没有换行符
	const hasNewlines = allExamples.some(example => example.line.includes('\n'));
	if (hasNewlines) {
		console.warn('警告: 仍有训练示例包含换行符，进行最终过滤');
		allExamples = allExamples.map(example => ({
			...example,
			line: example.line.replace(/\n/g, ' ').trim(),
		}));
	}

	// Output statistics
	const typeCounts = new Map<CompletionType, number>();
	for (const example of allExamples) {
		typeCounts.set(example.completionType, (typeCounts.get(example.completionType) || 0) + 1);
	}

	console.log(`Generated ${allExamples.length} training examples:`);
	for (const [type, count] of typeCounts.entries()) {
		console.log(`- ${CompletionType[type]}: ${count} examples`);
	}

	// Save to JSONL file
	const outputPath = path.join(OUTPUT_DIR, 'training-data.jsonl');
	const jsonlContent = allExamples.map(example => JSON.stringify(example)).join('\n');
	fs.writeFileSync(outputPath, jsonlContent, 'utf8');

	console.log(`Training data saved to ${outputPath}`);
}

/**
 * Helper function to shuffle an array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i]!, result[j]!] = [result[j]!, result[i]!];
	}
	return result;
}

/**
 * Balance examples by type to ensure more equal distribution
 * This helps prevent the model from being biased toward over-represented classes
 */
function balanceExamplesByType(examples: TrainingExample[]): TrainingExample[] {
	// Count examples by type
	const typeCountMap = new Map<CompletionType, number>();
	const typeExamplesMap = new Map<CompletionType, TrainingExample[]>();

	for (const example of examples) {
		if (!typeCountMap.has(example.completionType)) {
			typeCountMap.set(example.completionType, 0);
			typeExamplesMap.set(example.completionType, []);
		}

		typeCountMap.set(example.completionType, typeCountMap.get(example.completionType)! + 1);
		typeExamplesMap.get(example.completionType)!.push(example);
	}

	// Find the target count per type (approximately equal distribution)
	const numTypes = Object.keys(CompletionType).length / 2; // Enum has value-to-name and name-to-value mappings
	const targetCount = Math.min(50, Math.floor(NUM_EXAMPLES / numTypes));

	// Balance the dataset
	const balancedExamples: TrainingExample[] = [];

	for (const type of typeExamplesMap.keys()) {
		const typeExamples = typeExamplesMap.get(type)!;

		if (typeExamples.length <= targetCount) {
			// If we have fewer than the target, include all of them
			balancedExamples.push(...typeExamples);
		} else {
			// If we have more than the target, randomly sample
			const shuffled = shuffleArray(typeExamples);
			balancedExamples.push(...shuffled.slice(0, targetCount));
		}
	}

	return shuffleArray(balancedExamples);
}

// Run the generator
generateTrainingData();

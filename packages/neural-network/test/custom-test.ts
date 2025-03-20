import * as path from 'path';
import {
	CompletionNeuralNetwork,
	CompletionTriggerKind,
	CompletionType,
	TriggerInfo,
} from '../src/model/neural-network';

/**
 * 测试神经网络模型在中文Beancount数据上的表现
 */
function testModelWithChineseData() {
	console.log('测试神经网络模型在中文Beancount数据上的表现...');

	// 初始化模型
	const model = new CompletionNeuralNetwork();

	// 加载训练好的模型
	const modelPath = path.join(__dirname, '../models/model.json');
	const success = model.loadModel(modelPath);

	if (!success) {
		console.error('无法加载模型，请确保已经训练好模型');
		process.exit(1);
	}

	console.log('模型加载成功！');

	// 测试用例
	const testCases = [
		{
			description: '中文商家名称后补全叙述',
			triggerInfo: {
				triggerCharacter: '"',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2025-03-01 * "永鸿超市" "',
			},
			expectedType: CompletionType.NARRATION,
		},
		{
			description: '中文商家的账户补全',
			triggerInfo: {
				triggerCharacter: ' ',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2025-03-01 * "美团外卖" "午餐" ',
			},
			expectedType: CompletionType.ACCOUNT,
		},
		{
			description: '金额后的货币补全',
			triggerInfo: {
				triggerCharacter: ' ',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2025-03-01 * "cursor" "月费"\n    Expenses:Shopping:Production 20 ',
			},
			expectedType: CompletionType.CURRENCY,
		},
		{
			description: '补全带有中文标签',
			triggerInfo: {
				triggerCharacter: '#',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2025-03-04 * "USJ" "门票" #',
			},
			expectedType: CompletionType.TAG,
		},
		{
			description: '补全部分账户名称',
			triggerInfo: {
				triggerCharacter: undefined,
				triggerKind: CompletionTriggerKind.Invoked,
				currentLine: '2025-03-05 * "腾讯公司" "工资"\n    Income:Salary:',
			},
			expectedType: CompletionType.ACCOUNT,
		},
		{
			description: '股票账户场景',
			triggerInfo: {
				triggerCharacter: undefined,
				triggerKind: CompletionTriggerKind.Invoked,
				currentLine: '2025-03-05 * "LongBridge" "货币转换"\n    Assets:Stock:LongBridge:',
			},
			expectedType: CompletionType.ACCOUNT,
		},
		{
			description: '多行交易后的新日期补全',
			triggerInfo: {
				triggerCharacter: '2',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine:
					'2025-03-05 * "瑞幸咖啡" "咖啡"\n    Expenses:Food:Snack 9.75 CNY\n    Liabilities:CreditCard:CMB\n\n2',
			},
			expectedType: CompletionType.DATE,
		},
	];

	// 运行测试
	console.log('\n=== 测试结果 ===\n');

	for (const testCase of testCases) {
		console.log(`测试: ${testCase.description}`);
		console.log(`输入: ${testCase.triggerInfo.currentLine}`);
		console.log(
			`触发: ${testCase.triggerInfo.triggerCharacter || 'None'}, 类型: ${
				CompletionTriggerKind[testCase.triggerInfo.triggerKind]
			}`,
		);

		// 获取预测结果
		const prediction = model.predict(testCase.triggerInfo);
		const scores = model.getScores(testCase.triggerInfo);

		console.log(`预测: ${CompletionType[prediction]} (期望: ${CompletionType[testCase.expectedType]})`);

		// 输出前三个预测分数
		const scoreEntries = Object.entries(CompletionType)
			.filter(([key]) => !isNaN(Number(key)))
			.map(([key, value]) => ({
				type: value,
				score: scores[Number(key)] || 0,
			}))
			.sort((a, b) => (b.score || 0) - (a.score || 0))
			.slice(0, 3);

		console.log('前三预测:');
		for (const entry of scoreEntries) {
			console.log(`  - ${entry.type}: ${((entry.score || 0) * 100).toFixed(1)}%`);
		}

		console.log('');
	}

	console.log('测试完成！');
}

// 执行测试
testModelWithChineseData();

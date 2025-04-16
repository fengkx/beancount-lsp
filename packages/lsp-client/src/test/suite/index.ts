import { glob } from 'glob';
import Mocha from 'mocha';
import * as path from 'path';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
	});

	const testsRoot = path.resolve(__dirname, '..');
	return new Promise<void>((resolve, reject) => {
		glob('**/**.test.js', { cwd: testsRoot }).then((files: string[]) => {
			// Add files to the test suite
			files.forEach((file: string) => mocha.addFile(path.resolve(testsRoot, file)));

			try {
				// Run the mocha test
				mocha.run((failures: number) => {
					if (failures > 0) {
						reject(new Error(`${failures} tests failed.`));
					} else {
						resolve();
					}
				});
			} catch (error) {
				console.error(error);
				reject(error);
			}
		}).catch((error: Error) => {
			reject(error);
		});
	});
}

// Polyfills for Node.js built-ins
// These are needed for the browser build

// Polyfill for process
if (typeof globalThis.process === 'undefined') {
	globalThis.process = {
		env: {
			NODE_ENV: 'production',
		},
		cwd: () => '/',
	};
}

// Polyfill for require
if (typeof globalThis.require === 'undefined') {
	globalThis.require = (moduleName) => {
		throw new Error(`Cannot require module "${moduleName}" in the browser.`);
	};
}

// Polyfill for path
globalThis.path = {
	join: (...parts) => parts.join('/').replace(/\/+/g, '/'),
	resolve: (...parts) => parts.join('/').replace(/\/+/g, '/'),
	dirname: (path) => path.split('/').slice(0, -1).join('/') || '/',
	basename: (path, ext) => {
		const base = path.split('/').pop() || '';
		return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base;
	},
	extname: (path) => {
		const lastDotIndex = path.lastIndexOf('.');
		return lastDotIndex === -1 || lastDotIndex === 0 ? '' : path.slice(lastDotIndex);
	},
};

// Polyfill for fs
globalThis.fs = {
	existsSync: () => false,
	readFileSync: () => {
		throw new Error('fs.readFileSync is not available in the browser');
	},
	writeFileSync: () => {
		throw new Error('fs.writeFileSync is not available in the browser');
	},
};

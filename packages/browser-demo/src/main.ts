// main.ts
import './style.css';

import '@codingame/monaco-editor-wrapper/features/workbench';
import '@codingame/monaco-editor-wrapper/features/search';
import '@codingame/monaco-editor-wrapper/features/extensionGallery';
import '@codingame/monaco-editor-wrapper/features/extensionHostWorker';
import '@codingame/monaco-editor-wrapper/features/viewPanels';
import { whenReady as lspClientReady } from '../lsp-client.vsix';

import { initialize, registerFile, updateUserConfiguration } from '@codingame/monaco-editor-wrapper';
import { getService } from '@codingame/monaco-vscode-api';
import { IExtensionService, IExtensionsWorkbenchService } from '@codingame/monaco-vscode-api/services';
import { getBuiltinExtensions } from '@codingame/monaco-vscode-api/extensions';
import { URI } from '@codingame/monaco-vscode-api/vscode/vs/base/common/uri';
import { RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import { ExtensionIdentifier } from '@codingame/monaco-vscode-api/vscode/vs/platform/extensions/common/extensions';
import { commands, extensions, Uri } from 'vscode';

const files: Array<{ path: string; content: string }> = [
	{
		path: '/tmp/project/src/main.ts',
		content: `import './style.css';

export function greet(name: string) {
  return \`Hello, \${name}\`;
}
`,
	},
	{
		path: '/tmp/project/src/style.css',
		content: `:root {
  --accent: #4fc3f7;
}

body {
  font-family: "IBM Plex Sans", sans-serif;
  color: #eee;
}
`,
	},
	{
		path: '/tmp/project/config/settings.json',
		content: `{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "files.eol": "\\n"
}
`,
	},
	{
		path: '/tmp/project/README.md',
		content: `# Browser Demo

This is a VSCode workbench powered by monaco-editor-wrapper.
`,
	},
	{
		path: '/tmp/project/package.json',
		content: `{
  "name": "browser-demo",
  "private": true
}
`,
	},
];

for (const file of files) {
	registerFile(new RegisteredMemoryFile(URI.file(file.path), file.content));
}

await initialize(
	{
		productConfiguration: {
			extensionsGallery: {
				serviceUrl: 'https://open-vsx.org/vscode/gallery',
				itemUrl: 'https://open-vsx.org/vscode/item',
				resourceUrlTemplate: 'https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}',
			},
			linkProtectionTrustedDomains: ['https://open-vsx.org'],
		},
	},
	{ container: document.getElementById('workbench')! },
);
updateUserConfiguration(`{
  "workbench.activityBar.visible": true,
  "workbench.sideBar.location": "left",
  "workbench.statusBar.visible": true
}`);
try {
	await lspClientReady();
} catch (error) {
	console.error('[lspClient] ready failed', error);
}
console.info('[extensions] builtin', getBuiltinExtensions().map((ext) => ext.identifier.id));

const targetExtensionId = 'fengkx.beancount-lsp-client';
const extensionService = await getService(IExtensionService);
await extensionService.whenInstalledExtensionsRegistered();
console.info(
	'[extensions] registered',
	extensionService.extensions.map((ext) => ext.identifier?.id),
);
const extensionsWorkbenchService = await getService(IExtensionsWorkbenchService);
await extensionsWorkbenchService.whenInitialized;
console.info('[extensions] workbench local', extensionsWorkbenchService.local.map((ext) => ext.identifier.id));
console.info(
	'[extensions] workbench installed',
	extensionsWorkbenchService.installed.map((ext) => ext.identifier.id),
);
await extensionsWorkbenchService.openSearch('@builtin');
try {
	await extensionService.activateById(new ExtensionIdentifier(targetExtensionId), {
		startup: false,
		extensionId: new ExtensionIdentifier(targetExtensionId),
		activationEvent: 'onDemand',
	});
	console.info('[extensions] activated by service', targetExtensionId);
} catch (error) {
	console.error('[extensions] service activate failed', error);
}

const extension = extensions.getExtension(targetExtensionId);
console.info('[extensions] total', extensions.all.length);
console.info('[extensions] target', targetExtensionId, extension);
if (!extension) {
	console.warn('[extensions] target not found');
} else {
	console.info('[extensions] isActive before', extension.isActive);
	try {
		await extension.activate();
		console.info('[extensions] isActive after', extension.isActive);
	} catch (error) {
		console.error('[extensions] activate failed', error);
	}
}

await commands.executeCommand('vscode.open', Uri.file('/tmp/project/src/main.ts'));
await commands.executeCommand('workbench.view.extensions');
await commands.executeCommand('workbench.extensions.action.showBuiltinExtensions');

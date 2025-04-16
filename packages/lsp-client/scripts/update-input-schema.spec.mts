import { vi, it } from 'vitest';
import { tools } from "../src/common/llm/tools";
import { writeFile, readFile } from 'fs/promises';
import { $ } from "execa";

vi.mock('vscode', () => {
    return {}
})


async function updateInputSchema() {
    const keys = ['name', 'displayName', 'modelDescription', 'userDescription', 'canBeReferencedInPrompt', 'toolReferenceName', 'icon', 'tags', 'inputSchema'] as const;
    type Key = typeof keys[number];

    const toolDeclartions = tools.map((tool) => {
        return keys.reduce((acc, key: Key) => {
            acc[key] = tool[key as keyof typeof tool];
            return acc;
        }, {} as Record<Key, unknown>);
    });
    const packageJsonUri = new URL('../package.json', import.meta.url);

    const packageJson = await readFile(packageJsonUri, { encoding: 'utf-8' });
    const packageJsonObject = JSON.parse(packageJson);
    packageJsonObject['contributes']['languageModelTools'] = toolDeclartions;
    await writeFile(packageJsonUri, JSON.stringify(packageJsonObject, null, 2));
    await $`npx dprint fmt ${packageJsonUri.pathname}`


}

it('should update the input schema', async () => {
    await updateInputSchema();
})
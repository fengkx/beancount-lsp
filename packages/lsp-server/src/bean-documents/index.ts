import { LANGUAGE_ID, TokenTypes } from "@bean-lsp/shared";
import path from "path";
import { DepToken } from "src/ioc/tokens";
import { TreeParser } from "src/parser";
import { autoInjectable, inject, singleton } from "tsyringe";
import { fileURLToPath, pathToFileURL, } from "url";
import { Queue } from "mnemonist";
import { Connection } from "vscode-languageserver";
import { TreeQuery } from "../common/language/query";
import { glob } from "fast-glob";
import { LiteralUnion } from "type-fest";
import type * as WebTreeSitter from "web-tree-sitter";

@autoInjectable()
@singleton()
export class BeanDocuments {
    private documents: Map<string, BeanDocument>;
    public forEach: Map<string, BeanDocument>['forEach']
    public values: Map<string, BeanDocument>["values"]
    constructor(@inject(DepToken.connection) private connection?: Connection, private parser?: TreeParser) {
        this.documents = new Map();
        this.forEach = this.documents.forEach.bind(this.documents)
        this.values = this.documents.values.bind(this.documents)


    }
    public async getMainBeanFileUri(): Promise<string | null> {
        const config = await this.getConfiguration();
        const workspace = await this.connection!.workspace.getWorkspaceFolders();

        if (!workspace) {
            // just open a file
            return null
        }

        if (workspace && !config.mainBeanFile) {
            this.connection!.window.showWarningMessage(`Using default 'main.bean' as mainBeanFile, You should configure 'beancount.mainBeanFile'`)
        }
        const rootUri = workspace[0].uri;
        const workspaceFolder = fileURLToPath(rootUri);
        const mainAbsPath = path.join(workspaceFolder, config.mainBeanFile ?? 'main.bean')

        return pathToFileURL(mainAbsPath).toString()

    }

    async getDocumentByUri(uri: string): Promise<BeanDocument | undefined> {
        const doc = this.documents.get(uri);
        if (doc) {
            return doc;

        }
        await this.initTree();
        this.documents.get(uri)

    }


    private async getConfiguration() {
        const config = await this.connection!.workspace.getConfiguration({ section: LANGUAGE_ID });
        this.connection?.console.info(config)
        return config
    }

    public async initTree(): Promise<void> {
        const rootUri = await this.getMainBeanFileUri();
        if (!rootUri) {
            return
        }
        const queue = new Queue<string>();
        queue.enqueue(rootUri)
        while (queue.size > 0) {
            const uri = queue.dequeue()!;
            const tree = await this.parser!.getTreeByUri(uri);
            const matches = await TreeQuery.matches('(include (string) @path)', tree.rootNode);
            this.documents.set(uri, new BeanDocument(uri));
            for (const match of matches) {
                const cleanRelativePath = match.captures[0].node.text.replace(/^"/, '').replace(/"$/, '');
                const includedPattern = fileURLToPath(new URL(cleanRelativePath, uri))
                const files = await glob(includedPattern);

                files.forEach(f => {
                    queue.enqueue(pathToFileURL(f).toString())
                })

            }


        }


    }


    public async getBeanDocByUri(uri: string): Promise<BeanDocument | undefined> {
        const doc = this.documents.get(uri)
        if (doc) {
            return doc;
        }
        await this.initTree();
        return this.documents.get(uri);
    }
}

export type Point = {
    row: number;
    column: number;
}
export type BeanSyntaxNode = {
    startPosition: Point;
    endPosition: Point;
    text: string;
    tokenType: LiteralUnion<TokenTypes, string>;
    uri: string;
}

@autoInjectable()
class BeanDocument {
    constructor(public readonly uri: string, private parser?: TreeParser) { }

    public async getTree() {
        const tree = await this.parser!.getTreeByUri(this.uri);
        return tree;
    }

    private buildSyntaxNode(node: WebTreeSitter.SyntaxNode, tokenType: BeanSyntaxNode['tokenType']) {
        return {
            startPosition: node.startPosition,
            endPosition: node.endPosition,
            text: node.text,
            tokenType: tokenType,
            uri: this.uri
        }
    }

    async getAccounts(): Promise<Array<BeanSyntaxNode>> {
        const tree = await this.getTree();
        const matches = await TreeQuery.getQueryByTokenName('account').matches(tree.rootNode);
        const result = matches.map((m): BeanSyntaxNode => {
            const node = m.captures[0].node;
            return this.buildSyntaxNode(node, 'account')
        });
        return result;
    }

    async getCurrency() {
        const tree = await this.parser!.getTreeByUri(this.uri);
        const matches = await TreeQuery.getQueryByTokenName('currency').matches(tree.rootNode);
        const result = matches.map((m): BeanSyntaxNode => {
            const node = m.captures[0].node;
            return this.buildSyntaxNode(node, 'currency')
        });
        return result;
    }

}
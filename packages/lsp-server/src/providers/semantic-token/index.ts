import { SemanticTokensParams, TextDocuments, Connection } from "vscode-languageserver";
import {
    TextDocument
} from 'vscode-languageserver-textdocument';
import { TokenBuilder } from "./token-builder";
import { TreeQuery } from "src/providers/semantic-token/queries";
import { autoInjectable, inject, injectable } from "tsyringe";
import { DepToken } from "src/ioc/tokens";
import { TreeParser } from "src/parser";

@autoInjectable()
export class SemanticTokenProvider {
    constructor(@inject(DepToken.connection) private connection?: Connection, @inject(TreeParser) private parser?: TreeParser) { }
    onSemanticToken = async (params: SemanticTokensParams) => {
        const { uri } = params.textDocument;
        const tree = await this.parser!.getTreeByUri(uri);
        const tokenBuilder = new TokenBuilder()

        const stringMatches = await TreeQuery.getQueryByTokenName('string').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(stringMatches, "string")

        const dateMatches = await TreeQuery.getQueryByTokenName('date').matches(tree.rootNode);
        tokenBuilder.buildSingleCaptureTokens(dateMatches, 'date');


        const flagMatches = await TreeQuery.getQueryByTokenName('flag').matches(tree.rootNode);
        tokenBuilder.buildSingleCaptureTokens(flagMatches, 'operator');

        const narrationMatches = await TreeQuery.getQueryByTokenName('narration').matches(tree.rootNode);
        tokenBuilder.buildSingleCaptureTokens(narrationMatches, 'string')

        const payeeMatches = await TreeQuery.getQueryByTokenName('payee').matches(tree.rootNode);
        tokenBuilder.buildSingleCaptureTokens(payeeMatches, 'string')

        const accountMatches = await TreeQuery.getQueryByTokenName('account').matches(tree.rootNode);
        tokenBuilder.buildSingleCaptureTokens(accountMatches, 'account');

        const numberMatches = await TreeQuery.getQueryByTokenName('number').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(numberMatches, 'number')

        const currencyMatches = await TreeQuery.getQueryByTokenName('currency').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(currencyMatches, 'currency')

        const keywordMatches = await TreeQuery.getQueryByTokenName('keyword').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(keywordMatches, "keyword")

        const tagMatches = await TreeQuery.getQueryByTokenName('tag').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(tagMatches, 'tag')

        const linkMatches = await TreeQuery.getQueryByTokenName('link').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(linkMatches, 'link')

        const kvKeyMatches = await TreeQuery.getQueryByTokenName('kv_key').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(kvKeyMatches, 'kv_key')


        const boolMatches = await TreeQuery.getQueryByTokenName('bool').matches(tree.rootNode)
        tokenBuilder.buildSingleCaptureTokens(boolMatches, 'bool')

        const data = tokenBuilder.build();
        // this.connection?.console.info(JSON.stringify(data));


        return data

        // return Promise.resolve({ "resultId": "1689130493250", "data": [0, 0, 10, 7, 0, 4, 0, 10, 7, 0] });
    }
}
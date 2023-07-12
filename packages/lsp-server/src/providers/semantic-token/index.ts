import { SemanticTokensParams, TextDocuments, Connection } from "vscode-languageserver";
import { getParser } from "@bean-lsp/shared";
import {
    TextDocument
} from 'vscode-languageserver-textdocument';
import { TokenBuilder } from "./token-builder";
import { TreeQuery } from "src/queries";

export class SemanticTokenProvider {
    constructor(private connection: Connection, private documents: TextDocuments<TextDocument>) { }
    onSemanticToken = async (params: SemanticTokensParams) => {
        const doc = this.documents.get(params.textDocument.uri);
        if (!doc) return { data: [] };
        const code = doc.getText();
        const tree = (await getParser()).parse(code);

        const tokenBuilder = new TokenBuilder(this.connection)

        const dateMatches = await TreeQuery.getQueryByTokenName('date').matches(tree.rootNode);
        tokenBuilder.buildTokens(dateMatches, 'date');

        const flagMatches = await TreeQuery.getQueryByTokenName('flag').matches(tree.rootNode);
        tokenBuilder.buildTokens(flagMatches, 'operator');

        const narrationMatches = await TreeQuery.getQueryByTokenName('narration').matches(tree.rootNode);
        tokenBuilder.buildTokens(narrationMatches, 'string')

        const payeeMatches = await TreeQuery.getQueryByTokenName('payee').matches(tree.rootNode);
        tokenBuilder.buildTokens(payeeMatches, 'string')

        const accountMatches = await TreeQuery.getQueryByTokenName('account').matches(tree.rootNode);
        tokenBuilder.buildTokens(accountMatches, 'account');

        const numberMatches = await TreeQuery.getQueryByTokenName('number').matches(tree.rootNode)
        tokenBuilder.buildTokens(numberMatches, 'number')

        const currencyMatches = await TreeQuery.getQueryByTokenName('currency').matches(tree.rootNode)

        tokenBuilder.buildTokens(currencyMatches, 'currency')


        const data = tokenBuilder.build();
        this.connection.console.log(code);
        this.connection.console.info(JSON.stringify(data));


        return data

        // return Promise.resolve({ "resultId": "1689130493250", "data": [0, 0, 10, 7, 0, 4, 0, 10, 7, 0] });
    }
}
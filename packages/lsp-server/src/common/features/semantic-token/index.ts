import { Connection } from "vscode-languageserver";
import { Feature } from "../types";

export class SemanticTokenFeature implements Feature {
    // constructor(private parser:)
    register(connection: Connection) {
        // connection.languages.semanticTokens.on()
    }


}
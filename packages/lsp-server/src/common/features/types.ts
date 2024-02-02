import { Connection } from "vscode-languageserver";

export interface Feature {
    register(connection: Connection): unknown
}
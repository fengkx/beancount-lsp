import '@abraham/reflection';
import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult,
    SemanticTokensBuilder,
} from 'vscode-languageserver/node';
import {
    TextDocument
} from 'vscode-languageserver-textdocument';
import { TOKEN_TYPES, TOKEN_MODIFIERS, TokenTypes, tokenTypeToIndex, getParser } from '@bean-lsp/shared';




import { SemanticTokenProvider } from './providers/semantic-token';
import { DepToken } from './ioc/tokens';
import { container, instanceCachingFactory } from 'tsyringe';
import { CompletionProvider } from './providers/completion/completion';
import { BeanDocuments } from './bean-documents';


// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
container.register(DepToken.connection, { useValue: connection });

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
container.register(DepToken.documents, { useValue: documents });

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
let hasSemanticTokensCapability = false;
let hasCompletionCapability = false



connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    hasDiagnosticRelatedInformationCapability = !!(
        capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation
    );
    hasSemanticTokensCapability = !!(capabilities.textDocument && capabilities.textDocument.semanticTokens);
    hasCompletionCapability = !!(capabilities.textDocument && capabilities.textDocument.completion);

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {},
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }

    if (hasSemanticTokensCapability) {
        result.capabilities.semanticTokensProvider = {
            legend: { tokenTypes: TOKEN_TYPES, tokenModifiers: TOKEN_MODIFIERS },
            full: true
        }
    }


    return result;
});

connection.onInitialized(async (params) => {

    try {
        await getParser();
    } catch (err) {
        connection.console.error(String(err))
    }
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }


    if (hasSemanticTokensCapability) {
        const semanticTokenProvider = new SemanticTokenProvider()


        connection.languages.semanticTokens.onDelta(() => {
            return {
                data: [],
            }
        })
        connection.languages.semanticTokens.onRange(() => {
            return {
                data: [],
            }
        })


        connection.languages.semanticTokens.on(semanticTokenProvider.onSemanticToken)
        container.register(BeanDocuments, {
            useFactory: instanceCachingFactory<BeanDocuments>(() => {
                const beanDocuments = new BeanDocuments();
                beanDocuments.initTree();
                return beanDocuments;
            })
        })



    } else {
        connection.console.info('semanticTokens is disabled')
    }


});

// The example settings
interface ExampleSettings {
    maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
// let globalSettings: ExampleSettings = defaultSettings;


connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});

const completionProvider = new CompletionProvider();
// This handler provides the initial list of the completion items.
connection.onCompletion(
    completionProvider.onCompletion
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
    (item: CompletionItem): CompletionItem => {
        if (item.data === 1) {
            item.detail = 'TypeScript details';
            item.documentation = 'TypeScript documentation';
        } else if (item.data === 2) {
            item.detail = 'JavaScript details';
            item.documentation = 'JavaScript documentation';
        }
        return item;
    }
);



// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();



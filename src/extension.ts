import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating raumnebenan MCP extension...');

    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('raumnebenan.mcp-server', {
            provideMcpServerDefinitions: (_token: vscode.CancellationToken) => {
                console.log('Providing MCP server definitions...');
                return [
                    new vscode.McpHttpServerDefinition(
                        'raumnebenan',
                        vscode.Uri.parse('https://www.raumnebenan.de/mcp'),
                        {},
                        '0.2.4'
                    )
                ];
            },
            resolveMcpServerDefinition: (server: vscode.McpServerDefinition) => {
                console.log('Resolving MCP server definition:', server.label);
                return server;
            }
        })
    );
}

export function deactivate() {}

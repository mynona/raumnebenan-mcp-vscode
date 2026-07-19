import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating raumnebenan MCP extension...');

    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('raumnebenan.mcp-server', {
            provideMcpServerDefinitions() {
                return [
                    new vscode.McpHttpServerDefinition(
                        'raumnebenan',
                        vscode.Uri.parse('https://www.raumnebenan.de/mcp'),
                        {},
                        '0.2.5'
                    )
                ];
            },
            resolveMcpServerDefinition(server) {
                return server;
            }
        })
    );
}

export function deactivate() {}

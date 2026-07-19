import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "raumnebenan-mcp-vscode" is now active!');

    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('raumnebenan-mcp', {
            provideMcpServerDefinitions: async () => [
                new vscode.McpHttpServerDefinition(
                    'raumnebenan-mcp',
                    vscode.Uri.parse('https://www.raumnebenan.de/mcp'),
                    {},
                    '0.1.4'
                )
            ]
        })
    );
}

export function deactivate() {}

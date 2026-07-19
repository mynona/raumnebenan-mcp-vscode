import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "raumnebenan-mcp-vscode" is now active!');

    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('raumnebenan.mcp-server', {
            provideMcpServerDefinitions: (_token: vscode.CancellationToken) => [
                new vscode.McpHttpServerDefinition(
                    'raumnebenan',
                    vscode.Uri.parse('https://www.raumnebenan.de/mcp'),
                    {},
                    '0.2.1'
                )
            ]
        })
    );
}

export function deactivate() {}

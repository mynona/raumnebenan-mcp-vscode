import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating raumnebenan MCP extension...');

    context.subscriptions.push(
        vscode.commands.registerCommand('raumnebenan-mcp.installServer', async () => {
            console.log('Command raumnebenan-mcp.installServer triggered');
            const serverConfig = {
                "type": "http",
                "url": "https://www.raumnebenan.de/mcp",
                "version": "0.2.5"
            };

            try {
                // Using vscode.env.appSettingsHome to get the User settings directory in a platform-independent way
                const userMcpUri = vscode.Uri.joinPath(vscode.env.appSettingsHome, 'mcp.json');

                let config: any = { servers: {} };
                try {
                    const fileData = await vscode.workspace.fs.readFile(userMcpUri);
                    config = JSON.parse(fileData.toString());
                } catch (e) {
                    console.log('User mcp.json not found or not readable, starting with empty config');
                }

                config.servers = config.servers || {};
                config.servers["raumnebenan"] = serverConfig;

                await vscode.workspace.fs.writeFile(
                    userMcpUri, 
                    Buffer.from(JSON.stringify(config, null, 2))
                );
                
                vscode.window.showInformationMessage('Successfully added raumnebenan to global MCP configuration.');
            } catch (err) {
                vscode.window.showErrorMessage('Failed to update MCP configuration: ' + err);
            }
        })
    );

    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('raumnebenan.mcp-server', {
            provideMcpServerDefinitions: (_token: vscode.CancellationToken) => {
                console.log('Providing MCP server definitions...');
                return [
                    new vscode.McpHttpServerDefinition(
                        'raumnebenan',
                        vscode.Uri.parse('https://www.raumnebenan.de/mcp'),
                        {},
                        '0.2.5'
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

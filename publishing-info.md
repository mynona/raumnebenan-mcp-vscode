# Publishing Information

This file contains internal notes about the publishing process.
It is excluded from the final npm package via `.npmignore`.

## Part 1: MCP Registry & npm (Completed)
- **Registry:** [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io)
- **Package:** `@mynona/raumnebenan-mcp`
- **Identifier:** `io.github.mynona/raumnebenan-mcp`

### To update existing package:
1. Bump version in `package.json` and `server.json`.
2. Ensure tokens are fresh (`mcp-publisher login github`).
3. Run: `npm publish && mcp-publisher publish`.

---

## Part 2: VS Code MCP Marketplace Strategy
To make the server "discoverable" in VS Code's `@mcp` list without manual configuration, it must be wrapped in a VS Code Extension and published to the **Visual Studio Marketplace**.

### Step 1: Scaffold the Extension
1. Install the VS Code Extension Generator: `npm install -g yo generator-code`
2. Run `yo code` and choose:
   - Type: `New Extension (TypeScript)`
   - Name: `raumnebenan-mcp-vscode`
   - Description: `VS Code integration for raumnebenan MCP server`

### Step 2: Configure MCP Contribution
In the new extension's `package.json`, add the MCP capability:
```json
"contributes": {
  "mcpServerDefinitionProviders": [
    {
      "id": "raumnebenan-provider",
      "label": "raumnebenan MCP"
    }
  ]
}
```

### Step 3: Implement the Provider (extension.ts)
Update `src/extension.ts` to register the remote server:
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider('raumnebenan-provider', {
            provideMcpServerDefinitions: async () => [
                new vscode.McpHttpServerDefinition({
                    label: 'raumnebenan',
                    uri: 'https://www.raumnebenan.de/mcp',
                    version: '0.1.4'
                })
            ]
        })
    );
}
```

### To update existing extension:
1. **Bump Version**: Update `"version"` in [package.json](package.json).
2. **Re-Package**: Run `npx vsce package` in the `mcp-vscode` folder.
3. **Upload Update**:
   - Go to [Marketplace Management Portal](https://marketplace.visualstudio.com/manage/publishers/raumnebenan).
   - Click the **...** (three dots) on the `raumnebenan-mcp-vscode` extension row.
   - Select **Update**.
   - Upload the new `.vsix` file.

---

## Part 3: Secondary Discovery Features
- **Keywords:** Keep `"keywords": ["mcp", "mcp-server"]` in [package.json](package.json).
- **Search:** Once published to VS Marketplace, it will appear in the VS Code Extensions view when searching for "mcp".

---

## Part 4: Future Capabilities (Agents & Skills)
You can extend this VS Code extension to provide more than just server discovery:

### 1. Adding Skills
You can package "Agent Skills" (like the ones defining your Swift/Vapor conventions) inside the extension. 
- You would add a `skills` contribution point in [package.json](package.json).
- The skill files would be bundled in the `.vsix`.

### 2. Adding Custom Agents
You can define specialized "Subagents" that are pre-configured with your MCP tools.
- Users would see them in the Chat view and could invoke them for specific raumnebenan tasks.

### 3. Adding Copilot Instructions
You can contribute default prompt instructions that help Copilot understand how to use your specific product thinking framework.

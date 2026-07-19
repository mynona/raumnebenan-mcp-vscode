/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/288777 @DonJayamanne

	/**
	 * Represents a single MCP server definition.
	 */
	export type McpServerDefinition = McpStdioServerDefinition | McpHttpServerDefinition;

	/**
	 * McpStdioServerDefinition represents an MCP server available by running
	 * a local process and operating on its stdin and stdout streams.
	 */
	export class McpStdioServerDefinition {
		/**
		 * The human-readable label of the server.
		 */
		label: string;

		/**
		 * The command used to start the server.
		 */
		command: string;

		/**
		 * Additional command-line arguments passed to the server.
		 */
		args: string[];

		/**
		 * Optional additional environment information for the server.
		 */
		env: Record<string, string | number | null>;

		/**
		 * The working directory used to start the server.
		 */
		cwd?: Uri;

		/**
		 * Optional version identification for the server.
		 */
		version?: string;

		/**
		 * @param label The human-readable name of the server.
		 * @param command The command used to start the server.
		 * @param args Additional command-line arguments passed to the server.
		 * @param env Optional additional environment information for the server.
		 * @param version Optional version identification for the server.
		 */
		constructor(label: string, command: string, args?: string[], env?: Record<string, string | number | null>, version?: string);
	}

	/**
	 * McpHttpServerDefinition represents an MCP server available using the
	 * Streamable HTTP transport.
	 */
	export class McpHttpServerDefinition {
		/**
		 * The human-readable label of the server.
		 */
		readonly label: string;

		/**
		 * The URI of the server. The editor will make a POST request to this URI
		 * to begin each session.
		 */
		uri: Uri;

		/**
		 * Optional additional heads included with each request to the server.
		 */
		headers: Record<string, string>;

		/**
		 * Optional version identification for the server.
		 */
		version?: string;

		/**
		 * @param label The human-readable name of the server.
		 * @param uri The URI of the server.
		 * @param headers Optional additional heads included with each request to the server.
		 * @param version Optional version identification for the server.
		 */
		constructor(label: string, uri: Uri, headers?: Record<string, string>, version?: string);
	}

	/**
	 * Represents a single MCP server exposed by the gateway via its own HTTP endpoint.
	 */
	export interface McpGatewayServer {
		/**
		 * The human-readable label of the MCP server.
		 */
		readonly label: string;

		/**
		 * The address of the HTTP MCP server endpoint.
		 * External processes can connect to this URI to interact with this MCP server.
		 */
		readonly address: Uri;
	}

	/**
	 * Represents an MCP gateway that exposes MCP servers via HTTP.
	 * Each known MCP server gets its own HTTP endpoint. The gateway
	 * dynamically tracks server additions and removals.
	 */
	export interface McpGateway extends Disposable {
		/**
		 * The MCP servers currently exposed by the gateway.
		 * Each server has its own HTTP endpoint address.
		 */
		readonly servers: readonly McpGatewayServer[];

		/**
		 * Event that fires when the set of gateway servers changes.
		 * This can be due to MCP servers being added, removed, or restarted.
		 */
		readonly onDidChangeServers: Event<readonly McpGatewayServer[]>;
	}

	/**
	 * A provider which the editor calls to discover MCP servers that the extension provides.
	 */
	export interface McpServerDefinitionProvider<T extends McpServerDefinition = McpServerDefinition> {
		/**
		 * An optional event to signal that the set of MCP server definitions has changed.
		 */
		onDidChangeMcpServerDefinitions?: Event<void>;

		/**
		 * Provide the set of MCP server definitions.
		 */
		provideMcpServerDefinitions(token: CancellationToken): ProviderResult<T[]>;

		/**
		 * Resolve an MCP server definition. This is called once a server is actually
		 * needed, to allow the extension to provide more details about how to start it.
		 */
		resolveMcpServerDefinition?(definition: T, token: CancellationToken): ProviderResult<T>;
	}

	/**
	 * Namespace for language model related functionality.
	 */
	export namespace lm {
		/**
		 * All MCP server definitions known to the editor. This includes
		 * servers defined in user and workspace mcp.json files as well as those
		 * provided by extensions.
		 *
		 * Consumers should listen to {@link onDidChangeMcpServerDefinitions} and
		 * re-read this property when it fires.
		 */
		export const mcpServerDefinitions: readonly McpServerDefinition[];

		/**
		 * Event that fires when the set of MCP server definitions changes.
		 * This can be due to additions, deletions, or modifications of server
		 * definitions from any source.
		 */
		export const onDidChangeMcpServerDefinitions: Event<void>;

		/**
		 * Starts an MCP gateway that exposes MCP servers via HTTP endpoints.
		 *
		 * The gateway creates a localhost HTTP server where each MCP server known
		 * to the editor gets its own endpoint. External processes (such as CLI-based
		 * agent loops) can connect to these endpoints to interact with individual
		 * MCP servers.
		 *
		 * The HTTP server is shared among all gateways and is automatically torn down
		 * when the last gateway is disposed. The gateway dynamically tracks server
		 * additions and removals via {@link McpGateway.onDidChangeServers}.
		 *
		 * @param chatSessionResource Optional chat session resource URI to associate with this
		 * gateway. When provided, MCP tool calls made through this gateway will be associated
		 * with the chat session, enabling inline elicitation UI in the chat response.
		 * @returns A promise that resolves to an {@link McpGateway} if successful,
		 * or `undefined` if no Node process is available (e.g., in serverless web environments).
		 */
		export function startMcpGateway(chatSessionResource?: Uri): Thenable<McpGateway | undefined>;

		/**
		 * Register an MCP server definition provider.
		 *
		 * @param id The ID of the provider, which must match the ID of a provider
		 * in the `contributes.mcpServerDefinitionProviders` array in `package.json`.
		 * @param provider The provider to register.
		 */
		export function registerMcpServerDefinitionProvider<T extends McpServerDefinition = McpServerDefinition>(id: string, provider: McpServerDefinitionProvider<T>): Disposable;
	}
}

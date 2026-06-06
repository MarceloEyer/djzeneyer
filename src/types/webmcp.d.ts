/** A single tool exposed to AI agents via the WebMCP protocol. */
export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: unknown) => Promise<unknown> | unknown;
}

/** Collection of tools registered with the browser's model context. */
export interface WebMCPContext {
  tools: Record<string, WebMCPTool>;
}

/** Browser API for registering WebMCP context with AI agents. */
export interface ModelContext {
  provideContext: (context: WebMCPContext) => void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

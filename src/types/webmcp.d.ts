export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: unknown) => Promise<unknown> | unknown;
}

export interface WebMCPContext {
  tools: Record<string, WebMCPTool>;
}

export interface ModelContext {
  provideContext: (context: WebMCPContext) => void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

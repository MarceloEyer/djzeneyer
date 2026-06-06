export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: any;
  execute: (input: any) => Promise<any> | any;
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

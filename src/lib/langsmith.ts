import { Client } from "langsmith";

interface LangSmithRun {
  id: string;
  name: string;
  run_type: string;
  inputs: any;
  project_name: string;
  extra?: {
    metadata?: Record<string, any>;
  };
}

// Initialize LangSmith client
let langsmithClient: Client | null = null;

export const getLangSmithClient = () => {
  if (!langsmithClient) {
    langsmithClient = new Client({
      apiKey: process.env.LANGCHAIN_API_KEY,
    });
  }
  return langsmithClient;
};

// Verify LangSmith configuration
export const verifyLangSmithConfig = async (): Promise<{ isValid: boolean; error?: string }> => {
  try {
    if (!process.env.LANGCHAIN_API_KEY) {
      return { isValid: false, error: 'LangSmith API key is not configured' };
    }
    if (!process.env.LANGSMITH_PROJECT) {
      return { isValid: false, error: 'LangSmith project is not configured' };
    }

    // Test the LangSmith connection
    const client = getLangSmithClient();
    await client.listRuns({ projectName: process.env.LANGSMITH_PROJECT });

    return { isValid: true };
  } catch (error) {
    console.error('LangSmith verification failed:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown error during LangSmith verification'
    };
  }
};

// Helper to create a new trace
export const createTrace = async (name: string, input: any): Promise<{ id: string }> => {
  try {
    const client = getLangSmithClient();
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await client.createRun({
      name,
      run_type: 'chain',
      inputs: input,
      project_name: process.env.LANGSMITH_PROJECT || "marriott-hotel",
      extra: {
        metadata: {
          environment: process.env.NODE_ENV || 'development'
        }
      }
    });
    
    return { id: runId };
  } catch (error) {
    console.error('Failed to create LangSmith trace:', error);
    // Return a fallback ID if LangSmith fails
    return { id: `fallback_${Date.now()}` };
  }
};

// Helper to update trace with output
export const updateTrace = async (runId: string, output: any, error?: Error) => {
  try {
    const client = getLangSmithClient();
    await client.updateRun(runId, {
      outputs: output,
      error: error ? error.message : undefined,
      end_time: Date.now()
    });
  } catch (updateError) {
    console.error('Failed to update LangSmith trace:', updateError);
    // Continue without updating trace if it fails
  }
}; 
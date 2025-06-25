// Simple logger utility
const getTimestamp = () => new Date().toISOString();

const formatArgs = (args) => args.map(arg => 
  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
).join(' ');

export const logger = {
  error: (...args) => {
    console.error(`[${getTimestamp()}] ERROR:`, formatArgs(args));
    // You could also write to a file here if needed
  },
  warn: (...args) => {
    console.warn(`[${getTimestamp()}] WARN:`, formatArgs(args));
  },
  info: (...args) => {
    console.info(`[${getTimestamp()}] INFO:`, formatArgs(args));
  },
  debug: (...args) => {
    console.debug(`[${getTimestamp()}] DEBUG:`, formatArgs(args));
  }
};

// Export a function to check OpenAI availability
export const checkOpenAIConfig = () => {
  const config = {
    apiKey: process.env.OPENAI_API_KEY || (typeof window !== 'undefined' ? import.meta.env?.VITE_OPENAI_API_KEY : undefined),
    assistantId: process.env.AI_ASSISTANT_ID || (typeof window !== 'undefined' ? import.meta.env?.VITE_AI_ASSISTANT_ID : undefined),
    adminId: process.env.AI_ADMIN_ID || (typeof window !== 'undefined' ? import.meta.env?.VITE_AI_ADMIN_ID : undefined)
  };

  if (!config.apiKey) {
    logger.error('OpenAI API key is not configured');
  }
  if (!config.assistantId) {
    logger.error('AI Assistant ID is not configured');
  }
  if (!config.adminId) {
    logger.error('AI Admin ID is not configured');
  }

  return {
    isConfigured: !!(config.apiKey && config.assistantId && config.adminId),
    config
  };
}; 
// Simple logger utility with TypeScript support
const getTimestamp = (): string => new Date().toISOString();

const formatArgs = (args: any[]): string => args.map(arg => 
  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
).join(' ');

interface Logger {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

export const logger: Logger = {
  error: (...args: any[]): void => {
    console.error(`[${getTimestamp()}] ERROR:`, formatArgs(args));
  },
  warn: (...args: any[]): void => {
    console.warn(`[${getTimestamp()}] WARN:`, formatArgs(args));
  },
  info: (...args: any[]): void => {
    console.info(`[${getTimestamp()}] INFO:`, formatArgs(args));
  },
  debug: (...args: any[]): void => {
    console.debug(`[${getTimestamp()}] DEBUG:`, formatArgs(args));
  }
}; 
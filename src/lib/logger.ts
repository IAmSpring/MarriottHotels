import type { Logger } from './browserLogger';

let logger: Logger;

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Browser environment - use browser logger
  const { logger: browserLogger } = await import('./browserLogger');
  logger = browserLogger;
} else {
  // Node.js environment - use server logger
  const { logger: serverLogger } = await import('./serverLogger');
  logger = serverLogger;
}

export { logger, type Logger }; 
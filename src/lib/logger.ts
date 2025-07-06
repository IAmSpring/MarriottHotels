// This is a barrel file that exports the appropriate logger based on the environment
let logger;

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Browser environment - use browser logger
  const { logger: browserLogger } = await import('./browserLogger');
  logger = browserLogger;
} else {
  // Node.js environment - use server logger
  const winston = await import('winston');
  
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
}

export { logger }; 
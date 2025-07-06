type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class BrowserLogger {
  private static instance: BrowserLogger;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;

  private constructor() {}

  static getInstance(): BrowserLogger {
    if (!BrowserLogger.instance) {
      BrowserLogger.instance = new BrowserLogger();
    }
    return BrowserLogger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data: data || undefined
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.formatMessage(level, message, data);
    
    // Add to buffer with size limit
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output with styling
    const styles = {
      error: 'color: #ff0000; font-weight: bold',
      warn: 'color: #ffa500; font-weight: bold',
      info: 'color: #0000ff',
      debug: 'color: #808080'
    };

    const consoleMessage = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error('%c' + consoleMessage, styles[level], data);
        break;
      case 'warn':
        console.warn('%c' + consoleMessage, styles[level], data);
        break;
      case 'info':
        console.info('%c' + consoleMessage, styles[level], data);
        break;
      case 'debug':
        console.debug('%c' + consoleMessage, styles[level], data);
        break;
    }
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  clearBuffer() {
    this.logBuffer = [];
  }
}

export const logger = BrowserLogger.getInstance(); 
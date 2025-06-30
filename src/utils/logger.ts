import React from 'react';
import { navigationLogger } from './navigationLogger';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  component?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private debugMode: boolean = process.env.NODE_ENV === 'development';

  private constructor() {
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private handleGlobalError(event: ErrorEvent) {
    this.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      stack: event.error?.stack
    });
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    this.error('Unhandled promise rejection', {
      reason: event.reason,
      stack: event.reason?.stack
    });
  }

  private addLog(level: LogLevel, message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      component
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const logPrefix = `[${level.toUpperCase()}]${component ? ` [${component}]` : ''}`;
    
    if (this.debugMode || level !== 'debug') {
      switch (level) {
        case 'debug':
          console.debug(logPrefix, message, data || '');
          break;
        case 'info':
          console.info(logPrefix, message, data || '');
          break;
        case 'warn':
          console.warn(logPrefix, message, data || '');
          break;
        case 'error':
          console.error(logPrefix, message, data || '');
          break;
      }
    }
  }

  debug(message: string, data?: any, component?: string) {
    this.addLog('debug', message, data, component);
  }

  info(message: string, data?: any, component?: string) {
    this.addLog('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.addLog('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.addLog('error', message, data, component);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  downloadLogs() {
    const logData = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const logger = Logger.getInstance();

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Create a React Error Boundary HOC
export const withErrorLogging = (WrappedComponent: React.ComponentType<any>) => {
  return class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logger.error('React component error', {
        error,
        componentStack: errorInfo.componentStack
      }, WrappedComponent.displayName || WrappedComponent.name);
    }

    render(): JSX.Element {
      if (this.state.hasError) {
        return <div>Something went wrong. Please try again.</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}; 
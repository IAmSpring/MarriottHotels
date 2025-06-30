import { NavigationAction } from '../contexts/NavigationContext';

type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class NavigationLogger {
  private logs: LogEntry[] = [];
  private subscribers: ((entry: LogEntry) => void)[] = [];

  private createEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.createEntry(level, message, data);
    this.logs.push(entry);
    this.notifySubscribers(entry);
    
    // Console output with styling
    const styles = {
      info: 'color: #0066cc',
      warn: 'color: #ff9900',
      error: 'color: #cc0000',
      success: 'color: #00cc00',
      debug: 'color: #666666',
    };

    console.groupCollapsed(
      `%c[Navigation ${level.toUpperCase()}] ${message}`,
      styles[level]
    );
    if (data) console.log('Data:', data);
    console.log('Timestamp:', entry.timestamp);
    console.groupEnd();
  }

  public subscribe(callback: (entry: LogEntry) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(entry: LogEntry) {
    this.subscribers.forEach(callback => callback(entry));
  }

  public info(message: string, data?: any) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: any) {
    this.log('error', message, data);
  }

  public success(message: string, data?: any) {
    this.log('success', message, data);
  }

  public debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  public logAction(action: NavigationAction, status: 'queued' | 'started' | 'completed' | 'failed', error?: Error) {
    const message = `Action ${status}: ${action.type} -> ${action.selector}`;
    const level: LogLevel = error ? 'error' : status === 'completed' ? 'success' : 'info';
    
    this.log(level, message, {
      action,
      status,
      error: error?.message,
    });
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clear() {
    this.logs = [];
    this.info('Logs cleared');
  }
}

export const navigationLogger = new NavigationLogger(); 
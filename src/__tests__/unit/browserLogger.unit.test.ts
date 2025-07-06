import { browserLogger } from '../../lib/browserLogger';

describe('BrowserLogger', () => {
  const originalConsole = { ...console };
  let consoleOutput: any[] = [];

  beforeEach(() => {
    consoleOutput = [];
    console.info = jest.fn((...args) => consoleOutput.push(['info', ...args]));
    console.error = jest.fn((...args) => consoleOutput.push(['error', ...args]));
    console.warn = jest.fn((...args) => consoleOutput.push(['warn', ...args]));
    console.debug = jest.fn((...args) => consoleOutput.push(['debug', ...args]));
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });

  it('should log messages with correct level', () => {
    browserLogger.info('test info message');
    browserLogger.error('test error message');
    browserLogger.warn('test warn message');
    browserLogger.debug('test debug message');

    expect(consoleOutput).toHaveLength(4);
    expect(consoleOutput[0][0]).toBe('info');
    expect(consoleOutput[1][0]).toBe('error');
    expect(consoleOutput[2][0]).toBe('warn');
    expect(consoleOutput[3][0]).toBe('debug');
  });

  it('should include timestamp and level in message', () => {
    browserLogger.info('test message');
    
    const loggedMessage = consoleOutput[0][1];
    expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO: test message/);
  });

  it('should include meta information when provided', () => {
    const meta = { user: 'test', action: 'login' };
    browserLogger.info('test message', meta);
    
    const loggedMessage = consoleOutput[0][1];
    expect(loggedMessage).toContain(JSON.stringify(meta));
  });
}); 
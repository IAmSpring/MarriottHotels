import React, { useEffect, useState, useRef } from 'react';
import { navigationLogger } from '../utils/navigationLogger';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
  data?: any;
}

export const NavigationLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to new log entries
    const unsubscribe = navigationLogger.subscribe((entry) => {
      setLogs((prevLogs) => [...prevLogs, entry]);
      
      // Auto-scroll to bottom
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    });

    // Initialize with existing logs
    setLogs(navigationLogger.getLogs());

    return unsubscribe;
  }, []);

  const getLevelStyles = (level: LogEntry['level']) => {
    const baseStyles = 'px-2 py-1 rounded-full text-xs font-medium';
    const colorStyles = {
      info: 'bg-blue-100 text-blue-800',
      warn: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
      debug: 'bg-gray-100 text-gray-800',
    };
    return `${baseStyles} ${colorStyles[level]}`;
  };

  const clearLogs = () => {
    navigationLogger.clear();
    setLogs([]);
  };

  return (
    <div className={`fixed left-4 bottom-4 bg-white rounded-lg shadow-lg transition-all duration-300 ${
      isExpanded ? 'w-96 h-96' : 'w-40 h-10'
    }`}>
      <div className="flex justify-between items-center p-2 border-b">
        <h3 className="text-sm font-semibold">Navigation Logs</h3>
        <div className="flex space-x-2">
          <button
            onClick={clearLogs}
            className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            Clear
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
          >
            {isExpanded ? 'Minimize' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          ref={logContainerRef}
          className="h-[calc(100%-2.5rem)] overflow-y-auto p-2 space-y-2"
        >
          {logs.map((log, index) => (
            <div key={index} className="text-sm border-b border-gray-100 pb-2">
              <div className="flex justify-between items-center mb-1">
                <span className={getLevelStyles(log.level)}>
                  {log.level.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700">{log.message}</p>
              {log.data && (
                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 
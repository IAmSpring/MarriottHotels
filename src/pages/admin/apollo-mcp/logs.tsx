import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Code,
  Database,
  Network,
  Server
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  category: string;
  message: string;
  details?: string;
  metadata?: {
    operation?: string;
    userId?: string;
    requestId?: string;
    duration?: number;
    ip?: string;
    userAgent?: string;
  };
}

const ApolloMCPLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['info', 'warn', 'error']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Mock log data
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-15T10:30:15.123Z',
        level: 'info',
        category: 'graphql',
        message: 'GraphQL query executed successfully',
        details: 'Query: SearchHotels with variables: {"location": "New York", "rating": 4.0}',
        metadata: {
          operation: 'SearchHotels',
          requestId: 'req_123456',
          duration: 245,
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        }
      },
      {
        id: '2',
        timestamp: '2024-01-15T10:29:45.456Z',
        level: 'warn',
        category: 'database',
        message: 'Database connection pool running low',
        details: 'Active connections: 18/20, Available: 2',
        metadata: {
          requestId: 'req_123455',
          duration: 1200
        }
      },
      {
        id: '3',
        timestamp: '2024-01-15T10:29:12.789Z',
        level: 'error',
        category: 'graphql',
        message: 'GraphQL validation error',
        details: 'Invalid query structure: missing required field "id" in User type',
        metadata: {
          operation: 'GetUserProfile',
          requestId: 'req_123454',
          userId: 'user_789',
          duration: 50
        }
      },
      {
        id: '4',
        timestamp: '2024-01-15T10:28:30.012Z',
        level: 'info',
        category: 'mcp',
        message: 'MCP server started successfully',
        details: 'Server listening on port 5000, GraphQL endpoint: http://localhost:4000/graphql',
        metadata: {
          requestId: 'server_start'
        }
      },
      {
        id: '5',
        timestamp: '2024-01-15T10:27:15.345Z',
        level: 'debug',
        category: 'cache',
        message: 'Cache miss for hotel data',
        details: 'Cache key: hotels:nyc:4.0, fetching from database',
        metadata: {
          operation: 'SearchHotels',
          requestId: 'req_123453',
          duration: 180
        }
      },
      {
        id: '6',
        timestamp: '2024-01-15T10:26:45.678Z',
        level: 'info',
        category: 'auth',
        message: 'User authentication successful',
        details: 'User ID: user_123, Role: admin, Bonvoy Status: Platinum',
        metadata: {
          userId: 'user_123',
          requestId: 'req_123452',
          ip: '192.168.1.101'
        }
      },
      {
        id: '7',
        timestamp: '2024-01-15T10:25:30.901Z',
        level: 'error',
        category: 'payment',
        message: 'Payment processing failed',
        details: 'Stripe API error: card_declined - insufficient_funds',
        metadata: {
          operation: 'ProcessPayment',
          requestId: 'req_123451',
          userId: 'user_456',
          duration: 3000
        }
      },
      {
        id: '8',
        timestamp: '2024-01-15T10:24:15.234Z',
        level: 'warn',
        category: 'performance',
        message: 'Slow query detected',
        details: 'Query execution time: 2.5s exceeded threshold of 1s',
        metadata: {
          operation: 'GetBookingAnalytics',
          requestId: 'req_123450',
          duration: 2500
        }
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  // Filter logs based on search criteria
  useEffect(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.metadata?.operation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by log levels
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(log => selectedLevels.includes(log.level));
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(log => selectedCategories.includes(log.category));
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(dateRange.end));
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedLevels, selectedCategories, dateRange]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug': return 'text-gray-500 bg-gray-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warn': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'fatal': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug': return <Code size={14} />;
      case 'info': return <Info size={14} />;
      case 'warn': return <AlertTriangle size={14} />;
      case 'error': return <XCircle size={14} />;
      case 'fatal': return <XCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'graphql': return <Code size={14} />;
      case 'database': return <Database size={14} />;
      case 'mcp': return <Server size={14} />;
      case 'cache': return <Database size={14} />;
      case 'auth': return <Server size={14} />;
      case 'payment': return <Network size={14} />;
      case 'performance': return <Clock size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevels(['info', 'warn', 'error']);
    setSelectedCategories([]);
    setDateRange({ start: '', end: '' });
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Category,Message,Details,Operation,RequestId,Duration',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.level}","${log.category}","${log.message}","${log.details || ''}","${log.metadata?.operation || ''}","${log.metadata?.requestId || ''}","${log.metadata?.duration || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyLogDetails = (log: LogEntry) => {
    const details = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(details);
  };

  const availableCategories = Array.from(new Set(logs.map(log => log.category)));
  const availableLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MCP Server Logs</h1>
          <p className="text-gray-600">Real-time log monitoring and analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isLiveMode 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLiveMode ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{isLiveMode ? 'Live' : 'Paused'}</span>
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="datetime-local"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="datetime-local"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Level and Category Filters */}
        <div className="mt-6 space-y-4">
          {/* Log Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Levels</label>
            <div className="flex flex-wrap gap-2">
              {availableLevels.map(level => (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedLevels.includes(level)
                      ? getLevelColor(level)
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Log Entries ({filteredLogs.length})
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Auto-scroll</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showDetails}
                  onChange={(e) => setShowDetails(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show details</span>
              </label>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                {showDetails && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      <span className="ml-1">{log.level.toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center text-sm text-gray-900">
                      {getCategoryIcon(log.category)}
                      <span className="ml-1">{log.category}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                    {log.message}
                  </td>
                  {showDetails && (
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                      {log.details && (
                        <div className="truncate" title={log.details}>
                          {log.details}
                        </div>
                      )}
                      {log.metadata && (
                        <div className="text-xs text-gray-500 mt-1">
                          {log.metadata.operation && <span className="mr-2">Op: {log.metadata.operation}</span>}
                          {log.metadata.duration && <span className="mr-2">{log.metadata.duration}ms</span>}
                          {log.metadata.requestId && <span>ID: {log.metadata.requestId}</span>}
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyLogDetails(log)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Copy log details"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View full details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No logs found matching the current filters</p>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div><span className="font-medium">Timestamp:</span> {selectedLog.timestamp}</div>
                    <div><span className="font-medium">Level:</span> {selectedLog.level}</div>
                    <div><span className="font-medium">Category:</span> {selectedLog.category}</div>
                    <div><span className="font-medium">Message:</span> {selectedLog.message}</div>
                  </div>
                </div>

                {selectedLog.details && (
                  <div>
                    <h4 className="font-medium text-gray-900">Details</h4>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm font-mono">
                      {selectedLog.details}
                    </div>
                  </div>
                )}

                {selectedLog.metadata && (
                  <div>
                    <h4 className="font-medium text-gray-900">Metadata</h4>
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => copyLogDetails(selectedLog)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Copy Details
                </button>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApolloMCPLogs; 
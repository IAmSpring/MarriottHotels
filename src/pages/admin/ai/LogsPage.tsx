import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Bot,
  Bug,
  Brain,
  Clock,
  Cloud,
  Database,
  Download,
  Filter,
  Info,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Terminal,
  Users,
  Zap
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  component: string;
  message: string;
  metadata: {
    userId?: string;
    sessionId?: string;
    modelId?: string;
    latency?: number;
    tokens?: number;
    cost?: number;
    status?: number;
    errorCode?: string;
  };
  trace?: string;
}

interface LogFilter {
  level: string[];
  component: string[];
  timeRange: string;
  search: string;
}

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface ComponentHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'error';
  latency: string;
  uptime: string;
  lastIncident?: string;
}

// Mock data
const mockLogs: LogEntry[] = [
  {
    id: 'log_1',
    timestamp: '2024-03-15T10:30:45Z',
    level: 'error',
    component: 'GPT-4 API',
    message: 'Token rate limit exceeded during high-traffic period',
    metadata: {
      userId: 'user_123',
      sessionId: 'sess_456',
      modelId: 'gpt-4',
      status: 429,
      errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    trace: 'Error: Rate limit exceeded\n  at ApiHandler.processRequest (/src/handlers/api.ts:145)'
  },
  {
    id: 'log_2',
    timestamp: '2024-03-15T10:30:42Z',
    level: 'info',
    component: 'Vector Store',
    message: 'Successfully indexed new hotel amenities data',
    metadata: {
      latency: 245,
      tokens: 1500,
      cost: 0.12
    }
  },
  {
    id: 'log_3',
    timestamp: '2024-03-15T10:30:40Z',
    level: 'warning',
    component: 'LangGraph',
    message: 'High latency detected in conversation processing',
    metadata: {
      sessionId: 'sess_789',
      latency: 2500,
      status: 200
    }
  }
];

const mockMetrics: SystemMetric[] = [
  {
    id: 'metric_1',
    name: 'Total API Calls',
    value: '1.2M',
    change: 12,
    trend: 'up',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'metric_2',
    name: 'Avg Response Time',
    value: '0.85s',
    change: -5,
    trend: 'down',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'metric_3',
    name: 'Success Rate',
    value: '99.2%',
    change: 0.5,
    trend: 'up',
    icon: <Activity className="w-5 h-5" />
  },
  {
    id: 'metric_4',
    name: 'Active Sessions',
    value: '2.5K',
    change: 8,
    trend: 'up',
    icon: <Users className="w-5 h-5" />
  }
];

const mockHealth: ComponentHealth[] = [
  {
    id: 'health_1',
    name: 'AI Assistants',
    status: 'healthy',
    latency: '0.8s',
    uptime: '99.99%'
  },
  {
    id: 'health_2',
    name: 'Vector Search',
    status: 'degraded',
    latency: '250ms',
    uptime: '99.95%',
    lastIncident: '5 minutes ago'
  },
  {
    id: 'health_3',
    name: 'OpenAI API',
    status: 'error',
    latency: '1.2s',
    uptime: '99.90%',
    lastIncident: '2 minutes ago'
  }
];

const components = ['GPT-4 API', 'Vector Store', 'LangGraph', 'Training Pipeline', 'Data Ingestion', 'Security Layer'];
const logLevels = ['info', 'warning', 'error', 'debug'];
const timeRanges = ['Last 15 minutes', 'Last hour', 'Last 24 hours', 'Last 7 days', 'Custom range'];

type LogLevel = 'info' | 'warning' | 'error' | 'debug';

const LogLevelBadge: React.FC<{ level: LogLevel }> = ({ level }) => {
  const styles: Record<LogLevel, string> = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    debug: 'bg-gray-100 text-gray-800'
  };

  const icons: Record<LogLevel, JSX.Element> = {
    info: <Info className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    error: <Bug className="w-4 h-4" />,
    debug: <Terminal className="w-4 h-4" />
  };

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}>
      <span className="mr-1">{icons[level]}</span>
      {level.toUpperCase()}
    </span>
  );
};

const MetricCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-lg bg-[#8B1538] bg-opacity-10 text-[#8B1538] flex items-center justify-center mr-3">
          {metric.icon}
        </div>
        <h3 className="text-sm text-gray-600">{metric.name}</h3>
      </div>
      <span className={`flex items-center text-sm ${
        metric.trend === 'up' ? 'text-green-600' :
        metric.trend === 'down' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {metric.change > 0 ? '+' : ''}{metric.change}%
      </span>
    </div>
    <p className="text-2xl font-semibold">{metric.value}</p>
  </div>
);

const HealthIndicator: React.FC<{ health: ComponentHealth }> = ({ health }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{health.name}</h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        health.status === 'healthy' ? 'bg-green-100 text-green-800' :
        health.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {health.status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <p className="text-gray-600">Latency</p>
        <p className="font-medium">{health.latency}</p>
      </div>
      <div>
        <p className="text-gray-600">Uptime</p>
        <p className="font-medium">{health.uptime}</p>
      </div>
      {health.lastIncident && (
        <div className="col-span-2 text-yellow-600">
          Last incident: {health.lastIncident}
        </div>
      )}
    </div>
  </div>
);

const QuickInsights: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
    <div className="space-y-4">
      <div className="flex items-center text-yellow-600">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <p className="text-sm">Unusual spike in API errors detected</p>
      </div>
      <div className="flex items-center text-blue-600">
        <Info className="w-5 h-5 mr-2" />
        <p className="text-sm">New model version deployment completed</p>
      </div>
      <div className="flex items-center text-green-600">
        <Activity className="w-5 h-5 mr-2" />
        <p className="text-sm">System performance improved by 15%</p>
      </div>
    </div>
  </div>
);

const LogFilters: React.FC<{ filters: LogFilter; setFilters: (filters: LogFilter) => void }> = ({ filters, setFilters }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center">
        <Filter className="w-5 h-5 mr-2" />
        Log Filters
      </h2>
      <button
        onClick={() => setFilters({ level: [], component: [], timeRange: 'Last 24 hours', search: '' })}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Reset Filters
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
        <select
          multiple
          className="w-full rounded-lg border border-gray-300 shadow-sm"
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: Array.from(e.target.selectedOptions, option => option.value) })}
        >
          {logLevels.map(level => (
            <option key={level} value={level}>{level.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Component</label>
        <select
          multiple
          className="w-full rounded-lg border border-gray-300 shadow-sm"
          value={filters.component}
          onChange={(e) => setFilters({ ...filters, component: Array.from(e.target.selectedOptions, option => option.value) })}
        >
          {components.map(component => (
            <option key={component} value={component}>{component}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
        <select
          className="w-full rounded-lg border border-gray-300 shadow-sm"
          value={filters.timeRange}
          onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
        >
          {timeRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 shadow-sm pl-10"
            placeholder="Search logs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>
    </div>
  </div>
);

const LogTable: React.FC<{ logs: LogEntry[] }> = ({ logs }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
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
              Component
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Metadata
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <LogLevelBadge level={log.level} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.component}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {log.message}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <pre className="text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LogStats: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const stats = {
    total: logs.length,
    errors: logs.filter(log => log.level === 'error').length,
    warnings: logs.filter(log => log.level === 'warning').length,
    avgLatency: Math.round(
      logs.reduce((acc, log) => acc + (log.metadata.latency || 0), 0) / logs.length
    )
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Terminal className="w-8 h-8 text-[#8B1538]" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bug className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-semibold">{stats.errors}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-semibold">{stats.warnings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-[#8B1538]" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Latency</p>
              <p className="text-2xl font-semibold">{stats.avgLatency}ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RealTimeMonitor: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Real-Time Log Stream
      </h2>
      <div className="flex items-center space-x-2">
        <span className="flex items-center text-green-600">
          <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
          Live
        </span>
      </div>
    </div>
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 h-48 overflow-auto">
      {mockLogs.map((log) => (
        <div key={log.id} className="mb-2">
          <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
          <span className={`ml-2 ${
            log.level === 'error' ? 'text-red-400' :
            log.level === 'warning' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {log.level.toUpperCase()}
          </span>
          <span className="text-blue-400 ml-2">{log.component}:</span>
          <span className="ml-2">{log.message}</span>
        </div>
      ))}
    </div>
  </div>
);

const LogsPage: React.FC = () => {
  const [filters, setFilters] = useState<LogFilter>({
    level: [],
    component: [],
    timeRange: 'Last 24 hours',
    search: ''
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">AI System Logs</h1>
          <p className="text-gray-600">Monitor and analyze system logs across all AI components</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 mr-2" />
            Export Logs
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LogStats logs={mockLogs} />
          <RealTimeMonitor />
          <LogFilters filters={filters} setFilters={setFilters} />
          <LogTable logs={mockLogs} />
        </div>
        <div className="space-y-6">
          <QuickInsights />
          <div className="grid grid-cols-1 gap-4">
            {mockHealth.map((health) => (
              <HealthIndicator key={health.id} health={health} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage; 
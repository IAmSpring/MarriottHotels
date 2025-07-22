import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Cpu,
  HardDrive,
  Network,
  Zap,
  Eye,
  Settings,
  RefreshCw,
  Bell,
  BellOff,
  TrendingUp,
  TrendingDown,
  Gauge,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
    activeConnections: number;
  };
}

interface PerformanceMetrics {
  responseTime: {
    current: number;
    average: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
  };
  errors: {
    total: number;
    rate: number;
    recent: Array<{
      timestamp: string;
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

const ApolloMCPMonitoring: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: {
      usage: 23.5,
      cores: 8,
      temperature: 45
    },
    memory: {
      total: 16384,
      used: 8192,
      available: 8192,
      usage: 50
    },
    disk: {
      total: 512000,
      used: 128000,
      available: 384000,
      usage: 25
    },
    network: {
      bytesIn: 1024000,
      bytesOut: 512000,
      connections: 150,
      activeConnections: 45
    }
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    responseTime: {
      current: 245,
      average: 280,
      p95: 450,
      p99: 800
    },
    throughput: {
      requestsPerSecond: 12.5,
      totalRequests: 15678,
      successfulRequests: 15420,
      failedRequests: 258
    },
    errors: {
      total: 258,
      rate: 1.64,
      recent: [
        {
          timestamp: '2 minutes ago',
          type: 'GraphQL Validation Error',
          message: 'Invalid query structure in SearchHotels operation',
          severity: 'medium'
        },
        {
          timestamp: '5 minutes ago',
          type: 'Database Connection Timeout',
          message: 'Connection to PostgreSQL timed out after 30 seconds',
          severity: 'high'
        },
        {
          timestamp: '12 minutes ago',
          type: 'Memory Usage Warning',
          message: 'Memory usage exceeded 80% threshold',
          severity: 'warning'
        }
      ]
    }
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory usage has exceeded 80% threshold',
      timestamp: '5 minutes ago',
      acknowledged: false,
      resolved: false
    },
    {
      id: '2',
      type: 'error',
      title: 'Database Connection Issues',
      message: 'Multiple database connection timeouts detected',
      timestamp: '12 minutes ago',
      acknowledged: true,
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Server Restart',
      message: 'MCP server was restarted due to configuration changes',
      timestamp: '1 hour ago',
      acknowledged: true,
      resolved: true
    }
  ]);

  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoringActive) return;

    const interval = setInterval(() => {
      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(5, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          usage: Math.max(30, Math.min(90, prev.memory.usage + (Math.random() - 0.5) * 5))
        }
      }));

      // Update performance metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        responseTime: {
          ...prev.responseTime,
          current: Math.max(100, Math.min(1000, prev.responseTime.current + (Math.random() - 0.5) * 100))
        },
        throughput: {
          ...prev.throughput,
          requestsPerSecond: Math.max(5, Math.min(20, prev.throughput.requestsPerSecond + (Math.random() - 0.5) * 2))
        }
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isMonitoringActive, refreshInterval]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <CheckCircle size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'critical': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MCP Server Monitoring</h1>
          <p className="text-gray-600">Real-time monitoring and alerting for Apollo MCP server</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Refresh:</span>
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={1000}>1s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
          </div>
          <button
            onClick={() => setIsMonitoringActive(!isMonitoringActive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isMonitoringActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {isMonitoringActive ? <Eye size={16} /> : <Eye size={16} />}
            <span>{isMonitoringActive ? 'Active' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CPU Usage</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.cpu.usage.toFixed(1)}%</p>
            </div>
            <Cpu size={24} className="text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Cores: {systemMetrics.cpu.cores}</span>
              <span>Temp: {systemMetrics.cpu.temperature}°C</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Memory Usage</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.memory.usage.toFixed(1)}%</p>
            </div>
            <HardDrive size={24} className="text-green-500" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Used: {(systemMetrics.memory.used / 1024).toFixed(1)}GB</span>
              <span>Total: {(systemMetrics.memory.total / 1024).toFixed(1)}GB</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disk Usage</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.disk.usage.toFixed(1)}%</p>
            </div>
            <Database size={24} className="text-purple-500" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Used: {(systemMetrics.disk.used / 1024).toFixed(1)}GB</span>
              <span>Total: {(systemMetrics.disk.total / 1024).toFixed(1)}GB</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Network</p>
              <p className="text-2xl font-bold text-gray-900">{systemMetrics.network.activeConnections}</p>
            </div>
            <Network size={24} className="text-orange-500" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>In: {(systemMetrics.network.bytesIn / 1024).toFixed(1)}KB/s</span>
              <span>Out: {(systemMetrics.network.bytesOut / 1024).toFixed(1)}KB/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Current:</span>
              <span className="font-medium">{performanceMetrics.responseTime.current}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average:</span>
              <span className="font-medium">{performanceMetrics.responseTime.average}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">95th Percentile:</span>
              <span className="font-medium">{performanceMetrics.responseTime.p95}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">99th Percentile:</span>
              <span className="font-medium">{performanceMetrics.responseTime.p99}ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Throughput</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Requests/sec:</span>
              <span className="font-medium">{performanceMetrics.throughput.requestsPerSecond.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Requests:</span>
              <span className="font-medium">{performanceMetrics.throughput.totalRequests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium text-green-600">
                {((performanceMetrics.throughput.successfulRequests / performanceMetrics.throughput.totalRequests) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Error Rate:</span>
              <span className="font-medium text-red-600">{performanceMetrics.errors.rate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Errors</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {performanceMetrics.errors.recent.map((error, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle size={16} className={`mt-1 ${getSeverityColor(error.severity)}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{error.type}</p>
                    <span className="text-sm text-gray-500">{error.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{error.message}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    error.severity === 'low' ? 'bg-blue-100 text-blue-800' :
                    error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    error.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {error.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
            <span className="text-sm text-gray-500">
              {alerts.filter(a => !a.resolved).length} active
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {alerts.filter(alert => !alert.resolved).map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">{alert.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {alerts.filter(alert => !alert.resolved).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <p>No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApolloMCPMonitoring; 
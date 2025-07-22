import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Code,
  Database,
  Terminal,
  BarChart3,
  Monitor,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Server,
  Cpu,
  HardDrive,
  Network,
  Users,
  TrendingUp,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { apolloMCPService, MCPStatus, OperationStats, SystemMetrics } from '../../../services/apolloMCPService';



const ApolloMCPDashboard: React.FC = () => {
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [operationStats, setOperationStats] = useState<OperationStats | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const [recentOperations, setRecentOperations] = useState([
    {
      id: 1,
      name: 'SearchHotels',
      type: 'query',
      status: 'success',
      duration: 180,
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      name: 'GetBookings',
      type: 'query',
      status: 'success',
      duration: 320,
      timestamp: '5 minutes ago'
    },
    {
      id: 3,
      name: 'CreateBooking',
      type: 'mutation',
      status: 'success',
      duration: 450,
      timestamp: '8 minutes ago'
    },
    {
      id: 4,
      name: 'GetUserAnalytics',
      type: 'query',
      status: 'error',
      duration: 1200,
      timestamp: '12 minutes ago'
    }
  ]);



  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [status, stats, metrics] = await Promise.all([
          apolloMCPService.getMCPStatus(),
          apolloMCPService.getOperationStats(),
          apolloMCPService.getSystemMetrics()
        ]);
        setMcpStatus(status);
        setOperationStats(stats);
        setSystemMetrics(metrics);
      } catch (error) {
        console.error('Error loading MCP data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const quickActions = [
    {
      title: 'Start Server',
      icon: <Play size={20} />,
      action: () => console.log('Start server'),
      color: 'bg-green-500'
    },
    {
      title: 'Stop Server',
      icon: <Pause size={20} />,
      action: () => console.log('Stop server'),
      color: 'bg-red-500'
    },
    {
      title: 'Restart Server',
      icon: <RefreshCw size={20} />,
      action: () => console.log('Restart server'),
      color: 'bg-blue-500'
    },
    {
      title: 'Reload Schema',
      icon: <Database size={20} />,
      action: () => console.log('Reload schema'),
      color: 'bg-purple-500'
    }
  ];

  const navigationCards = [
    {
      title: 'Operations',
      description: 'Manage GraphQL operations and queries',
      icon: <Code size={24} />,
      path: '/admin/apollo-mcp/operations',
      color: 'bg-blue-500'
    },
    {
      title: 'Schema',
      description: 'View and edit GraphQL schema',
      icon: <Database size={24} />,
      path: '/admin/apollo-mcp/schema',
      color: 'bg-green-500'
    },
    {
      title: 'Playground',
      description: 'Interactive GraphQL playground',
      icon: <Terminal size={24} />,
      path: '/admin/apollo-mcp/playground',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Performance and usage analytics',
      icon: <BarChart3 size={24} />,
      path: '/admin/apollo-mcp/analytics',
      color: 'bg-orange-500'
    },
    {
      title: 'Monitoring',
      description: 'Real-time system monitoring',
      icon: <Monitor size={24} />,
      path: '/admin/apollo-mcp/monitoring',
      color: 'bg-red-500'
    },
    {
      title: 'Logs',
      description: 'View system logs and errors',
      icon: <Terminal size={24} />,
      path: '/admin/apollo-mcp/logs',
      color: 'bg-gray-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!mcpStatus || !operationStats || !systemMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apollo MCP Dashboard</h1>
          <p className="text-gray-600 mt-2">Model Context Protocol server for GraphQL operations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              mcpStatus.server === 'running' ? 'bg-green-500' : 
              mcpStatus.server === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm font-medium capitalize">{mcpStatus.server}</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw size={16} className="inline mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{action.title}</span>
              {action.icon}
            </div>
          </button>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Server Status</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{mcpStatus.server}</p>
            </div>
            <Server className="text-blue-500" size={24} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Uptime: {mcpStatus.uptime}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Operations</p>
              <p className="text-2xl font-bold text-gray-900">{mcpStatus.operations}</p>
            </div>
            <Code className="text-green-500" size={24} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Executed: {operationStats.executed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{mcpStatus.responseTime}ms</p>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Avg: {operationStats.avgResponseTime}ms</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(mcpStatus.errorRate * 100).toFixed(1)}%</p>
            </div>
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Failed: {operationStats.failed}</p>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${mcpStatus.memoryUsage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{mcpStatus.memoryUsage}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${mcpStatus.cpuUsage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{mcpStatus.cpuUsage}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="text-sm font-medium">{mcpStatus.activeConnections}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Activity</span>
              <span className="text-sm font-medium">{mcpStatus.lastActivity}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schema Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">GraphQL Endpoint</span>
              <span className="text-sm font-mono text-blue-600">{systemMetrics.graphqlEndpoint}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">MCP Port</span>
              <span className="text-sm font-medium">{systemMetrics.mcpPort}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Schema Version</span>
              <span className="text-sm font-medium">{systemMetrics.schemaVersion}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Types</span>
              <span className="text-sm font-medium">{systemMetrics.totalTypes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Queries</span>
              <span className="text-sm font-medium">{systemMetrics.totalQueries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Mutations</span>
              <span className="text-sm font-medium">{systemMetrics.totalMutations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationCards.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  {card.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{card.title}</h4>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Operations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Operations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Operation</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Duration</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentOperations.map((op) => (
                <tr key={op.id} className="border-b">
                  <td className="py-2 text-sm font-medium">{op.name}</td>
                  <td className="py-2 text-sm text-gray-600 capitalize">{op.type}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      op.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {op.status === 'success' ? <CheckCircle size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                      {op.status}
                    </span>
                  </td>
                  <td className="py-2 text-sm text-gray-600">{op.duration}ms</td>
                  <td className="py-2 text-sm text-gray-600">{op.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApolloMCPDashboard; 
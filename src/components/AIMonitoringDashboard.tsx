import React from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Clock,
  Cpu,
  Database,
  DollarSign,
  FileText,
  GitBranch,
  Globe,
  HardDrive,
  LineChart,
  MessageCircle,
  Server,
  Shield,
  Zap
} from 'lucide-react';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
}

interface ModelMetrics {
  name: string;
  accuracy: number;
  latency: number;
  requests: number;
}

interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface AIMonitoringDashboardProps {
  timeRange: string;
  metrics: {
    system: {
      cpu: number;
      memory: number;
      latency: number;
      errorRate: number;
    };
    user: {
      totalUsers: number;
      activeUsers: number;
      sessionDuration: number;
    };
    business: {
      bookings: number;
      revenue: number;
      conversionRate: number;
    };
  } | null;
}

const SystemHealthIndicator: React.FC<{ health: SystemHealth }> = ({ health }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-900">System Health</h3>
    <div className={`mt-4 p-4 rounded-lg ${
      health.status === 'healthy' ? 'bg-green-50' :
      health.status === 'warning' ? 'bg-yellow-50' :
      'bg-red-50'
    }`}>
      <div className="flex items-center">
        <div className={`rounded-full p-2 ${
          health.status === 'healthy' ? 'bg-green-100 text-green-600' :
          health.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
          'bg-red-100 text-red-600'
        }`}>
          {health.status === 'healthy' ? <Shield className="h-5 w-5" /> :
           health.status === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
           <AlertTriangle className="h-5 w-5" />}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${
            health.status === 'healthy' ? 'text-green-800' :
            health.status === 'warning' ? 'text-yellow-800' :
            'text-red-800'
          }`}>
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </h3>
          <p className="text-sm text-gray-500">{health.message}</p>
        </div>
      </div>
    </div>
  </div>
);

const ModelPerformance: React.FC<{ metrics: ModelMetrics[] }> = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-900">Model Performance</h3>
    <div className="mt-4 space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{metric.name}</p>
            <p className="text-sm text-gray-500">Accuracy: {metric.accuracy}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{metric.latency}ms</p>
            <p className="text-sm text-gray-500">{metric.requests} req/s</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AIMonitoringDashboard: React.FC<AIMonitoringDashboardProps> = ({ timeRange, metrics }) => {
  // Calculate system health based on metrics
  const calculateSystemHealth = (): SystemHealth => {
    if (!metrics) {
      return {
        status: 'warning',
        message: 'No metrics available'
      };
    }

    if (metrics.system.errorRate > 5 || metrics.system.cpu > 90 || metrics.system.latency > 2) {
      return {
        status: 'critical',
        message: 'Critical system issues detected'
      };
    }

    if (metrics.system.errorRate > 1 || metrics.system.cpu > 70 || metrics.system.latency > 1) {
      return {
        status: 'warning',
        message: 'Performance degradation detected'
      };
    }

    return {
      status: 'healthy',
      message: 'All systems operational'
    };
  };

  // Transform metrics into cards
  const getMetricCards = (): MetricCard[] => {
    if (!metrics) return [];

    return [
      {
        title: 'Total Requests',
        value: metrics.user.totalUsers.toLocaleString(),
        icon: <Activity className="h-5 w-5 text-blue-600" />,
        trend: { value: 12, isPositive: true }
      },
      {
        title: 'Average Latency',
        value: `${metrics.system.latency.toFixed(2)}s`,
        icon: <Clock className="h-5 w-5 text-blue-600" />,
        trend: { value: 8, isPositive: false }
      },
      {
        title: 'Error Rate',
        value: `${metrics.system.errorRate.toFixed(2)}%`,
        icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
        trend: { value: 5, isPositive: true }
      },
      {
        title: 'CPU Usage',
        value: `${metrics.system.cpu.toFixed(1)}%`,
        icon: <Cpu className="h-5 w-5 text-blue-600" />
      }
    ];
  };

  const systemHealth = calculateSystemHealth();
  const metricCards = getMetricCards();

  // Mock model metrics (this would come from your AI monitoring system)
  const modelMetrics: ModelMetrics[] = [
    {
      name: 'Text Classification',
      accuracy: 95.5,
      latency: 120,
      requests: 450
    },
    {
      name: 'Image Recognition',
      accuracy: 92.8,
      latency: 180,
      requests: 320
    },
    {
      name: 'Sentiment Analysis',
      accuracy: 88.9,
      latency: 90,
      requests: 680
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">AI System Monitoring</h2>
        <p className="mt-1 text-sm text-gray-500">Real-time performance metrics and system health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[#8B1538] bg-opacity-10 text-[#8B1538] flex items-center justify-center mr-3">
                  {metric.icon}
                </div>
                <h3 className="text-sm text-gray-600">{metric.title}</h3>
              </div>
              {metric.trend && (
                <span className={`flex items-center text-sm ${
                  metric.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend.isPositive ? '+' : '-'}{metric.trend.value}%
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthIndicator health={systemHealth} />
        <ModelPerformance metrics={modelMetrics} />
      </div>
    </div>
  );
};

export default AIMonitoringDashboard;
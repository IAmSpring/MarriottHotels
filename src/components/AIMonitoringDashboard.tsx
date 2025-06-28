import React, { useState, useEffect } from 'react';
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
}

const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 bg-blue-100 rounded-lg">
          {metric.icon}
        </div>
        <h3 className="ml-3 text-sm font-medium text-gray-900">{metric.title}</h3>
      </div>
      {metric.trend && (
        <div className={`flex items-center ${metric.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span className="text-sm font-medium">{metric.trend.value}%</span>
        </div>
      )}
    </div>
    <p className="mt-4 text-2xl font-semibold text-gray-900">{metric.value}</p>
  </div>
);

const SystemHealthIndicator: React.FC<{ health: SystemHealth }> = ({ health }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-900">System Health</h3>
    <div className="mt-4 flex items-center">
      <div className={`p-2 rounded-full ${
        health.status === 'healthy' ? 'bg-green-100' :
        health.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
      }`}>
        <Shield className={`h-5 w-5 ${
          health.status === 'healthy' ? 'text-green-600' :
          health.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
      <span className="ml-3 text-sm font-medium text-gray-900">{health.message}</span>
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

const AIMonitoringDashboard: React.FC<AIMonitoringDashboardProps> = ({ timeRange }) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    message: 'All systems operational'
  });

  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>([
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
  ]);

  const metrics: MetricCard[] = [
    {
      title: 'Total Requests',
      value: '2.5M',
      icon: <Activity className="h-5 w-5 text-blue-600" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Average Latency',
      value: '145ms',
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      trend: { value: 8, isPositive: false }
    },
    {
      title: 'Error Rate',
      value: '0.12%',
      icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'CPU Usage',
      value: '78%',
      icon: <Cpu className="h-5 w-5 text-blue-600" />
    }
  ];

  useEffect(() => {
    // Simulated data fetching
    const fetchData = () => {
      // Update metrics periodically
    };

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">AI System Monitoring</h2>
        <p className="mt-1 text-sm text-gray-500">Real-time performance metrics and system health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
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
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

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    latency: string;
    uptime: string;
  }[];
}

interface ModelMetrics {
  name: string;
  requests: number;
  latency: string;
  errorRate: number;
  tokenUsage: number;
  cost: number;
}

interface AIMonitoringDashboardProps {
  timeRange: string;
}

const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-lg bg-[#8B1538] bg-opacity-10 text-[#8B1538] flex items-center justify-center mr-3">
          {metric.icon}
        </div>
        <h3 className="text-sm text-gray-600">{metric.title}</h3>
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
    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
  </div>
);

const SystemHealthIndicator: React.FC<{ health: SystemHealth }> = ({ health }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">System Health</h3>
    <div className="space-y-4">
      {health.components.map((component) => (
        <div key={component.name} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              component.status === 'operational' ? 'bg-green-500' :
              component.status === 'degraded' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm">{component.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">{component.latency}</span>
            <span className="text-xs text-gray-500">{component.uptime}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ModelPerformance: React.FC<{ metrics: ModelMetrics[] }> = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="pb-3">Model</th>
            <th className="pb-3">Requests</th>
            <th className="pb-3">Latency</th>
            <th className="pb-3">Error Rate</th>
            <th className="pb-3">Token Usage</th>
            <th className="pb-3">Cost</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((model) => (
            <tr key={model.name} className="border-t">
              <td className="py-3">{model.name}</td>
              <td className="py-3">{model.requests.toLocaleString()}</td>
              <td className="py-3">{model.latency}</td>
              <td className="py-3">{model.errorRate}%</td>
              <td className="py-3">{model.tokenUsage.toLocaleString()}</td>
              <td className="py-3">${model.cost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AIMonitoringDashboard: React.FC<AIMonitoringDashboardProps> = ({ timeRange }) => {
  const [metrics] = useState<MetricCard[]>([
    {
      title: 'Total Requests',
      value: '2.4M',
      change: 12.5,
      icon: <Activity className="w-5 h-5" />,
      trend: 'up',
      description: `Total API requests in last ${timeRange}`
    },
    {
      title: 'Avg Latency',
      value: '245ms',
      change: -8.3,
      icon: <Clock className="w-5 h-5" />,
      trend: 'down',
      description: 'Average response time'
    },
    {
      title: 'Token Usage',
      value: '15.2M',
      change: 5.7,
      icon: <FileText className="w-5 h-5" />,
      trend: 'up',
      description: 'Total tokens processed'
    },
    {
      title: 'Error Rate',
      value: '0.12%',
      change: -15.4,
      icon: <AlertTriangle className="w-5 h-5" />,
      trend: 'down',
      description: 'Request failure rate'
    },
    {
      title: 'Active Models',
      value: '8',
      change: 0,
      icon: <Server className="w-5 h-5" />,
      trend: 'stable',
      description: 'Models in production'
    },
    {
      title: 'Cache Hit Rate',
      value: '89.4%',
      change: 3.2,
      icon: <Database className="w-5 h-5" />,
      trend: 'up',
      description: 'Prompt cache efficiency'
    },
    {
      title: 'Cost/1K Tokens',
      value: '$0.018',
      change: -4.5,
      icon: <DollarSign className="w-5 h-5" />,
      trend: 'down',
      description: 'Average cost per request'
    },
    {
      title: 'Memory Usage',
      value: '78.5%',
      change: 2.1,
      icon: <HardDrive className="w-5 h-5" />,
      trend: 'up',
      description: 'System memory utilization'
    }
  ]);

  const [health] = useState<SystemHealth>({
    status: 'healthy',
    components: [
      {
        name: 'API Gateway',
        status: 'operational',
        latency: '45ms',
        uptime: '99.99%'
      },
      {
        name: 'LangGraph Orchestrator',
        status: 'operational',
        latency: '120ms',
        uptime: '99.95%'
      },
      {
        name: 'Model Garden',
        status: 'operational',
        latency: '180ms',
        uptime: '99.98%'
      },
      {
        name: 'OpenAI Integration',
        status: 'operational',
        latency: '350ms',
        uptime: '99.90%'
      },
      {
        name: 'Event Stream',
        status: 'operational',
        latency: '65ms',
        uptime: '99.99%'
      }
    ]
  });

  const [modelMetrics] = useState<ModelMetrics[]>([
    {
      name: 'Base Concierge GPT-4',
      requests: 1250000,
      latency: '450ms',
      errorRate: 0.08,
      tokenUsage: 8500000,
      cost: 425.00
    },
    {
      name: 'Hospitality Specialist',
      requests: 580000,
      latency: '380ms',
      errorRate: 0.12,
      tokenUsage: 3200000,
      cost: 160.00
    },
    {
      name: 'Dining Expert',
      requests: 320000,
      latency: '290ms',
      errorRate: 0.15,
      tokenUsage: 1800000,
      cost: 90.00
    },
    {
      name: 'Room Service Bot',
      requests: 250000,
      latency: '220ms',
      errorRate: 0.10,
      tokenUsage: 1500000,
      cost: 75.00
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthIndicator health={health} />
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Active Traces</h3>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            OpenTelemetry trace visualization would render here
          </div>
        </div>
      </div>

      <ModelPerformance metrics={modelMetrics} />
    </div>
  );
};

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

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    latency: string;
    uptime: string;
  }[];
}

interface ModelMetrics {
  name: string;
  requests: number;
  latency: string;
  errorRate: number;
  tokenUsage: number;
  cost: number;
}

interface AIMonitoringDashboardProps {
  timeRange: string;
}

const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-lg bg-[#8B1538] bg-opacity-10 text-[#8B1538] flex items-center justify-center mr-3">
          {metric.icon}
        </div>
        <h3 className="text-sm text-gray-600">{metric.title}</h3>
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
    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
  </div>
);

const SystemHealthIndicator: React.FC<{ health: SystemHealth }> = ({ health }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">System Health</h3>
    <div className="space-y-4">
      {health.components.map((component) => (
        <div key={component.name} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              component.status === 'operational' ? 'bg-green-500' :
              component.status === 'degraded' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm">{component.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">{component.latency}</span>
            <span className="text-xs text-gray-500">{component.uptime}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ModelPerformance: React.FC<{ metrics: ModelMetrics[] }> = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="pb-3">Model</th>
            <th className="pb-3">Requests</th>
            <th className="pb-3">Latency</th>
            <th className="pb-3">Error Rate</th>
            <th className="pb-3">Token Usage</th>
            <th className="pb-3">Cost</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((model) => (
            <tr key={model.name} className="border-t">
              <td className="py-3">{model.name}</td>
              <td className="py-3">{model.requests.toLocaleString()}</td>
              <td className="py-3">{model.latency}</td>
              <td className="py-3">{model.errorRate}%</td>
              <td className="py-3">{model.tokenUsage.toLocaleString()}</td>
              <td className="py-3">${model.cost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AIMonitoringDashboard: React.FC<AIMonitoringDashboardProps> = ({ timeRange }) => {
  const [metrics] = useState<MetricCard[]>([
    {
      title: 'Total Requests',
      value: '2.4M',
      change: 12.5,
      icon: <Activity className="w-5 h-5" />,
      trend: 'up',
      description: `Total API requests in last ${timeRange}`
    },
    {
      title: 'Avg Latency',
      value: '245ms',
      change: -8.3,
      icon: <Clock className="w-5 h-5" />,
      trend: 'down',
      description: 'Average response time'
    },
    {
      title: 'Token Usage',
      value: '15.2M',
      change: 5.7,
      icon: <FileText className="w-5 h-5" />,
      trend: 'up',
      description: 'Total tokens processed'
    },
    {
      title: 'Error Rate',
      value: '0.12%',
      change: -15.4,
      icon: <AlertTriangle className="w-5 h-5" />,
      trend: 'down',
      description: 'Request failure rate'
    },
    {
      title: 'Active Models',
      value: '8',
      change: 0,
      icon: <Server className="w-5 h-5" />,
      trend: 'stable',
      description: 'Models in production'
    },
    {
      title: 'Cache Hit Rate',
      value: '89.4%',
      change: 3.2,
      icon: <Database className="w-5 h-5" />,
      trend: 'up',
      description: 'Prompt cache efficiency'
    },
    {
      title: 'Cost/1K Tokens',
      value: '$0.018',
      change: -4.5,
      icon: <DollarSign className="w-5 h-5" />,
      trend: 'down',
      description: 'Average cost per request'
    },
    {
      title: 'Memory Usage',
      value: '78.5%',
      change: 2.1,
      icon: <HardDrive className="w-5 h-5" />,
      trend: 'up',
      description: 'System memory utilization'
    }
  ]);

  const [health] = useState<SystemHealth>({
    status: 'healthy',
    components: [
      {
        name: 'API Gateway',
        status: 'operational',
        latency: '45ms',
        uptime: '99.99%'
      },
      {
        name: 'LangGraph Orchestrator',
        status: 'operational',
        latency: '120ms',
        uptime: '99.95%'
      },
      {
        name: 'Model Garden',
        status: 'operational',
        latency: '180ms',
        uptime: '99.98%'
      },
      {
        name: 'OpenAI Integration',
        status: 'operational',
        latency: '350ms',
        uptime: '99.90%'
      },
      {
        name: 'Event Stream',
        status: 'operational',
        latency: '65ms',
        uptime: '99.99%'
      }
    ]
  });

  const [modelMetrics] = useState<ModelMetrics[]>([
    {
      name: 'Base Concierge GPT-4',
      requests: 1250000,
      latency: '450ms',
      errorRate: 0.08,
      tokenUsage: 8500000,
      cost: 425.00
    },
    {
      name: 'Hospitality Specialist',
      requests: 580000,
      latency: '380ms',
      errorRate: 0.12,
      tokenUsage: 3200000,
      cost: 160.00
    },
    {
      name: 'Dining Expert',
      requests: 320000,
      latency: '290ms',
      errorRate: 0.15,
      tokenUsage: 1800000,
      cost: 90.00
    },
    {
      name: 'Room Service Bot',
      requests: 250000,
      latency: '220ms',
      errorRate: 0.10,
      tokenUsage: 1500000,
      cost: 75.00
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthIndicator health={health} />
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Active Traces</h3>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            OpenTelemetry trace visualization would render here
          </div>
        </div>
      </div>

      <ModelPerformance metrics={modelMetrics} />
    </div>
  );
};

export default AIMonitoringDashboard;
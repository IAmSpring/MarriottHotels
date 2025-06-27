import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  Clock,
  Cloud,
  Code2,
  Database,
  DollarSign,
  FileText,
  GitGraph,
  HardDrive,
  LineChart,
  MessageSquare,
  Network,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  component: string;
}

interface ModelPerformance {
  id: string;
  name: string;
  metrics: {
    accuracy: number;
    latency: string;
    cost: number;
    usage: number;
  };
  status: 'healthy' | 'degraded' | 'error';
}

interface ResourceUsage {
  id: string;
  name: string;
  current: number;
  total: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface TrainingMetric {
  id: string;
  modelName: string;
  progress: number;
  eta: string;
  metrics: {
    accuracy: number;
    loss: number;
    epoch: number;
  };
}

// Add new interfaces
interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface IntegrationStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastSync: string;
  throughput: number;
}

interface ErrorDistribution {
  type: string;
  count: number;
  percentage: number;
}

// Mock data
const mockMetrics: SystemMetric[] = [
  {
    id: 'metric_1',
    name: 'Total Queries',
    value: '15,783',
    change: 12.5,
    trend: 'up',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: 'metric_2',
    name: 'Active Models',
    value: '8',
    change: 33.3,
    trend: 'up',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: 'metric_3',
    name: 'Avg Response Time',
    value: '0.85s',
    change: -5.2,
    trend: 'down',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: 'metric_4',
    name: 'Success Rate',
    value: '99.2%',
    change: 0.5,
    trend: 'up',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 'metric_5',
    name: 'Daily Cost',
    value: '$245.82',
    change: -8.3,
    trend: 'down',
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    id: 'metric_6',
    name: 'Active Users',
    value: '2,547',
    change: 15.8,
    trend: 'up',
    icon: <Users className="w-5 h-5" />,
  },
];

const mockAlerts: AlertItem[] = [
  {
    id: 'alert_1',
    type: 'critical',
    message: 'High latency detected in vector search operations',
    timestamp: '5 minutes ago',
    component: 'Vector Store',
  },
  {
    id: 'alert_2',
    type: 'warning',
    message: 'GPT-4 API cost approaching daily budget limit',
    timestamp: '15 minutes ago',
    component: 'Cost Management',
  },
  {
    id: 'alert_3',
    type: 'info',
    message: 'New model version available for Concierge Assistant',
    timestamp: '1 hour ago',
    component: 'Model Management',
  },
];

const mockModels: ModelPerformance[] = [
  {
    id: 'model_1',
    name: 'Concierge GPT-4',
    metrics: {
      accuracy: 97.5,
      latency: '0.85s',
      cost: 0.12,
      usage: 12500,
    },
    status: 'healthy',
  },
  {
    id: 'model_2',
    name: 'Booking Assistant',
    metrics: {
      accuracy: 95.8,
      latency: '0.65s',
      cost: 0.08,
      usage: 8900,
    },
    status: 'degraded',
  },
  {
    id: 'model_3',
    name: 'Review Analyzer',
    metrics: {
      accuracy: 94.2,
      latency: '0.45s',
      cost: 0.05,
      usage: 5600,
    },
    status: 'healthy',
  },
];

const mockResources: ResourceUsage[] = [
  {
    id: 'resource_1',
    name: 'Vector DB Storage',
    current: 25000,
    total: 50000,
    unit: 'entries',
    trend: 'up',
  },
  {
    id: 'resource_2',
    name: 'Graph DB Nodes',
    current: 12500,
    total: 20000,
    unit: 'nodes',
    trend: 'stable',
  },
  {
    id: 'resource_3',
    name: 'Cache Storage',
    current: 6000,
    total: 10000,
    unit: 'MB',
    trend: 'up',
  },
];

const mockTraining: TrainingMetric[] = [
  {
    id: 'training_1',
    modelName: 'Enhanced Concierge v2.4',
    progress: 65,
    eta: '2h 15m',
    metrics: {
      accuracy: 96.8,
      loss: 0.15,
      epoch: 3,
    },
  },
  {
    id: 'training_2',
    modelName: 'Booking Intent v1.5',
    progress: 89,
    eta: '45m',
    metrics: {
      accuracy: 94.5,
      loss: 0.22,
      epoch: 5,
    },
  },
];

// Add new mock data
const mockSecurityMetrics: SecurityMetric[] = [
  {
    id: 'sec_1',
    name: 'Token Security',
    value: 98,
    status: 'good',
    description: 'Token encryption and rotation health'
  },
  {
    id: 'sec_2',
    name: 'Data Privacy',
    value: 92,
    status: 'warning',
    description: 'PII detection and handling'
  },
  {
    id: 'sec_3',
    name: 'API Security',
    value: 95,
    status: 'good',
    description: 'API authentication and rate limiting'
  }
];

const mockIntegrations: IntegrationStatus[] = [
  {
    id: 'int_1',
    name: 'OpenAI GPT-4',
    status: 'online',
    lastSync: '2 min ago',
    throughput: 156
  },
  {
    id: 'int_2',
    name: 'Pinecone Vector DB',
    status: 'degraded',
    lastSync: '5 min ago',
    throughput: 89
  },
  {
    id: 'int_3',
    name: 'LangChain',
    status: 'online',
    lastSync: '1 min ago',
    throughput: 245
  }
];

const mockErrorDistribution: ErrorDistribution[] = [
  { type: 'Token Validation', count: 45, percentage: 35 },
  { type: 'Rate Limiting', count: 32, percentage: 25 },
  { type: 'Context Length', count: 28, percentage: 22 },
  { type: 'API Timeout', count: 23, percentage: 18 }
];

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

const AlertsPanel: React.FC<{ alerts: AlertItem[] }> = ({ alerts }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border ${
            alert.type === 'critical' ? 'bg-red-50 border-red-200' :
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-center mb-2">
            <AlertTriangle className={`w-5 h-5 mr-2 ${
              alert.type === 'critical' ? 'text-red-600' :
              alert.type === 'warning' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
            <span className="font-medium">{alert.component}</span>
            <span className="text-sm text-gray-600 ml-auto">{alert.timestamp}</span>
          </div>
          <p className="text-sm">{alert.message}</p>
        </div>
      ))}
    </div>
  </div>
);

const ModelCard: React.FC<{ model: ModelPerformance }> = ({ model }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Brain className="w-6 h-6 text-[#8B1538] mr-2" />
        <h3 className="font-medium">{model.name}</h3>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        model.status === 'healthy' ? 'bg-green-100 text-green-800' :
        model.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {model.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-600">Accuracy</p>
        <p className="font-semibold">{model.metrics.accuracy}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Latency</p>
        <p className="font-semibold">{model.metrics.latency}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Cost/1k tokens</p>
        <p className="font-semibold">${model.metrics.cost}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Daily Usage</p>
        <p className="font-semibold">{model.metrics.usage.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const ResourceCard: React.FC<{ resource: ResourceUsage }> = ({ resource }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-medium">{resource.name}</h3>
      <span className={`text-sm ${
        resource.trend === 'up' ? 'text-green-600' :
        resource.trend === 'down' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {resource.trend === 'up' ? '↑' : resource.trend === 'down' ? '↓' : '→'}
      </span>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Usage</span>
        <span>{resource.current.toLocaleString()} / {resource.total.toLocaleString()} {resource.unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            (resource.current / resource.total) > 0.9 ? 'bg-red-500' :
            (resource.current / resource.total) > 0.7 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${(resource.current / resource.total) * 100}%` }}
        />
      </div>
    </div>
  </div>
);

const TrainingCard: React.FC<{ training: TrainingMetric }> = ({ training }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-medium">{training.modelName}</h3>
        <p className="text-sm text-gray-600">ETA: {training.eta}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{training.progress}%</p>
        <p className="text-sm text-gray-600">Progress</p>
      </div>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div
        className="bg-[#8B1538] h-2 rounded-full"
        style={{ width: `${training.progress}%` }}
      />
    </div>

    <div className="grid grid-cols-3 gap-2 text-sm">
      <div>
        <p className="text-gray-600">Accuracy</p>
        <p className="font-medium">{training.metrics.accuracy}%</p>
      </div>
      <div>
        <p className="text-gray-600">Loss</p>
        <p className="font-medium">{training.metrics.loss}</p>
      </div>
      <div>
        <p className="text-gray-600">Epoch</p>
        <p className="font-medium">{training.metrics.epoch}</p>
      </div>
    </div>
  </div>
);

const SystemHealth: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">System Health</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">API Services</h3>
          <span className="text-green-600">●</span>
        </div>
        <p className="text-sm text-green-700">All systems operational</p>
      </div>
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Model Endpoints</h3>
          <span className="text-green-600">●</span>
        </div>
        <p className="text-sm text-green-700">8/8 endpoints healthy</p>
      </div>
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Vector Database</h3>
          <span className="text-yellow-600">●</span>
        </div>
        <p className="text-sm text-yellow-700">Performance degraded</p>
      </div>
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">LangGraph Engine</h3>
          <span className="text-green-600">●</span>
        </div>
        <p className="text-sm text-green-700">Running optimally</p>
      </div>
    </div>
  </div>
);

const CostBreakdown: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Cost Breakdown</h2>
      <select className="text-sm border rounded-lg px-3 py-2">
        <option>Last 24 hours</option>
        <option>Last 7 days</option>
        <option>Last 30 days</option>
      </select>
    </div>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>GPT-4 API</span>
          <span>$156.82</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '65%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Vector Search</span>
          <span>$45.25</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '25%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Fine-tuning</span>
          <span>$35.50</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '15%' }} />
        </div>
      </div>
    </div>
  </div>
);

// Add new components
const SecurityMetricsPanel: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Security & Compliance</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {mockSecurityMetrics.map((metric) => (
        <div key={metric.id} className="p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{metric.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              metric.status === 'good' ? 'bg-green-100 text-green-800' :
              metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {metric.value}%
            </span>
          </div>
          <p className="text-sm text-gray-600">{metric.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const IntegrationsPanel: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Integration Status</h2>
    <div className="space-y-4">
      {mockIntegrations.map((integration) => (
        <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 ${
              integration.status === 'online' ? 'bg-green-500' :
              integration.status === 'degraded' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            <div>
              <h3 className="font-medium">{integration.name}</h3>
              <p className="text-sm text-gray-600">Last sync: {integration.lastSync}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{integration.throughput} req/min</p>
            <p className="text-sm text-gray-600">{integration.status}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorAnalysis: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Error Distribution</h2>
    <div className="space-y-4">
      {mockErrorDistribution.map((error) => (
        <div key={error.type} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{error.type}</span>
            <span>{error.count} errors ({error.percentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${error.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">AI System Overview</h1>
          <p className="text-gray-600">Monitor AI performance, storage, and system health</p>
        </div>
        <div className="flex items-center space-x-3">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* System Health and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealth />
        <AlertsPanel alerts={mockAlerts} />
      </div>

      {/* Security and Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityMetricsPanel />
        <IntegrationsPanel />
      </div>

      {/* Model Performance */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Model Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      {/* Resource Usage and Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Resource Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
        <ErrorAnalysis />
      </div>

      {/* Active Training Jobs and Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Active Training Jobs</h2>
          <div className="space-y-4">
            {mockTraining.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        </div>
        <CostBreakdown />
      </div>
    </div>
  );
};

export default DashboardPage; 
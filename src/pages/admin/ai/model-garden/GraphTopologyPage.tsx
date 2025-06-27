import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Box,
  Circle,
  GitBranch,
  GitGraph,
  GitMerge,
  GitPullRequest,
  Info,
  Network,
  RefreshCw,
  Save,
  Settings,
  Share2,
  Zap
} from 'lucide-react';
import ModelTopologyGraph from '../../../../components/ModelTopologyGraph';
import LangGraphFlow from '../../../../components/LangGraphFlow';

interface ModelNode {
  id: string;
  name: string;
  type: 'base' | 'fine-tuned' | 'ensemble' | 'specialized';
  status: 'active' | 'training' | 'deprecated';
  version: string;
  dependencies: string[];
  metrics: {
    accuracy: number;
    latency: string;
    throughput: number;
    lastUpdated: string;
  };
}

interface TopologyMetric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

// Mock data
const mockNodes: ModelNode[] = [
  {
    id: 'model_1',
    name: 'Base Concierge GPT-4',
    type: 'base',
    status: 'active',
    version: '2.4.0',
    dependencies: [],
    metrics: {
      accuracy: 97.5,
      latency: '0.8s',
      throughput: 1200,
      lastUpdated: '2024-03-15T10:30:00Z'
    }
  },
  {
    id: 'model_2',
    name: 'Hospitality Specialist',
    type: 'fine-tuned',
    status: 'active',
    version: '1.8.0',
    dependencies: ['model_1'],
    metrics: {
      accuracy: 98.2,
      latency: '0.9s',
      throughput: 800,
      lastUpdated: '2024-03-14T15:45:00Z'
    }
  },
  {
    id: 'model_3',
    name: 'Dining Expert',
    type: 'specialized',
    status: 'training',
    version: '1.5.0',
    dependencies: ['model_2'],
    metrics: {
      accuracy: 96.8,
      latency: '0.7s',
      throughput: 500,
      lastUpdated: '2024-03-13T09:15:00Z'
    }
  },
  {
    id: 'model_4',
    name: 'Concierge Assistant',
    type: 'ensemble',
    status: 'active',
    version: '2.0.0',
    dependencies: ['model_1', 'model_2'],
    metrics: {
      accuracy: 98.5,
      latency: '1.1s',
      throughput: 600,
      lastUpdated: '2024-03-12T14:20:00Z'
    }
  },
  {
    id: 'model_5',
    name: 'Room Service Bot',
    type: 'specialized',
    status: 'active',
    version: '1.2.0',
    dependencies: ['model_2'],
    metrics: {
      accuracy: 97.8,
      latency: '0.6s',
      throughput: 900,
      lastUpdated: '2024-03-11T11:10:00Z'
    }
  },
  {
    id: 'model_6',
    name: 'Multilingual Adapter',
    type: 'fine-tuned',
    status: 'training',
    version: '1.0.0',
    dependencies: ['model_1'],
    metrics: {
      accuracy: 95.5,
      latency: '0.9s',
      throughput: 400,
      lastUpdated: '2024-03-10T16:30:00Z'
    }
  },
  {
    id: 'model_7',
    name: 'Super Concierge',
    type: 'ensemble',
    status: 'deprecated',
    version: '1.8.0',
    dependencies: ['model_2', 'model_3', 'model_4'],
    metrics: {
      accuracy: 94.2,
      latency: '1.4s',
      throughput: 300,
      lastUpdated: '2024-03-09T13:25:00Z'
    }
  }
];

const mockMetrics: TopologyMetric[] = [
  {
    id: 'metric_1',
    name: 'Active Models',
    value: '8',
    change: 12.5,
    trend: 'up',
    icon: <Box className="w-5 h-5" />
  },
  {
    id: 'metric_2',
    name: 'Avg Latency',
    value: '0.85s',
    change: -5.2,
    trend: 'down',
    icon: <Activity className="w-5 h-5" />
  },
  {
    id: 'metric_3',
    name: 'Dependencies',
    value: '12',
    change: 8.3,
    trend: 'up',
    icon: <GitBranch className="w-5 h-5" />
  },
  {
    id: 'metric_4',
    name: 'Health Score',
    value: '98.2%',
    change: 2.1,
    trend: 'up',
    icon: <Activity className="w-5 h-5" />
  }
];

const MetricCard: React.FC<{ metric: TopologyMetric }> = ({ metric }) => (
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

const ModelNodeCard: React.FC<{ node: ModelNode }> = ({ node }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-3 ${
          node.status === 'active' ? 'bg-green-500' :
          node.status === 'training' ? 'bg-blue-500' :
          'bg-gray-500'
        }`} />
        <div>
          <h3 className="font-medium">{node.name}</h3>
          <p className="text-sm text-gray-600">Version {node.version}</p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        node.type === 'base' ? 'bg-purple-100 text-purple-800' :
        node.type === 'fine-tuned' ? 'bg-blue-100 text-blue-800' :
        node.type === 'ensemble' ? 'bg-green-100 text-green-800' :
        'bg-orange-100 text-orange-800'
      }`}>
        {node.type.toUpperCase()}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Accuracy</p>
        <p className="font-medium">{node.metrics.accuracy}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Latency</p>
        <p className="font-medium">{node.metrics.latency}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Throughput</p>
        <p className="font-medium">{node.metrics.throughput}/min</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Last Updated</p>
        <p className="font-medium">{new Date(node.metrics.lastUpdated).toLocaleDateString()}</p>
      </div>
    </div>

    {node.dependencies.length > 0 && (
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">Dependencies</p>
        <div className="flex flex-wrap gap-2">
          {node.dependencies.map((dep) => (
            <span key={dep} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {mockNodes.find(n => n.id === dep)?.name || dep}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const TopologyViewer: React.FC<{ nodes: ModelNode[] }> = ({ nodes }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Model Topology</h2>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Share2 className="w-5 h-5 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Save className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
    <ModelTopologyGraph models={nodes} />
  </div>
);

const GraphTopologyPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'models' | 'workflow'>('models');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Model Graph Topology</h1>
          <p className="text-gray-600">Visualize and manage model relationships and workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setActiveView('models')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeView === 'models'
                  ? 'bg-[#8B1538] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              Model Graph
            </button>
            <button
              onClick={() => setActiveView('workflow')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeView === 'workflow'
                  ? 'bg-[#8B1538] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              LangGraph Flow
            </button>
          </div>
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

      {activeView === 'models' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopologyViewer nodes={mockNodes} />
          </div>
          <div className="space-y-6">
            {mockNodes.map((node) => (
              <ModelNodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">LangGraph Workflow</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Save className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <LangGraphFlow />
        </div>
      )}
    </div>
  );
};

export default GraphTopologyPage; 
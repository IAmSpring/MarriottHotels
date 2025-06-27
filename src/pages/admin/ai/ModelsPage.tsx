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
  Copy,
  Database,
  Download,
  FileJson,
  GitBranch,
  History,
  LayoutGrid,
  LineChart,
  MoreVertical,
  Play,
  Plus,
  RefreshCw,
  Scale,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Tag,
  TestTube,
} from 'lucide-react';

interface ModelVersion {
  id: string;
  version: string;
  createdAt: string;
  status: 'stable' | 'testing' | 'deprecated';
  performance: {
    accuracy: number;
    latency: string;
    throughput: number;
  };
  size: string;
  framework: string;
  lastTrained: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  type: 'classification' | 'generation' | 'embedding' | 'custom';
  baseModel: string;
  currentVersion: string;
  status: 'production' | 'staging' | 'development';
  versions: ModelVersion[];
  metrics: {
    requests: number;
    avgLatency: string;
    errorRate: number;
    uptime: string;
  };
}

interface ModelEvaluation {
  id: string;
  metric: string;
  value: number;
  benchmark: number;
  status: 'passed' | 'failed' | 'warning';
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'scheduled';
  modelA: string;
  modelB: string;
  metrics: {
    winnerModel: string;
    confidenceScore: number;
    sampleSize: number;
    duration: string;
  };
  results: {
    accuracy: [number, number];
    latency: [string, string];
    cost: [number, number];
  };
}

// Mock data
const mockModels: AIModel[] = [
  {
    id: 'model_1',
    name: 'Concierge Assistant',
    description: 'Primary hotel concierge service model',
    type: 'generation',
    baseModel: 'gpt-4-turbo',
    currentVersion: 'v2.3.0',
    status: 'production',
    versions: [
      {
        id: 'v2.3.0',
        version: 'v2.3.0',
        createdAt: '2024-03-20',
        status: 'stable',
        performance: {
          accuracy: 97.5,
          latency: '150ms',
          throughput: 250,
        },
        size: '12.5GB',
        framework: 'PyTorch',
        lastTrained: '2024-03-19',
      },
      {
        id: 'v2.2.0',
        version: 'v2.2.0',
        createdAt: '2024-03-10',
        status: 'deprecated',
        performance: {
          accuracy: 96.8,
          latency: '180ms',
          throughput: 220,
        },
        size: '12.2GB',
        framework: 'PyTorch',
        lastTrained: '2024-03-09',
      },
    ],
    metrics: {
      requests: 15783,
      avgLatency: '0.85s',
      errorRate: 0.5,
      uptime: '99.99%',
    },
  },
  {
    id: 'model_2',
    name: 'Booking Intent Classifier',
    description: 'Classifies user intent for booking flows',
    type: 'classification',
    baseModel: 'gpt-4',
    currentVersion: 'v1.5.0',
    status: 'staging',
    versions: [
      {
        id: 'v1.5.0',
        version: 'v1.5.0',
        createdAt: '2024-03-25',
        status: 'testing',
        performance: {
          accuracy: 98.2,
          latency: '120ms',
          throughput: 300,
        },
        size: '8.5GB',
        framework: 'TensorFlow',
        lastTrained: '2024-03-24',
      },
    ],
    metrics: {
      requests: 8925,
      avgLatency: '0.65s',
      errorRate: 0.3,
      uptime: '99.95%',
    },
  },
];

const mockEvaluations: ModelEvaluation[] = [
  {
    id: 'eval_1',
    metric: 'ROUGE-L Score',
    value: 0.89,
    benchmark: 0.85,
    status: 'passed',
  },
  {
    id: 'eval_2',
    metric: 'BLEU Score',
    value: 42.5,
    benchmark: 45.0,
    status: 'warning',
  },
  {
    id: 'eval_3',
    metric: 'Response Coherence',
    value: 0.95,
    benchmark: 0.90,
    status: 'passed',
  },
  {
    id: 'eval_4',
    metric: 'Factual Accuracy',
    value: 0.92,
    benchmark: 0.95,
    status: 'failed',
  },
];

const mockABTests: ABTest[] = [
  {
    id: 'test_1',
    name: 'Concierge Response Quality',
    status: 'completed',
    modelA: 'GPT-4 Turbo',
    modelB: 'Claude 3',
    metrics: {
      winnerModel: 'Claude 3',
      confidenceScore: 92.5,
      sampleSize: 1000,
      duration: '7 days',
    },
    results: {
      accuracy: [92.5, 94.8],
      latency: ['0.85s', '0.78s'],
      cost: [0.12, 0.09],
    },
  },
  {
    id: 'test_2',
    name: 'Booking Intent Detection',
    status: 'running',
    modelA: 'Custom GPT-4',
    modelB: 'Fine-tuned Llama',
    metrics: {
      winnerModel: 'Pending',
      confidenceScore: 68.2,
      sampleSize: 580,
      duration: '3 days',
    },
    results: {
      accuracy: [88.5, 89.2],
      latency: ['0.65s', '0.45s'],
      cost: [0.08, 0.03],
    },
  },
];

const ModelCard: React.FC<{ model: AIModel }> = ({ model }) => {
  const [showVersions, setShowVersions] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-[#8B1538] mr-2" />
            <h3 className="text-lg font-semibold">{model.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{model.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs ${
            model.status === 'production' ? 'bg-green-100 text-green-800' :
            model.status === 'staging' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {model.status}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Base Model</p>
          <p className="font-semibold">{model.baseModel}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Version</p>
          <p className="font-semibold">{model.currentVersion}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Type</p>
          <p className="font-semibold capitalize">{model.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Requests</p>
          <p className="font-semibold">{model.metrics.requests.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
        <div>
          <p className="text-xs text-gray-600">Avg Latency</p>
          <p className="font-semibold">{model.metrics.avgLatency}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Error Rate</p>
          <p className="font-semibold">{model.metrics.errorRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Uptime</p>
          <p className="font-semibold">{model.metrics.uptime}</p>
        </div>
        <div>
          <button className="text-[#8B1538] text-sm hover:text-[#6d102c] flex items-center">
            View Metrics <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Versions</h4>
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="text-sm text-[#8B1538] hover:text-[#6d102c]"
          >
            {showVersions ? 'Hide' : 'Show'} History
          </button>
        </div>

        {showVersions && (
          <div className="space-y-3">
            {model.versions.map((version) => (
              <div
                key={version.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium">{version.version}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({version.createdAt})
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    version.status === 'stable' ? 'bg-green-100 text-green-800' :
                    version.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {version.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Accuracy</p>
                    <p className="font-medium">{version.performance.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Latency</p>
                    <p className="font-medium">{version.performance.latency}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Throughput</p>
                    <p className="font-medium">{version.performance.throughput}/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-6">
        <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
          <Play className="w-4 h-4 mr-2" />
          Deploy
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <History className="w-4 h-4 mr-2" />
          Rollback
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ModelEvaluationCard: React.FC<{ evaluation: ModelEvaluation }> = ({ evaluation }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-medium">{evaluation.metric}</h3>
      <span className={`px-2 py-1 rounded-full text-xs ${
        evaluation.status === 'passed' ? 'bg-green-100 text-green-800' :
        evaluation.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {evaluation.status}
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Current</span>
        <span className="font-medium">{evaluation.value}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Benchmark</span>
        <span className="font-medium">{evaluation.benchmark}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            evaluation.status === 'passed' ? 'bg-green-500' :
            evaluation.status === 'warning' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${(evaluation.value / evaluation.benchmark) * 100}%` }}
        />
      </div>
    </div>
  </div>
);

const ABTestCard: React.FC<{ test: ABTest }> = ({ test }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold">{test.name}</h3>
        <p className="text-sm text-gray-600">
          {test.modelA} vs {test.modelB}
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs ${
        test.status === 'completed' ? 'bg-green-100 text-green-800' :
        test.status === 'running' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {test.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Winner</p>
        <p className="font-semibold">{test.metrics.winnerModel}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Confidence</p>
        <p className="font-semibold">{test.metrics.confidenceScore}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Sample Size</p>
        <p className="font-semibold">{test.metrics.sampleSize.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Duration</p>
        <p className="font-semibold">{test.metrics.duration}</p>
      </div>
    </div>

    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Accuracy</span>
          <span className="font-medium">
            {test.results.accuracy[0]}% vs {test.results.accuracy[1]}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '70%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Latency</span>
          <span className="font-medium">
            {test.results.latency[0]} vs {test.results.latency[1]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '85%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Cost per 1k tokens</span>
          <span className="font-medium">
            ${test.results.cost[0]} vs ${test.results.cost[1]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  </div>
);

const ModelActions: React.FC = () => (
  <div className="mt-4 grid grid-cols-2 gap-2">
    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
      <TestTube className="w-4 h-4 mr-2" />
      Run Tests
    </button>
    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
      <Scale className="w-4 h-4 mr-2" />
      Compare
    </button>
    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
      <LayoutGrid className="w-4 h-4 mr-2" />
      Prompts
    </button>
    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
      <Sparkles className="w-4 h-4 mr-2" />
      Optimize
    </button>
  </div>
);

const ModelsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evaluation' | 'testing'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">AI Models</h1>
          <p className="text-gray-600">Manage and monitor AI models and their deployments</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 mr-2" />
            Import Model
          </button>
          <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
            <Plus className="w-5 h-5 mr-2" />
            New Model
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex p-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'overview'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ml-2 ${
                activeTab === 'evaluation'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('evaluation')}
            >
              Evaluation
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ml-2 ${
                activeTab === 'testing'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('testing')}
            >
              A/B Testing
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {mockModels.map((model) => (
                <div key={model.id}>
                  <ModelCard model={model} />
                  <ModelActions />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Model Evaluation Metrics</h2>
                <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
                  <Plus className="w-5 h-5 mr-2" />
                  New Evaluation
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockEvaluations.map((evaluation) => (
                  <ModelEvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">A/B Testing</h2>
                <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
                  <Plus className="w-5 h-5 mr-2" />
                  New Test
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockABTests.map((test) => (
                  <ABTestCard key={test.id} test={test} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage; 
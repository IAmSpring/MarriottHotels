import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  Clock,
  Database,
  FileText,
  Filter,
  FolderInput,
  LineChart,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Tags,
  Upload,
  Users,
} from 'lucide-react';

interface TrainingDataset {
  id: string;
  name: string;
  type: 'documents' | 'conversations' | 'structured' | 'custom';
  status: 'active' | 'processing' | 'error' | 'archived';
  size: string;
  documents: number;
  lastUpdated: string;
  accuracy: number;
  coverage: number;
}

interface TrainingJob {
  id: string;
  datasetId: string;
  model: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  startTime: string;
  endTime?: string;
  metrics?: {
    accuracy: number;
    loss: number;
    epochs: number;
  };
}

interface DataQualityMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'error';
}

// Mock data
const mockDatasets: TrainingDataset[] = [
  {
    id: 'dataset_1',
    name: 'Hotel Services Knowledge Base',
    type: 'documents',
    status: 'active',
    size: '2.5GB',
    documents: 15000,
    lastUpdated: '2024-03-27 10:00',
    accuracy: 95.8,
    coverage: 92.5,
  },
  {
    id: 'dataset_2',
    name: 'Customer Support Conversations',
    type: 'conversations',
    status: 'processing',
    size: '1.8GB',
    documents: 8500,
    lastUpdated: '2024-03-27 11:30',
    accuracy: 94.2,
    coverage: 88.7,
  },
  {
    id: 'dataset_3',
    name: 'Room Inventory Data',
    type: 'structured',
    status: 'active',
    size: '500MB',
    documents: 2500,
    lastUpdated: '2024-03-26 15:45',
    accuracy: 98.1,
    coverage: 95.3,
  },
];

const mockJobs: TrainingJob[] = [
  {
    id: 'job_1',
    datasetId: 'dataset_1',
    model: 'gpt-4-turbo',
    status: 'running',
    progress: 65,
    startTime: '2024-03-27 11:00',
    metrics: {
      accuracy: 94.5,
      loss: 0.15,
      epochs: 3,
    },
  },
  {
    id: 'job_2',
    datasetId: 'dataset_2',
    model: 'gpt-4',
    status: 'completed',
    progress: 100,
    startTime: '2024-03-27 09:00',
    endTime: '2024-03-27 10:30',
    metrics: {
      accuracy: 96.2,
      loss: 0.12,
      epochs: 5,
    },
  },
];

const mockQualityMetrics: DataQualityMetric[] = [
  {
    id: 'metric_1',
    name: 'Data Consistency',
    value: 95.8,
    trend: 'up',
    status: 'good',
  },
  {
    id: 'metric_2',
    name: 'Coverage Score',
    value: 88.5,
    trend: 'up',
    status: 'warning',
  },
  {
    id: 'metric_3',
    name: 'Labeling Accuracy',
    value: 97.2,
    trend: 'stable',
    status: 'good',
  },
  {
    id: 'metric_4',
    name: 'Data Freshness',
    value: 85.4,
    trend: 'down',
    status: 'warning',
  },
];

const DatasetCard: React.FC<{ dataset: TrainingDataset }> = ({ dataset }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
          dataset.type === 'documents' ? 'bg-blue-100 text-blue-700' :
          dataset.type === 'conversations' ? 'bg-green-100 text-green-700' :
          dataset.type === 'structured' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {dataset.type === 'documents' ? <FileText className="w-6 h-6" /> :
           dataset.type === 'conversations' ? <Users className="w-6 h-6" /> :
           dataset.type === 'structured' ? <Database className="w-6 h-6" /> :
           <FolderInput className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{dataset.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{dataset.type}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs ${
        dataset.status === 'active' ? 'bg-green-100 text-green-800' :
        dataset.status === 'processing' ? 'bg-blue-100 text-blue-800' :
        dataset.status === 'error' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {dataset.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-sm text-gray-600">Size</p>
        <p className="font-semibold">{dataset.size}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Documents</p>
        <p className="font-semibold">{dataset.documents.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Accuracy</p>
        <p className="font-semibold">{dataset.accuracy}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Coverage</p>
        <p className="font-semibold">{dataset.coverage}%</p>
      </div>
    </div>

    <div className="flex space-x-3">
      <button className="flex-1 px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
        View Details
      </button>
      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const TrainingJobCard: React.FC<{ job: TrainingJob }> = ({ job }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <Brain className="w-6 h-6 text-[#8B1538] mr-2" />
        <div>
          <h3 className="font-medium">{job.model}</h3>
          <p className="text-sm text-gray-600">Job #{job.id}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        job.status === 'running' ? 'bg-blue-100 text-blue-800' :
        job.status === 'completed' ? 'bg-green-100 text-green-800' :
        job.status === 'failed' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {job.status}
      </span>
    </div>

    {job.status === 'running' && (
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{job.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#8B1538] h-2 rounded-full"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>
    )}

    {job.metrics && (
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-600">Accuracy</p>
          <p className="font-medium">{job.metrics.accuracy}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Loss</p>
          <p className="font-medium">{job.metrics.loss}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Epochs</p>
          <p className="font-medium">{job.metrics.epochs}</p>
        </div>
      </div>
    )}

    <div className="text-sm text-gray-600">
      <p>Started: {job.startTime}</p>
      {job.endTime && <p>Completed: {job.endTime}</p>}
    </div>
  </div>
);

const QualityMetricCard: React.FC<{ metric: DataQualityMetric }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{metric.name}</h3>
      <span className={`flex items-center text-sm ${
        metric.trend === 'up' ? 'text-green-600' :
        metric.trend === 'down' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        <ArrowRight className={`w-4 h-4 ${
          metric.trend === 'up' ? 'rotate-[-45deg]' :
          metric.trend === 'down' ? 'rotate-45deg]' :
          ''
        }`} />
      </span>
    </div>
    <p className="text-2xl font-semibold mb-2">{metric.value}%</p>
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
      metric.status === 'good' ? 'bg-green-100 text-green-800' :
      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {metric.status}
    </div>
  </div>
);

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'datasets' | 'jobs'>('datasets');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Training Data Management</h1>
          <p className="text-gray-600">Manage and monitor AI training data and jobs</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-5 h-5 mr-2" />
            Import Data
          </button>
          <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
            <Plus className="w-5 h-5 mr-2" />
            New Training Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockQualityMetrics.map((metric) => (
          <QualityMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex p-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'datasets'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('datasets')}
            >
              Datasets
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ml-2 ${
                activeTab === 'jobs'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              Training Jobs
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeTab === 'datasets'
              ? mockDatasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))
              : mockJobs.map((job) => (
                  <TrainingJobCard key={job.id} job={job} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage; 
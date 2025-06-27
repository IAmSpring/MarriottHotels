import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  Clock,
  Code2,
  Copy,
  Edit,
  FileText,
  Filter,
  GitBranch,
  Globe,
  History,
  Languages,
  MessageSquare,
  MoreVertical,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Star,
  Trash2,
  Users,
  Zap
} from 'lucide-react';

interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'training' | 'disabled';
  languages: string[];
  capabilities: string[];
  metrics: {
    conversations: number;
    avgResponseTime: string;
    satisfaction: number;
    accuracy: number;
    dailyUsers: number;
  };
  lastUpdated: string;
  version: string;
}

interface AssistantMetric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface ConversationSummary {
  id: string;
  assistant: string;
  user: string;
  timestamp: string;
  duration: string;
  satisfaction: number;
  topics: string[];
  status: 'completed' | 'ongoing' | 'failed';
}

// Mock data
const mockAssistants: Assistant[] = [
  {
    id: 'ast_1',
    name: 'Concierge Assistant',
    description: 'Primary hotel concierge service assistant',
    model: 'gpt-4-turbo',
    status: 'active',
    languages: ['English', 'Spanish', 'French', 'Mandarin'],
    capabilities: ['Booking', 'Recommendations', 'FAQ', 'Special Requests'],
    metrics: {
      conversations: 15783,
      avgResponseTime: '0.8s',
      satisfaction: 4.8,
      accuracy: 97.5,
      dailyUsers: 2500
    },
    lastUpdated: '2024-03-15T10:30:00Z',
    version: '2.4.0'
  },
  {
    id: 'ast_2',
    name: 'Dining Assistant',
    description: 'Restaurant and dining recommendations specialist',
    model: 'gpt-4',
    status: 'training',
    languages: ['English', 'Spanish', 'French'],
    capabilities: ['Restaurant Booking', 'Menu Information', 'Dietary Assistance'],
    metrics: {
      conversations: 8920,
      avgResponseTime: '1.2s',
      satisfaction: 4.6,
      accuracy: 95.8,
      dailyUsers: 1200
    },
    lastUpdated: '2024-03-14T15:45:00Z',
    version: '1.8.0'
  },
  {
    id: 'ast_3',
    name: 'Events Assistant',
    description: 'Events and conference planning specialist',
    model: 'gpt-4',
    status: 'active',
    languages: ['English', 'Spanish'],
    capabilities: ['Event Planning', 'Venue Selection', 'Catering Coordination'],
    metrics: {
      conversations: 5430,
      avgResponseTime: '0.9s',
      satisfaction: 4.7,
      accuracy: 96.2,
      dailyUsers: 800
    },
    lastUpdated: '2024-03-13T09:15:00Z',
    version: '1.5.0'
  }
];

const mockMetrics: AssistantMetric[] = [
  {
    id: 'metric_1',
    name: 'Total Conversations',
    value: '30.1K',
    change: 12.5,
    trend: 'up',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    id: 'metric_2',
    name: 'Active Users',
    value: '4.5K',
    change: 8.3,
    trend: 'up',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'metric_3',
    name: 'Avg Response Time',
    value: '0.9s',
    change: -5.2,
    trend: 'down',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'metric_4',
    name: 'Satisfaction Rate',
    value: '4.7',
    change: 2.1,
    trend: 'up',
    icon: <Star className="w-5 h-5" />
  }
];

const mockConversations: ConversationSummary[] = [
  {
    id: 'conv_1',
    assistant: 'Concierge Assistant',
    user: 'John D.',
    timestamp: '2024-03-15T10:45:00Z',
    duration: '5m 30s',
    satisfaction: 5,
    topics: ['Room Service', 'Restaurant Booking'],
    status: 'completed'
  },
  {
    id: 'conv_2',
    assistant: 'Events Assistant',
    user: 'Sarah M.',
    timestamp: '2024-03-15T10:30:00Z',
    duration: '12m 15s',
    satisfaction: 4,
    topics: ['Conference Room', 'Catering'],
    status: 'completed'
  },
  {
    id: 'conv_3',
    assistant: 'Dining Assistant',
    user: 'Alex R.',
    timestamp: '2024-03-15T10:15:00Z',
    duration: '3m 45s',
    satisfaction: 5,
    topics: ['Restaurant Hours', 'Menu Options'],
    status: 'completed'
  }
];

const MetricCard: React.FC<{ metric: AssistantMetric }> = ({ metric }) => (
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

const AssistantCard: React.FC<{ assistant: Assistant }> = ({ assistant }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Bot className="w-6 h-6 text-[#8B1538] mr-3" />
        <div>
          <h3 className="font-medium">{assistant.name}</h3>
          <p className="text-sm text-gray-600">{assistant.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          assistant.status === 'active' ? 'bg-green-100 text-green-800' :
          assistant.status === 'training' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {assistant.status.toUpperCase()}
        </span>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Model</p>
        <p className="font-medium">{assistant.model}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Version</p>
        <p className="font-medium">{assistant.version}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Languages</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {assistant.languages.map((lang) => (
            <span key={lang} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {lang}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600">Capabilities</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {assistant.capabilities.map((cap) => (
            <span key={cap} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="border-t pt-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Conversations</p>
          <p className="font-semibold">{assistant.metrics.conversations.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Response Time</p>
          <p className="font-semibold">{assistant.metrics.avgResponseTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Satisfaction</p>
          <p className="font-semibold">{assistant.metrics.satisfaction}/5.0</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Accuracy</p>
          <p className="font-semibold">{assistant.metrics.accuracy}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Daily Users</p>
          <p className="font-semibold">{assistant.metrics.dailyUsers.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

const ConversationList: React.FC<{ conversations: ConversationSummary[] }> = ({ conversations }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">Recent Conversations</h2>
    </div>
    <div className="divide-y">
      {conversations.map((conv) => (
        <div key={conv.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-[#8B1538] mr-2" />
              <span className="font-medium">{conv.assistant}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-600">{conv.user}</span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(conv.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{conv.duration}</span>
              <span className="text-gray-300">|</span>
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{conv.satisfaction}/5</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {conv.topics.map((topic) => (
                <span key={topic} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      <button className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
        <Plus className="w-5 h-5 mr-2" />
        New Assistant
      </button>
      <button className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
        <Brain className="w-5 h-5 mr-2" />
        Train Model
      </button>
      <button className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
        <Globe className="w-5 h-5 mr-2" />
        Add Language
      </button>
      <button className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
        <Code2 className="w-5 h-5 mr-2" />
        Edit Prompts
      </button>
    </div>
  </div>
);

const AssistantsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">AI Assistants</h1>
          <p className="text-gray-600">Manage and monitor your AI assistant fleet</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
            <Plus className="w-5 h-5 mr-2" />
            New Assistant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {mockAssistants.map((assistant) => (
            <AssistantCard key={assistant.id} assistant={assistant} />
          ))}
        </div>
        <div className="space-y-6">
          <QuickActions />
          <ConversationList conversations={mockConversations} />
        </div>
      </div>
    </div>
  );
};

export default AssistantsPage;
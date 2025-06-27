import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Play,
  Pause,
  Settings,
  RefreshCw,
  Plus,
  MessageSquare,
  Clock,
  Activity,
  CheckCircle,
} from 'lucide-react';

interface Assistant {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'paused';
  totalCalls: number;
  avgResponseTime: string;
  successRate: string;
  lastActive: string;
}

const mockAssistants: Assistant[] = [
  {
    id: 'asst_1',
    name: 'Concierge Assistant',
    model: 'gpt-4-turbo',
    status: 'active',
    totalCalls: 8500,
    avgResponseTime: '0.8s',
    successRate: '98.5%',
    lastActive: '2 minutes ago',
  },
  {
    id: 'asst_2',
    name: 'Booking Assistant',
    model: 'gpt-4',
    status: 'active',
    totalCalls: 12000,
    avgResponseTime: '0.9s',
    successRate: '97.8%',
    lastActive: '5 minutes ago',
  },
  {
    id: 'asst_3',
    name: 'Customer Support',
    model: 'gpt-4-turbo',
    status: 'paused',
    totalCalls: 5200,
    avgResponseTime: '1.1s',
    successRate: '96.5%',
    lastActive: '1 hour ago',
  },
];

interface AssistantCardProps {
  assistant: Assistant;
}

const AssistantCard: React.FC<{ assistant: Assistant }> = ({ assistant }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#8B1538] text-white flex items-center justify-center mr-3">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{assistant.name}</h3>
            <p className="text-sm text-gray-600">{assistant.model}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          assistant.status === 'active' ? 'bg-green-100 text-green-800' :
          assistant.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {assistant.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Calls</p>
          <p className="font-semibold">{assistant.totalCalls.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
          <p className="font-semibold">{assistant.avgResponseTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Success Rate</p>
          <p className="font-semibold">{assistant.successRate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Last Active</p>
          <p className="font-semibold">{assistant.lastActive}</p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => navigate(`/admin/ai/assistants/${assistant.id}/conversations`)}
          className="flex-1 px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c] transition-colors"
        >
          View Conversations
        </button>
      </div>
    </div>
  );
};

const AssistantStats: React.FC = () => {
  const stats = [
    {
      label: 'Total Assistants',
      value: mockAssistants.length,
      icon: Bot,
    },
    {
      label: 'Active Assistants',
      value: mockAssistants.filter(a => a.status === 'active').length,
      icon: Activity,
    },
    {
      label: 'Total Conversations',
      value: '35.5K',
      icon: MessageSquare,
    },
    {
      label: 'Avg Response Time',
      value: '0.85s',
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-2">
            <stat.icon className="w-5 h-5 mr-2 text-[#8B1538]" />
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
          </div>
          <p className="text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

const AssistantsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">AI Assistants</h1>
            <p className="text-gray-600">Monitor and manage your AI assistants</p>
          </div>
          <button
            onClick={() => navigate('/admin/ai/assistants/new')}
            className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]"
          >
            Create New Assistant
          </button>
        </div>
      </div>

      <AssistantStats />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Active Assistants</h2>
        <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
          <Plus className="w-4 h-4 mr-2" />
          New Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockAssistants.map((assistant) => (
          <AssistantCard key={assistant.id} assistant={assistant} />
        ))}
      </div>
    </div>
  );
};

export default AssistantsPage; 
import React from 'react';
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
} from 'lucide-react';
import { AIAssistant } from '../../../types/ai';

// Mock data for AI assistants
const mockAssistants: AIAssistant[] = [
  {
    id: 'asst_1',
    name: 'Concierge Assistant',
    model: 'gpt-4-turbo',
    status: 'active',
    totalCalls: 8500,
    avgResponseTime: 0.8,
    lastActive: '2 minutes ago',
    successRate: 98.5,
  },
  {
    id: 'asst_2',
    name: 'Booking Assistant',
    model: 'gpt-4',
    status: 'active',
    totalCalls: 12000,
    avgResponseTime: 0.9,
    lastActive: '5 minutes ago',
    successRate: 97.8,
  },
  {
    id: 'asst_3',
    name: 'Customer Support',
    model: 'gpt-3.5-turbo',
    status: 'paused',
    totalCalls: 15000,
    avgResponseTime: 0.7,
    lastActive: '1 hour ago',
    successRate: 96.5,
  },
];

interface AssistantCardProps {
  assistant: AIAssistant;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ assistant }) => {
  const isActive = assistant.status === 'active';
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Bot className="w-6 h-6 mr-2 text-[#8B1538]" />
          <div>
            <h3 className="text-lg font-medium">{assistant.name}</h3>
            <p className="text-sm text-gray-500">{assistant.model}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {assistant.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Total Calls</p>
          <p className="text-lg font-semibold">{assistant.totalCalls.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Response Time</p>
          <p className="text-lg font-semibold">{assistant.avgResponseTime}s</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-lg font-semibold">{assistant.successRate}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last Active</p>
          <p className="text-lg font-semibold">{assistant.lastActive}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <button className="flex items-center px-3 py-2 bg-[#8B1538] text-white rounded hover:bg-[#6d102c]">
          <MessageSquare className="w-4 h-4 mr-2" />
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

const AIAssistantsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">AI Assistants Management</h1>
        <p className="text-gray-600">Monitor and manage OpenAI assistants</p>
      </div>

      <AssistantStats />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Active Assistants</h2>
        <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
          <Plus className="w-4 h-4 mr-2" />
          New Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAssistants.map((assistant) => (
          <AssistantCard key={assistant.id} assistant={assistant} />
        ))}
      </div>
    </div>
  );
};

export default AIAssistantsPage; 
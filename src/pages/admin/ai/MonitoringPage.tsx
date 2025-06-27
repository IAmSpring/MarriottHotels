import React, { useState } from 'react';
import {
  Activity,
  RefreshCw,
  Settings,
  Clock,
  Filter,
  Download
} from 'lucide-react';
import LangGraphFlow from '../../../components/LangGraphFlow';
import AIMonitoringDashboard from '../../../components/AIMonitoringDashboard';

const TimeRangeSelector: React.FC<{
  range: string;
  setRange: (range: string) => void;
}> = ({ range, setRange }) => (
  <div className="flex space-x-2">
    {['1h', '6h', '24h', '7d', '30d'].map((timeRange) => (
      <button
        key={timeRange}
        onClick={() => setRange(timeRange)}
        className={`px-3 py-1 rounded-md text-sm ${
          range === timeRange
            ? 'bg-[#8B1538] text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {timeRange}
      </button>
    ))}
  </div>
);

const MonitoringPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeView, setActiveView] = useState<'dashboard' | 'workflow'>('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">AI System Monitoring</h1>
          <p className="text-gray-600">Real-time metrics, traces, and system health</p>
        </div>
        <div className="flex items-center space-x-3">
          <TimeRangeSelector range={timeRange} setRange={setTimeRange} />
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
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

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-lg ${
            activeView === 'dashboard'
              ? 'bg-[#8B1538] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Metrics Dashboard
        </button>
        <button
          onClick={() => setActiveView('workflow')}
          className={`px-4 py-2 rounded-lg ${
            activeView === 'workflow'
              ? 'bg-[#8B1538] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Workflow Visualization
        </button>
      </div>

      {activeView === 'dashboard' ? (
        <AIMonitoringDashboard timeRange={timeRange} />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Workflow Visualization</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Auto-refresh: 30s</span>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <LangGraphFlow />
        </div>
      )}
    </div>
  );
};

export default MonitoringPage; 
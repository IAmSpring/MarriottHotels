import React, { useState, useEffect } from 'react';
import { Filter, Download, RefreshCw, Settings, Clock } from 'lucide-react';
import AIMonitoringDashboard from '../../../components/AIMonitoringDashboard';
import LangGraphFlow from '../../../components/LangGraphFlow';
import { monitoringService } from '../../../services/monitoringService';
import { logger } from '../../../lib/browserLogger';

const MonitoringPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeView, setActiveView] = useState<'dashboard' | 'workflow'>('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await monitoringService.getRealTimeMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      logger.error('Failed to fetch monitoring metrics', err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Set up polling interval
    const interval = setInterval(fetchMetrics, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

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
          <button 
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={fetchMetrics}
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B1538]"></div>
            </div>
          )}
          <AIMonitoringDashboard 
            timeRange={timeRange} 
            metrics={metrics}
          />
        </div>
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

interface TimeRangeSelectorProps {
  range: string;
  setRange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ range, setRange }) => {
  const ranges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  return (
    <select
      value={range}
      onChange={(e) => setRange(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
    >
      {ranges.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
};

export default MonitoringPage; 
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';
import {
  PerformanceMetrics,
  TimeSeriesData,
  ModelUsage,
  ErrorType,
} from '../../../types/ai';

// Mock performance data
const mockPerformanceData: PerformanceMetrics = {
  totalRequests: 15783,
  avgLatency: 0.85,
  errorRate: 2.5,
  costPerDay: 28.50,
};

const mockTimeSeriesData: TimeSeriesData[] = [
  { time: '00:00', requests: 420, latency: 0.75, errors: 8 },
  { time: '04:00', requests: 280, latency: 0.72, errors: 5 },
  { time: '08:00', requests: 850, latency: 0.85, errors: 12 },
  { time: '12:00', requests: 1200, latency: 0.95, errors: 18 },
  { time: '16:00', requests: 980, latency: 0.88, errors: 15 },
  { time: '20:00', requests: 750, latency: 0.82, errors: 10 },
];

const mockModelUsage: ModelUsage[] = [
  { name: 'GPT-4 Turbo', requests: 5500, cost: 12.50 },
  { name: 'GPT-4', requests: 3800, cost: 9.80 },
  { name: 'GPT-3.5 Turbo', requests: 6483, cost: 6.20 },
];

const mockErrorTypes: ErrorType[] = [
  { type: 'Rate Limit', count: 45 },
  { type: 'Timeout', count: 32 },
  { type: 'Invalid Input', count: 28 },
  { type: 'Model Error', count: 15 },
];

const COLORS = ['#8B1538', '#1E40AF', '#047857', '#B45309'];

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
}

const PerformanceStats: React.FC = () => {
  const stats: StatCardProps[] = [
    {
      label: 'Total Requests',
      value: mockPerformanceData.totalRequests.toLocaleString(),
      icon: Activity,
      change: '+12%',
    },
    {
      label: 'Avg Latency',
      value: `${mockPerformanceData.avgLatency}s`,
      icon: Clock,
      change: '-5%',
    },
    {
      label: 'Error Rate',
      value: `${mockPerformanceData.errorRate}%`,
      icon: AlertTriangle,
      change: '-0.5%',
    },
    {
      label: 'Cost/Day',
      value: `$${mockPerformanceData.costPerDay}`,
      icon: Zap,
      change: '+8%',
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
          <p className={`text-sm mt-2 ${
            stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change} from last week
          </p>
        </div>
      ))}
    </div>
  );
};

const RequestsChart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Requests & Latency (24h)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockTimeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="requests"
              stroke="#8B1538"
              name="Requests"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              stroke="#1E40AF"
              name="Latency (s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ModelUsageChart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Model Usage & Cost</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockModelUsage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="requests" fill="#8B1538" name="Requests" />
            <Bar yAxisId="right" dataKey="cost" fill="#1E40AF" name="Cost ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ErrorDistributionChart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Error Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockErrorTypes}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
              label={({ type, count }) => `${type}: ${count}`}
            >
              {mockErrorTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AIPerformancePage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">AI Performance Monitoring</h1>
        <p className="text-gray-600">Track AI system performance, usage, and costs</p>
      </div>

      <PerformanceStats />
      <RequestsChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModelUsageChart />
        <ErrorDistributionChart />
      </div>
    </div>
  );
};

export default AIPerformancePage; 
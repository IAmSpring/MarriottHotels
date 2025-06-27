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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const mockAIStats = {
  totalQueries: 15783,
  avgResponseTime: 0.8,
  successRate: 97.5,
  activeAssistants: 5,
  vectorDBSize: 25000,
  graphDBNodes: 12500,
};

const mockPerformanceData = [
  { hour: '00:00', queries: 420, avgTime: 0.75 },
  { hour: '04:00', queries: 280, avgTime: 0.72 },
  { hour: '08:00', queries: 850, avgTime: 0.85 },
  { hour: '12:00', queries: 1200, avgTime: 0.95 },
  { hour: '16:00', queries: 980, avgTime: 0.88 },
  { hour: '20:00', queries: 750, avgTime: 0.82 },
];

const mockStorageDistribution = [
  { name: 'Vector DB', value: 25000 },
  { name: 'Graph DB', value: 12500 },
  { name: 'Cache', value: 5000 },
];

const COLORS = ['#8B1538', '#1E40AF', '#047857'];

const StatsOverview = () => {
  const stats = [
    { label: 'Total Queries', value: mockAIStats.totalQueries.toLocaleString() },
    { label: 'Avg Response Time', value: `${mockAIStats.avgResponseTime}s` },
    { label: 'Success Rate', value: `${mockAIStats.successRate}%` },
    { label: 'Active Assistants', value: mockAIStats.activeAssistants },
    { label: 'Vector DB Entries', value: mockAIStats.vectorDBSize.toLocaleString() },
    { label: 'Graph DB Nodes', value: mockAIStats.graphDBNodes.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

const QueryPerformanceChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Query Performance (24h)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="queries"
              stroke="#8B1538"
              name="Queries"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTime"
              stroke="#1E40AF"
              name="Avg Time (s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StorageDistributionChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Storage Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockStorageDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
            >
              {mockStorageDistribution.map((entry, index) => (
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

const AIDashboardPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">AI System Overview</h1>
        <p className="text-gray-600">Monitor AI performance, storage, and system health</p>
      </div>
      
      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QueryPerformanceChart />
        <StorageDistributionChart />
      </div>
    </div>
  );
};

export default AIDashboardPage; 
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Database,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  totalQueries: number;
  totalMutations: number;
  totalErrors: number;
  avgResponseTime: number;
  peakResponseTime: number;
  activeUsers: number;
  topOperations: Array<{
    name: string;
    count: number;
    avgTime: number;
    errorRate: number;
  }>;
  hourlyData: Array<{
    hour: string;
    queries: number;
    mutations: number;
    errors: number;
  }>;
  dailyData: Array<{
    date: string;
    queries: number;
    mutations: number;
    errors: number;
    avgResponseTime: number;
  }>;
}

const ApolloMCPAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalQueries: 1247,
    totalMutations: 89,
    totalErrors: 23,
    avgResponseTime: 245,
    peakResponseTime: 1200,
    activeUsers: 45,
    topOperations: [
      { name: 'SearchHotels', count: 156, avgTime: 180, errorRate: 0.02 },
      { name: 'GetBookings', count: 134, avgTime: 320, errorRate: 0.05 },
      { name: 'GetUserProfile', count: 98, avgTime: 145, errorRate: 0.01 },
      { name: 'CreateBooking', count: 67, avgTime: 450, errorRate: 0.08 },
      { name: 'UpdateUser', count: 45, avgTime: 280, errorRate: 0.03 }
    ],
    hourlyData: [
      { hour: '00:00', queries: 12, mutations: 2, errors: 0 },
      { hour: '01:00', queries: 8, mutations: 1, errors: 0 },
      { hour: '02:00', queries: 5, mutations: 0, errors: 0 },
      { hour: '03:00', queries: 3, mutations: 0, errors: 0 },
      { hour: '04:00', queries: 4, mutations: 0, errors: 0 },
      { hour: '05:00', queries: 7, mutations: 1, errors: 0 },
      { hour: '06:00', queries: 15, mutations: 2, errors: 1 },
      { hour: '07:00', queries: 28, mutations: 4, errors: 1 },
      { hour: '08:00', queries: 45, mutations: 6, errors: 2 },
      { hour: '09:00', queries: 67, mutations: 8, errors: 3 },
      { hour: '10:00', queries: 89, mutations: 12, errors: 4 },
      { hour: '11:00', queries: 95, mutations: 15, errors: 5 },
      { hour: '12:00', queries: 87, mutations: 13, errors: 3 },
      { hour: '13:00', queries: 92, mutations: 14, errors: 4 },
      { hour: '14:00', queries: 78, mutations: 11, errors: 2 },
      { hour: '15:00', queries: 85, mutations: 12, errors: 3 },
      { hour: '16:00', queries: 76, mutations: 10, errors: 2 },
      { hour: '17:00', queries: 68, mutations: 9, errors: 1 },
      { hour: '18:00', queries: 72, mutations: 8, errors: 2 },
      { hour: '19:00', queries: 65, mutations: 7, errors: 1 },
      { hour: '20:00', queries: 58, mutations: 6, errors: 1 },
      { hour: '21:00', queries: 45, mutations: 4, errors: 0 },
      { hour: '22:00', queries: 32, mutations: 3, errors: 0 },
      { hour: '23:00', queries: 18, mutations: 2, errors: 0 }
    ],
    dailyData: [
      { date: '2024-01-01', queries: 1247, mutations: 89, errors: 23, avgResponseTime: 245 },
      { date: '2024-01-02', queries: 1189, mutations: 76, errors: 19, avgResponseTime: 238 },
      { date: '2024-01-03', queries: 1321, mutations: 94, errors: 28, avgResponseTime: 251 },
      { date: '2024-01-04', queries: 1156, mutations: 82, errors: 21, avgResponseTime: 242 },
      { date: '2024-01-05', queries: 1432, mutations: 103, errors: 31, avgResponseTime: 258 },
      { date: '2024-01-06', queries: 1567, mutations: 118, errors: 35, avgResponseTime: 267 },
      { date: '2024-01-07', queries: 1489, mutations: 112, errors: 33, avgResponseTime: 261 }
    ]
  });

  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('queries');

  const successRate = ((analytics.totalQueries + analytics.totalMutations - analytics.totalErrors) / 
                      (analytics.totalQueries + analytics.totalMutations) * 100).toFixed(1);

  const totalOperations = analytics.totalQueries + analytics.totalMutations;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Performance metrics and usage statistics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Operations</p>
              <p className="text-2xl font-bold text-gray-900">{totalOperations.toLocaleString()}</p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <span className="text-green-600">+{analytics.totalQueries}</span>
            <span className="text-gray-600">queries</span>
            <span className="text-blue-600">+{analytics.totalMutations}</span>
            <span className="text-gray-600">mutations</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{analytics.totalErrors} errors</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.avgResponseTime}ms</p>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Peak: {analytics.peakResponseTime}ms</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Currently online</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hourly Activity</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('queries')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'queries' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Queries
              </button>
              <button
                onClick={() => setSelectedMetric('mutations')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'mutations' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Mutations
              </button>
              <button
                onClick={() => setSelectedMetric('errors')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'errors' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Errors
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-1">
            {analytics.hourlyData.map((data, index) => {
              const maxValue = Math.max(...analytics.hourlyData.map(d => 
                selectedMetric === 'queries' ? d.queries : 
                selectedMetric === 'mutations' ? d.mutations : d.errors
              ));
              const value = selectedMetric === 'queries' ? data.queries : 
                           selectedMetric === 'mutations' ? data.mutations : data.errors;
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t ${
                      selectedMetric === 'queries' ? 'bg-blue-500' :
                      selectedMetric === 'mutations' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1">{data.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Operations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Operations</h3>
          <div className="space-y-4">
            {analytics.topOperations.map((op, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{op.name}</h4>
                    <p className="text-sm text-gray-600">{op.count} executions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{op.avgTime}ms</p>
                  <p className="text-xs text-gray-600">{(op.errorRate * 100).toFixed(1)}% error</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Trends (Last 7 Days)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Queries</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Mutations</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Errors</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Avg Response</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.dailyData.map((day, index) => {
                const totalOps = day.queries + day.mutations;
                const successRate = totalOps > 0 ? ((totalOps - day.errors) / totalOps * 100).toFixed(1) : '0.0';
                
                return (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm text-gray-900">{day.date}</td>
                    <td className="py-2 text-sm text-gray-600">{day.queries.toLocaleString()}</td>
                    <td className="py-2 text-sm text-gray-600">{day.mutations.toLocaleString()}</td>
                    <td className="py-2 text-sm text-gray-600">{day.errors.toLocaleString()}</td>
                    <td className="py-2 text-sm text-gray-600">{day.avgResponseTime}ms</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(successRate) >= 95 ? 'bg-green-100 text-green-800' :
                        parseFloat(successRate) >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-500 mr-2" />
                <span className="text-green-800">Response time is optimal</span>
              </div>
              <span className="text-sm text-green-600">245ms avg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-yellow-500 mr-2" />
                <span className="text-yellow-800">Error rate needs attention</span>
              </div>
              <span className="text-sm text-yellow-600">1.8% errors</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp size={20} className="text-blue-500 mr-2" />
                <span className="text-blue-800">Traffic is increasing</span>
              </div>
              <span className="text-sm text-blue-600">+12% this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Zap size={16} className="text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Optimize CreateBooking</p>
                <p className="text-xs text-gray-600">Consider caching to reduce 450ms response time</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Database size={16} className="text-green-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Add query caching</p>
                <p className="text-xs text-gray-600">Implement Redis for frequently accessed data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Eye size={16} className="text-purple-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Monitor error patterns</p>
                <p className="text-xs text-gray-600">Set up alerts for error rate spikes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApolloMCPAnalytics; 
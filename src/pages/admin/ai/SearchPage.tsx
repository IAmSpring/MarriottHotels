import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  LineChart,
  Search,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  Brain,
  MessageSquare,
  Lightbulb,
  Tag,
} from 'lucide-react';

interface SearchMetric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopQuery {
  query: string;
  count: number;
  avgLatency: string;
  successRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface SearchPattern {
  category: string;
  percentage: number;
  count: number;
  examples: string[];
}

interface SemanticCluster {
  id: string;
  name: string;
  size: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  topQueries: string[];
  growth: number;
}

interface QueryIntent {
  id: string;
  intent: string;
  confidence: number;
  examples: string[];
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

interface FailedQuery {
  query: string;
  count: number;
  reason: 'no_match' | 'low_confidence' | 'timeout' | 'error';
  lastOccurred: string;
  suggestedAction: string;
}

// Mock data
const mockMetrics: SearchMetric[] = [
  {
    id: 'metric_1',
    name: 'Total Searches',
    value: '45,782',
    change: 12.5,
    trend: 'up',
  },
  {
    id: 'metric_2',
    name: 'Avg Response Time',
    value: '0.45s',
    change: -8.2,
    trend: 'down',
  },
  {
    id: 'metric_3',
    name: 'Success Rate',
    value: '94.8%',
    change: 2.1,
    trend: 'up',
  },
  {
    id: 'metric_4',
    name: 'Unique Users',
    value: '12,345',
    change: 15.3,
    trend: 'up',
  },
];

const mockTopQueries: TopQuery[] = [
  {
    query: 'room service menu',
    count: 1250,
    avgLatency: '0.42s',
    successRate: 96.5,
    trend: 'up',
  },
  {
    query: 'check-in time',
    count: 980,
    avgLatency: '0.38s',
    successRate: 98.2,
    trend: 'stable',
  },
  {
    query: 'pool hours',
    count: 875,
    avgLatency: '0.41s',
    successRate: 97.8,
    trend: 'up',
  },
  {
    query: 'parking rates',
    count: 750,
    avgLatency: '0.44s',
    successRate: 95.5,
    trend: 'down',
  },
];

const mockPatterns: SearchPattern[] = [
  {
    category: 'Amenities',
    percentage: 35,
    count: 16234,
    examples: ['pool access', 'gym hours', 'spa services'],
  },
  {
    category: 'Dining',
    percentage: 28,
    count: 12819,
    examples: ['restaurant reservations', 'room service', 'breakfast hours'],
  },
  {
    category: 'Room Services',
    percentage: 20,
    count: 9156,
    examples: ['housekeeping', 'extra towels', 'maintenance'],
  },
  {
    category: 'Booking',
    percentage: 17,
    count: 7573,
    examples: ['check-in time', 'late checkout', 'room upgrade'],
  },
];

const mockClusters: SemanticCluster[] = [
  {
    id: 'cluster_1',
    name: 'Room Amenities',
    size: 2500,
    sentiment: 'positive',
    topQueries: ['mini bar items', 'room service menu', 'extra pillows'],
    growth: 15,
  },
  {
    id: 'cluster_2',
    name: 'Booking Issues',
    size: 1800,
    sentiment: 'negative',
    topQueries: ['cancel reservation', 'change dates', 'refund policy'],
    growth: -8,
  },
  {
    id: 'cluster_3',
    name: 'Local Recommendations',
    size: 2200,
    sentiment: 'positive',
    topQueries: ['nearby restaurants', 'tourist attractions', 'shopping areas'],
    growth: 25,
  },
];

const mockIntents: QueryIntent[] = [
  {
    id: 'intent_1',
    intent: 'Make Reservation',
    confidence: 95.5,
    examples: ['book a room', 'make reservation', 'available rooms'],
    volume: 3500,
    trend: 'up',
  },
  {
    id: 'intent_2',
    intent: 'Service Request',
    confidence: 92.8,
    examples: ['room cleaning', 'maintenance help', 'extra towels'],
    volume: 2800,
    trend: 'stable',
  },
  {
    id: 'intent_3',
    intent: 'Information',
    confidence: 88.5,
    examples: ['check-in time', 'wifi password', 'parking info'],
    volume: 4200,
    trend: 'up',
  },
];

const mockFailedQueries: FailedQuery[] = [
  {
    query: 'spa treatments for pets',
    count: 45,
    reason: 'no_match',
    lastOccurred: '2h ago',
    suggestedAction: 'Add pet services content',
  },
  {
    query: 'helicopter landing pad',
    count: 28,
    reason: 'no_match',
    lastOccurred: '4h ago',
    suggestedAction: 'Redirect to transportation',
  },
  {
    query: 'underwater room booking',
    count: 15,
    reason: 'no_match',
    lastOccurred: '6h ago',
    suggestedAction: 'Add specialty rooms FAQ',
  },
];

const MetricCard: React.FC<{ metric: SearchMetric }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm text-gray-600">{metric.name}</h3>
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

const SearchTrends: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">Search Trends</h2>
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
          Last 7 Days <ChevronDown className="w-4 h-4 inline-block ml-1" />
        </button>
        <button className="p-1.5 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <div className="space-y-4">
      {mockTopQueries.map((query, index) => (
        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-400">#{index + 1}</span>
            <div>
              <p className="font-medium">{query.query}</p>
              <p className="text-sm text-gray-600">{query.count} searches</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-medium">{query.avgLatency}</p>
              <p className="text-xs text-gray-600">Avg Latency</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{query.successRate}%</p>
              <p className="text-xs text-gray-600">Success Rate</p>
            </div>
            <div className={`text-sm ${
              query.trend === 'up' ? 'text-green-600' :
              query.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SearchPatterns: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">Search Patterns</h2>
      <button className="text-sm text-[#8B1538] hover:text-[#6d102c]">
        View Details
      </button>
    </div>

    <div className="space-y-4">
      {mockPatterns.map((pattern, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{pattern.category}</span>
              <span className="ml-2 text-sm text-gray-600">
                ({pattern.count.toLocaleString()} searches)
              </span>
            </div>
            <span className="font-medium">{pattern.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#8B1538] h-2 rounded-full"
              style={{ width: `${pattern.percentage}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {pattern.examples.map((example, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ClusterCard: React.FC<{ cluster: SemanticCluster }> = ({ cluster }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-semibold">{cluster.name}</h3>
        <p className="text-sm text-gray-600">{cluster.size} queries</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        cluster.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
        cluster.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {cluster.sentiment}
      </span>
    </div>

    <div className="space-y-2 mb-3">
      {cluster.topQueries.map((query, index) => (
        <div key={index} className="text-sm px-2 py-1 bg-gray-50 rounded">
          {query}
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Growth</span>
      <span className={cluster.growth > 0 ? 'text-green-600' : 'text-red-600'}>
        {cluster.growth > 0 ? '+' : ''}{cluster.growth}%
      </span>
    </div>
  </div>
);

const IntentCard: React.FC<{ intent: QueryIntent }> = ({ intent }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold">{intent.intent}</h3>
      <span className="text-sm font-medium">{intent.confidence}% confident</span>
    </div>

    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Volume</span>
        <span>{intent.volume.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#8B1538] h-2 rounded-full"
          style={{ width: `${(intent.volume / 5000) * 100}%` }}
        />
      </div>
    </div>

    <div className="space-y-1 mb-3">
      {intent.examples.map((example, index) => (
        <div key={index} className="text-sm text-gray-600">
          • {example}
        </div>
      ))}
    </div>

    <div className={`text-sm ${
      intent.trend === 'up' ? 'text-green-600' :
      intent.trend === 'down' ? 'text-red-600' :
      'text-gray-600'
    }`}>
      <TrendingUp className="w-4 h-4 inline-block mr-1" />
      {intent.trend}
    </div>
  </div>
);

const FailedQueriesTable: React.FC<{ queries: FailedQuery[] }> = ({ queries }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">Failed Queries</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Query</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Occurred</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {queries.map((query, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm">{query.query}</td>
              <td className="px-6 py-4 text-sm">{query.count}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  query.reason === 'no_match' ? 'bg-yellow-100 text-yellow-800' :
                  query.reason === 'low_confidence' ? 'bg-orange-100 text-orange-800' :
                  query.reason === 'timeout' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {query.reason}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{query.lastOccurred}</td>
              <td className="px-6 py-4 text-sm">
                <button className="text-[#8B1538] hover:text-[#6d102c]">
                  {query.suggestedAction}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'semantic' | 'intent'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Search Analytics</h1>
          <p className="text-gray-600">Monitor and analyze search patterns and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
            <Calendar className="w-5 h-5" />
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
                activeTab === 'semantic'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('semantic')}
            >
              Semantic Analysis
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ml-2 ${
                activeTab === 'intent'
                  ? 'bg-[#8B1538] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('intent')}
            >
              Intent Analysis
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {mockMetrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SearchTrends />
                <SearchPatterns />
              </div>

              <div className="mt-6">
                <FailedQueriesTable queries={mockFailedQueries} />
              </div>
            </>
          )}

          {activeTab === 'semantic' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Semantic Clusters</h2>
                <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze Clusters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockClusters.map((cluster) => (
                  <ClusterCard key={cluster.id} cluster={cluster} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'intent' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Query Intents</h2>
                <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Train Intents
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockIntents.map((intent) => (
                  <IntentCard key={intent.id} intent={intent} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 
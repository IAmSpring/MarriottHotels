import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Save, 
  Copy, 
  Download, 
  Upload, 
  Settings,
  Code,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  History,
  BookOpen
} from 'lucide-react';

interface PlaygroundQuery {
  id: string;
  name: string;
  query: string;
  variables: string;
  headers: string;
  result?: any;
  error?: string;
  executionTime?: number;
  timestamp: string;
}

const ApolloMCPPlayground: React.FC = () => {
  const [query, setQuery] = useState(`query SearchHotels($location: String, $rating: Float) {
  hotels(location: $location, rating: $rating) {
    id
    name
    location
    address
    rating
    imageUrl
    description
    amenities {
      id
      name
      category
    }
    rooms {
      id
      type
      price
      capacity
      available
    }
  }
}`);
  
  const [variables, setVariables] = useState(`{
  "location": "New York",
  "rating": 4.0
}`);
  
  const [headers, setHeaders] = useState(`{
  "Authorization": "Bearer your-token-here",
  "Content-Type": "application/json"
}`);
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [savedQueries, setSavedQueries] = useState<PlaygroundQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<PlaygroundQuery | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const [endpoint, setEndpoint] = useState('http://localhost:4000/graphql');

  const executeQuery = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);
    setExecutionTime(null);

    try {
      const startTime = Date.now();
      
      // Parse headers
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(headers);
      } catch (e) {
        console.warn('Invalid headers JSON, using empty object');
      }

      // Simulate GraphQL execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const endTime = Date.now();
      const executionTimeMs = endTime - startTime;
      setExecutionTime(executionTimeMs);

      // Mock successful response
      const mockResult = {
        data: {
          hotels: [
            {
              id: "hotel_1",
              name: "Marriott Marquis Times Square",
              location: "New York",
              address: "1535 Broadway, New York, NY 10036",
              rating: 4.5,
              imageUrl: "https://example.com/hotel1.jpg",
              description: "Luxury hotel in the heart of Times Square",
              amenities: [
                { id: "amenity_1", name: "WiFi", category: "Technology" },
                { id: "amenity_2", name: "Pool", category: "Recreation" },
                { id: "amenity_3", name: "Spa", category: "Wellness" }
              ],
              rooms: [
                { id: "room_1", type: "Deluxe King", price: 299, capacity: 2, available: true },
                { id: "room_2", type: "Executive Suite", price: 499, capacity: 4, available: true }
              ]
            },
            {
              id: "hotel_2",
              name: "W New York - Times Square",
              location: "New York",
              address: "1567 Broadway, New York, NY 10036",
              rating: 4.2,
              imageUrl: "https://example.com/hotel2.jpg",
              description: "Modern boutique hotel with city views",
              amenities: [
                { id: "amenity_4", name: "WiFi", category: "Technology" },
                { id: "amenity_5", name: "Fitness Center", category: "Recreation" }
              ],
              rooms: [
                { id: "room_3", type: "Wonderful King", price: 349, capacity: 2, available: true },
                { id: "room_4", type: "Marvelous Suite", price: 599, capacity: 4, available: false }
              ]
            }
          ]
        },
        extensions: {
          tracing: {
            version: 1,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            duration: executionTimeMs * 1000000
          }
        }
      };

      setResult(mockResult);

      // Save to history
      const newQuery: PlaygroundQuery = {
        id: Date.now().toString(),
        name: `Query ${savedQueries.length + 1}`,
        query,
        variables,
        headers,
        result: mockResult,
        executionTime: executionTimeMs,
        timestamp: new Date().toLocaleString()
      };

      setSavedQueries(prev => [newQuery, ...prev.slice(0, 9)]); // Keep last 10

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  const saveQuery = () => {
    const name = prompt('Enter a name for this query:');
    if (name) {
      const newQuery: PlaygroundQuery = {
        id: Date.now().toString(),
        name,
        query,
        variables,
        headers,
        result,
        error,
        executionTime,
        timestamp: new Date().toLocaleString()
      };
      setSavedQueries(prev => [newQuery, ...prev]);
    }
  };

  const loadQuery = (savedQuery: PlaygroundQuery) => {
    setQuery(savedQuery.query);
    setVariables(savedQuery.variables);
    setHeaders(savedQuery.headers);
    setResult(savedQuery.result);
    setError(savedQuery.error);
    setExecutionTime(savedQuery.executionTime);
    setSelectedQuery(savedQuery);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    }
  };

  const clearAll = () => {
    setQuery('');
    setVariables('{}');
    setHeaders('{}');
    setResult(null);
    setError(null);
    setExecutionTime(null);
    setSelectedQuery(null);
  };

  const sampleQueries = [
    {
      name: 'Search Hotels',
      query: `query SearchHotels($location: String, $rating: Float) {
  hotels(location: $location, rating: $rating) {
    id
    name
    location
    address
    rating
    imageUrl
    description
    amenities {
      id
      name
      category
    }
    rooms {
      id
      type
      price
      capacity
      available
    }
  }
}`,
      variables: `{
  "location": "New York",
  "rating": 4.0
}`
    },
    {
      name: 'Get User Bookings',
      query: `query GetUserBookings($userId: Int!) {
  bookings(userId: $userId) {
    id
    hotelId
    roomId
    checkIn
    checkOut
    guests
    totalPrice
    status
    hotel {
      name
      location
      rating
    }
    room {
      type
      price
    }
  }
}`,
      variables: `{
  "userId": 1
}`
    },
    {
      name: 'Create Booking',
      query: `mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    userId
    hotelId
    roomId
    checkIn
    checkOut
    guests
    totalPrice
    status
    user {
      name
      email
    }
    hotel {
      name
      location
    }
  }
}`,
      variables: `{
  "input": {
    "userId": 1,
    "hotelId": "hotel_1",
    "roomId": "room_1",
    "checkIn": "2024-01-15T15:00:00Z",
    "checkOut": "2024-01-17T11:00:00Z",
    "guests": 2
  }
}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GraphQL Playground</h1>
          <p className="text-gray-600 mt-2">Interactive GraphQL query testing and exploration</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={executeQuery}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {isExecuting ? <Clock size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
            {isExecuting ? 'Executing...' : 'Execute'}
          </button>
          <button
            onClick={saveQuery}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
          >
            <Code size={16} className="mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Endpoint Configuration */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">GraphQL Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="http://localhost:4000/graphql"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <Settings size={16} className="mr-2" />
              Headers
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Query</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(query)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your GraphQL query here..."
            />
          </div>

          {/* Variables and Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Variables</h3>
              <textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder='{"key": "value"}'
              />
            </div>

            {showHeaders && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Headers</h3>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder='{"Authorization": "Bearer token"}'
                />
              </div>
            )}
          </div>

          {/* Sample Queries */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Queries</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleQueries.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(sample.query);
                    setVariables(sample.variables);
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{sample.name}</h4>
                  <p className="text-sm text-gray-600">Click to load this sample query</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results and History */}
        <div className="lg:col-span-1 space-y-6">
          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Results</h3>
              <div className="flex items-center space-x-2">
                {executionTime && (
                  <span className="text-sm text-gray-600">{executionTime}ms</span>
                )}
                {result && (
                  <button
                    onClick={copyResult}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {isExecuting ? (
                <div className="flex items-center justify-center py-8">
                  <Clock size={24} className="animate-spin text-blue-500 mr-2" />
                  <span className="text-gray-600">Executing query...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-red-500 mr-2" />
                    <span className="text-red-800 font-medium">Error</span>
                  </div>
                  <pre className="text-red-700 mt-2 text-sm whitespace-pre-wrap">{error}</pre>
                </div>
              ) : result ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle size={20} className="text-green-500 mr-2" />
                    <span className="text-green-800 font-medium">Success</span>
                  </div>
                  <pre className="text-green-700 text-sm whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database size={24} className="mx-auto mb-2" />
                  <p>No results yet. Execute a query to see results here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Query History */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Query History</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {savedQueries.map(savedQuery => (
                <div
                  key={savedQuery.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedQuery?.id === savedQuery.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => loadQuery(savedQuery)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{savedQuery.name}</h4>
                      <p className="text-sm text-gray-600">{savedQuery.timestamp}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {savedQuery.executionTime && (
                        <span className="text-xs text-gray-500">{savedQuery.executionTime}ms</span>
                      )}
                      {savedQuery.error ? (
                        <AlertCircle size={14} className="text-red-500" />
                      ) : (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {savedQueries.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <History size={24} className="mx-auto mb-2" />
                  <p>No saved queries yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApolloMCPPlayground; 
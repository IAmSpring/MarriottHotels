import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Play, 
  Save, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  Search,
  Filter,
  FileText,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit
} from 'lucide-react';

interface GraphQLOperation {
  id: string;
  name: string;
  type: 'query' | 'mutation' | 'subscription';
  category: string;
  content: string;
  variables: string;
  description: string;
  lastExecuted?: string;
  executionCount: number;
  avgResponseTime: number;
  successRate: number;
}

const ApolloMCPOperations: React.FC = () => {
  const [operations, setOperations] = useState<GraphQLOperation[]>([
    {
      id: '1',
      name: 'SearchHotels',
      type: 'query',
      category: 'hotel-search',
      content: `query SearchHotels($location: String, $rating: Float, $amenities: [String], $limit: Int = 10, $offset: Int = 0) {
  hotels(location: $location, rating: $rating, amenities: $amenities, limit: $limit, offset: $offset) {
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
      description
    }
    rooms {
      id
      type
      price
      capacity
      available
      imageUrl
    }
  }
}`,
      variables: `{
  "location": "New York",
  "rating": 4.0,
  "amenities": ["wifi", "pool"],
  "limit": 10,
  "offset": 0
}`,
      description: 'Search for hotels with filtering and pagination',
      lastExecuted: '2 minutes ago',
      executionCount: 45,
      avgResponseTime: 180,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'GetBookings',
      type: 'query',
      category: 'booking-management',
      content: `query GetBookings($userId: Int, $hotelId: String, $status: String, $limit: Int = 20, $offset: Int = 0) {
  bookings(userId: $userId, hotelId: $hotelId, status: $status, limit: $limit, offset: $offset) {
    id
    userId
    hotelId
    roomId
    checkIn
    checkOut
    guests
    totalPrice
    status
    specialRequests
    createdAt
    updatedAt
    user {
      id
      name
      email
      bonvoyNumber
      bonvoyPoints
      bonvoyStatus
    }
    hotel {
      id
      name
      location
      address
      rating
    }
    room {
      id
      type
      price
      capacity
      amenities
    }
  }
}`,
      variables: `{
  "userId": 1,
  "status": "confirmed",
  "limit": 20,
  "offset": 0
}`,
      description: 'Get bookings with comprehensive filtering',
      lastExecuted: '5 minutes ago',
      executionCount: 32,
      avgResponseTime: 320,
      successRate: 96.8
    },
    {
      id: '3',
      name: 'CreateBooking',
      type: 'mutation',
      category: 'booking-management',
      content: `mutation CreateBooking($input: CreateBookingInput!) {
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
    specialRequests
    createdAt
    user {
      name
      email
      bonvoyNumber
    }
    hotel {
      name
      location
    }
    room {
      type
      price
    }
  }
}`,
      variables: `{
  "input": {
    "userId": 1,
    "hotelId": "hotel_123",
    "roomId": "room_456",
    "checkIn": "2024-01-15T15:00:00Z",
    "checkOut": "2024-01-17T11:00:00Z",
    "guests": 2,
    "specialRequests": "Late check-in preferred"
  }
}`,
      description: 'Create a new booking with validation',
      lastExecuted: '8 minutes ago',
      executionCount: 18,
      avgResponseTime: 450,
      successRate: 94.4
    }
  ]);

  const [selectedOperation, setSelectedOperation] = useState<GraphQLOperation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const categories = ['all', 'hotel-search', 'booking-management', 'user-management', 'analytics'];
  const types = ['all', 'query', 'mutation', 'subscription'];

  const filteredOperations = operations.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || op.category === selectedCategory;
    const matchesType = selectedType === 'all' || op.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const executeOperation = async (operation: GraphQLOperation) => {
    setIsExecuting(true);
    setExecutionError(null);
    setExecutionResult(null);

    try {
      // Simulate GraphQL execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mock successful response
      const mockResult = {
        data: {
          [operation.name.toLowerCase()]: operation.type === 'query' ? 
            { id: 'mock_result', status: 'success' } : 
            { id: 'mock_mutation_result', status: 'completed' }
        },
        executionTime: Math.floor(Math.random() * 500) + 100
      };

      setExecutionResult(mockResult);
      
      // Update operation stats
      setOperations(prev => prev.map(op => 
        op.id === operation.id ? {
          ...op,
          lastExecuted: 'Just now',
          executionCount: op.executionCount + 1,
          avgResponseTime: Math.floor((op.avgResponseTime + mockResult.executionTime) / 2)
        } : op
      ));

    } catch (error) {
      setExecutionError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  const saveOperation = (operation: GraphQLOperation) => {
    // Implementation for saving operation
    console.log('Saving operation:', operation);
  };

  const deleteOperation = (operationId: string) => {
    setOperations(prev => prev.filter(op => op.id !== operationId));
    if (selectedOperation?.id === operationId) {
      setSelectedOperation(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GraphQL Operations</h1>
          <p className="text-gray-600 mt-2">Manage and execute GraphQL operations</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Upload size={16} className="mr-2" />
            Import
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <FileText size={16} className="mr-2" />
            New Operation
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                <Filter size={14} className="inline mr-1" />
                Filter
              </button>
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                <Download size={14} className="inline mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Operations ({filteredOperations.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredOperations.map(operation => (
                <div
                  key={operation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedOperation?.id === operation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedOperation(operation)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{operation.name}</h4>
                      <p className="text-sm text-gray-600">{operation.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        operation.type === 'query' ? 'bg-blue-100 text-blue-800' :
                        operation.type === 'mutation' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {operation.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Executed {operation.executionCount} times</span>
                    <span>{operation.avgResponseTime}ms avg</span>
                  </div>
                  {operation.lastExecuted && (
                    <div className="mt-1 text-xs text-gray-400">
                      Last: {operation.lastExecuted}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operation Details and Execution */}
        <div className="lg:col-span-2">
          {selectedOperation ? (
            <div className="space-y-6">
              {/* Operation Header */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedOperation.name}</h3>
                    <p className="text-gray-600">{selectedOperation.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      selectedOperation.type === 'query' ? 'bg-blue-100 text-blue-800' :
                      selectedOperation.type === 'mutation' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedOperation.type}
                    </span>
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                      {selectedOperation.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => executeOperation(selectedOperation)}
                    disabled={isExecuting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {isExecuting ? <Clock size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                    {isExecuting ? 'Executing...' : 'Execute'}
                  </button>
                  <button
                    onClick={() => saveOperation(selectedOperation)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedOperation.content)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                  >
                    <Copy size={16} className="mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={() => deleteOperation(selectedOperation.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Operation Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Operation</h4>
                    <button
                      onClick={() => copyToClipboard(selectedOperation.content)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{selectedOperation.content}</code>
                  </pre>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Variables</h4>
                    <button
                      onClick={() => copyToClipboard(selectedOperation.variables)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{selectedOperation.variables}</code>
                  </pre>
                </div>
              </div>

              {/* Execution Results */}
              {(executionResult || executionError) && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Execution Results</h4>
                  
                  {executionError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle size={20} className="text-red-500 mr-2" />
                        <span className="text-red-800 font-medium">Error</span>
                      </div>
                      <p className="text-red-700 mt-2">{executionError}</p>
                    </div>
                  ) : executionResult && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle size={20} className="text-green-500 mr-2" />
                          <span className="text-green-800 font-medium">Success</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Execution time: {executionResult.executionTime}ms
                        </span>
                      </div>
                      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{JSON.stringify(executionResult.data, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Operation Statistics */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedOperation.executionCount}</div>
                    <div className="text-sm text-gray-600">Total Executions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedOperation.avgResponseTime}ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedOperation.successRate}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedOperation.lastExecuted ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-gray-600">Recently Used</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <Code size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Operation Selected</h3>
              <p className="text-gray-600">Select an operation from the list to view details and execute it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApolloMCPOperations; 
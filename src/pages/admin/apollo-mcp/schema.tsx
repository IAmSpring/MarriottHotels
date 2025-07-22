import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw,
  Eye,
  Code,
  FileText,
  ChevronDown,
  ChevronRight,
  Type,
  Query,
  Mutation,
  Subscription,
  Field,
  Argument
} from 'lucide-react';

interface SchemaType {
  name: string;
  kind: string;
  description?: string;
  fields?: SchemaField[];
  inputFields?: SchemaField[];
  enumValues?: SchemaEnumValue[];
  interfaces?: string[];
  possibleTypes?: string[];
}

interface SchemaField {
  name: string;
  description?: string;
  type: SchemaTypeRef;
  args?: SchemaArgument[];
  isDeprecated?: boolean;
  deprecationReason?: string;
}

interface SchemaArgument {
  name: string;
  description?: string;
  type: SchemaTypeRef;
  defaultValue?: string;
}

interface SchemaTypeRef {
  kind: string;
  name?: string;
  ofType?: SchemaTypeRef;
}

interface SchemaEnumValue {
  name: string;
  description?: string;
  isDeprecated?: boolean;
  deprecationReason?: string;
}

const ApolloMCPSchema: React.FC = () => {
  const [schema, setSchema] = useState<SchemaType[]>([]);
  const [selectedType, setSelectedType] = useState<SchemaType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKind, setSelectedKind] = useState('all');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [schemaStats, setSchemaStats] = useState({
    totalTypes: 0,
    objectTypes: 0,
    inputTypes: 0,
    enumTypes: 0,
    scalarTypes: 0,
    queries: 0,
    mutations: 0,
    subscriptions: 0
  });

  // Mock schema data
  useEffect(() => {
    const mockSchema: SchemaType[] = [
      {
        name: 'User',
        kind: 'OBJECT',
        description: 'A user account with Bonvoy integration',
        fields: [
          {
            name: 'id',
            description: 'Unique identifier for the user',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'Int' } }
          },
          {
            name: 'name',
            description: 'User\'s full name',
            type: { kind: 'SCALAR', name: 'String' }
          },
          {
            name: 'email',
            description: 'User\'s email address',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          },
          {
            name: 'bonvoyNumber',
            description: 'Marriott Bonvoy membership number',
            type: { kind: 'SCALAR', name: 'String' }
          },
          {
            name: 'bookings',
            description: 'User\'s booking history',
            type: { kind: 'LIST', ofType: { kind: 'NON_NULL', ofType: { kind: 'OBJECT', name: 'Booking' } } }
          }
        ]
      },
      {
        name: 'Hotel',
        kind: 'OBJECT',
        description: 'A hotel property with rooms and amenities',
        fields: [
          {
            name: 'id',
            description: 'Unique identifier for the hotel',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          },
          {
            name: 'name',
            description: 'Hotel name',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          },
          {
            name: 'location',
            description: 'Hotel location',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          },
          {
            name: 'rating',
            description: 'Hotel rating (1-5 stars)',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'Float' } }
          },
          {
            name: 'rooms',
            description: 'Available rooms at the hotel',
            type: { kind: 'LIST', ofType: { kind: 'NON_NULL', ofType: { kind: 'OBJECT', name: 'Room' } } }
          }
        ]
      },
      {
        name: 'Query',
        kind: 'OBJECT',
        description: 'Root query type',
        fields: [
          {
            name: 'users',
            description: 'Get list of users with filtering',
            type: { kind: 'LIST', ofType: { kind: 'NON_NULL', ofType: { kind: 'OBJECT', name: 'User' } } },
            args: [
              {
                name: 'role',
                description: 'Filter by user role',
                type: { kind: 'SCALAR', name: 'String' }
              },
              {
                name: 'limit',
                description: 'Maximum number of users to return',
                type: { kind: 'SCALAR', name: 'Int' }
              }
            ]
          },
          {
            name: 'hotels',
            description: 'Get list of hotels with filtering',
            type: { kind: 'LIST', ofType: { kind: 'NON_NULL', ofType: { kind: 'OBJECT', name: 'Hotel' } } },
            args: [
              {
                name: 'location',
                description: 'Filter by location',
                type: { kind: 'SCALAR', name: 'String' }
              },
              {
                name: 'rating',
                description: 'Minimum rating filter',
                type: { kind: 'SCALAR', name: 'Float' }
              }
            ]
          }
        ]
      },
      {
        name: 'Mutation',
        kind: 'OBJECT',
        description: 'Root mutation type',
        fields: [
          {
            name: 'createUser',
            description: 'Create a new user account',
            type: { kind: 'NON_NULL', ofType: { kind: 'OBJECT', name: 'User' } },
            args: [
              {
                name: 'input',
                description: 'User creation input',
                type: { kind: 'NON_NULL', ofType: { kind: 'INPUT_OBJECT', name: 'CreateUserInput' } }
              }
            ]
          },
          {
            name: 'createBooking',
            description: 'Create a new booking',
            type: { kind: 'NON_NULL', ofType: { kind: 'OBJECT', name: 'Booking' } },
            args: [
              {
                name: 'input',
                description: 'Booking creation input',
                type: { kind: 'NON_NULL', ofType: { kind: 'INPUT_OBJECT', name: 'CreateBookingInput' } }
              }
            ]
          }
        ]
      },
      {
        name: 'CreateUserInput',
        kind: 'INPUT_OBJECT',
        description: 'Input type for creating a user',
        inputFields: [
          {
            name: 'name',
            description: 'User\'s full name',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          },
          {
            name: 'email',
            description: 'User\'s email address',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          },
          {
            name: 'password',
            description: 'User\'s password',
            type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } }
          }
        ]
      },
      {
        name: 'BookingStatus',
        kind: 'ENUM',
        description: 'Status of a booking',
        enumValues: [
          { name: 'PENDING', description: 'Booking is pending confirmation' },
          { name: 'CONFIRMED', description: 'Booking is confirmed' },
          { name: 'CANCELLED', description: 'Booking has been cancelled' },
          { name: 'COMPLETED', description: 'Booking has been completed' }
        ]
      }
    ];

    setSchema(mockSchema);
    
    // Calculate stats
    const stats = {
      totalTypes: mockSchema.length,
      objectTypes: mockSchema.filter(t => t.kind === 'OBJECT').length,
      inputTypes: mockSchema.filter(t => t.kind === 'INPUT_OBJECT').length,
      enumTypes: mockSchema.filter(t => t.kind === 'ENUM').length,
      scalarTypes: mockSchema.filter(t => t.kind === 'SCALAR').length,
      queries: mockSchema.find(t => t.name === 'Query')?.fields?.length || 0,
      mutations: mockSchema.find(t => t.name === 'Mutation')?.fields?.length || 0,
      subscriptions: mockSchema.find(t => t.name === 'Subscription')?.fields?.length || 0
    };
    setSchemaStats(stats);
  }, []);

  const filteredSchema = schema.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKind = selectedKind === 'all' || type.kind === selectedKind;
    return matchesSearch && matchesKind;
  });

  const toggleExpanded = (typeName: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeName)) {
      newExpanded.delete(typeName);
    } else {
      newExpanded.add(typeName);
    }
    setExpandedTypes(newExpanded);
  };

  const getTypeString = (typeRef: SchemaTypeRef): string => {
    if (typeRef.kind === 'NON_NULL') {
      return `${getTypeString(typeRef.ofType!)}!`;
    } else if (typeRef.kind === 'LIST') {
      return `[${getTypeString(typeRef.ofType!)}]`;
    } else {
      return typeRef.name || typeRef.kind;
    }
  };

  const getTypeIcon = (kind: string) => {
    switch (kind) {
      case 'OBJECT': return <Type size={16} />;
      case 'INPUT_OBJECT': return <Code size={16} />;
      case 'ENUM': return <FileText size={16} />;
      case 'SCALAR': return <Database size={16} />;
      case 'QUERY': return <Query size={16} />;
      case 'MUTATION': return <Mutation size={16} />;
      case 'SUBSCRIPTION': return <Subscription size={16} />;
      default: return <Type size={16} />;
    }
  };

  const copySchemaToClipboard = () => {
    const schemaString = JSON.stringify(schema, null, 2);
    navigator.clipboard.writeText(schemaString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GraphQL Schema</h1>
          <p className="text-gray-600 mt-2">Explore and manage the GraphQL schema</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <RefreshCw size={16} className="mr-2" />
            Refresh Schema
          </button>
          <button 
            onClick={copySchemaToClipboard}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Copy size={16} className="mr-2" />
            Copy Schema
          </button>
        </div>
      </div>

      {/* Schema Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{schemaStats.totalTypes}</div>
          <div className="text-sm text-gray-600">Total Types</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{schemaStats.objectTypes}</div>
          <div className="text-sm text-gray-600">Objects</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{schemaStats.inputTypes}</div>
          <div className="text-sm text-gray-600">Inputs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{schemaStats.enumTypes}</div>
          <div className="text-sm text-gray-600">Enums</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">{schemaStats.scalarTypes}</div>
          <div className="text-sm text-gray-600">Scalars</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-indigo-600">{schemaStats.queries}</div>
          <div className="text-sm text-gray-600">Queries</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-pink-600">{schemaStats.mutations}</div>
          <div className="text-sm text-gray-600">Mutations</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{schemaStats.subscriptions}</div>
          <div className="text-sm text-gray-600">Subscriptions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Types</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search schema types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type Kind</label>
            <select
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Kinds</option>
              <option value="OBJECT">Objects</option>
              <option value="INPUT_OBJECT">Input Objects</option>
              <option value="ENUM">Enums</option>
              <option value="SCALAR">Scalars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                <Download size={14} className="inline mr-1" />
                Export
              </button>
              <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                <Upload size={14} className="inline mr-1" />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schema Types List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Types ({filteredSchema.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredSchema.map(type => (
                <div
                  key={type.name}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedType?.name === type.name ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(type.kind)}
                      <div>
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.kind.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(type.name);
                      }}
                    >
                      {expandedTypes.has(type.name) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                  
                  {expandedTypes.has(type.name) && (
                    <div className="mt-3 pl-6">
                      {type.description && (
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      )}
                      {type.fields && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Fields:</p>
                          {type.fields.slice(0, 3).map(field => (
                            <div key={field.name} className="text-xs text-gray-600">
                              {field.name}: {getTypeString(field.type)}
                            </div>
                          ))}
                          {type.fields.length > 3 && (
                            <div className="text-xs text-gray-500">+{type.fields.length - 3} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type Details */}
        <div className="lg:col-span-2">
          {selectedType ? (
            <div className="space-y-6">
              {/* Type Header */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(selectedType.kind)}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedType.name}</h3>
                      <p className="text-gray-600">{selectedType.kind.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copySchemaToClipboard()}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    <Copy size={14} className="inline mr-1" />
                    Copy
                  </button>
                </div>
                
                {selectedType.description && (
                  <p className="text-gray-700 mb-4">{selectedType.description}</p>
                )}
              </div>

              {/* Type Fields */}
              {(selectedType.fields || selectedType.inputFields) && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedType.fields ? 'Fields' : 'Input Fields'}
                  </h4>
                  <div className="space-y-4">
                    {(selectedType.fields || selectedType.inputFields)?.map(field => (
                      <div key={field.name} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Field size={16} className="text-blue-500" />
                            <span className="font-medium text-gray-900">{field.name}</span>
                            <span className="text-sm text-gray-500">: {getTypeString(field.type)}</span>
                          </div>
                          {field.isDeprecated && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              Deprecated
                            </span>
                          )}
                        </div>
                        
                        {field.description && (
                          <p className="text-sm text-gray-600 mb-2">{field.description}</p>
                        )}
                        
                        {field.deprecationReason && (
                          <p className="text-sm text-red-600 mb-2">
                            Deprecation reason: {field.deprecationReason}
                          </p>
                        )}
                        
                        {field.args && field.args.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">Arguments:</p>
                            <div className="space-y-1">
                              {field.args.map(arg => (
                                <div key={arg.name} className="flex items-center space-x-2 text-xs text-gray-600">
                                  <Argument size={12} className="text-green-500" />
                                  <span>{arg.name}: {getTypeString(arg.type)}</span>
                                  {arg.defaultValue && (
                                    <span className="text-gray-400">= {arg.defaultValue}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enum Values */}
              {selectedType.enumValues && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Enum Values</h4>
                  <div className="space-y-2">
                    {selectedType.enumValues.map(enumValue => (
                      <div key={enumValue.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium text-gray-900">{enumValue.name}</span>
                          {enumValue.description && (
                            <p className="text-sm text-gray-600">{enumValue.description}</p>
                          )}
                        </div>
                        {enumValue.isDeprecated && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                            Deprecated
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type Information */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Type Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Kind:</span>
                    <p className="text-gray-900">{selectedType.kind}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{selectedType.name}</p>
                  </div>
                  {selectedType.fields && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Fields:</span>
                      <p className="text-gray-900">{selectedType.fields.length}</p>
                    </div>
                  )}
                  {selectedType.inputFields && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Input Fields:</span>
                      <p className="text-gray-900">{selectedType.inputFields.length}</p>
                    </div>
                  )}
                  {selectedType.enumValues && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Enum Values:</span>
                      <p className="text-gray-900">{selectedType.enumValues.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <Database size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Type Selected</h3>
              <p className="text-gray-600">Select a type from the list to view its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApolloMCPSchema; 
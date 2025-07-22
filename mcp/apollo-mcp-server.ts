import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core/index.js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, transports } from 'winston';

// Initialize logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: './mcp/logs/mcp-server.log' }),
    new transports.Console({
      format: format.simple()
    })
  ]
});

// Load configuration
const config = JSON.parse(readFileSync('./mcp/config/mcp-config.json', 'utf8'));

// Initialize Apollo Client
const client = new ApolloClient({
  uri: config.graphql.endpoint,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Load GraphQL schema
const schema = readFileSync(config.graphql.schema, 'utf8');

// Load GraphQL operations
const operationsDir = config.operations.directory;
const operations: { [key: string]: string } = {};

try {
  const operationFiles = readdirSync(operationsDir);
  operationFiles.forEach(file => {
    if (file.endsWith('.graphql')) {
      const operationName = file.replace('.graphql', '');
      const operationContent = readFileSync(join(operationsDir, file), 'utf8');
      operations[operationName] = operationContent;
    }
  });
} catch (error) {
  logger.error('Error loading operations:', error);
}

// Define MCP tools
const tools: Tool[] = [
  {
    name: 'graphql_introspect',
    description: 'Introspect the GraphQL schema to understand available types, queries, and mutations',
    inputSchema: {
      type: 'object',
      properties: {
        includeDescriptions: {
          type: 'boolean',
          description: 'Whether to include field descriptions in the introspection',
          default: true
        }
      }
    }
  },
  {
    name: 'graphql_execute_query',
    description: 'Execute a GraphQL query with variables',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The GraphQL query to execute'
        },
        variables: {
          type: 'object',
          description: 'Variables for the GraphQL query',
          additionalProperties: true
        }
      },
      required: ['query']
    }
  },
  {
    name: 'graphql_execute_mutation',
    description: 'Execute a GraphQL mutation with variables',
    inputSchema: {
      type: 'object',
      properties: {
        mutation: {
          type: 'string',
          description: 'The GraphQL mutation to execute'
        },
        variables: {
          type: 'object',
          description: 'Variables for the GraphQL mutation',
          additionalProperties: true
        }
      },
      required: ['mutation']
    }
  },
  {
    name: 'graphql_list_operations',
    description: 'List available GraphQL operations from the operations directory',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter operations by category (hotel-search, booking-management, user-management, analytics)',
          enum: ['hotel-search', 'booking-management', 'user-management', 'analytics', 'all']
        }
      }
    }
  },
  {
    name: 'graphql_get_operation',
    description: 'Get the content of a specific GraphQL operation',
    inputSchema: {
      type: 'object',
      properties: {
        operationName: {
          type: 'string',
          description: 'Name of the operation to retrieve'
        }
      },
      required: ['operationName']
    }
  },
  {
    name: 'graphql_search_hotels',
    description: 'Search for hotels with filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Filter hotels by location'
        },
        rating: {
          type: 'number',
          description: 'Filter hotels by minimum rating'
        },
        amenities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter hotels by amenities'
        },
        limit: {
          type: 'number',
          description: 'Number of hotels to return',
          default: 10
        },
        offset: {
          type: 'number',
          description: 'Number of hotels to skip',
          default: 0
        }
      }
    }
  },
  {
    name: 'graphql_get_bookings',
    description: 'Get bookings with comprehensive filtering',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          description: 'Filter bookings by user ID'
        },
        hotelId: {
          type: 'string',
          description: 'Filter bookings by hotel ID'
        },
        status: {
          type: 'string',
          description: 'Filter bookings by status',
          enum: ['confirmed', 'pending', 'cancelled', 'completed']
        },
        limit: {
          type: 'number',
          description: 'Number of bookings to return',
          default: 20
        },
        offset: {
          type: 'number',
          description: 'Number of bookings to skip',
          default: 0
        }
      }
    }
  },
  {
    name: 'graphql_get_users',
    description: 'Get users with Bonvoy information and filtering',
    inputSchema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          description: 'Filter users by role',
          enum: ['customer', 'admin', 'manager']
        },
        bonvoyStatus: {
          type: 'string',
          description: 'Filter users by Bonvoy status',
          enum: ['silver', 'gold', 'platinum', 'titanium', 'ambassador']
        },
        limit: {
          type: 'number',
          description: 'Number of users to return',
          default: 20
        },
        offset: {
          type: 'number',
          description: 'Number of users to skip',
          default: 0
        }
      }
    }
  },
  {
    name: 'graphql_get_analytics',
    description: 'Get comprehensive analytics and business intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Type of analytics to retrieve',
          enum: ['hotel', 'booking', 'revenue', 'user-behavior'],
          required: true
        },
        hotelId: {
          type: 'string',
          description: 'Hotel ID for hotel-specific analytics'
        },
        startDate: {
          type: 'string',
          description: 'Start date for date range analytics (ISO format)'
        },
        endDate: {
          type: 'string',
          description: 'End date for date range analytics (ISO format)'
        },
        limit: {
          type: 'number',
          description: 'Limit for user behavior analytics',
          default: 50
        }
      }
    }
  }
];

// Create MCP server
const server = new Server(
  {
    name: 'apollo-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info('Listing tools');
  return {
    tools,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  logger.info(`Calling tool: ${name}`, { args });

  try {
    switch (name) {
      case 'graphql_introspect': {
        const result = await client.query({
          query: gql`
            query IntrospectionQuery {
              __schema {
                queryType { name }
                mutationType { name }
                subscriptionType { name }
                types {
                  ...FullType
                }
                directives {
                  name
                  description
                  locations
                  args {
                    ...InputValue
                  }
                }
              }
            }
            fragment FullType on __Type {
              kind
              name
              description
              fields(includeDeprecated: true) {
                name
                description
                args {
                  ...InputValue
                }
                type {
                  ...TypeRef
                }
                isDeprecated
                deprecationReason
              }
              inputFields {
                ...InputValue
              }
              interfaces {
                ...TypeRef
              }
              enumValues(includeDeprecated: true) {
                name
                description
                isDeprecated
                deprecationReason
              }
              possibleTypes {
                ...TypeRef
              }
            }
            fragment InputValue on __InputValue {
              name
              description
              type { ...TypeRef }
              defaultValue
            }
            fragment TypeRef on __Type {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                          ofType {
                            kind
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'graphql_execute_query': {
        const { query, variables } = args;
        const result = await client.query({
          query: gql`${query}`,
          variables: variables || {}
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'graphql_execute_mutation': {
        const { mutation, variables } = args;
        const result = await client.mutate({
          mutation: gql`${mutation}`,
          variables: variables || {}
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'graphql_list_operations': {
        const { category = 'all' } = args;
        let filteredOperations = operations;
        
        if (category !== 'all') {
          filteredOperations = Object.keys(operations)
            .filter(key => key.includes(category))
            .reduce((obj, key) => {
              obj[key] = operations[key];
              return obj;
            }, {} as { [key: string]: string });
        }

        return {
          content: [
            {
              type: 'text',
              text: `Available operations:\n${Object.keys(filteredOperations).map(name => `- ${name}`).join('\n')}`
            }
          ]
        };
      }

      case 'graphql_get_operation': {
        const { operationName } = args;
        const operation = operations[operationName];
        
        if (!operation) {
          throw new Error(`Operation '${operationName}' not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: operation
            }
          ]
        };
      }

      case 'graphql_search_hotels': {
        const { location, rating, amenities, limit = 10, offset = 0 } = args;
        const query = gql`
          query SearchHotels($location: String, $rating: Float, $amenities: [String], $limit: Int, $offset: Int) {
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
          }
        `;

        const result = await client.query({
          query,
          variables: { location, rating, amenities, limit, offset }
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'graphql_get_bookings': {
        const { userId, hotelId, status, limit = 20, offset = 0 } = args;
        const query = gql`
          query GetBookings($userId: Int, $hotelId: String, $status: String, $limit: Int, $offset: Int) {
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
          }
        `;

        const result = await client.query({
          query,
          variables: { userId, hotelId, status, limit, offset }
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'graphql_get_users': {
        const { role, bonvoyStatus, limit = 20, offset = 0 } = args;
        const query = gql`
          query GetUsers($role: String, $bonvoyStatus: String, $limit: Int, $offset: Int) {
            users(role: $role, bonvoyStatus: $bonvoyStatus, limit: $limit, offset: $offset) {
              id
              name
              email
              role
              bonvoyNumber
              bonvoyPoints
              bonvoyStatus
              createdAt
              updatedAt
              bookings {
                id
                hotelId
                checkIn
                checkOut
                totalPrice
                status
              }
              reviews {
                id
                hotelId
                rating
                comment
              }
            }
          }
        `;

        const result = await client.query({
          query,
          variables: { role, bonvoyStatus, limit, offset }
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'graphql_get_analytics': {
        const { type, hotelId, startDate, endDate, limit = 50 } = args;
        
        let query;
        let variables: any = {};

        switch (type) {
          case 'hotel':
            query = gql`
              query GetHotelAnalytics($hotelId: String!) {
                hotelAnalytics(hotelId: $hotelId) {
                  hotelId
                  totalBookings
                  averageRating
                  totalRevenue
                  occupancyRate
                  popularAmenities
                }
              }
            `;
            variables = { hotelId };
            break;

          case 'booking':
            query = gql`
              query GetBookingAnalytics($startDate: DateTime, $endDate: DateTime) {
                bookingAnalytics(startDate: $startDate, endDate: $endDate) {
                  totalBookings
                  totalRevenue
                  averageBookingValue
                  topHotels {
                    hotelId
                    hotelName
                    totalBookings
                    totalRevenue
                  }
                  bookingTrends {
                    date
                    bookings
                    revenue
                  }
                }
              }
            `;
            variables = { startDate, endDate };
            break;

          case 'revenue':
            query = gql`
              query GetRevenueAnalytics($startDate: DateTime, $endDate: DateTime) {
                bookingAnalytics(startDate: $startDate, endDate: $endDate) {
                  totalRevenue
                  averageBookingValue
                  bookingTrends {
                    date
                    revenue
                    bookings
                  }
                  topHotels {
                    hotelId
                    hotelName
                    totalRevenue
                    totalBookings
                  }
                }
              }
            `;
            variables = { startDate, endDate };
            break;

          case 'user-behavior':
            query = gql`
              query GetUserBehaviorAnalytics($limit: Int) {
                users(limit: $limit) {
                  id
                  name
                  bonvoyPoints
                  bonvoyStatus
                  bookings {
                    id
                    totalPrice
                    status
                    createdAt
                    hotel {
                      name
                      location
                      rating
                    }
                  }
                  reviews {
                    id
                    rating
                    comment
                    createdAt
                    hotel {
                      name
                      location
                    }
                  }
                }
              }
            `;
            variables = { limit };
            break;

          default:
            throw new Error(`Unknown analytics type: ${type}`);
        }

        const result = await client.query({
          query,
          variables
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logger.error(`Error executing tool ${name}:`, error);
    throw error;
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

logger.info('Apollo MCP Server started'); 
# Apollo MCP Integration

## Overview

The Apollo MCP (Model Context Protocol) integration provides AI-powered GraphQL operations and introspection capabilities for the Marriott Hotels application. This integration enables AI agents to interact with our GraphQL API through a standardized MCP server interface.

## Features

- **AI-Powered GraphQL Operations**: Pre-defined GraphQL operations for common hotel booking tasks
- **Schema Introspection**: Real-time access to GraphQL schema information
- **Interactive Playground**: Built-in GraphQL playground for testing operations
- **Analytics Dashboard**: Comprehensive analytics and performance monitoring
- **Real-time Monitoring**: System metrics, performance tracking, and alerting
- **Log Management**: Advanced log viewing, filtering, and search capabilities

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Agent      │    │   Apollo MCP    │    │   GraphQL API   │
│                 │◄──►│     Server      │◄──►│                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Admin UI      │
                       │   Dashboard     │
                       └─────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the MCP Server

```bash
# Development mode
npm run mcp:dev

# Production mode
npm run mcp:build
npm run mcp:start
```

### 3. Access the Admin Interface

Navigate to `/admin/apollo-mcp` in your browser to access the MCP dashboard.

## MCP Server Configuration

The MCP server is configured through `mcp/config/mcp-config.json`:

```json
{
  "server": {
    "port": 5000,
    "host": "localhost",
    "transport": "sse"
  },
  "graphql": {
    "endpoint": "http://localhost:4000/graphql",
    "schema": "./mcp/schema.graphql",
    "introspection": true
  }
}
```

## Available Operations

### Hotel Search Operations

- **SearchHotels**: Search for hotels with filtering and pagination
- **GetHotelDetails**: Get detailed hotel information
- **GetHotelRooms**: Get available rooms for a hotel

### Booking Management

- **GetBookings**: Retrieve booking information with filtering
- **CreateBooking**: Create new bookings
- **UpdateBooking**: Update existing bookings
- **CancelBooking**: Cancel bookings

### User Management

- **GetUsers**: Retrieve user information
- **GetUserProfile**: Get detailed user profiles
- **UpdateUser**: Update user information

### Analytics

- **GetHotelAnalytics**: Hotel performance metrics
- **GetBookingAnalytics**: Booking trends and analytics
- **GetUserAnalytics**: User behavior analytics

## Admin Interface

### Dashboard (`/admin/apollo-mcp`)

- Server status and health metrics
- Recent operations and performance stats
- Quick access to all MCP features

### Operations (`/admin/apollo-mcp/operations`)

- View and manage GraphQL operations
- Execute operations with custom variables
- Monitor operation performance and success rates

### Schema (`/admin/apollo-mcp/schema`)

- Interactive GraphQL schema browser
- Type definitions and field information
- Schema validation and documentation

### Playground (`/admin/apollo-mcp/playground`)

- Interactive GraphQL playground
- Query execution with real-time results
- Query history and saved queries

### Analytics (`/admin/apollo-mcp/analytics`)

- Performance metrics and trends
- Operation usage statistics
- Error rates and response times

### Monitoring (`/admin/apollo-mcp/monitoring`)

- Real-time system metrics
- Performance monitoring
- Alert management

### Logs (`/admin/apollo-mcp/logs`)

- Comprehensive log viewing
- Advanced filtering and search
- Log export capabilities

## GraphQL Schema

The MCP server exposes the following main types:

### Core Types

- **User**: User accounts with Bonvoy integration
- **Hotel**: Hotel properties with rooms and amenities
- **Room**: Available rooms with pricing and availability
- **Booking**: Booking information and status
- **Review**: User reviews and ratings

### Query Operations

```graphql
query SearchHotels($location: String, $rating: Float) {
  hotels(location: $location, rating: $rating) {
    id
    name
    location
    rating
    amenities {
      name
      category
    }
    rooms {
      type
      price
      available
    }
  }
}
```

### Mutation Operations

```graphql
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    status
    totalPrice
    user {
      name
      email
    }
    hotel {
      name
      location
    }
  }
}
```

## AI Integration

The MCP server provides AI agents with:

1. **Structured Data Access**: Pre-defined operations for common tasks
2. **Schema Awareness**: Full GraphQL schema introspection
3. **Context Optimization**: Efficient data fetching with minimal noise
4. **Error Handling**: Comprehensive error reporting and recovery

### Example AI Agent Usage

```typescript
// AI agent can use MCP tools to:
// 1. Search for hotels in a specific location
// 2. Get room availability and pricing
// 3. Create bookings for users
// 4. Retrieve booking history
// 5. Access user preferences and Bonvoy status
```

## Development

### Adding New Operations

1. Create a new GraphQL operation file in `mcp/operations/`
2. Update the MCP server to include the new operation
3. Add corresponding UI components in the admin interface

### Customizing the Schema

1. Modify `mcp/schema.graphql` to add new types or fields
2. Update the main GraphQL schema in `src/graphql/schema.ts`
3. Regenerate the MCP server configuration

### Testing

```bash
# Test the MCP server
npm run mcp:dev

# Test GraphQL operations
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { hotels { id name } }"}'
```

## Monitoring and Logging

### Metrics

- **Response Time**: Average, P95, P99 response times
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **System Resources**: CPU, memory, disk usage

### Alerts

- High memory usage (>80%)
- Database connection issues
- Slow query performance (>1s)
- High error rates (>5%)

### Log Levels

- **DEBUG**: Detailed debugging information
- **INFO**: General operational information
- **WARN**: Warning conditions
- **ERROR**: Error conditions
- **FATAL**: Critical system failures

## Security

### Authentication

- JWT-based authentication for admin interface
- API key authentication for MCP server
- Role-based access control

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting

## Troubleshooting

### Common Issues

1. **MCP Server Not Starting**
   - Check port availability
   - Verify GraphQL endpoint is accessible
   - Check configuration file syntax

2. **GraphQL Operations Failing**
   - Verify schema compatibility
   - Check authentication tokens
   - Review error logs

3. **Performance Issues**
   - Monitor system resources
   - Check database connection pool
   - Review query optimization

### Debug Mode

Enable debug logging by setting the log level to "debug" in the MCP configuration:

```json
{
  "logging": {
    "level": "debug"
  }
}
```

## Contributing

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation for any changes
4. Ensure backward compatibility

## License

This integration is part of the Marriott Hotels application and follows the same licensing terms.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the logs in the admin interface
3. Contact the development team
4. Create an issue in the project repository 
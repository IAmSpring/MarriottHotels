# Performance Testing Documentation

## Overview
This document outlines the performance testing strategy for the Marriott Hotels platform, focusing on response times, scalability, and resource utilization across all system components.

## Table of Contents
- [Performance Testing Strategy](#performance-testing-strategy)
- [Load Testing](#load-testing)
- [Stress Testing](#stress-testing)
- [Endurance Testing](#endurance-testing)
- [AI Performance Testing](#ai-performance-testing)
- [Monitoring and Analysis](#monitoring-and-analysis)

## Performance Testing Strategy

### Key Performance Indicators (KPIs)
1. Response Time
   - API endpoints: < 200ms
   - Page load: < 2s
   - AI responses: < 1s
2. Throughput
   - API: 1000 requests/second
   - Database: 5000 transactions/second
3. Error Rate
   - < 0.1% under normal load
   - < 1% under peak load
4. Resource Utilization
   - CPU: < 70%
   - Memory: < 80%
   - Network: < 60%

### Testing Tools
- k6 for load testing
- Apache JMeter for stress testing
- Grafana for monitoring
- Prometheus for metrics collection
- New Relic for APM

## Load Testing

### Test Scenarios

1. Normal Load
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30m',
};

export default function () {
  const res = http.get('https://api.marriott.com/v1/rooms');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

2. Peak Load
```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '10m', target: 500 },
    { duration: '5m', target: 1000 },
    { duration: '5m', target: 0 },
  ],
};
```

### API Endpoints Testing
- Room search
- Booking creation
- Payment processing
- User authentication
- AI chat endpoints

## Stress Testing

### Test Scenarios

1. Spike Testing
```javascript
export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '1m', target: 2000 },
    { duration: '1m', target: 100 },
  ],
};
```

2. Breakpoint Testing
```javascript
export const options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '5m', target: 500 },
    { duration: '5m', target: 1000 },
    { duration: '5m', target: 2000 },
    { duration: '5m', target: 3000 },
  ],
};
```

## Endurance Testing

### Long-Running Tests
```javascript
export const options = {
  vus: 100,
  duration: '24h',
};

export default function () {
  // Simulate real user behavior
  group('User Flow', () => {
    // Search rooms
    let searchRes = http.get('https://api.marriott.com/v1/rooms/search');
    check(searchRes, { 'search successful': (r) => r.status === 200 });
    sleep(random(1, 5));

    // View room details
    let roomRes = http.get('https://api.marriott.com/v1/rooms/1');
    check(roomRes, { 'room details loaded': (r) => r.status === 200 });
    sleep(random(2, 8));

    // Make booking
    let bookingRes = http.post('https://api.marriott.com/v1/bookings');
    check(bookingRes, { 'booking successful': (r) => r.status === 201 });
  });
}
```

## AI Performance Testing

### Chatbot Performance
```javascript
export default function () {
  const payload = {
    message: 'I want to book a room for tomorrow',
    userId: 'test-user',
  };

  const res = http.post('https://api.marriott.com/v1/chat', JSON.stringify(payload));
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
    'valid response': (r) => r.json('intent') === 'ROOM_BOOKING',
  });
}
```

### Voice Processing Performance
```javascript
export default function () {
  const audioData = open('./test-audio.wav', 'b');
  
  const res = http.post('https://api.marriott.com/v1/voice', audioData);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'processing time < 2s': (r) => r.timings.duration < 2000,
    'transcription present': (r) => r.json('transcription') !== null,
  });
}
```

## Monitoring and Analysis

### Metrics Collection
```yaml
scrape_configs:
  - job_name: 'marriott_api'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['api:8080']
    
  - job_name: 'marriott_ai'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['ai-service:8081']
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "http_request_duration_seconds"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

## Performance Optimization

### Common Issues and Solutions

1. Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_bookings_date ON bookings(check_in_date);
CREATE INDEX idx_rooms_availability ON rooms(is_available);
```

2. Caching Strategy
```typescript
// Redis caching for room availability
const getRoomAvailability = async (roomId: string) => {
  const cached = await redis.get(`room:${roomId}`);
  if (cached) return JSON.parse(cached);
  
  const room = await db.rooms.findUnique({ where: { id: roomId } });
  await redis.set(`room:${roomId}`, JSON.stringify(room), 'EX', 300);
  
  return room;
};
```

3. API Optimization
```typescript
// Implement pagination
app.get('/api/rooms', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const rooms = await db.rooms.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
  res.json(rooms);
});
```

## Best Practices

1. **Regular Testing**: Schedule performance tests weekly
2. **Baseline Metrics**: Maintain historical performance data
3. **Alert Thresholds**: Set up alerts for performance degradation
4. **Documentation**: Keep test scenarios and results documented
5. **Continuous Improvement**: Regular review and optimization

## Troubleshooting Guide

Common performance issues:
1. High latency
2. Memory leaks
3. CPU bottlenecks
4. Network congestion
5. Database slowdown

## Maintenance

Regular tasks:
1. Update test scenarios
2. Review and adjust thresholds
3. Optimize test scripts
4. Update monitoring dashboards
5. Review and act on performance trends
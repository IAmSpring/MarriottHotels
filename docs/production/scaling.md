# Production Scaling Strategy

## Overview
This document outlines the scaling strategy for the Marriott Hotels platform in production, covering horizontal scaling, load balancing, database scaling, and performance optimization.

## Table of Contents
- [Horizontal Scaling](#horizontal-scaling)
- [Load Balancing](#load-balancing)
- [Database Scaling](#database-scaling)
- [Caching Strategy](#caching-strategy)
- [Auto Scaling](#auto-scaling)
- [Performance Monitoring](#performance-monitoring)

## Horizontal Scaling

### Application Server Scaling
```yaml
# Docker Compose for multiple instances
version: '3.8'
services:
  app:
    image: marriott-hotels:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - redis
      - postgres
```

### Load Balancer Configuration
```nginx
# Nginx load balancer configuration
upstream marriott_backend {
    least_conn;
    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
    server app3:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    server_name marriott.com;
    
    location / {
        proxy_pass http://marriott_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Load Balancing

### Load Balancer Types
- **Application Load Balancer (ALB)**: For HTTP/HTTPS traffic
- **Network Load Balancer (NLB)**: For TCP/UDP traffic
- **Classic Load Balancer (CLB)**: Legacy load balancer

### Health Checks
```yaml
# Health check configuration
health_checks:
  path: /health
  port: 3000
  protocol: HTTP
  interval: 30s
  timeout: 5s
  healthy_threshold: 2
  unhealthy_threshold: 3
```

### Session Affinity
```typescript
// Session affinity configuration
const sessionAffinity = {
  enabled: true,
  method: 'cookie', // or 'ip'
  cookieName: 'marriott_session',
  maxAge: 3600 // 1 hour
};
```

## Database Scaling

### Read Replicas
```sql
-- Primary database for writes
INSERT INTO bookings (user_id, hotel_id, check_in, check_out)
VALUES ('user123', 'hotel456', '2024-01-01', '2024-01-03');

-- Read replica for queries
SELECT * FROM hotels WHERE city = 'New York';
```

### Database Sharding
```typescript
// Sharding configuration
const shardingConfig = {
  shards: [
    { id: 'shard1', range: { min: 0, max: 1000000 } },
    { id: 'shard2', range: { min: 1000001, max: 2000000 } },
    { id: 'shard3', range: { min: 2000001, max: 3000000 } }
  ],
  shardKey: 'user_id'
};

// Shard selection
const getShard = (userId: string) => {
  const hash = hashUserId(userId);
  return shardingConfig.shards.find(shard => 
    hash >= shard.range.min && hash <= shard.range.max
  );
};
```

### Connection Pooling
```typescript
// Database connection pool
const dbPool = {
  min: 5,
  max: 20,
  acquire: 30000,
  idle: 10000,
  evict: 60000
};
```

## Caching Strategy

### Redis Cluster Configuration
```typescript
// Redis cluster setup
const Redis = require('ioredis');

const cluster = new Redis.Cluster([
  {
    port: 6380,
    host: 'redis-node-1'
  },
  {
    port: 6380,
    host: 'redis-node-2'
  },
  {
    port: 6380,
    host: 'redis-node-3'
  }
]);
```

### Multi-Level Caching
```typescript
// Cache hierarchy
const cacheStrategy = {
  browser: {
    static: true,
    api: true,
    ttl: 3600
  },
  cdn: {
    static: true,
    dynamic: true,
    ttl: 1800
  },
  application: {
    memory: true,
    redis: true,
    ttl: 300
  },
  database: {
    query: true,
    results: true,
    ttl: 60
  }
};
```

## Auto Scaling

### Application Auto Scaling
```yaml
# Auto scaling configuration
auto_scaling:
  min_capacity: 2
  max_capacity: 10
  target_tracking:
    target_value: 70
    scale_in_cooldown: 300
    scale_out_cooldown: 60
  metrics:
    - cpu_utilization
    - memory_utilization
    - request_count
```

### Database Auto Scaling
```yaml
# RDS auto scaling
rds_scaling:
  cpu_utilization_threshold: 75
  connections_threshold: 5000
  storage_threshold: 80
  min_capacity: 2
  max_capacity: 16
```

## Performance Monitoring

### Metrics Collection
```typescript
// Performance metrics
const performanceMetrics = {
  response_time: {
    p50: '100ms',
    p95: '200ms',
    p99: '500ms'
  },
  throughput: {
    requests_per_second: 1000,
    concurrent_users: 100
  },
  resource_usage: {
    cpu: '80%',
    memory: '85%',
    disk: '70%'
  }
};
```

### Alert Rules
```yaml
# Prometheus alert rules
groups:
- name: scaling-alerts
  rules:
  - alert: HighCPUUsage
    expr: cpu_usage > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High CPU usage detected
      
  - alert: HighMemoryUsage
    expr: memory_usage > 85
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High memory usage detected
```

### Load Testing
```typescript
// Load testing configuration
const loadTestConfig = {
  scenarios: [
    {
      name: 'normal_load',
      duration: '10m',
      arrival_rate: 100,
      ramp_to: 500
    },
    {
      name: 'peak_load',
      duration: '5m',
      arrival_rate: 1000,
      ramp_to: 2000
    }
  ],
  thresholds: {
    response_time: { p95: 200 },
    error_rate: { max: 1 },
    throughput: { min: 1000 }
  }
};
```

## Best Practices

### 1. Horizontal Scaling
- Use stateless application design
- Implement proper session management
- Use external storage for sessions
- Implement health checks

### 2. Database Scaling
- Use read replicas for read-heavy workloads
- Implement proper connection pooling
- Use database sharding for large datasets
- Monitor query performance

### 3. Caching Strategy
- Implement multi-level caching
- Use appropriate cache invalidation
- Monitor cache hit ratios
- Implement cache warming

### 4. Monitoring and Alerting
- Set up comprehensive monitoring
- Implement proper alerting
- Use distributed tracing
- Monitor business metrics

## Implementation Checklist

- [ ] Set up load balancer
- [ ] Configure auto scaling
- [ ] Implement caching strategy
- [ ] Set up database scaling
- [ ] Configure monitoring
- [ ] Implement health checks
- [ ] Set up alerting
- [ ] Perform load testing
- [ ] Document procedures
- [ ] Train operations team 
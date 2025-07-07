# DevOps Monitoring and Observability

This document outlines the comprehensive monitoring and observability strategy implemented for the Marriott Hotels platform, covering infrastructure, application, and business metrics.

## Table of Contents

- [Monitoring Overview](#monitoring-overview)
- [Infrastructure Monitoring](#infrastructure-monitoring)
- [Application Monitoring](#application-monitoring)
- [AI Service Monitoring](#ai-service-monitoring)
- [Log Management](#log-management)
- [Alerting Strategy](#alerting-strategy)
- [Dashboard Configuration](#dashboard-configuration)
- [Incident Response](#incident-response)

## Monitoring Overview

The monitoring strategy is built on a multi-layered approach that provides comprehensive visibility into system health, performance, and user experience.

### Monitoring Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Infrastructure│    │   Application   │    │   Business      │
│   Monitoring    │    │   Monitoring    │    │   Monitoring    │
│   (CPU, Memory) │    │   (APM, Errors)│    │   (KPIs, UX)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Metrics       │    │   Logs          │    │   Traces        │
│   Collection    │    │   Aggregation   │    │   Distributed   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Alerting      │    │   Dashboards    │    │   Incident      │
│   Engine        │    │   Visualization │    │   Management    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Monitoring Principles

1. **Proactive Monitoring**: Detect issues before they impact users
2. **Comprehensive Coverage**: Monitor all system components
3. **Real-time Visibility**: Provide immediate insights into system health
4. **Actionable Alerts**: Ensure alerts lead to meaningful actions
5. **Historical Analysis**: Maintain data for trend analysis and capacity planning

## Infrastructure Monitoring

### 1. Server Monitoring

Monitor server resources and performance metrics.

#### Key Metrics:
- **CPU Usage**: Track CPU utilization across all servers
- **Memory Usage**: Monitor RAM usage and swap activity
- **Disk I/O**: Track disk read/write operations
- **Network I/O**: Monitor network bandwidth usage
- **Load Average**: Track system load across time periods

#### Implementation:
```typescript
// Server monitoring configuration
const serverMonitoring = {
  metrics: {
    cpu: {
      threshold: 80, // Alert if CPU > 80%
      collection: '5s'
    },
    memory: {
      threshold: 85, // Alert if memory > 85%
      collection: '10s'
    },
    disk: {
      threshold: 90, // Alert if disk > 90%
      collection: '30s'
    }
  },
  alerts: {
    cpu_high: {
      condition: 'cpu_usage > 80%',
      duration: '5m',
      severity: 'warning'
    },
    memory_critical: {
      condition: 'memory_usage > 95%',
      duration: '2m',
      severity: 'critical'
    }
  }
};
```

### 2. Database Monitoring

Monitor database performance and health.

#### Key Metrics:
- **Connection Pool**: Track active and idle connections
- **Query Performance**: Monitor slow queries and execution times
- **Lock Contention**: Track database locks and deadlocks
- **Replication Lag**: Monitor replication delays
- **Storage Usage**: Track database size and growth

#### Implementation:
```typescript
// Database monitoring
const dbMonitoring = {
  postgres: {
    metrics: [
      'pg_stat_database',
      'pg_stat_bgwriter',
      'pg_stat_user_tables',
      'pg_stat_user_indexes'
    ],
    queries: {
      slow_query_threshold: 1000, // ms
      connection_pool_size: 20,
      max_connections: 100
    }
  },
  alerts: {
    slow_queries: {
      condition: 'query_time > 1000ms',
      severity: 'warning'
    },
    connection_exhaustion: {
      condition: 'active_connections > 90%',
      severity: 'critical'
    }
  }
};
```

### 3. Network Monitoring

Monitor network infrastructure and connectivity.

#### Key Metrics:
- **Bandwidth Usage**: Track network throughput
- **Latency**: Monitor response times
- **Packet Loss**: Track dropped packets
- **DNS Resolution**: Monitor DNS query performance
- **SSL Certificate**: Track certificate expiration

#### Implementation:
```typescript
// Network monitoring
const networkMonitoring = {
  endpoints: [
    'api.marriott.com',
    'cdn.marriott.com',
    'database.marriott.com'
  ],
  checks: {
    http: {
      interval: '30s',
      timeout: '10s',
      expected_status: [200, 301, 302]
    },
    tcp: {
      interval: '60s',
      timeout: '5s'
    },
    dns: {
      interval: '300s',
      timeout: '5s'
    }
  },
  alerts: {
    endpoint_down: {
      condition: 'response_time > 10s OR status != 200',
      duration: '2m',
      severity: 'critical'
    }
  }
};
```

## Application Monitoring

### 1. Application Performance Monitoring (APM)

Monitor application performance and user experience.

#### Key Metrics:
- **Response Time**: Track API response times
- **Throughput**: Monitor requests per second
- **Error Rate**: Track application errors
- **User Experience**: Monitor Core Web Vitals
- **Business Transactions**: Track key user journeys

#### Implementation:
```typescript
// APM configuration
const apmConfig = {
  service: 'marriott-hotels-frontend',
  environment: process.env.NODE_ENV,
  serverUrl: process.env.APM_SERVER_URL,
  logLevel: 'info',
  captureBody: 'off',
  captureHeaders: false,
  metrics: {
    transactionSampleRate: 1.0,
    errorSampleRate: 1.0
  }
};

// Performance monitoring
const performanceMonitor = {
  trackTransaction: (name, duration, result) => {
    // Track business transactions
    apm.startTransaction(name);
    apm.setTransactionResult(result);
    apm.endTransaction();
  },
  
  trackError: (error, context) => {
    // Track application errors
    apm.captureError(error, {
      custom: context,
      tags: { component: 'frontend' }
    });
  }
};
```

### 2. Error Tracking

Comprehensive error tracking and analysis.

#### Error Categories:
- **JavaScript Errors**: Client-side errors
- **API Errors**: Server-side errors
- **Network Errors**: Connection failures
- **Performance Errors**: Timeout and slow responses

#### Implementation:
```typescript
// Error tracking
const errorTracker = {
  captureError: (error, context = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };
    
    // Send to error tracking service
    sendToErrorService(errorData);
  },
  
  captureUnhandledRejection: (event) => {
    errorTracker.captureError(event.reason, {
      type: 'unhandled-rejection'
    });
  }
};

// Global error handlers
window.addEventListener('error', (event) => {
  errorTracker.captureError(event.error, {
    type: 'javascript-error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorTracker.captureUnhandledRejection(event);
});
```

### 3. User Experience Monitoring

Monitor user experience and engagement metrics.

#### Key Metrics:
- **Page Load Time**: Track page load performance
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **User Engagement**: Track session duration and interactions
- **Conversion Rates**: Monitor booking completion rates
- **Error Impact**: Track errors affecting user experience

#### Implementation:
```typescript
// UX monitoring
const uxMonitor = {
  trackPageLoad: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
    };
    
    sendToAnalytics('page_load', metrics);
  },
  
  trackUserInteraction: (element, action) => {
    const interactionData = {
      element,
      action,
      timestamp: Date.now(),
      sessionId: getSessionId()
    };
    
    sendToAnalytics('user_interaction', interactionData);
  }
};
```

## AI Service Monitoring

### 1. LangSmith Integration

Monitor AI service performance and usage.

#### Key Metrics:
- **Response Time**: Track AI response times
- **Token Usage**: Monitor token consumption
- **Error Rate**: Track AI service errors
- **Tool Usage**: Monitor tool execution frequency
- **User Satisfaction**: Track user feedback

#### Implementation:
```typescript
// LangSmith monitoring
const langSmithMonitor = {
  config: {
    apiKey: process.env.LANGSMITH_API_KEY,
    project: process.env.LANGSMITH_PROJECT,
    endpoint: process.env.LANGSMITH_ENDPOINT
  },
  
  trackRun: (runData) => {
    const run = {
      name: runData.name,
      inputs: runData.inputs,
      outputs: runData.outputs,
      error: runData.error,
      startTime: runData.startTime,
      endTime: runData.endTime,
      tags: runData.tags
    };
    
    // Send to LangSmith
    sendToLangSmith(run);
  },
  
  trackToolUsage: (toolName, duration, success) => {
    const toolData = {
      tool: toolName,
      duration,
      success,
      timestamp: Date.now()
    };
    
    sendToAnalytics('tool_usage', toolData);
  }
};
```

### 2. AI Performance Metrics

Monitor AI-specific performance indicators.

#### Metrics:
- **Model Response Time**: Track GPT model response times
- **Token Efficiency**: Monitor tokens per response
- **Cache Hit Rate**: Track response caching effectiveness
- **User Satisfaction**: Monitor AI response quality
- **Cost Tracking**: Monitor API usage costs

#### Implementation:
```typescript
// AI performance monitoring
const aiPerformanceMonitor = {
  trackModelResponse: (model, inputTokens, outputTokens, duration) => {
    const metrics = {
      model,
      inputTokens,
      outputTokens,
      duration,
      cost: calculateCost(inputTokens, outputTokens, model),
      timestamp: Date.now()
    };
    
    sendToAnalytics('ai_performance', metrics);
  },
  
  trackUserFeedback: (interactionId, rating, feedback) => {
    const feedbackData = {
      interactionId,
      rating,
      feedback,
      timestamp: Date.now()
    };
    
    sendToAnalytics('ai_feedback', feedbackData);
  }
};
```

## Log Management

### 1. Centralized Logging

Implement centralized log collection and analysis.

#### Log Levels:
- **ERROR**: System errors and failures
- **WARN**: Warning conditions
- **INFO**: General information
- **DEBUG**: Detailed debugging information

#### Implementation:
```typescript
// Logging configuration
const logger = {
  error: (message, context = {}) => {
    log('ERROR', message, context);
  },
  
  warn: (message, context = {}) => {
    log('WARN', message, context);
  },
  
  info: (message, context = {}) => {
    log('INFO', message, context);
  },
  
  debug: (message, context = {}) => {
    log('DEBUG', message, context);
  }
};

const log = (level, message, context) => {
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'marriott-hotels',
    environment: process.env.NODE_ENV,
    context
  };
  
  // Send to log aggregation service
  sendToLogService(logEntry);
};
```

### 2. Log Aggregation

Centralize logs from all services for analysis.

#### Log Sources:
- **Application Logs**: Frontend and backend logs
- **System Logs**: Server and infrastructure logs
- **Access Logs**: Web server access logs
- **Error Logs**: Error tracking and monitoring logs

#### Implementation:
```typescript
// Log aggregation
const logAggregator = {
  sources: [
    'application',
    'system',
    'access',
    'error'
  ],
  
  processors: {
    parse: (logEntry) => {
      // Parse and structure log entries
      return {
        ...logEntry,
        parsed: true,
        indexed: true
      };
    },
    
    enrich: (logEntry) => {
      // Add additional context
      return {
        ...logEntry,
        hostname: process.env.HOSTNAME,
        version: process.env.APP_VERSION
      };
    }
  }
};
```

## Alerting Strategy

### 1. Alert Configuration

Configure comprehensive alerting rules.

#### Alert Severity Levels:
- **Critical**: Immediate action required
- **Warning**: Attention needed
- **Info**: Informational alerts

#### Implementation:
```typescript
// Alert configuration
const alertConfig = {
  critical: {
    response_time: '> 5s',
    error_rate: '> 5%',
    cpu_usage: '> 90%',
    memory_usage: '> 95%'
  },
  
  warning: {
    response_time: '> 2s',
    error_rate: '> 2%',
    cpu_usage: '> 80%',
    memory_usage: '> 85%'
  },
  
  info: {
    deployment: 'success',
    backup: 'completed',
    certificate: 'expiring_soon'
  }
};
```

### 2. Notification Channels

Configure multiple notification channels for alerts.

#### Channels:
- **Email**: For all severity levels
- **Slack**: For critical and warning alerts
- **SMS**: For critical alerts only
- **PagerDuty**: For critical alerts with escalation

#### Implementation:
```typescript
// Notification configuration
const notificationConfig = {
  channels: {
    email: {
      recipients: ['ops@marriott.com', 'dev@marriott.com'],
      severity: ['critical', 'warning', 'info']
    },
    slack: {
      channel: '#alerts',
      severity: ['critical', 'warning']
    },
    sms: {
      recipients: ['+1234567890'],
      severity: ['critical']
    }
  },
  
  escalation: {
    critical: {
      initial: '5m',
      escalation: '15m',
      max_escalations: 3
    }
  }
};
```

## Dashboard Configuration

### 1. Infrastructure Dashboard

Monitor infrastructure health and performance.

#### Dashboard Components:
- **Server Metrics**: CPU, memory, disk usage
- **Network Metrics**: Bandwidth, latency, packet loss
- **Database Metrics**: Connections, queries, performance
- **Application Metrics**: Response times, error rates

#### Implementation:
```typescript
// Dashboard configuration
const infrastructureDashboard = {
  panels: [
    {
      title: 'Server Health',
      metrics: ['cpu_usage', 'memory_usage', 'disk_usage'],
      type: 'graph',
      refresh: '30s'
    },
    {
      title: 'Network Performance',
      metrics: ['bandwidth', 'latency', 'packet_loss'],
      type: 'graph',
      refresh: '60s'
    },
    {
      title: 'Database Performance',
      metrics: ['connections', 'query_time', 'lock_wait'],
      type: 'graph',
      refresh: '30s'
    }
  ]
};
```

### 2. Application Dashboard

Monitor application performance and user experience.

#### Dashboard Components:
- **Performance Metrics**: Response times, throughput
- **Error Tracking**: Error rates, error types
- **User Experience**: Core Web Vitals, user engagement
- **Business Metrics**: Conversion rates, revenue

#### Implementation:
```typescript
// Application dashboard
const applicationDashboard = {
  panels: [
    {
      title: 'Performance Overview',
      metrics: ['response_time', 'throughput', 'error_rate'],
      type: 'graph',
      refresh: '30s'
    },
    {
      title: 'User Experience',
      metrics: ['lcp', 'fid', 'cls'],
      type: 'graph',
      refresh: '60s'
    },
    {
      title: 'Business Metrics',
      metrics: ['conversion_rate', 'revenue', 'bookings'],
      type: 'graph',
      refresh: '300s'
    }
  ]
};
```

### 3. AI Service Dashboard

Monitor AI service performance and usage.

#### Dashboard Components:
- **AI Performance**: Response times, token usage
- **Tool Usage**: Tool execution frequency and success rates
- **User Feedback**: User satisfaction and ratings
- **Cost Tracking**: API usage and costs

#### Implementation:
```typescript
// AI dashboard
const aiDashboard = {
  panels: [
    {
      title: 'AI Performance',
      metrics: ['response_time', 'token_usage', 'error_rate'],
      type: 'graph',
      refresh: '30s'
    },
    {
      title: 'Tool Usage',
      metrics: ['hotel_search', 'availability_check', 'local_attractions'],
      type: 'graph',
      refresh: '60s'
    },
    {
      title: 'User Feedback',
      metrics: ['satisfaction_score', 'rating_distribution'],
      type: 'graph',
      refresh: '300s'
    }
  ]
};
```

## Incident Response

### 1. Incident Classification

Classify incidents by severity and impact.

#### Incident Levels:
- **P0**: Critical - System down, immediate action required
- **P1**: High - Major functionality affected
- **P2**: Medium - Minor functionality affected
- **P3**: Low - Cosmetic or minor issues

#### Implementation:
```typescript
// Incident classification
const incidentClassification = {
  p0: {
    criteria: ['system_down', 'data_loss', 'security_breach'],
    response_time: '5m',
    escalation: 'immediate'
  },
  
  p1: {
    criteria: ['major_functionality_down', 'performance_degradation'],
    response_time: '15m',
    escalation: '30m'
  },
  
  p2: {
    criteria: ['minor_functionality_affected', 'ui_issues'],
    response_time: '2h',
    escalation: '4h'
  },
  
  p3: {
    criteria: ['cosmetic_issues', 'minor_bugs'],
    response_time: '24h',
    escalation: '48h'
  }
};
```

### 2. Incident Response Process

Define clear incident response procedures.

#### Response Steps:
1. **Detection**: Automated detection and alerting
2. **Assessment**: Initial impact assessment
3. **Response**: Immediate response actions
4. **Resolution**: Problem resolution
5. **Recovery**: Service restoration
6. **Post-mortem**: Analysis and improvement

#### Implementation:
```typescript
// Incident response
const incidentResponse = {
  process: {
    detection: {
      automated: true,
      manual: true,
      escalation: '5m'
    },
    
    assessment: {
      impact_analysis: true,
      customer_impact: true,
      business_impact: true
    },
    
    response: {
      immediate_actions: [
        'isolate_affected_systems',
        'implement_workarounds',
        'notify_stakeholders'
      ],
      communication: {
        internal: 'immediate',
        external: '30m'
      }
    },
    
    resolution: {
      root_cause_analysis: true,
      fix_implementation: true,
      testing: true
    },
    
    recovery: {
      service_restoration: true,
      monitoring: true,
      validation: true
    },
    
    post_mortem: {
      analysis: 'within_24h',
      documentation: 'within_48h',
      action_items: 'within_week'
    }
  }
};
```

### 3. Communication Plan

Define communication procedures for incidents.

#### Communication Channels:
- **Internal**: Team notifications and updates
- **External**: Customer communications
- **Stakeholders**: Management and business updates
- **Public**: Status page updates

#### Implementation:
```typescript
// Communication plan
const communicationPlan = {
  channels: {
    internal: {
      slack: '#incidents',
      email: 'incidents@marriott.com',
      phone: 'emergency_contact'
    },
    
    external: {
      status_page: 'status.marriott.com',
      email: 'support@marriott.com',
      social_media: '@marriott_support'
    }
  },
  
  templates: {
    initial_notification: {
      subject: 'Incident Detected - {service}',
      body: 'We have detected an issue with {service}. We are investigating and will provide updates.'
    },
    
    update_notification: {
      subject: 'Incident Update - {service}',
      body: 'Update on the {service} incident: {status}'
    },
    
    resolution_notification: {
      subject: 'Incident Resolved - {service}',
      body: 'The {service} incident has been resolved. We apologize for any inconvenience.'
    }
  }
};
``` 
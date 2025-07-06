import { MetricDefinition } from '../types/metrics';

export const MONITORING_CONFIG = {
  // Prometheus configuration
  prometheus: {
    defaultBuckets: [0.1, 0.5, 1, 2, 5],
    scrapeInterval: '15s',
    retentionPeriod: '15d',
    metrics: {
      http: {
        requestsTotal: {
          name: 'http_requests_total',
          help: 'Total number of HTTP requests',
          type: 'counter',
          labelNames: ['method', 'path', 'status']
        },
        requestDuration: {
          name: 'http_request_duration_seconds',
          help: 'HTTP request duration in seconds',
          type: 'histogram',
          labelNames: ['method', 'path'],
          buckets: [0.1, 0.5, 1, 2, 5]
        }
      },
      business: {
        bookingsTotal: {
          name: 'bookings_total',
          help: 'Total number of bookings',
          type: 'counter',
          labelNames: ['hotel', 'room_type']
        },
        revenueTotal: {
          name: 'revenue_total',
          help: 'Total revenue in USD',
          type: 'counter',
          labelNames: ['hotel', 'category']
        }
      },
      ai: {
        requestsTotal: {
          name: 'ai_requests_total',
          help: 'Total number of AI requests',
          type: 'counter',
          labelNames: ['model', 'type']
        },
        latency: {
          name: 'ai_request_duration_seconds',
          help: 'AI request duration in seconds',
          type: 'histogram',
          labelNames: ['model', 'type'],
          buckets: [0.1, 0.5, 1, 2, 5, 10]
        }
      }
    } as Record<string, Record<string, MetricDefinition>>
  },

  // PostHog configuration
  posthog: {
    // Event names
    events: {
      pageView: 'page_view',
      booking: 'booking_completed',
      search: 'search_performed',
      aiInteraction: 'ai_interaction',
      error: 'error_occurred',
      login: 'user_login',
      signup: 'user_signup'
    },
    // Properties to capture
    properties: {
      user: ['id', 'type', 'membership_level'],
      booking: ['hotel_id', 'room_type', 'price', 'duration'],
      search: ['query', 'filters', 'results_count'],
      ai: ['query_type', 'response_time', 'success']
    }
  },

  // Logging configuration
  logging: {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    },
    // Categories for structured logging
    categories: {
      http: 'HTTP',
      auth: 'Authentication',
      booking: 'Booking',
      ai: 'AI',
      payment: 'Payment',
      system: 'System'
    },
    // Metadata fields to include
    metadata: {
      common: ['timestamp', 'level', 'category'],
      http: ['method', 'path', 'status', 'duration'],
      error: ['message', 'stack', 'code'],
      user: ['id', 'type', 'ip']
    }
  }
}; 
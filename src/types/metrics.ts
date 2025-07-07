// Conditionally import prom-client types only on server side
let Counter: any = null;
let Histogram: any = null;
let Gauge: any = null;

if (typeof window === 'undefined') {
  // Server-side only
  try {
    const promClient = require('prom-client');
    Counter = promClient.Counter;
    Histogram = promClient.Histogram;
    Gauge = promClient.Gauge;
  } catch (error) {
    console.warn('prom-client types not available in this environment');
  }
}

export interface MetricEvent {
  name: string;
  value?: number;
  labels?: Record<string, string | number>;
  timestamp?: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  latency: number;
  errorRate: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  sessionDuration: number;
}

export interface BusinessMetrics {
  bookings: number;
  revenue: number;
  conversionRate: number;
}

export interface MetricOptions {
  prometheusMetric?: any; // Using any to avoid type issues
  prometheusLabels?: Record<string, string | number>;
  postHogProperties?: Record<string, any>;
  logLevel?: 'info' | 'warn' | 'error';
}

export type MetricType = 'counter' | 'histogram' | 'gauge';

export interface MetricDefinition {
  name: string;
  help: string;
  type: MetricType;
  labelNames?: string[];
  buckets?: number[]; // for histograms
} 
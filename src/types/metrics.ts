import { Counter, Histogram, Gauge } from 'prom-client';

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
  prometheusMetric?: Counter | Histogram | Gauge;
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
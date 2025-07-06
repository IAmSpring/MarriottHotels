import { Registry, Gauge, Counter, Histogram } from 'prom-client';
import { logger } from './logger';

const registry = new Registry();

type MetricType = 'counter' | 'gauge' | 'histogram';
type LabelValues = Record<string, string | number>;

class MetricsManager {
  private metrics: Map<string, Gauge<string> | Counter<string> | Histogram<string>>;

  constructor() {
    this.metrics = new Map();
  }

  createMetric(name: string, help: string, type: MetricType, labelNames: string[] = []) {
    try {
      let metric;
      switch (type) {
        case 'counter':
          metric = new Counter({ name, help, labelNames });
          break;
        case 'gauge':
          metric = new Gauge({ name, help, labelNames });
          break;
        case 'histogram':
          metric = new Histogram({ name, help, labelNames });
          break;
        default:
          throw new Error(`Unknown metric type: ${type}`);
      }
      
      registry.registerMetric(metric);
      this.metrics.set(name, metric);
      return metric;
    } catch (error) {
      logger.error(`Error creating metric ${name}:`, error);
      throw error;
    }
  }

  recordMetric(name: string, value: number | LabelValues) {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`Metric ${name} not found`);
      return;
    }

    try {
      if (typeof value === 'number') {
        if (metric instanceof Counter) {
          metric.inc(value);
        } else if (metric instanceof Gauge) {
          metric.set(value);
        } else if (metric instanceof Histogram) {
          metric.observe(value);
        }
      } else {
        const labels = Object.keys(value).reduce((acc, key) => {
          if (typeof value[key] === 'string') {
            acc[key] = value[key] as string;
          }
          return acc;
        }, {} as Record<string, string>);

        const numericValue = Object.values(value).find(v => typeof v === 'number') as number;
        
        if (metric instanceof Counter) {
          metric.inc(labels, numericValue);
        } else if (metric instanceof Gauge) {
          metric.set(labels, numericValue);
        }
      }
    } catch (error) {
      logger.error(`Error recording metric ${name}:`, error);
    }
  }

  getMetricValue(name: string) {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`Metric ${name} not found`);
      return null;
    }
    return metric.get();
  }

  getAllMetrics() {
    return registry.metrics();
  }
}

export const metricsManager = new MetricsManager();
export default metricsManager; 
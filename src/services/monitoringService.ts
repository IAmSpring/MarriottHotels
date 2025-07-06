import { register } from 'prom-client';
import posthog from 'posthog-js';
import logger from '../lib/logger';
import { SystemMetrics, UserMetrics, BusinessMetrics } from '../types/metrics';

class MonitoringService {
  // Fetch system metrics from Prometheus
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const metrics = await register.getMetricsAsJSON();
      
      // Extract and process metrics
      const cpuMetric = metrics.find(m => m.name === 'system_cpu_usage');
      const memoryMetric = metrics.find(m => m.name === 'system_memory_usage_bytes');
      const latencyMetric = metrics.find(m => m.name === 'http_request_duration_seconds');
      const errorMetric = metrics.find(m => m.name === 'http_requests_total');

      // Calculate error rate
      const totalErrors = errorMetric?.values.reduce((acc, val) => {
        if (val.labels?.status?.startsWith('5')) {
          return acc + (val.value as number);
        }
        return acc;
      }, 0) || 0;

      const totalRequests = errorMetric?.values.reduce((acc, val) => {
        return acc + (val.value as number);
      }, 0) || 1; // Avoid division by zero

      return {
        cpu: cpuMetric?.values[0]?.value as number || 0,
        memory: memoryMetric?.values[0]?.value as number || 0,
        latency: latencyMetric?.values[0]?.value as number || 0,
        errorRate: (totalErrors / totalRequests) * 100
      };
    } catch (error) {
      logger.error('Failed to fetch system metrics', error as Error);
      throw error;
    }
  }

  // Fetch user metrics from PostHog
  async getUserMetrics(): Promise<UserMetrics> {
    try {
      // This would typically be a call to PostHog's API
      // For now, we'll use the client-side SDK
      const insights = await posthog.get_session_recording_properties();
      
      return {
        totalUsers: insights.total_users || 0,
        activeUsers: insights.active_users || 0,
        sessionDuration: insights.avg_session_duration || 0
      };
    } catch (error) {
      logger.error('Failed to fetch user metrics', error as Error);
      throw error;
    }
  }

  // Fetch business metrics from our database/analytics
  async getBusinessMetrics(): Promise<BusinessMetrics> {
    try {
      // This would typically be a combination of database queries
      // and analytics data. For now, we'll use mock data
      return {
        bookings: 0,
        revenue: 0,
        conversionRate: 0
      };
    } catch (error) {
      logger.error('Failed to fetch business metrics', error as Error);
      throw error;
    }
  }

  // Get all logs within a time range
  async getLogs(startTime: Date, endTime: Date, level?: string) {
    try {
      // This would typically be a call to your logging service (e.g., Logtail)
      // For now, we'll return an empty array
      return [];
    } catch (error) {
      logger.error('Failed to fetch logs', error as Error);
      throw error;
    }
  }

  // Get real-time metrics
  async getRealTimeMetrics() {
    try {
      const [systemMetrics, userMetrics, businessMetrics] = await Promise.all([
        this.getSystemMetrics(),
        this.getUserMetrics(),
        this.getBusinessMetrics()
      ]);

      return {
        system: systemMetrics,
        user: userMetrics,
        business: businessMetrics
      };
    } catch (error) {
      logger.error('Failed to fetch real-time metrics', error as Error);
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService(); 
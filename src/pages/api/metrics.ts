import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../server/logger';

// Conditionally import prom-client only on server side
let register: any = null;
let metricsManager: any = null;

if (typeof window === 'undefined') {
  // Server-side only
  try {
    const promClient = require('prom-client');
    register = promClient.register;
    
    // Import metrics manager from server
    const { metricsManager: serverMetricsManager } = await import('../../server/metrics');
    metricsManager = serverMetricsManager;
  } catch (error) {
    console.warn('prom-client not available in this environment');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // If we're in the browser or prom-client is not available, return mock data
    if (!register || typeof window !== 'undefined') {
      return res.status(200).json({
        system: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          latency: Math.random() * 1000,
          errorRate: Math.random() * 5
        },
        user: {
          totalUsers: Math.floor(Math.random() * 1000),
          activeUsers: Math.floor(Math.random() * 100),
          sessionDuration: Math.random() * 3600
        },
        business: {
          bookings: Math.floor(Math.random() * 50),
          revenue: Math.random() * 10000,
          conversionRate: Math.random() * 10
        }
      });
    }

    // Get Prometheus metrics
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

    const systemMetrics = {
      cpu: cpuMetric?.values[0]?.value as number || 0,
      memory: memoryMetric?.values[0]?.value as number || 0,
      latency: latencyMetric?.values[0]?.value as number || 0,
      errorRate: (totalErrors / totalRequests) * 100
    };

    // Mock user and business metrics for now
    const userMetrics = {
      totalUsers: Math.floor(Math.random() * 1000),
      activeUsers: Math.floor(Math.random() * 100),
      sessionDuration: Math.random() * 3600
    };

    const businessMetrics = {
      bookings: Math.floor(Math.random() * 50),
      revenue: Math.random() * 10000,
      conversionRate: Math.random() * 10
    };

    logger.info('Metrics API request processed successfully');

    return res.status(200).json({
      system: systemMetrics,
      user: userMetrics,
      business: businessMetrics
    });

  } catch (error) {
    logger.error('Metrics API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
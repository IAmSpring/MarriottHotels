import { NextApiRequest, NextApiResponse } from 'next';
import { register } from 'prom-client';
import { logger } from '../../server/logger';

// Disable automatic collection of default metrics
register.clear();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Check for metrics scraper authentication token
    const authHeader = req.headers.authorization;
    const metricsToken = process.env.METRICS_SCRAPER_TOKEN;

    if (metricsToken && authHeader !== `Bearer ${metricsToken}`) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get all registered metrics
    const metrics = await register.metrics();

    // Set Prometheus format header
    res.setHeader('Content-Type', register.contentType);
    res.status(200).send(metrics);

    logger.info('Metrics scraped successfully');
  } catch (error) {
    logger.error('Error while collecting metrics', error as Error);
    res.status(500).json({ error: 'Error collecting metrics' });
  }
} 
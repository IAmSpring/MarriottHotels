import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { metrics, trackEvent } from './lib/metrics';
import logger, { setRequestContext, clearRequestContext } from './lib/logger';
import { v4 as uuidv4 } from 'uuid';

export async function middleware(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = uuidv4();

  // Set up request context for logging
  setRequestContext({
    requestId,
    path: request.nextUrl.pathname,
    method: request.method,
  });

  try {
    // Track request in Prometheus
    metrics.httpRequestsTotal.inc({
      method: request.method,
      path: request.nextUrl.pathname,
    });

    // Create response
    const response = NextResponse.next();

    // Calculate request duration
    const duration = (Date.now() - requestStartTime) / 1000;

    // Track response metrics
    metrics.httpRequestDuration.observe(
      {
        method: request.method,
        path: request.nextUrl.pathname,
      },
      duration
    );

    // Log request completion
    logger.info('Request completed', {
      method: request.method,
      path: request.nextUrl.pathname,
      duration,
      status: response.status,
    });

    // Track in PostHog if it's a page view
    if (request.method === 'GET' && !request.nextUrl.pathname.startsWith('/api')) {
      trackEvent('pageview', {
        path: request.nextUrl.pathname,
        duration,
      });
    }

    return response;
  } catch (error) {
    // Log error
    logger.error('Request failed', error as Error, {
      method: request.method,
      path: request.nextUrl.pathname,
    });

    // Track error in Prometheus
    metrics.httpRequestsTotal.inc({
      method: request.method,
      path: request.nextUrl.pathname,
      status: '500',
    });

    // Track error in PostHog
    trackEvent('error', {
      path: request.nextUrl.pathname,
      error: (error as Error).message,
    });

    return NextResponse.error();
  } finally {
    clearRequestContext();
  }
} 
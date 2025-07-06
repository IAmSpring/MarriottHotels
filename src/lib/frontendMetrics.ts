import { logger } from './browserLogger';
import posthog from 'posthog-js';

// Initialize PostHog
export const initializeAnalytics = () => {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      persistence: 'localStorage',
      autocapture: true
    });
  } catch (error) {
    logger.error('Failed to initialize PostHog', { error });
  }
};

// Unified tracking function for frontend
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  try {
    // Track in PostHog
    posthog.capture(eventName, properties);

    // Log the event
    logger.info('Event tracked', { eventName, properties });
  } catch (error) {
    logger.error('Failed to track event', { eventName, properties, error });
  }
}; 
import { useCallback } from 'react';
import { trackEvent } from '../lib/metrics';
import { MONITORING_CONFIG } from '../config/monitoring';
import { logger } from '../lib/browserLogger';

interface TrackEventOptions {
  properties?: Record<string, any>;
  prometheusLabels?: Record<string, string | number>;
  logLevel?: 'info' | 'warn' | 'error';
}

export const useAnalytics = () => {
  const track = useCallback((eventName: string, options: TrackEventOptions = {}) => {
    const { properties, prometheusLabels, logLevel = 'info' } = options;

    try {
      // Get event configuration
      const eventConfig = MONITORING_CONFIG.posthog.events[eventName as keyof typeof MONITORING_CONFIG.posthog.events];
      
      // Track the event
      trackEvent(eventConfig || eventName, properties, {
        prometheusLabels
      });

      // Log the event
      logger[logLevel](`Analytics event: ${eventName}`, {
        event: eventName,
        properties,
        category: 'Analytics'
      });
    } catch (error) {
      logger.error('Failed to track analytics event', error as Error, {
        event: eventName,
        properties
      });
    }
  }, []);

  // Predefined tracking functions for common events
  const trackPageView = useCallback((path: string) => {
    track('page_view', {
      properties: { path }
    });
  }, [track]);

  const trackBooking = useCallback((bookingData: {
    hotelId: string;
    roomType: string;
    price: number;
    duration: number;
  }) => {
    track('booking_completed', {
      properties: bookingData,
      prometheusLabels: {
        hotel: bookingData.hotelId,
        room_type: bookingData.roomType
      }
    });
  }, [track]);

  const trackSearch = useCallback((searchData: {
    query: string;
    filters?: Record<string, any>;
    resultsCount: number;
  }) => {
    track('search_performed', {
      properties: searchData
    });
  }, [track]);

  const trackAIInteraction = useCallback((data: {
    queryType: string;
    responseTime: number;
    success: boolean;
    error?: string;
  }) => {
    track('ai_interaction', {
      properties: data,
      prometheusLabels: {
        type: data.queryType,
        success: data.success ? 1 : 0
      }
    });
  }, [track]);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    track('error_occurred', {
      properties: {
        message: error.message,
        stack: error.stack,
        ...context
      },
      logLevel: 'error'
    });
  }, [track]);

  return {
    track,
    trackPageView,
    trackBooking,
    trackSearch,
    trackAIInteraction,
    trackError
  };
}; 
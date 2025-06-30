import { useState, useCallback } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

interface UseAINavigationReturn {
  isLoading: boolean;
  error: string | null;
  explanation: string | null;
  requestNavigation: (query: string) => Promise<void>;
}

export const useAINavigation = (): UseAINavigationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const { queueActions, takeScreenshot } = useNavigation();

  const requestNavigation = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      // Take a screenshot of the current page state
      const screenshot = await takeScreenshot();

      // Send request to the AI navigation endpoint
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: query,
          currentUrl: window.location.href,
          screenshot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get navigation instructions');
      }

      const data = await response.json();
      
      // Queue the actions received from the AI
      queueActions(data.actions);
      setExplanation(data.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [queueActions, takeScreenshot]);

  return {
    isLoading,
    error,
    explanation,
    requestNavigation,
  };
}; 
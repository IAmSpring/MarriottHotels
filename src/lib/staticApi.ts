import { isStaticBuild } from './openai';

interface ApiResponse {
  ok: boolean;
  json: () => Promise<any>;
  status?: number;
}

// Static API responses
const STATIC_RESPONSES = {
  chat: {
    response: "This is a demo version running on GitHub Pages. For full functionality, please run the application locally.",
    threadId: "demo-thread"
  },
  tts: {
    audioData: "" // Empty audio data for static build
  }
};

export const fetchApi = async (endpoint: 'chat' | 'tts', options: RequestInit = {}): Promise<ApiResponse> => {
  if (isStaticBuild()) {
    // Return mock response for static build
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve(STATIC_RESPONSES[endpoint])
        });
      }, 1000);
    });
  }

  // Make actual API call for local development
  const response = await fetch(`/api/${endpoint}`, options);
  return response;
};

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  return {
    error: error instanceof Error ? error.message : 'An unexpected error occurred',
    isStatic: isStaticBuild()
  };
}; 
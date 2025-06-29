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
    audioData: "data:audio/mp3;base64," // Empty audio data for static build - prevents TTS errors
  }
};

export const fetchApi = async (endpoint: 'chat' | 'tts', options: RequestInit = {}): Promise<ApiResponse> => {
  if (isStaticBuild()) {
    // Return mock response for static build
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(STATIC_RESPONSES[endpoint])
        });
      }, 500); // Reduced delay for better UX
    });
  }

  try {
    // Make actual API call for local development
    const response = await fetch(`/api/${endpoint}`, options);
    return response;
  } catch (error) {
    // Return mock response if API call fails
    console.warn('API call failed, using static response:', error);
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve(STATIC_RESPONSES[endpoint])
    };
  }
};

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  if (isStaticBuild()) {
    return {
      error: 'This is a demo version. Some features are limited.',
      isStatic: true
    };
  }
  return {
    error: error instanceof Error ? error.message : 'An unexpected error occurred',
    isStatic: false
  };
}; 
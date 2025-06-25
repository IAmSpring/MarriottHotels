import OpenAI from 'openai';

// Singleton pattern for OpenAI client
let openaiInstance: OpenAI | null = null;

export const getOpenAIClient = (apiKey?: string): OpenAI => {
  if (!openaiInstance) {
    if (!apiKey && typeof window !== 'undefined') {
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    }
    
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: typeof window !== 'undefined'
    });
  }
  return openaiInstance;
};

// Cache for thread retrieval
const threadCache = new Map<string, { thread: any, timestamp: number }>();
const THREAD_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getThread = async (openai: OpenAI, threadId: string) => {
  const now = Date.now();
  const cached = threadCache.get(threadId);
  
  if (cached && (now - cached.timestamp) < THREAD_CACHE_DURATION) {
    return cached.thread;
  }

  const thread = await openai.beta.threads.retrieve(threadId);
  threadCache.set(threadId, { thread, timestamp: now });
  return thread;
};

// Response parsing utility
export const parseAssistantResponse = (content: any): string => {
  if (!content) return '';
  
  try {
    if (typeof content === 'string') {
      const jsonResponse = JSON.parse(content);
      return jsonResponse.response || content;
    }
    if ('text' in content && content.text.value) {
      const jsonResponse = JSON.parse(content.text.value);
      return jsonResponse.response || content.text.value;
    }
  } catch (e) {
    return typeof content === 'string' ? content : 
           'text' in content ? content.text.value : '';
  }
};

// Rate limiting utility
const rateLimiter = new Map<string, number>();
const RATE_LIMIT_DURATION = 1000; // 1 second

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const lastRequest = rateLimiter.get(userId);
  
  if (lastRequest && (now - lastRequest) < RATE_LIMIT_DURATION) {
    return false;
  }
  
  rateLimiter.set(userId, now);
  return true;
};

// Audio response caching
const audioCache = new Map<string, { audio: string, timestamp: number }>();
const AUDIO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getCachedAudioResponse = async (
  openai: OpenAI,
  text: string,
  voice: string = 'nova'
): Promise<string> => {
  const cacheKey = `${text}-${voice}`;
  const now = Date.now();
  const cached = audioCache.get(cacheKey);
  
  if (cached && (now - cached.timestamp) < AUDIO_CACHE_DURATION) {
    return cached.audio;
  }

  const speechResponse = await openai.audio.speech.create({
    model: "tts-1",
    voice,
    input: text,
  });

  const audioBuffer = await speechResponse.arrayBuffer();
  const audioBase64 = Buffer.from(audioBuffer).toString('base64');
  
  audioCache.set(cacheKey, { audio: audioBase64, timestamp: now });
  return audioBase64;
};
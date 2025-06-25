import OpenAI from 'openai';
import type { Thread } from 'openai/resources/beta/threads/threads';
import { logger } from '../utils/logger';

// Singleton pattern for OpenAI client
let openaiInstance: OpenAI | null = null;

export interface OpenAIConfig {
  apiKey: string | undefined;
  assistantId: string | undefined;
  adminId: string | undefined;
}

export const verifyOpenAIConfig = async (): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const config = getOpenAIConfig();
    
    if (!config.apiKey) {
      return { isValid: false, error: 'OpenAI API key is not configured' };
    }
    if (!config.assistantId) {
      return { isValid: false, error: 'AI Assistant ID is not configured' };
    }
    if (!config.adminId) {
      return { isValid: false, error: 'AI Admin ID is not configured' };
    }

    // Test the OpenAI connection with a simple request
    const openai = getOpenAIClient(config.apiKey);
    await openai.models.list();

    return { isValid: true };
  } catch (error) {
    logger.error('OpenAI verification failed:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown error during OpenAI verification'
    };
  }
};

export const getOpenAIConfig = (): OpenAIConfig => {
  // In the browser, use import.meta.env
  if (typeof window !== 'undefined') {
    return {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      assistantId: import.meta.env.VITE_AI_ASSISTANT_ID,
      adminId: import.meta.env.VITE_AI_ADMIN_ID
    };
  }
  
  // On the server, use process.env
  return {
    apiKey: process.env.OPENAI_API_KEY,
    assistantId: process.env.AI_ASSISTANT_ID,
    adminId: process.env.AI_ADMIN_ID
  };
};

export const getOpenAIClient = (apiKey?: string): OpenAI => {
  if (!openaiInstance) {
    // If no API key provided, try to get it from config
    if (!apiKey) {
      const config = getOpenAIConfig();
      apiKey = config.apiKey;
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

export const getThread = async (openai: OpenAI, threadId: string): Promise<OpenAI.Beta.Threads.Thread> => {
  const now = Date.now();
  const cached = threadCache.get(threadId);
  
  if (cached && (now - cached.timestamp) < THREAD_CACHE_DURATION) {
    return cached.thread;
  }

  const thread = await openai.beta.threads.retrieve(threadId);
  if (!thread) {
    throw new Error(`Thread not found: ${threadId}`);
  }
  
  threadCache.set(threadId, { thread, timestamp: now });
  return thread;
};

// Response parsing utility
export const parseAssistantResponse = (content: any): string => {
  if (!content) return '';
  
  try {
    if (typeof content === 'string') {
      const parsed = JSON.parse(content);
      return parsed.response || '';
    }
    
    if (typeof content === 'object') {
      return content.response || '';
    }
    
    return String(content);
  } catch (error) {
    console.error('Error parsing assistant response:', error);
    return '';
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

// Audio transcription utility
export const transcribeAudio = async (openai: OpenAI, audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    const response = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
    });

    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}; 
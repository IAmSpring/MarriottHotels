/// <reference types="vite/client" />

import OpenAI from 'openai';
import type { Thread } from 'openai/resources/beta/threads/threads';
import { logger } from '../server/logger';

// Singleton pattern for OpenAI client
let openaiInstance: OpenAI | null = null;

// Fallback demo credentials for static builds
const DEMO_ASSISTANT_ID = 'asst_demo123';
const DEMO_ADMIN_ID = 'admin_demo123';

export interface OpenAIConfig {
  apiKey: string | undefined;
  assistantId: string | undefined;
  adminId: string | undefined;
}

interface StaticResponses {
  tts: { audioData: string };
  chat: { response: string };
}

const MOCK_RESPONSES: StaticResponses = {
  tts: {
    audioData: '' // Empty audio data for static build
  },
  chat: {
    response: 'This is a demo version. Please run the application locally to access the full AI features.'
  }
};

export const isStaticBuild = () => {
  try {
    return import.meta.env.VITE_STATIC_BUILD === 'true' ||
           (typeof window !== 'undefined' && window.location.hostname.includes('github.io'));
  } catch {
    return false;
  }
};

export const getStaticResponse = <T extends keyof StaticResponses>(endpoint: T): StaticResponses[T] => {
  return MOCK_RESPONSES[endpoint];
};

export const verifyOpenAIConfig = async (): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // For static builds, always return valid
    if (isStaticBuild()) {
      return { isValid: true };
    }

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
  // For static builds, return demo credentials
  if (isStaticBuild()) {
    return {
      apiKey: undefined,
      assistantId: DEMO_ASSISTANT_ID,
      adminId: DEMO_ADMIN_ID
    };
  }

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
    
    if (!apiKey && !isStaticBuild()) {
      throw new Error('OpenAI API key is required');
    }

    openaiInstance = new OpenAI({
      apiKey: apiKey || 'dummy-key-for-static-build',
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

  // For static builds, return a mock thread
  if (isStaticBuild()) {
    const mockThread = {
      id: threadId,
      object: 'thread',
      created_at: now,
      metadata: { demo: true },
      tool_resources: []
    } as unknown as OpenAI.Beta.Threads.Thread;
    threadCache.set(threadId, { thread: mockThread, timestamp: now });
    return mockThread;
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

  // For static builds, return a mock audio response
  if (isStaticBuild()) {
    const mockAudio = 'MOCK_AUDIO_BASE64_FOR_DEMO';
    audioCache.set(cacheKey, { audio: mockAudio, timestamp: now });
    return mockAudio;
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
  // For static builds, return a mock transcription
  if (isStaticBuild()) {
    return 'This is a mock transcription for the demo version.';
  }

  try {
    console.log('[OpenAI Transcribe] Starting transcription process');
    console.log('[OpenAI Transcribe] Audio blob details:', {
      size: audioBlob.size,
      type: audioBlob.type
    });

    // Convert Blob to File object for OpenAI API
    const file = new File([audioBlob], 'audio.webm', { 
      type: audioBlob.type,
      lastModified: Date.now()
    });
    
    console.log('[OpenAI Transcribe] Created File object:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Verify file is not empty
    if (file.size === 0) {
      throw new Error('Audio file is empty');
    }

    // Verify file type
    if (!file.type.includes('audio/')) {
      throw new Error(`Invalid file type: ${file.type}`);
    }
    
    console.log('[OpenAI Transcribe] Sending request to OpenAI API');
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });

    if (!response) {
      throw new Error('OpenAI returned empty response');
    }

    console.log('[OpenAI Transcribe] Received response from OpenAI:', {
      responseType: typeof response,
      textLength: response.length,
      preview: response.substring(0, 100) + '...'
    });

    return response;
  } catch (error) {
    console.error('[OpenAI Transcribe] Error during transcription:', {
      error,
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing');
      }
      if (error.message.includes('file too large')) {
        throw new Error('Audio file is too large. Maximum size is 25MB');
      }
    }

    throw new Error('Failed to transcribe audio: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}; 
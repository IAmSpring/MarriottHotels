import { createRequire } from 'module';
import { logger } from './logger';
const require = createRequire(import.meta.url);

// Initialize Datadog APM with fallback
let ddTraceInitialized = false;
try {
  const tracer = require('dd-trace');
  tracer.init({
    logInjection: true,
    runtimeMetrics: true,
    profiling: true
  });
  ddTraceInitialized = true;
  logger.info('Datadog APM initialized successfully');
} catch (error) {
  logger.warn('Failed to initialize Datadog APM:', error);
}

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from '../graphql/schema.js';
import { appRouter, createContext } from '@/trpc/router';
import querystring from 'querystring';
import fs from 'fs';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OpenAIModule {
  verifyOpenAIConfig: () => Promise<{ isValid: boolean; error?: any }>;
  getOpenAIConfig: () => { apiKey?: string; assistantId?: string; adminId?: string };
}

// Dynamically import OpenAI config
let openaiModule: OpenAIModule | undefined;

try {
  openaiModule = await import('../lib/openai');
  logger.info('OpenAI module loaded successfully');
} catch (error) {
  logger.error('Failed to load OpenAI module:', error);
  if (error instanceof Error) {
    logger.error('Error details:', error.message, error.stack);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to open URL in default browser
const openInBrowser = (url: string): void => {
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${command} ${url}`, (error) => {
    if (error) {
      logger.error('Error opening browser:', error);
    }
  });
};

// Function to check if a port is in use
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.listen(startPort, () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });

    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Health check function
async function checkServices() {
  const health = {
    datadog: ddTraceInitialized,
    openai: false,
    database: false,
    redis: false
  };

  // Check OpenAI
  if (openaiModule) {
    try {
      const { isValid } = await openaiModule.verifyOpenAIConfig();
      health.openai = isValid;
    } catch (error) {
      logger.error('OpenAI health check failed:', error);
    }
  }

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.database = true;
  } catch (error) {
    logger.error('Database health check failed:', error);
  }

  return health;
}

async function main() {
  // Perform initial health checks
  const health = await checkServices();
  logger.info('Service health status:', health);

  // Create HTTP server instance
  const app = express();
  const httpServer = createServer(app);

  // Find available port
  const port = await findAvailablePort(parseInt(process.env.PORT || '3000', 10));

  // Add health check endpoint
  app.get('/health', async (req, res) => {
    const health = await checkServices();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: health
    });
  });

  // Configure query parser to use querystring instead of qs
  app.set('query parser', (str: string) => querystring.parse(str));

  // Add middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max file size
  }));

  // Configure CORS
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5173/MarriottHotels',
      'http://localhost:5173/MarriottHotels/',
      'https://studio.apollographql.com',
      'https://iamspring.github.io',
      process.env.FRONTEND_URL || 'https://iamspring.github.io'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-trpc-source',
      'apollo-require-preflight',
      'x-csrf-token'
    ],
    exposedHeaders: ['set-cookie']
  }));

  // Add security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, userId, threadId } = req.body;
      
      // Debug logging
      logger.info('Chat API request:', {
        message,
        userId,
        threadId,
        env: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set',
          AI_ASSISTANT_ID: process.env.AI_ASSISTANT_ID || process.env.VITE_AI_ASSISTANT_ID,
          AI_ADMIN_ID: process.env.AI_ADMIN_ID || process.env.VITE_AI_ADMIN_ID,
        }
      });
      
      if (!message) {
        logger.warn('Chat API: Message is required');
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!openaiModule) {
        logger.error('Chat API: OpenAI module not loaded');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      // Try both sets of environment variables
      process.env.AI_ASSISTANT_ID = process.env.AI_ASSISTANT_ID || process.env.VITE_AI_ASSISTANT_ID;
      process.env.AI_ADMIN_ID = process.env.AI_ADMIN_ID || process.env.VITE_AI_ADMIN_ID;

      const config = openaiModule.getOpenAIConfig();
      logger.info('OpenAI config:', {
        hasApiKey: !!config.apiKey,
        hasAssistantId: !!config.assistantId,
        hasAdminId: !!config.adminId
      });

      if (!config.apiKey) {
        logger.error('Chat API: OpenAI API key not configured');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      // Import the chat handler
      const { default: chatHandler } = await import('../pages/api/chat');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
        query: {},
        cookies: {},
        env: {},
        headers: {},
        url: '/api/chat'
      } as any as NextApiRequest;
      
      let responseData: any;
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      } as unknown as NextApiResponse;

      // Call the chat handler
      await chatHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('Chat API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // TTS API endpoint
  app.post('/api/tts', async (req, res) => {
    try {
      const { text } = req.body;
      
      logger.info('TTS API request:', {
        textLength: text?.length,
        env: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set'
        }
      });
      
      if (!text) {
        logger.warn('TTS API: Text is required');
        return res.status(400).json({ error: 'Text is required' });
      }

      if (!openaiModule) {
        logger.error('TTS API: OpenAI module not loaded');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      const config = openaiModule.getOpenAIConfig();
      if (!config.apiKey) {
        logger.error('TTS API: OpenAI API key not configured');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      // Import the TTS handler
      const { default: ttsHandler } = await import('../pages/api/tts');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
        query: {},
        cookies: {},
        env: {},
        headers: {},
        url: '/api/tts'
      } as any as NextApiRequest;
      
      let responseData: any;
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      } as unknown as NextApiResponse;

      // Call the TTS handler
      await ttsHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('TTS API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Metrics API endpoint
  app.get('/api/metrics', async (req, res) => {
    try {
      logger.info('Metrics API request received');
      
      // Import the metrics handler
      const { default: metricsHandler } = await import('../pages/api/metrics');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'GET',
        body: {},
        query: req.query,
        cookies: {},
        env: {},
        headers: {},
        url: '/api/metrics'
      } as any as NextApiRequest;
      
      let responseData: any;
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      } as unknown as NextApiResponse;

      // Call the metrics handler
      await metricsHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('Metrics API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Check Coherence API endpoint
  app.post('/api/check-coherence', async (req, res) => {
    try {
      logger.info('Check Coherence API request received');
      
      // Import the check-coherence handler
      const { default: coherenceHandler } = await import('../pages/api/check-coherence');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
        query: {},
        cookies: {},
        env: {},
        headers: {},
        url: '/api/check-coherence'
      } as any as NextApiRequest;
      
      let responseData: any;
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      } as unknown as NextApiResponse;

      // Call the coherence handler
      await coherenceHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('Check Coherence API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Navigation API endpoint
  app.post('/api/navigation', async (req, res) => {
    try {
      logger.info('Navigation API request received');
      
      // Import the navigation handler
      const { default: navigationHandler } = await import('../pages/api/navigation');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
        query: {},
        cookies: {},
        env: {},
        headers: {},
        url: '/api/navigation'
      } as any as NextApiRequest;
      
      let responseData: any;
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      } as unknown as NextApiResponse;

      // Call the navigation handler
      await navigationHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('Navigation API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Transcribe API endpoint
  app.post('/api/transcribe', async (req, res) => {
    try {
      logger.info('Transcribe API request received');
      
      // Import the transcribe handler
      const { default: transcribeHandler } = await import('../pages/api/transcribe');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
        query: {},
        cookies: {},
        env: {},
        headers: {},
        url: '/api/transcribe'
      } as any as NextApiRequest;
      
      let responseData: any;
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data: any) => {
          responseData = data;
          return mockRes;
        }
      } as unknown as NextApiResponse;

      // Call the transcribe handler
      await transcribeHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('Transcribe API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Add tRPC middleware
  app.use(
    '/api/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );

  // Set up Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Enable introspection in all environments
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app: app as any,
    path: '/api/graphql',
    cors: false // Already handled by express cors middleware
  });

  // Start the server
  httpServer.listen(port, () => {
    logger.info('\n🚀 Server ready:');
    logger.info(`🔌 tRPC API: http://localhost:${port}/api/trpc`);
    logger.info(`💬 Chat API: http://localhost:${port}/api/chat`);
    logger.info(`🎤 TTS API: http://localhost:${port}/api/tts`);
    logger.info(`📊 Metrics API: http://localhost:${port}/api/metrics`);
    logger.info(`🔍 Check Coherence API: http://localhost:${port}/api/check-coherence`);
    logger.info(`🧭 Navigation API: http://localhost:${port}/api/navigation`);
    logger.info(`🎵 Transcribe API: http://localhost:${port}/api/transcribe`);
    logger.info(`📝 GraphQL Playground: http://localhost:${port}/api/graphql`);
    logger.info(`🌐 Frontend: http://localhost:5173/MarriottHotels/`);
    logger.info(`📚 Documentation: http://localhost:${port}/MarriottHotels/docs`);
    logger.info(`🗄️ Prisma Studio: http://localhost:5555`);
    logger.info(`🏥 Health Check: http://localhost:${port}/health`);

    // Only open browser in development
    if (process.env.NODE_ENV === 'development') {
      openInBrowser(`http://localhost:${port}`);
    }
  });
}

main().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
}); 
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './src/graphql/schema.js';
import { appRouter, createContext } from './src/trpc/router';
import querystring from 'querystring';
import fs from 'fs';
import { createServer } from 'http';
import { exec } from 'child_process';

// Initialize basic logger while the TypeScript logger loads
const tempLogger = {
  error: (...args) => console.error(new Date().toISOString(), 'ERROR:', ...args),
  warn: (...args) => console.warn(new Date().toISOString(), 'WARN:', ...args),
  info: (...args) => console.info(new Date().toISOString(), 'INFO:', ...args),
  debug: (...args) => console.debug(new Date().toISOString(), 'DEBUG:', ...args)
};

// Dynamically import the TypeScript logger and OpenAI config
let logger = tempLogger;
let openaiModule;

try {
  const [loggerModule, openaiModuleImport] = await Promise.all([
    import('./src/utils/logger.js'),
    import('./src/lib/openai.js')
  ]);
  logger = loggerModule.logger;
  openaiModule = openaiModuleImport;
  logger.info('Modules loaded successfully');
} catch (error) {
  tempLogger.error('Failed to load modules:', error);
  if (error instanceof Error) {
    tempLogger.error('Error details:', error.message, error.stack);
  }
}

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = parseInt(process.env.PORT, 10) || 3000;

// Function to open URL in default browser
const openInBrowser = (url) => {
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${command} ${url}`, (error) => {
    if (error) {
      console.error('Error opening browser:', error);
    }
  });
};

async function main() {
  // Check OpenAI configuration at startup
  if (openaiModule) {
    const { isValid, error } = await openaiModule.verifyOpenAIConfig();
    if (!isValid) {
      logger.error('OpenAI verification failed:', error);
      logger.warn('OpenAI services will not be available');
    } else {
      logger.info('OpenAI services verified and ready');
    }
  } else {
    logger.error('OpenAI module failed to load - services will not be available');
  }

  // Create HTTP server instance
  const app = express();
  const httpServer = createServer(app);

  // Configure query parser to use querystring instead of qs
  app.set('query parser', str => querystring.parse(str));

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
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://studio.apollographql.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-trpc-source', 'apollo-require-preflight'],
    exposedHeaders: ['set-cookie']
  }));

  // Serve static admin UI
  app.use(express.static(join(__dirname, 'admin-ui')));

  // Admin routes
  app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, 'admin-ui', 'index.html'));
  });

  app.get('/admin/login', (req, res) => {
    res.sendFile(join(__dirname, 'admin-ui', 'login.html'));
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
          AI_ASSISTANT_ID: process.env.AI_ASSISTANT_ID,
          AI_ADMIN_ID: process.env.AI_ADMIN_ID,
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

      const config = openaiModule.getOpenAIConfig();
      logger.info('OpenAI config:', {
        hasApiKey: !!config.apiKey,
        assistantId: config.assistantId,
        adminId: config.adminId
      });

      if (!config.apiKey) {
        logger.error('Chat API: OpenAI API key not configured');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      // Import the chat handler
      const { default: chatHandler } = await import('./src/pages/api/chat.ts');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
      };
      
      let responseData;
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data) => {
          responseData = data;
          return mockRes;
        }
      };

      // Call the chat handler
      await chatHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('Chat API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
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
      const { default: ttsHandler } = await import('./src/pages/api/tts.ts');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
      };
      
      let responseData;
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            responseData = data;
            return mockRes;
          }
        }),
        json: (data) => {
          responseData = data;
          return mockRes;
        }
      };

      // Call the TTS handler
      await ttsHandler(mockReq, mockRes);
      
      // Send the actual response
      res.json(responseData);
    } catch (error) {
      logger.error('TTS API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  // Add transcription endpoint
  app.post('/api/transcribe', async (req, res) => {
    let tempFilePath = null;

    try {
      logger.info('[Transcribe API] Request received:', {
        method: req.method,
        files: req.files ? Object.keys(req.files) : 'no files'
      });

      if (!req.files || !req.files.audio) {
        logger.error('[Transcribe API] No audio file found in request');
        return res.status(400).json({ error: 'Audio file is required' });
      }

      if (!openaiModule) {
        logger.error('[Transcribe API] OpenAI module not loaded');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      const config = openaiModule.getOpenAIConfig();
      if (!config.apiKey) {
        logger.error('[Transcribe API] OpenAI API key not configured');
        return res.status(503).json({ error: 'OpenAI service not available' });
      }

      const audioFile = req.files.audio;
      logger.info('[Transcribe API] Audio file received:', {
        name: audioFile.name,
        size: audioFile.size,
        mimetype: audioFile.mimetype
      });

      // Create a temporary file path
      tempFilePath = `/tmp/audio-${Date.now()}.webm`;
      await audioFile.mv(tempFilePath);
      logger.info('[Transcribe API] Audio file saved to temp location:', tempFilePath);

      // Create form data for OpenAI
      const formData = new FormData();
      formData.append('file', new Blob([fs.readFileSync(tempFilePath)], { type: audioFile.mimetype }), 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      logger.info('[Transcribe API] Sending to OpenAI');
      // Send to OpenAI Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('[Transcribe API] OpenAI error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      logger.info('[Transcribe API] Transcription successful:', {
        text: data.text?.substring(0, 100) + '...'
      });

      // Cleanup temp file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        logger.info('[Transcribe API] Cleaned up temp file:', tempFilePath);
      }

      res.json({ text: data.text });
    } catch (error) {
      logger.error('[Transcribe API] Error:', error);

      // Cleanup temp file in case of error
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
          logger.info('[Transcribe API] Cleaned up temp file after error:', tempFilePath);
        } catch (cleanupError) {
          logger.error('[Transcribe API] Error during cleanup:', cleanupError);
        }
      }

      res.status(500).json({ 
        error: 'Failed to transcribe audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // API endpoints
  app.use('/api/trpc', createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, type, path, input, ctx, req }) {
      logger.error('tRPC error:', {
        type,
        path,
        input,
        error: error.message,
        stack: error.stack
      });
    }
  }));

  // Configure Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
      settings: {
        'editor.theme': 'dark',
        'editor.reuseHeaders': true,
        'tracing.hideTracingResponse': false,
        'queryPlan.hideQueryPlanResponse': false,
        'editor.fontSize': 14,
        'editor.fontFamily': "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace"
      }
    },
    introspection: true
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app, 
    path: '/api/graphql',
    cors: {
      origin: ['http://localhost:5173', 'https://studio.apollographql.com'],
      credentials: true
    }
  });

  // API documentation
  app.get('/', (req, res) => {
    res.json({ 
      status: 'ok',
      endpoints: {
        admin: {
          ui: '/admin',
          login: '/admin/login'
        },
        api: {
          trpc: '/api/trpc',
          graphql: '/api/graphql',
          chat: '/api/chat',
          docs: '/api/graphql' // GraphQL playground
        }
      }
    });
  });

  // Start the server
  httpServer.listen(port, () => {
    const frontendUrl = 'http://localhost:5173/MarriottHotels/';
    const graphqlUrl = 'http://localhost:3000/api/graphql';
    const prismaStudioUrl = 'http://localhost:5555';

    logger.info(`
🚀 Admin & API Server ready:
📊 Admin UI: http://localhost:3000/admin
🔑 Admin Login: http://localhost:3000/admin/login
🔌 tRPC API: http://localhost:3000/api/trpc
💬 Chat API: http://localhost:3000/api/chat
📝 GraphQL Playground: ${graphqlUrl}
🌐 Accepting frontend requests from ${frontendUrl}
📚 Documentation: http://localhost:3000/MarriottHotels/docs
🗄️ Prisma Studio: ${prismaStudioUrl}
    `);

    // Auto-launch browser windows after a short delay
    setTimeout(() => {
      openInBrowser(frontendUrl);
      openInBrowser(graphqlUrl);
      openInBrowser(prismaStudioUrl);
    }, 2000); // Wait 2 seconds to ensure all services are ready
  });
}

main().catch((error) => {
  logger.error('Server startup error:', error);
  process.exit(1);
});
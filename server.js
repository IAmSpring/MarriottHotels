// Initialize Datadog APM
import tracer from 'dd-trace';
tracer.init({
    logInjection: true,
    analytics: true,
    runtimeMetrics: true,
    profiling: true
});
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './src/graphql/schema.js';
import { appRouter, createContext } from './src/trpc/router';
import querystring from 'querystring';
import { createServer } from 'http';
import { exec } from 'child_process';
import { logger } from './src/server/logger';
// Dynamically import OpenAI config
let openaiModule;
try {
    openaiModule = await import('./src/lib/openai');
    logger.info('OpenAI module loaded successfully');
}
catch (error) {
    logger.error('Failed to load OpenAI module:', error);
    if (error instanceof Error) {
        logger.error('Error details:', error.message, error.stack);
    }
}
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = parseInt(process.env.PORT || '3000', 10);
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
        }
        else {
            logger.info('OpenAI services verified and ready');
        }
    }
    else {
        logger.error('OpenAI module failed to load - services will not be available');
    }
    // Create HTTP server instance
    const app = express();
    const httpServer = createServer(app);
    // Configure query parser to use querystring instead of qs
    app.set('query parser', (str) => querystring.parse(str));
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
            const { default: chatHandler } = await import('./src/pages/api/chat');
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
        }
        catch (error) {
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
            const { default: ttsHandler } = await import('./src/pages/api/tts');
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
        }
        catch (error) {
            logger.error('TTS API Error:', error);
            res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
        }
    });
    // Add tRPC middleware
    app.use('/api/trpc', createExpressMiddleware({
        router: appRouter,
        createContext
    }));
    // Set up Apollo Server
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true, // Enable introspection in all environments
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        path: '/api/graphql',
        cors: false // Already handled by express cors middleware
    });
    // Start the server
    httpServer.listen(port, () => {
        logger.info('\n🚀 Server ready:');
        logger.info(`🔌 tRPC API: http://localhost:${port}/api/trpc`);
        logger.info(`💬 Chat API: http://localhost:${port}/api/chat`);
        logger.info(`📝 GraphQL Playground: http://localhost:${port}/api/graphql`);
        logger.info(`🌐 Frontend: http://localhost:5173/MarriottHotels/`);
        logger.info(`📚 Documentation: http://localhost:${port}/MarriottHotels/docs`);
        logger.info(`🗄️ Prisma Studio: http://localhost:5555`);
    });
}
main().catch((error) => {
    logger.error('Server startup error:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './src/graphql/schema.js';
import { appRouter, createContext } from './src/trpc/router';
import querystring from 'querystring';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = parseInt(process.env.PORT, 10) || 3000;

async function main() {
  const app = express();

  // Configure query parser to use querystring instead of qs
  app.set('query parser', str => querystring.parse(str));

  // Add middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Configure CORS
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-trpc-source'],
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
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Import the chat handler
      const { default: chatHandler } = await import('./src/pages/api/chat.ts');
      
      // Create a mock Next.js request and response
      const mockReq = {
        method: 'POST',
        body: req.body,
      };
      
      const mockRes = {
        status: (code) => ({
          json: (data) => res.status(code).json(data)
        })
      };

      // Call the chat handler
      await chatHandler(mockReq, mockRes);
    } catch (error) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  // API endpoints
  app.use('/api/trpc', createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, type, path, input, ctx, req }) {
      console.error('tRPC error:', {
        type,
        path,
        input,
        error: error.message,
        stack: error.stack
      });
    }
  }));

  // GraphQL for admin operations
  const apolloServer = new ApolloServer({ 
    typeDefs, 
    resolvers,
    playground: true,
    introspection: true
  });
  
  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app, 
    path: '/api/graphql',
    cors: false
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

  app.listen(port, () => {
    console.log(`
🚀 Admin & API Server ready:
📊 Admin UI: http://localhost:${port}/admin
🔑 Admin Login: http://localhost:${port}/admin/login
🔌 tRPC API: http://localhost:${port}/api/trpc
💬 Chat API: http://localhost:${port}/api/chat
📝 GraphQL Playground: http://localhost:${port}/api/graphql
🌐 Accepting frontend requests from http://localhost:5173
    `);
  });
}

main().catch(console.error); 
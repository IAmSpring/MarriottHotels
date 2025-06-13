import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './src/graphql/schema.js';
import { appRouter, createContext } from './src/trpc/router';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = parseInt(process.env.PORT, 10) || 3000;

async function main() {
  const app = express();

  // Configure CORS
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
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

  // API endpoints
  app.use('/api/trpc', createExpressMiddleware({
    router: appRouter,
    createContext,
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
📝 GraphQL Playground: http://localhost:${port}/api/graphql
🌐 Accepting frontend requests from http://localhost:5173
    `);
  });
}

main().catch(console.error); 
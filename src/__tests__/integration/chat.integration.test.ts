import request from 'supertest';
import express from 'express';
import { createServer } from 'http';
import { server as mockServer } from '../../mocks/server';
import { PrismaClient } from '@prisma/client';

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

describe('Chat API Integration', () => {
  beforeAll(async () => {
    // Start the mock server
    mockServer.listen();
    
    // Initialize your express app
    app.use(express.json());
    app.post('/api/chat', async (req, res) => {
      const { message, threadId, assistantId } = req.body;
      
      try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        
        // Your actual chat handler logic here
        const response = await request('https://api.openai.com')
          .post('/v1/chat/completions')
          .send({
            messages: [{ role: 'user', content: message }]
          });
          
        return res.json({
          response: response.body.choices[0].message.content,
          threadId: threadId || 'new-thread'
        });
      } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  });

  afterAll(async () => {
    mockServer.close();
    await prisma.$disconnect();
    httpServer.close();
  });

  it('should handle chat messages successfully', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({
        message: 'Hello, how can I help you?',
        assistantId: 'test-assistant'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
    expect(response.body).toHaveProperty('threadId');
  });

  it('should maintain conversation context with threadId', async () => {
    const firstResponse = await request(app)
      .post('/api/chat')
      .send({
        message: 'What hotels do you have in Miami?',
        assistantId: 'test-assistant'
      });

    const threadId = firstResponse.body.threadId;

    const secondResponse = await request(app)
      .post('/api/chat')
      .send({
        message: 'Show me the beachfront ones',
        threadId,
        assistantId: 'test-assistant'
      });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.threadId).toBe(threadId);
  });

  it('should handle errors gracefully', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({
        // Missing required fields
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
}); 
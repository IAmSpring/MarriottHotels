import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ensure ASSISTANT_ID is available and valid
const ASSISTANT_ID = process.env.AI_ASSISTANT_ID;
if (!ASSISTANT_ID) {
  throw new Error('ASSISTANT_ID is required');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, userId, threadId } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Create or retrieve thread
    let currentThreadId: string;
    if (threadId) {
      const thread = await openai.beta.threads.retrieve(threadId);
      currentThreadId = thread.id;
    } else {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: `Please provide your response in JSON format. Here is my message: ${message}`
    });

    // Run the assistant with JSON format
    const run = await openai.beta.threads.runs.create(
      currentThreadId,
      { 
        assistant_id: ASSISTANT_ID as string,
        response_format: { type: "json_object" }
      }
    );

    // Wait for the completion (with timeout)
    let responseText = '';
    const startTime = Date.now();
    const TIMEOUT = 30000; // 30 seconds timeout

    while (true) {
      if (Date.now() - startTime > TIMEOUT) {
        throw new Error('Assistant response timeout');
      }

      const runStatus = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id: currentThreadId
      });

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(currentThreadId);
        const latestMessage = messages.data[0];
        
        if (!latestMessage?.content?.[0]) {
          throw new Error('No response from assistant');
        }

        const content = latestMessage.content[0];
        if ('text' in content) {
          // Parse the JSON response
          try {
            const jsonResponse = JSON.parse(content.text.value);
            responseText = jsonResponse.response || content.text.value;
          } catch (e) {
            responseText = content.text.value;
          }
          break;
        } else {
          throw new Error('Unexpected response type from assistant');
        }
      } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Assistant run ${runStatus.status}`);
      } else if (runStatus.status === 'requires_action') {
        throw new Error('Assistant requires action');
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!responseText) {
      throw new Error('Empty response from assistant');
    }

    // Store the conversation in the database
    const conversation = await prisma.conversation.create({
      data: {
        userId: parseInt(userId) || 1,
        userMessage: message,
        aiResponse: responseText,
        threadId: currentThreadId,
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      message: responseText,
      conversationId: conversation.id,
      threadId: currentThreadId
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: errorMessage
    });
  }
} 
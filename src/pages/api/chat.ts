import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getOpenAIClient, getOpenAIConfig } from '../../lib/openai';
import { createTrace, updateTrace } from '../../lib/langsmith';
import { Readable } from 'stream';
import {
  searchHotels,
  getHotelDetails,
  checkAvailability,
  getLocalAttractions,
  getDiningOptions,
  getBonvoyInfo,
  checkTransportation,
  ASSISTANT_TOOLS
} from '../../lib/assistantTools';
import OpenAI from 'openai';
import { logger } from '../../server/logger';
import { Run } from 'openai/resources/beta/threads/runs';
import { TextContentBlock } from 'openai/resources/beta/threads/messages';

const prisma = new PrismaClient();

// Use the tools from assistantTools.ts
const TOOLS = ASSISTANT_TOOLS;

async function handleToolCalls(openai: OpenAI, run: Run, threadId: string) {
  const toolCalls = run.required_action?.submit_tool_outputs.tool_calls;
  if (!toolCalls) return '';

  const toolOutputs = await Promise.all(
    toolCalls.map(async (toolCall) => {
      const { function: func, id } = toolCall;
      let output = '';
      let traceId = '';

      try {
        const args = JSON.parse(func.arguments);
        
        // Create trace for tool execution
        try {
          const trace = await createTrace(`Tool: ${func.name}`, args);
          traceId = trace.id;
        } catch (traceError) {
          logger.warn('Failed to create tool trace:', traceError);
        }

        switch (func.name) {
          case 'search_hotels':
            output = JSON.stringify(await searchHotels(args));
            break;
          case 'get_hotel_details':
            output = JSON.stringify(await getHotelDetails(args));
            break;
          case 'check_availability':
            output = JSON.stringify(await checkAvailability(args));
            break;
          case 'get_local_attractions':
            output = JSON.stringify(await getLocalAttractions(args));
            break;
          case 'get_dining_options':
            output = JSON.stringify(await getDiningOptions(args));
            break;
          case 'get_bonvoy_info':
            output = JSON.stringify(await getBonvoyInfo(args));
            break;
          case 'check_transportation':
            output = JSON.stringify(await checkTransportation(args));
            break;
          default:
            logger.warn(`Unknown tool called: ${func.name}`);
            output = JSON.stringify({ error: 'Tool not implemented' });
        }

        // Update trace with output if trace was created
        if (traceId) {
          try {
            await updateTrace(traceId, { output });
          } catch (updateError) {
            logger.warn('Failed to update tool trace:', updateError);
          }
        }
      } catch (error) {
        logger.error(`Error executing tool ${func.name}:`, error);
        output = JSON.stringify({ 
          error: 'Tool execution failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Update trace with error if it exists
        if (traceId) {
          try {
            await updateTrace(traceId, { output }, error instanceof Error ? error : new Error('Tool execution failed'));
          } catch (updateError) {
            logger.warn('Failed to update tool trace with error:', updateError);
          }
        }
      }

      return {
        tool_call_id: id,
        output
      };
    })
  );

  // Submit tool outputs
  await openai.beta.threads.runs.submitToolOutputs(run.id, {
    thread_id: threadId,
    tool_outputs: toolOutputs
  });

  // Retrieve updated run
  const updatedRun = await openai.beta.threads.runs.retrieve(run.id, {
    thread_id: threadId
  });

  // Get messages
  const messages = await openai.beta.threads.messages.list(threadId, {
    limit: 1,
    order: 'desc'
  });
  const lastMessage = messages.data[0];
  
  const textContent = lastMessage.content.find(
    (content): content is OpenAI.Beta.Threads.Messages.TextContentBlock => 
    content.type === 'text'
  );

  return textContent?.text?.value || '';
}

interface ChatRequest {
  message: string;
  threadId?: string;
  assistantId: string;
  isAdmin: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let chatTraceId = '';

  try {
    const { message, threadId, assistantId, isAdmin } = req.body as ChatRequest;

    // Create trace for the chat request
    try {
      const chatTrace = await createTrace('Chat Request', {
        message,
        threadId,
        isAdmin
      });
      chatTraceId = chatTrace.id;
    } catch (traceError) {
      logger.warn('Failed to create LangSmith trace:', traceError);
      // Continue without tracing if it fails
    }

    // Check if user is authorized to use admin assistant
    const userRole = req.headers['x-user-role'];
    if (isAdmin && userRole !== 'ADMIN') {
      logger.warn('Unauthorized attempt to use admin assistant', {
        userRole,
        assistantId
      });
      await updateTrace(chatTraceId, null, new Error('Unauthorized to use admin assistant'));
      return res.status(403).json({ error: 'Unauthorized to use admin assistant' });
    }

    // Initialize OpenAI client
    const config = getOpenAIConfig();
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    const openai = getOpenAIClient(config.apiKey);

    logger.info('Chat API request:', {
      message,
      userId: req.headers['x-user-id'],
      userRole,
      threadId,
      env: {
        OPENAI_API_KEY: config.apiKey ? 'set' : 'not set',
        AI_ASSISTANT_ID: config.assistantId,
        AI_ADMIN_ID: config.adminId
      }
    });

    // Create or retrieve thread
    const thread = threadId
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create();

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message
    });

    // Create run
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      tools: TOOLS,
      instructions: "You are a helpful Marriott Hotels concierge. Provide direct responses without any JSON formatting."
    });

    // Poll for completion
    let response = '';
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id: thread.id
      });

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id, {
          limit: 1,
          order: 'desc'
        });
        const lastMessage = messages.data[0];
        const textContent = lastMessage.content[0] as OpenAI.Beta.Threads.Messages.TextContentBlock;
        
        let messageText = textContent.text.value;
        try {
          const parsed = JSON.parse(messageText);
          if (parsed.response) {
            messageText = parsed.response;
          }
        } catch (e) {
          console.log('Response is not JSON:', messageText);
        }
        
        response = messageText;
        break;
      } else if (runStatus.status === 'requires_action') {
        response = await handleToolCalls(openai, runStatus, thread.id);
        console.log('Tool Call Response:', response);
      } else if (
        runStatus.status === 'failed' ||
        runStatus.status === 'cancelled' ||
        runStatus.status === 'expired'
      ) {
        const error = new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
        await updateTrace(chatTraceId, null, error);
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update trace with successful response
    await updateTrace(chatTraceId, {
      response,
      threadId: thread.id
    });

    return res.status(200).json({
      response,
      threadId: thread.id
    });

  } catch (error) {
    logger.error('Chat API:', error);
    
    // Update trace with error if it exists
    if (chatTraceId) {
      await updateTrace(chatTraceId, null, error instanceof Error ? error : new Error('Chat request failed'));
    }

    return res.status(500).json({
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
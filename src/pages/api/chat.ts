import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getOpenAIClient, getOpenAIConfig } from '../../lib/openai';
import { Readable } from 'stream';
import {
  searchHotels,
  getHotelDetails,
  checkAvailability,
  getLocalAttractions,
  getDiningOptions,
  getBonvoyInfo,
  checkTransportation
} from '../../lib/assistantTools';
import OpenAI from 'openai';
import { logger } from '../../utils/logger';
import { Run } from 'openai/resources/beta/threads/runs';
import { MessageContentText } from 'openai/resources/beta/threads/messages';

const prisma = new PrismaClient();

// Tool definitions
const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "search_hotels",
      description: "Search for hotels based on location, dates, and preferences",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City or area to search for hotels"
          },
          checkIn: {
            type: "string",
            description: "Check-in date in YYYY-MM-DD format"
          },
          checkOut: {
            type: "string",
            description: "Check-out date in YYYY-MM-DD format"
          },
          guests: {
            type: "integer",
            description: "Number of guests"
          },
          preferences: {
            type: "array",
            items: { type: "string" },
            description: "List of preferences (e.g., ['pool', 'spa', 'beachfront'])"
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_hotel_details",
      description: "Get detailed information about a specific hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "check_availability",
      description: "Check room availability and rates for a specific hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          checkIn: {
            type: "string",
            description: "Check-in date in YYYY-MM-DD format"
          },
          checkOut: {
            type: "string",
            description: "Check-out date in YYYY-MM-DD format"
          },
          guests: {
            type: "integer",
            description: "Number of guests"
          },
          roomType: {
            type: "string",
            description: "Specific room type to check"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_local_attractions",
      description: "Get information about attractions near a hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          category: {
            type: "string",
            description: "Type of attraction (e.g., restaurants, shopping, entertainment)"
          },
          radius: {
            type: "number",
            description: "Search radius in miles"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_dining_options",
      description: "Get dining options at a specific hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          cuisine: {
            type: "string",
            description: "Type of cuisine"
          },
          mealType: {
            type: "string",
            description: "Type of meal (breakfast, lunch, dinner)"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_bonvoy_info",
      description: "Get Marriott Bonvoy program information",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Specific topic about Bonvoy (e.g., points, status, benefits)"
          }
        },
        required: ["topic"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "check_transportation",
      description: "Get transportation options to/from hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          fromTo: {
            type: "string",
            description: "Location to/from hotel (e.g., airport, attraction)"
          },
          type: {
            type: "string",
            description: "Type of transportation (e.g., shuttle, taxi, public)"
          }
        },
        required: ["hotelId", "fromTo"]
      }
    }
  }
];

async function handleToolCalls(openai: OpenAI, toolCalls: any[], threadId: string, runId: string) {
  const toolOutputs = [];

  for (const toolCall of toolCalls) {
    const { name, arguments: args } = toolCall.function;
    let output;

    try {
      switch (name) {
        case 'search_hotels':
          output = await searchHotels(JSON.parse(args));
          break;
        case 'get_hotel_details':
          output = await getHotelDetails(JSON.parse(args));
          break;
        case 'check_availability':
          output = await checkAvailability(JSON.parse(args));
          break;
        case 'get_local_attractions':
          output = await getLocalAttractions(JSON.parse(args));
          break;
        case 'get_dining_options':
          output = await getDiningOptions(JSON.parse(args));
          break;
        case 'get_bonvoy_info':
          output = await getBonvoyInfo(JSON.parse(args));
          break;
        case 'check_transportation':
          output = await checkTransportation(JSON.parse(args));
          break;
        default:
          logger.warn(`Unknown tool called: ${name}`);
          output = { error: 'Tool not implemented' };
      }
    } catch (error) {
      logger.error(`Tool execution error: ${name}`, error);
      output = { error: 'Tool execution failed' };
    }

    toolOutputs.push({
      tool_call_id: toolCall.id,
      output: JSON.stringify(output)
    });
  }

  await openai.beta.threads.runs.submitToolOutputs(runId, {
    tool_outputs: toolOutputs
  });
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

  try {
    const { message, threadId, assistantId, isAdmin } = req.body as ChatRequest;

    // Check if user is authorized to use admin assistant
    const userRole = req.headers['x-user-role'];
    if (isAdmin && userRole !== 'ADMIN') {
      logger.warn('Unauthorized attempt to use admin assistant', {
        userRole,
        assistantId
      });
      return res.status(403).json({ error: 'Unauthorized to use admin assistant' });
    }

    // Initialize OpenAI client for each request
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

    // Create a new thread if none exists
    const thread = threadId
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message
    });

    // Create a run with the appropriate assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      tools: TOOLS
    });

    // Poll for completion
    let response = '';
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];
        const textContent = lastMessage.content[0] as MessageContentText;
        response = textContent.text.value;
        break;
      } else if (runStatus.status === 'requires_action') {
        await handleToolCalls(openai, runStatus.required_action!.submit_tool_outputs.tool_calls, thread.id, run.id);
      } else if (
        runStatus.status === 'failed' ||
        runStatus.status === 'cancelled' ||
        runStatus.status === 'expired'
      ) {
        throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return res.status(200).json({
      response,
      threadId: thread.id
    });

  } catch (error) {
    logger.error('Chat API:', error);
    return res.status(500).json({
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
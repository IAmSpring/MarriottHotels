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
import { logger } from '../../server/logger';
import { Run } from 'openai/resources/beta/threads/runs';
import { TextContentBlock } from 'openai/resources/beta/threads/messages';

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

async function handleToolCalls(openai: OpenAI, run: Run, threadId: string) {
  const toolCalls = run.required_action?.submit_tool_outputs.tool_calls;
  if (!toolCalls) return '';

  const toolOutputs = await Promise.all(
    toolCalls.map(async (toolCall) => {
      const { function: func, id } = toolCall;
      let output = '';

      try {
        const args = JSON.parse(func.arguments);
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
      } catch (error) {
        logger.error(`Error executing tool ${func.name}:`, error);
        output = JSON.stringify({ error: 'Tool execution failed' });
      }

      return {
        tool_call_id: id,
        output
      };
    })
  );

  // Submit tool outputs with thread_id
  await openai.beta.threads.runs.submitToolOutputs(run.id, {
    thread_id: threadId,
    tool_outputs: toolOutputs
  });

  // Retrieve updated run with proper params
  const updatedRun = await openai.beta.threads.runs.retrieve(run.id, {
    thread_id: threadId
  });

  // Get messages with type guard for text content
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
      tools: TOOLS,
      instructions: "You are a helpful Marriott Hotels concierge. Provide direct responses without any JSON formatting."
    });

    // Poll for completion
    let response = '';
    while (true) {
      // Retrieve run status
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
        
        // Extract the actual message from OpenAI's response
        let messageText = textContent.text.value;
        try {
          // OpenAI might return JSON response due to response_format setting
          const parsed = JSON.parse(messageText);
          if (parsed.response) {
            messageText = parsed.response;
          }
        } catch (e) {
          // If not JSON, use the text as is
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
        throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Return the clean response
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
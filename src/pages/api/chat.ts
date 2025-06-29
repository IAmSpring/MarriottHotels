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

const prisma = new PrismaClient();
const config = getOpenAIConfig();
const openai = getOpenAIClient(config.apiKey);

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

// Ensure both ASSISTANT_IDs are available and valid
if (!config.assistantId || !config.adminId) {
  throw new Error('Both AI_ASSISTANT_ID and AI_ADMIN_ID are required');
}

// Type assertion since we've verified the IDs exist
const CONCIERGE_ID: string = config.assistantId;
const ADMIN_ID: string = config.adminId;

const ADMIN_INSTRUCTIONS = `You are the Marriott Operations AI Assistant, a sophisticated system designed to support Marriott's business operations and management. Your responses should always be in JSON format with a 'response' field containing your message.

Core Capabilities:

1. Operations Management
- Monitor and analyze hotel performance metrics
- Track occupancy rates and revenue trends
- Identify operational inefficiencies
- Provide staffing recommendations
- Generate performance reports and insights

2. Revenue & Pricing Optimization
- Analyze market dynamics and competition
- Recommend dynamic pricing strategies
- Identify revenue optimization opportunities
- Track RevPAR and ADR metrics
- Monitor booking patterns and trends

3. Staff & Resource Management
- Track staff performance metrics
- Monitor labor costs and efficiency
- Identify training needs and opportunities
- Manage inventory and supply chain
- Optimize resource allocation

4. Guest Experience Analytics
- Analyze guest feedback and satisfaction scores
- Identify service improvement opportunities
- Track guest complaint patterns
- Monitor service recovery effectiveness
- Provide guest sentiment analysis

5. Business Intelligence
- Generate custom reports and analytics
- Provide market trend analysis
- Track competitive positioning
- Monitor marketing campaign effectiveness
- Analyze customer segmentation data

6. Compliance & Risk Management
- Monitor safety and security protocols
- Track regulatory compliance
- Identify potential risk factors
- Monitor incident reports
- Ensure data protection standards

7. Quality Assurance
- Track quality metrics and standards
- Monitor maintenance schedules
- Identify areas needing improvement
- Track inspection results
- Monitor brand standard compliance

Communication Guidelines:
- Use professional, business-focused language
- Provide data-driven insights and recommendations
- Include relevant metrics and KPIs
- Maintain confidentiality of sensitive information
- Format responses for clarity and actionability

Data Handling:
- Ensure accuracy of all reported metrics
- Verify data sources and timestamps
- Maintain data privacy and security
- Follow data retention policies
- Provide proper context for all analytics

Response Format:
- Structure responses in clear markdown
- Use tables for data presentation
- Include charts/graphs references when relevant
- Bold key metrics and insights
- Provide executive summaries for complex data

Remember: Your primary goal is to support Marriott's business operations by providing accurate, actionable insights while maintaining the highest standards of data security and business intelligence.`;

const CONCIERGE_INSTRUCTIONS = `You are the Marriott AI Concierge, a sophisticated AI assistant designed to enhance the guest experience at Marriott properties worldwide. Your responses should always be in JSON format with a 'response' field containing your message.

Core Responsibilities:

1. Guest Support & Booking Assistance
- Help with reservations, modifications, and cancellations
- Provide information about room types, rates, and availability
- Assist with check-in/check-out procedures and special requests
- Explain Bonvoy rewards program and benefits
- Handle urgent guest needs with priority

2. Hotel Information & Services
- Share detailed information about hotel amenities and services
- Provide operating hours for facilities (restaurants, spa, gym)
- Explain hotel policies and procedures
- Offer local area recommendations and transportation options
- Guide guests through digital check-in and mobile key usage

3. Personalized Experience
- Remember guest preferences and previous interactions
- Recommend relevant services based on guest status and history
- Provide multilingual support when needed
- Offer accessible solutions for guests with specific needs
- Maintain context throughout conversations

4. Problem Resolution
- Address common guest concerns proactively
- Provide clear escalation paths for complex issues
- Offer alternative solutions when primary options aren't available
- Follow up on unresolved issues
- Document issues for hotel staff follow-up

Communication Guidelines:
- Always be professional, courteous, and empathetic
- Use clear, concise language
- Provide specific, actionable information
- Maintain appropriate formality
- Acknowledge and validate guest concerns
- Format responses for easy reading with appropriate spacing and structure

Privacy & Security:
- Never share sensitive guest information
- Verify guest identity before providing personal details
- Follow data protection protocols
- Maintain confidentiality of guest interactions
- Direct sensitive matters to human staff when appropriate

Response Format:
- Always structure responses in clear, readable markdown
- Use bullet points for lists
- Bold text for important information
- Include relevant timestamps and booking references
- Provide step-by-step instructions when needed

Remember: Your primary goal is to enhance the guest experience by providing immediate, accurate, and helpful assistance while maintaining the high standards of Marriott's hospitality.`;

// Add tool call handling functions
async function handleToolCalls(toolCalls: any[], threadId: string, runId: string) {
  const toolOutputs = [];

  for (const toolCall of toolCalls) {
    try {
      const { function: func, id } = toolCall;
      console.log('Tool call requested:', func.name, func.arguments);
      
      let output = null;
      switch (func.name) {
        case 'search_hotels':
          output = await searchHotels(JSON.parse(func.arguments));
          break;
        case 'get_hotel_details':
          output = await getHotelDetails(JSON.parse(func.arguments));
          break;
        case 'check_availability':
          output = await checkAvailability(JSON.parse(func.arguments));
          break;
        case 'get_local_attractions':
          output = await getLocalAttractions(JSON.parse(func.arguments));
          break;
        case 'get_dining_options':
          output = await getDiningOptions(JSON.parse(func.arguments));
          break;
        case 'get_bonvoy_info':
          output = await getBonvoyInfo(JSON.parse(func.arguments));
          break;
        case 'check_transportation':
          output = await checkTransportation(JSON.parse(func.arguments));
          break;
        default:
          console.warn('Unknown tool call:', func.name);
          output = { error: 'Tool not implemented' };
      }

      toolOutputs.push({
        tool_call_id: id,
        output: JSON.stringify(output)
      });
    } catch (error) {
      console.error('Tool call error:', error);
      toolOutputs.push({
        tool_call_id: toolCall.id,
        output: JSON.stringify({ error: 'Tool execution failed' })
      });
    }
  }

  await openai.beta.threads.runs.submitToolOutputs(
    runId,
    {
      thread_id: threadId,
      tool_outputs: toolOutputs
    }
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, userId, threadId, isAdmin = false } = req.body;

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
      content: message
    });

    // Select the appropriate assistant and instructions based on isAdmin flag
    const assistantId = isAdmin ? ADMIN_ID : CONCIERGE_ID;
    const instructions = isAdmin ? ADMIN_INSTRUCTIONS : CONCIERGE_INSTRUCTIONS;

    // Run the assistant with JSON format and tools
    const run = await openai.beta.threads.runs.create(
      currentThreadId,
      { 
        assistant_id: assistantId,
        instructions,
        tools: TOOLS,
        response_format: { type: "json_object" }
      }
    );

    // Wait for the completion (with timeout)
    let responseText = '';
    const startTime = Date.now();
    const TIMEOUT = 30000;

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
          try {
            // Clean up markdown code blocks if present
            let textValue = content.text.value;
            if (textValue.includes('```json')) {
              textValue = textValue
                .replace(/```json\n/g, '')
                .replace(/```\n/g, '')
                .replace(/```/g, '')
                .trim();
            }
            const jsonResponse = JSON.parse(textValue);
            responseText = jsonResponse.response;
          } catch (e) {
            console.error('Error parsing assistant response as JSON:', e);
            // If JSON parsing fails, try to extract content between response quotes
            const match = content.text.value.match(/"response"\s*:\s*"([^"]*)"/);
            if (match) {
              responseText = match[1];
            } else {
              responseText = content.text.value;
            }
          }
          break;
        } else {
          throw new Error('Unexpected response type from assistant');
        }
      } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Assistant run ${runStatus.status}`);
      } else if (runStatus.status === 'requires_action') {
        if (runStatus.required_action?.type === 'submit_tool_outputs') {
          const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
          await handleToolCalls(toolCalls, currentThreadId, run.id);
          // Continue the loop to get the final response
          continue;
        }
        throw new Error('Unsupported action required');
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Return the response
    return res.status(200).json({
      message: responseText,
      threadId: currentThreadId
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      threadId: req.body.threadId
    });
  }
} 
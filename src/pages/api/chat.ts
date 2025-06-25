import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getOpenAIClient, getOpenAIConfig } from '../../lib/openai';
import { Readable } from 'stream';

const prisma = new PrismaClient();
const config = getOpenAIConfig();
const openai = getOpenAIClient(config.apiKey);

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

    // Run the assistant with JSON format
    const run = await openai.beta.threads.runs.create(
      currentThreadId,
      { 
        assistant_id: assistantId,
        instructions,
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
        throw new Error('Assistant requires action');
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!responseText) {
      throw new Error('Empty response from assistant');
    }

    // Generate speech from the response
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: responseText,
    });

    // Convert the speech response to base64
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    const audioBase64 = buffer.toString('base64');

    // Validate user exists before creating conversation
    let userIdToUse = 1; // Default to 1 if no userId provided
    if (userId) {
      try {
        const parsedUserId = parseInt(userId);
        if (!isNaN(parsedUserId)) {
          const user = await prisma.user.findUnique({
            where: {
              id: parsedUserId
            }
          });
          if (user) {
            userIdToUse = user.id;
          }
        }
      } catch (error) {
        console.error('Error parsing or finding user:', error);
        // Continue with default userIdToUse if there's an error
      }
    }

    // Ensure default user exists
    const defaultUser = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: 'default@marriott.com',
        password: 'defaultpass', // This is safe as it's just for the default user
        name: 'Default User',
        role: 'USER'
      }
    });

    // Store the conversation in the database
    const conversation = await prisma.conversation.create({
      data: {
        userId: userIdToUse,
        userMessage: message,
        aiResponse: responseText,
        threadId: currentThreadId,
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      message: responseText,
      audioData: audioBase64,
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
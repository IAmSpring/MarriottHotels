import OpenAI from 'openai';

// Get environment variables - using the same names as our .env file
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const AI_ASSISTANT_ID = import.meta.env.AI_ASSISTANT_ID;
const AI_ADMIN_ID = import.meta.env.AI_ADMIN_ID;
const ENABLE_AI_CHAT = import.meta.env.ENABLE_AI_CHAT !== 'false';

if (!ENABLE_AI_CHAT) {
  console.warn('AI Chat is disabled');
}

if (!OPENAI_API_KEY || !AI_ASSISTANT_ID || !AI_ADMIN_ID) {
  console.warn('Missing required OpenAI environment variables');
}

// Initialize OpenAI with browser-safe configuration
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

// Static data store (simulating database)
const staticStore = {
  conversations: [] as any[],
  currentThreadId: null as string | null,
};

// Static API handlers
export const staticApi = {
  // Chat endpoint
  async chat(message: string, userId: string = '1', threadId?: string, isAdmin: boolean = false) {
    try {
      // Create or retrieve thread
      let currentThreadId: string;
      if (threadId) {
        const thread = await openai.beta.threads.retrieve(threadId);
        currentThreadId = thread.id;
      } else {
        const thread = await openai.beta.threads.create();
        currentThreadId = thread.id;
      }
      staticStore.currentThreadId = currentThreadId;

      // Add message to thread
      await openai.beta.threads.messages.create(currentThreadId, {
        role: "user",
        content: message
      });

      // Select appropriate assistant based on isAdmin flag
      const assistantId = isAdmin ? AI_ADMIN_ID : AI_ASSISTANT_ID;
      const instructions = isAdmin 
        ? "You are a Marriott business operations assistant. Provide responses in JSON format with a 'response' field."
        : "You are a helpful Marriott Hotels concierge. Provide responses in JSON format with a 'response' field.";

      // Run the assistant
      const run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: assistantId,
        instructions,
        response_format: { type: "json_object" }
      });

      // Wait for completion
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
              const jsonResponse = JSON.parse(content.text.value);
              responseText = jsonResponse.response;
            } catch (e) {
              responseText = content.text.value;
            }
            break;
          }
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
          throw new Error(`Assistant run ${runStatus.status}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate speech
      const speechResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: responseText,
      });

      const audioBuffer = await speechResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');

      // Store conversation
      const conversation = {
        id: Date.now(),
        userId: parseInt(userId),
        userMessage: message,
        aiResponse: responseText,
        threadId: currentThreadId,
        timestamp: new Date(),
        isAdmin
      };
      staticStore.conversations.push(conversation);

      return {
        message: responseText,
        audioData: audioBase64,
        conversationId: conversation.id,
        threadId: currentThreadId
      };
    } catch (error) {
      console.error('Static Chat API Error:', error);
      throw error;
    }
  },

  // Get conversation history
  getConversations(userId: string = '1', isAdmin: boolean = false) {
    return staticStore.conversations.filter(
      conv => conv.userId === parseInt(userId) && conv.isAdmin === isAdmin
    );
  },

  // Get current thread
  getCurrentThread() {
    return staticStore.currentThreadId;
  }
}; 
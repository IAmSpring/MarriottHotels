import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your Marriott AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Add user message
    const newMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          userId: 'anonymous', // Replace with actual user ID when auth is implemented
          threadId: threadId
        }),
      });

      const data = await response.json();
      
      // Store threadId for conversation continuity
      if (data.threadId) {
        setThreadId(data.threadId);
      }

      // Try to parse the message as JSON if it's a string
      let messageText = data.message;
      try {
        if (typeof data.message === 'string') {
          const jsonMatch = data.message.match(/```json\s*({[\s\S]*?})\s*```/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[1]);
            messageText = jsonData.response;
          }
        }
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        // Keep the original message if JSON parsing fails
      }

      const aiResponse: Message = {
        text: messageText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center w-14 h-14 rounded-full bg-[#8B1538] text-white shadow-lg hover:bg-[#6B1028] transition-colors`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col bg-white rounded-lg shadow-xl w-full sm:w-96 h-[600px] max-h-[80vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#8B1538] text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <span className="font-semibold">Marriott AI Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[#6B1028] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-[#8B1538] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="p-2 bg-[#8B1538] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B1028] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot; 
import React, { useState, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Expand, Minimize, Volume2, Pause, Play, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioData?: string;
}

interface AudioState {
  messageId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
  const [audioState, setAudioState] = useState<AudioState>({
    messageId: null,
    isPlaying: false,
    isLoading: false
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioPlayback = async (messageId: number, audioData: string | undefined) => {
    if (!audioData) return;

    if (audioState.messageId === messageId && audioState.isPlaying) {
      // Pause current playback
      audioRef.current?.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else if (audioState.messageId === messageId && !audioState.isPlaying && audioRef.current) {
      // Resume current audio
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    } else {
      // Start new audio
      setAudioState({ messageId, isPlaying: false, isLoading: true });
      
      // Create audio element
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
      audioRef.current = audio;

      // Set up audio event listeners
      audio.addEventListener('play', () => {
        setAudioState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      });

      audio.addEventListener('pause', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });

      audio.addEventListener('ended', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false, messageId: null }));
      });

      // Start playing
      try {
        await audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState({ messageId: null, isPlaying: false, isLoading: false });
    }
  };

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
          userId: 'anonymous',
          threadId: threadId
        }),
      });

      const data = await response.json();
      
      if (data.threadId) {
        setThreadId(data.threadId);
      }

      const aiResponse: Message = {
        text: data.message,
        isUser: false,
        timestamp: new Date(),
        audioData: data.audioData
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
        } ${
          isExpanded 
            ? 'fixed top-[10vh] left-[10vw] w-[80vw] h-[80vh] transform-none'
            : 'w-full sm:w-96 h-[600px] max-h-[80vh]'
        } flex-col bg-white rounded-lg shadow-xl transition-all duration-300 z-50`}
        style={{
          ...(isExpanded && {
            transform: 'translate(0, 0)',
            right: 'auto',
            bottom: 'auto'
          })
        }}
      >
        {/* Overlay when expanded */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black opacity-50 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#8B1538] text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <span className="font-semibold">Marriott AI Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-[#6B1028] rounded-full transition-colors"
            >
              {isExpanded ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Expand className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#6B1028] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
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
                <div className={`text-sm prose prose-sm max-w-none ${
                  message.isUser 
                    ? 'prose-invert' 
                    : 'prose-neutral'
                } prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-1`}>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {!message.isUser && message.audioData && (
                    <button
                      onClick={() => handleAudioPlayback(index, message.audioData)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      disabled={audioState.isLoading}
                    >
                      {audioState.isLoading && audioState.messageId === index ? (
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      ) : audioState.isPlaying && audioState.messageId === index ? (
                        <div className="flex space-x-1">
                          <Pause className="w-4 h-4" />
                          <Square 
                            className="w-4 h-4 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              stopAudio();
                            }}
                          />
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
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
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent bg-white"
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
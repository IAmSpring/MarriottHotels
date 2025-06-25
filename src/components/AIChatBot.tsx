import React, { useState, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Expand, Minimize, Volume2, Pause, Play, Square, Mic, VolumeX, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import MessageBubble from './MessageBubble';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AudioState {
  messageId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
}

interface AIResponse {
  response: string;
  threadId?: string;
}

const DEFAULT_OPTIONS = [
  "What are the best hotels in Miami?",
  "Tell me about Marriott Bonvoy rewards",
  "Help me plan a romantic getaway"
];

const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/#{1,6}\s/g, '')       // Remove headers
    .replace(/`{1,3}.*?`{1,3}/g, '') // Remove code blocks
    .replace(/\n/g, ' ')            // Replace newlines with spaces
    .trim();
};

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
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceRecorder({
    onTranscriptionComplete: (text) => {
      if (text && text.trim()) {
        setInputText(text);
        handleSend(text);
      }
    },
  });

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

  const handlePlayback = async (messageId: number, text: string) => {
    const cleanText = stripMarkdown(text);
    
    // If currently playing this message, pause it
    if (audioState.messageId === messageId && audioState.isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      }
      return;
    }
    
    // If we have this audio paused, resume it
    if (audioState.messageId === messageId && !audioState.isPlaying && audioRef.current) {
      try {
        await audioRef.current.play();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      } catch (error) {
        console.error('Error resuming audio:', error);
        setAudioState({ messageId: null, isPlaying: false, isLoading: false });
      }
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Start new playback
    try {
      // Set loading state immediately
      setAudioState({ messageId, isPlaying: false, isLoading: true });
      
      // Request TTS audio from our API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      
      // Create and setup new audio element
      const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
      audioRef.current = audio;

      // Set up event listeners
      audio.addEventListener('play', () => {
        setAudioState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      });

      audio.addEventListener('pause', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });

      audio.addEventListener('ended', () => {
        setAudioState({ messageId: null, isPlaying: false, isLoading: false });
      });

      // Start playing
      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      setAudioState({ messageId: null, isPlaying: false, isLoading: false });
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState({
        messageId: null,
        isPlaying: false,
        isLoading: false
      });
    }
  };

  const speakText = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputText(option);
    handleSend(option);
  };

  const handleSend = async (text?: string) => {
    const trimmedInput = (text || inputText)?.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const newMessage: Message = {
      text: trimmedInput,
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
          message: trimmedInput,
          userId: 'anonymous',
          threadId: threadId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Parse the response properly
      let messageText = '';
      try {
        // If data is already a parsed object
        if (typeof data === 'object' && data.response) {
          messageText = data.response;
        }
        // If data.message is a string containing JSON
        else if (typeof data.message === 'string') {
          try {
            const parsed = JSON.parse(data.message);
            messageText = parsed.response || data.message;
          } catch {
            messageText = data.message;
          }
        }
        // If data.message is an object
        else if (typeof data.message === 'object' && data.message.response) {
          messageText = data.message.response;
        }
        // Fallback
        else {
          messageText = "I'm sorry, I couldn't process that response properly.";
        }
      } catch (error) {
        console.error('Error parsing message:', error);
        messageText = "I'm sorry, I couldn't process that response properly.";
      }

      // Add AI response
      const aiMessage: Message = {
        text: messageText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // If TTS is enabled, speak the response
      if (isTTSEnabled) {
        speakText(messageText);
      }

      if (data.threadId) {
        setThreadId(data.threadId);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      }]);
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
    <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'w-96' : 'w-auto'}`}>
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
        } flex-col bg-white rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-[#8B1538] text-white rounded-t-lg">
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

        {/* Messages and Input Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-[#8B1538] text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="mr-3 prose prose-sm max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                    {!message.isUser && (
                      <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                        <div className="relative">
                          {audioState.messageId === index && audioState.isLoading ? (
                            <div className="p-1">
                              <Loader2 className="w-4 h-4 text-gray-700 animate-spin" />
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePlayback(index, message.text)}
                              className="p-1 rounded-full hover:bg-gray-300 transition-colors"
                              disabled={audioState.isLoading}
                            >
                              {audioState.messageId === index && audioState.isPlaying ? (
                                <Pause className="w-4 h-4 text-gray-700" />
                              ) : (
                                <Play className="w-4 h-4 text-gray-700" />
                              )}
                            </button>
                          )}
                        </div>
                        {audioState.messageId === index && (audioState.isPlaying || audioState.isLoading) && (
                          <button
                            onClick={stopPlayback}
                            className="p-1 rounded-full hover:bg-gray-300 transition-colors"
                          >
                            <Square className="w-4 h-4 text-gray-700" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {/* Quick Options - Show only after first AI message */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 mt-4">
                {DEFAULT_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8B1538]"></div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex-shrink-0 p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <textarea
                value={inputText || ''}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent bg-white"
                rows={1}
                disabled={isLoading || isRecording || isTranscribing}
              />
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    if (isRecording) {
                      await stopRecording();
                    } else {
                      await startRecording();
                    }
                  } catch (error) {
                    console.error('Recording error:', error);
                  }
                }}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : isTranscribing
                    ? 'bg-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isTranscribing ? (
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                ) : (
                  <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
                )}
              </button>
              <button
                onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                className={`p-2 rounded-full transition-colors ${
                  isTTSEnabled 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title={isTTSEnabled ? 'Disable auto-read responses' : 'Enable auto-read responses'}
              >
                {isTTSEnabled ? (
                  <Volume2 className="w-5 h-5 text-white" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                disabled={!(inputText?.trim()) || isLoading || isRecording || isTranscribing}
                className="p-2 bg-[#8B1538] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B1028] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
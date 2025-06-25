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

  const handlePlayback = (messageId: number, text: string) => {
    if (audioState.messageId === messageId && audioState.isPlaying) {
      // Pause current playback
      window.speechSynthesis.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else if (audioState.messageId === messageId && !audioState.isPlaying) {
      // Resume current playback
      window.speechSynthesis.resume();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    } else {
      // Start new playback
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => {
        setAudioState({
          messageId,
          isPlaying: true,
          isLoading: false
        });
      };
      
      utterance.onend = () => {
        setAudioState({
          messageId: null,
          isPlaying: false,
          isLoading: false
        });
      };
      
      utterance.onpause = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      };
      
      utterance.onresume = () => {
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopPlayback = () => {
    window.speechSynthesis.cancel();
    setAudioState({
      messageId: null,
      isPlaying: false,
      isLoading: false
    });
  };

  const speakText = async (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn('Text-to-speech not supported in this browser');
      }
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

        <div className={`${isOpen ? 'block' : 'hidden'} bg-white rounded-t-xl shadow-xl`}>
          <div className="h-96 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                text={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                messageId={index}
                audioState={audioState}
                onPlayPause={handlePlayback}
                onStop={stopPlayback}
              />
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
          <div className="p-4 border-t bg-white">
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
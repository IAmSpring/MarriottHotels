import React, { useState, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Expand, Minimize, Volume2, Pause, Play, Square, Mic, VolumeX, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import MessageBubble from './MessageBubble';
import MarkdownMessage from './MarkdownMessage';

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

const RECOMMENDED_PROMPTS = [
  "Help me plan a luxury vacation in Aspen",
  "What are the best Marriott hotels for a business trip?",
  "Tell me about Marriott Bonvoy rewards program"
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

// Audio cache to store generated audio data
const audioCache = new Map<string, { audio: HTMLAudioElement; data: string }>();

const loadAndPlayAudio = async (audioData: string, cacheKey: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    // Check cache first
    const cached = audioCache.get(cacheKey);
    if (cached) {
      console.log('Using cached audio for:', cacheKey);
      // Create a new audio instance from cached data to allow multiple playbacks
      const audio = new Audio(`data:audio/mp3;base64,${cached.data}`);
      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', (e) => reject(e), { once: true });
      audio.load();
      return;
    }

    console.log('Loading new audio for:', cacheKey);
    const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
    
    const onCanPlay = () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
      // Store in cache
      audioCache.set(cacheKey, { audio, data: audioData });
      resolve(audio);
    };

    const onError = (e: ErrorEvent) => {
      console.error('Audio loading error:', e);
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
      reject(new Error('Failed to load audio: ' + e.message));
    };

    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('error', onError);
    audio.load();
  });
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

  // Function to generate cache key for a message
  const getCacheKey = useCallback((messageId: number, text: string) => {
    return `message-${messageId}-${text.substring(0, 50)}`;
  }, []);

  const handlePlayback = async (messageId: number, text: string) => {
    const cacheKey = getCacheKey(messageId, text);

    // If currently playing this message, pause it
    if (audioState.messageId === messageId && audioState.isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      }
      return;
    }

    // If we have a loaded audio for this message but it's paused, resume it
    if (audioRef.current && audioState.messageId === messageId && !audioState.isPlaying) {
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Check if we have cached audio
    const cached = audioCache.get(cacheKey);
    if (cached) {
      try {
        setAudioState({ messageId, isPlaying: false, isLoading: true });
        const audio = await loadAndPlayAudio(cached.data, cacheKey);
        setupAudioListeners(audio, messageId);
        audioRef.current = audio;
        await audio.play();
        return;
      } catch (error) {
        console.error('Error playing cached audio:', error);
        // If cached audio fails, remove it from cache and continue to fetch new audio
        audioCache.delete(cacheKey);
      }
    }

    // Start new playback
    try {
      const cleanText = text.replace(/[*#\[\]]/g, ''); // Strip markdown
      setAudioState({ messageId, isPlaying: false, isLoading: true });
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error('Failed to generate speech: ' + (error.details || error.error));
      }
      
      const { audioData } = await response.json();
      
      if (!audioData) {
        throw new Error('No audio data received');
      }

      // Load and setup the audio element
      const audio = await loadAndPlayAudio(audioData, cacheKey);
      setupAudioListeners(audio, messageId);
      audioRef.current = audio;
      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      setAudioState({ messageId: null, isPlaying: false, isLoading: false });
      audioRef.current = null;
      // Remove failed audio from cache
      audioCache.delete(cacheKey);
    }
  };

  // Separate function for setting up audio listeners
  const setupAudioListeners = (audio: HTMLAudioElement, messageId: number) => {
    audio.addEventListener('playing', () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    });

    audio.addEventListener('pause', () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener('ended', () => {
      setAudioState({ messageId: null, isPlaying: false, isLoading: false });
      audioRef.current = null;
    });
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setAudioState({
        messageId: null,
        isPlaying: false,
        isLoading: false
      });
    }
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
          threadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      let messageText = data.message;

      // Add AI response
      const aiMessage: Message = {
        text: messageText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        // If TTS is enabled, play the response with the correct index
        if (isTTSEnabled) {
          handlePlayback(newMessages.length - 1, messageText);
        }
        return newMessages;
      });

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

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
    handleSend(prompt);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'w-96' : 'w-auto'}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#8B1538] text-white shadow-lg hover:bg-[#6B1028] transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`${
            isExpanded 
              ? 'fixed top-[10vh] left-[10vw] w-[80vw] h-[80vh] transform-none'
              : 'w-full h-[600px] max-h-[80vh]'
          } flex flex-col bg-white rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden`}
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

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <MarkdownMessage
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
            
            {/* Show recommended prompts after the first AI message */}
            {messages.length === 1 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-500">Try asking about:</p>
                {RECOMMENDED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="block w-full text-left p-2 text-sm text-[#8B1538] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {prompt}
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
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                disabled={isLoading || isRecording || isTranscribing}
              />
              <button
                onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                className={`p-2 rounded-full transition-colors ${
                  isTTSEnabled 
                    ? 'bg-[#8B1538] text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title={isTTSEnabled ? 'Disable auto-read responses' : 'Enable auto-read responses'}
              >
                {isTTSEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={async () => {
                  if (isRecording) {
                    await stopRecording();
                  } else {
                    await startRecording();
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
                onClick={() => handleSend()}
                disabled={!inputText?.trim() || isLoading || isRecording || isTranscribing}
                className="p-2 bg-[#8B1538] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B1028] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
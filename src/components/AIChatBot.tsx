import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Expand, Minimize, Volume2, Pause, Play, Square, Mic, VolumeX, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import MessageBubble from './MessageBubble';
import MarkdownMessage from './MarkdownMessage';
import ContinuousModeModal from './ContinuousModeModal';
import { isStaticBuild, getStaticResponse } from '../lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>();
  const [audioState, setAudioState] = useState<AudioState>({
    messageId: null,
    isPlaying: false,
    isLoading: false
  });
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [showContinuousModal, setShowContinuousModal] = useState(false);
  const [hasSeenContinuousModal, setHasSeenContinuousModal] = useState(() => {
    return localStorage.getItem('hasSeenContinuousModal') === 'true';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isWakeWordMode, setIsWakeWordMode] = useState(false);

  const { 
    isRecording, 
    isTranscribing, 
    isListeningForWakeWord,
    startRecording, 
    stopRecording,
    startWakeWordDetection 
  } = useVoiceRecorder({
    onTranscriptionComplete: async (text) => {
      console.log('🎤 Transcription complete:', text);
      if (text && text.trim()) {
        setInputText(text);
        await handleSend(text);
      }
      setCurrentTranscription('');
      // After sending, go back to wake word detection if in continuous mode
      if (isContinuousMode) {
        console.log('🎙️ Returning to wake word detection...');
        startWakeWordDetection();
      }
    },
    onTranscriptionUpdate: (text) => {
      console.log('🎤 Transcription update:', text);
      setCurrentTranscription(text);
      setInputText(text);
    },
    onWakeWordDetected: () => {
      console.log('🎙️ Wake word detected! Starting recording...');
      setIsWakeWordMode(false);
      // Enable TTS for auto-playback of responses
      setIsTTSEnabled(true);
      // Start recording automatically
      startRecording();
    }
  });

  // Auto-start wake word detection when continuous mode is enabled
  useEffect(() => {
    if (isContinuousMode && !isRecording && !isTranscribing) {
      console.log('🎙️ Continuous mode enabled, starting wake word detection...');
      setIsWakeWordMode(true);
      startWakeWordDetection();
    }
  }, [isContinuousMode]);

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

    console.log('📤 Sending message:', trimmedInput);

    // Add user message
    const newMessage: Message = {
      role: 'user',
      content: trimmedInput,
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
          threadId: threadId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      console.log('📥 Received AI response');

      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setThreadId(data.threadId);

      // Auto-play response if TTS is enabled
        if (isTTSEnabled) {
        console.log('🔊 Auto-playing AI response...');
        const messageId = messages.length + 1;
        handlePlayback(messageId, data.message);
        }

      // If in continuous mode, go back to wake word detection
      if (isContinuousMode) {
        console.log('🎙️ Returning to wake word detection after response...');
        startWakeWordDetection();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
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

  const handleContinuousModeToggle = () => {
    if (!hasSeenContinuousModal) {
      setShowContinuousModal(true);
    } else {
      const newMode = !isContinuousMode;
      console.log(`🔄 ${newMode ? 'Enabling' : 'Disabling'} continuous mode...`);
      setIsContinuousMode(newMode);
      if (newMode) {
        setIsWakeWordMode(true);
        setIsTTSEnabled(true); // Auto-enable TTS in continuous mode
        startWakeWordDetection();
      }
    }
  };

  const handleAcceptContinuousMode = () => {
    console.log('✅ Accepted continuous mode, enabling wake word detection...');
    setHasSeenContinuousModal(true);
    localStorage.setItem('hasSeenContinuousMode', 'true');
    setIsContinuousMode(true);
    setIsWakeWordMode(true);
    setIsTTSEnabled(true); // Auto-enable TTS when accepting continuous mode
    startWakeWordDetection();
  };

  const handleSendMessage = async (message: string) => {
    try {
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: message,
        timestamp: new Date()
      }]);
      setIsLoading(true);

      if (isStaticBuild()) {
        const mockResponse = getStaticResponse('chat');
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: mockResponse.response,
            timestamp: new Date()
          }]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: '1',
          threadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      }]);
      setThreadId(data.threadId);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContinuousModeModal
        isOpen={showContinuousModal}
        onClose={() => setShowContinuousModal(false)}
        onAccept={handleAcceptContinuousMode}
      />
      
      <div className="fixed bottom-6 right-6 z-[1000]">
        <div className="flex flex-col items-end space-y-4">
          {!isOpen && (
      <button
              onClick={() => setIsOpen(true)}
              className="p-4 bg-[#8B1538] text-white rounded-full shadow-lg hover:bg-[#6B1028] transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
          )}

          {isOpen && (
      <div
              className={`bg-white rounded-lg shadow-xl flex flex-col ${
          isExpanded 
                  ? 'fixed top-[10vh] left-[10vw] w-[80vw] h-[80vh]' 
                  : 'w-[420px] h-[600px]'
              }`}
      >
              <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-[#8B1538]" />
            <span className="font-semibold">Marriott AI Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-gray-100 rounded-full"
            >
                    {isExpanded ? <Minimize className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
                  <MarkdownMessage
              key={index}
              text={message.content}
              isUser={message.role === 'user'}
              timestamp={message.timestamp}
              messageId={index}
              audioState={audioState}
                    onPlayPause={(messageId, text) => handlePlayback(messageId, text)}
              onStop={stopPlayback}
            />
          ))}
          {isLoading && (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#8B1538]" />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-4 border-t bg-white">
                <div className="flex items-start space-x-2">
                  <button
                    onClick={handleContinuousModeToggle}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      isContinuousMode 
                        ? 'bg-[#8B1538] text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                    title={isContinuousMode ? 'Disable voice assistant' : 'Enable voice assistant'}
                  >
                    <RefreshCw className={`w-5 h-5 ${isListeningForWakeWord ? 'animate-spin' : ''}`} />
                    {isListeningForWakeWord && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </button>
                  
                  <div className="flex-1">
            <textarea
                      value={isRecording ? currentTranscription : inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
                      placeholder={isRecording ? 'Listening...' : 'Type your message...'}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent resize-none overflow-hidden"
                      style={{
                        minHeight: '42px',
                        maxHeight: '120px',
                      }}
              rows={1}
              disabled={isLoading || isRecording || isTranscribing}
            />
                  </div>

                  <div className="flex-shrink-0 flex items-start space-x-2">
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
                      disabled={isLoading || isTranscribing || isListeningForWakeWord}
              className={`p-2 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : isTranscribing
                  ? 'bg-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300'
                      } relative`}
                      title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isTranscribing ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                        </div>
              ) : (
                        <Mic 
                          className={`w-5 h-5 ${
                            isRecording 
                              ? 'text-white animate-pulse' 
                              : 'text-gray-600'
                          }`} 
                        />
              )}
                      {isRecording && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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

                {/* Show different status messages based on mode */}
                {isListeningForWakeWord && (
                  <div className="mt-2 text-sm text-blue-500 italic">
                    Listening for wake word (Hey Bonvoy, Hey Marriott, or Hey Concierge)...
                  </div>
                )}
                {isRecording && currentTranscription && (
                  <div className="mt-2 text-sm text-gray-500 italic">
                    {currentTranscription}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIChatBot;
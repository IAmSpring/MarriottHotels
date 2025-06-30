import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Expand, Minimize, Volume2, Pause, Play, Square, Mic, VolumeX, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import MessageBubble from './MessageBubble';
import MarkdownMessage from './MarkdownMessage';
import ContinuousModeModal from './ContinuousModeModal';
import { isStaticBuild, getStaticResponse } from '../lib/openai';
import { fetchApi, handleApiError } from '../lib/staticApi';
import { StreamingAudioService } from '../utils/streamingAudioService';
import { navigationLogger } from '../utils/navigationLogger';
import { useLocation, useNavigate } from 'react-router-dom';

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
  "What are the best hotels this time of year?",
  "Tell me about Marriott Bonvoy rewards",
  "Help me plan a romantic getaway"
];

const RECOMMENDED_PROMPTS = [
  "Help me plan a luxury vacation next month",
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

const audioService = new StreamingAudioService();

// Event to communicate with TourController
const tourEvent = new CustomEvent('startTour');

const MIN_CONFIDENCE_THRESHOLD = 0.7; // Minimum confidence for transcription
const MIN_WORDS_THRESHOLD = 3; // Minimum words for a valid input
const MAX_SILENCE_DURATION = 1500; // Max silence duration in ms

const AIChatBot: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handlePlayback = async (messageId: number, text: string) => {
    if (audioState.isPlaying && audioState.messageId === messageId) {
      audioService.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else {
      setAudioState({ messageId, isPlaying: true, isLoading: true });
      try {
        await audioService.playText(text);
        setAudioState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        navigationLogger.error('Playback error', error);
        setAudioState({ messageId: null, isPlaying: false, isLoading: false });
      }
    }
  };

  const stopPlayback = () => {
    audioService.stop();
    setAudioState({ messageId: null, isPlaying: false, isLoading: false });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to check if input is coherent
  const isCoherentInput = async (text: string): Promise<boolean> => {
    // Quick checks first
    if (!text || text.trim().split(' ').length < MIN_WORDS_THRESHOLD) {
      return false;
    }

    try {
      // Use AI to check coherence
      const response = await fetch('/api/check-coherence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) return false;
      const { isCoherent, confidence } = await response.json();
      return isCoherent && confidence >= MIN_CONFIDENCE_THRESHOLD;
    } catch (error) {
      navigationLogger.error('Coherence check failed', error);
      // Fall back to basic word count check if AI check fails
      return text.trim().split(' ').length >= MIN_WORDS_THRESHOLD;
    }
  };

  const startGuidedTour = () => {
    // If not on home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete
      setTimeout(() => {
        window.dispatchEvent(tourEvent);
      }, 1000);
    } else {
      window.dispatchEvent(tourEvent);
    }
    
    // Respond to user
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "I'll start the guided tour now! I'll walk you through each section of our platform, explaining the features and benefits. Feel free to ask questions at any time.",
      timestamp: new Date()
    }]);
  };

  // Function to check if input is a tour command
  const isTourCommand = (text: string): boolean => {
    const tourPhrases = [
      'start tour',
      'begin tour',
      'start guided tour',
      'begin guided tour',
      'give me a tour',
      'show me around'
    ];
    return tourPhrases.some(phrase => text.toLowerCase().includes(phrase));
  };

  const handleSend = async (text?: string) => {
    const trimmedInput = (text || inputText)?.trim();
    if (!trimmedInput || isLoading) return;

    // Check for tour command first
    if (isTourCommand(trimmedInput)) {
      setInputText('');
      setMessages(prev => [...prev, {
        role: 'user',
        content: trimmedInput,
        timestamp: new Date()
      }]);
      startGuidedTour();
      return;
    }

    // Check if we should interrupt current response
    const shouldInterrupt = audioState.isPlaying && await isCoherentInput(trimmedInput);
    if (shouldInterrupt) {
      audioService.stopCurrentResponse();
      navigationLogger.info('Interrupting current response for new coherent input');
    }

    navigationLogger.info('Sending message', { text: trimmedInput });

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
          threadId: threadId,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Create a new message immediately
      const aiMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Stream the response
      if (isTTSEnabled) {
        navigationLogger.info('Streaming AI response');
        await audioService.streamResponse(response.body as ReadableStream<Uint8Array>);
      }

      // Get the complete response text
      const data = await response.json();
      setThreadId(data.threadId);

      // Update the message with complete text
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 ? { ...msg, content: data.message } : msg
      ));

      if (isContinuousMode) {
        navigationLogger.info('Ready for next input');
      }
    } catch (error) {
      navigationLogger.error('Chat error', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const { 
    isRecording, 
    isSpeaking,
    startRecording, 
    stopRecording
  } = useVoiceRecorder({
    onStartSpeaking: () => {
      audioService.handleUserSpeakingStarted();
      navigationLogger.info('User started speaking, fading out AI audio');
    },
    onStopSpeaking: () => {
      audioService.handleUserSpeakingEnded();
      navigationLogger.info('User stopped speaking, restoring AI audio');
    },
    onRecordingComplete: async (blob) => {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      try {
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const { text } = await response.json();
        if (text && text.trim()) {
          const isCoherent = await isCoherentInput(text);
          if (isCoherent) {
            setInputText(text);
            await handleSend(text);
          } else {
            navigationLogger.info('Skipping incoherent input', { text });
          }
        }
        setCurrentTranscription('');

      } catch (error) {
        navigationLogger.error('Transcription failed', error);
      }
    },
    silenceThreshold: MAX_SILENCE_DURATION,
    minDecibels: -45
  });

  // Start continuous recording when continuous mode is enabled
  useEffect(() => {
    if (isContinuousMode && !isRecording) {
      navigationLogger.info('Starting continuous recording');
      startRecording();
    }
  }, [isContinuousMode, isRecording, startRecording]);

  // Update volume when TTS is toggled
  useEffect(() => {
    audioService.setVolume(isTTSEnabled ? 1 : 0);
  }, [isTTSEnabled]);

  const handleContinuousModeToggle = () => {
    if (!hasSeenContinuousModal) {
      setShowContinuousModal(true);
    } else {
      const newMode = !isContinuousMode;
      navigationLogger.info(`${newMode ? 'Enabling' : 'Disabling'} continuous mode`);
      setIsContinuousMode(newMode);
      if (newMode) {
        setIsTTSEnabled(true);
        startRecording();
      } else {
        stopRecording();
      }
    }
  };

  const handleAcceptContinuousMode = () => {
    navigationLogger.info('Continuous mode accepted');
    setHasSeenContinuousModal(true);
    localStorage.setItem('hasSeenContinuousModal', 'true');
    setIsContinuousMode(true);
    setIsTTSEnabled(true);
    startRecording();
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleContinuousModeToggle}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      isContinuousMode 
                        ? 'bg-[#8B1538] text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                    title={isContinuousMode ? 'Disable voice assistant' : 'Enable voice assistant'}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRecording ? 'animate-spin' : ''}`} />
                    {isRecording && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  <div className="flex-1">
            <textarea
                      value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
              rows={1}
                      className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
                  </div>

            <button
                      onClick={() => handleSend()}
                    disabled={!inputText?.trim() || isLoading}
              className="p-2 bg-[#8B1538] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B1028] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
                </div>

                {currentTranscription && (
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
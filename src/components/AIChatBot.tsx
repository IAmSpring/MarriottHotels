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
import { logger } from '../lib/browserLogger';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
  const { isAdmin } = useAuth();
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
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [showContinuousModal, setShowContinuousModal] = useState(false);
  const [hasSeenContinuousModal, setHasSeenContinuousModal] = useState(() => {
    return localStorage.getItem('hasSeenContinuousModal') === 'true';
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useState<string>(import.meta.env.VITE_AI_ASSISTANT_ID);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset admin mode when user is not admin
  useEffect(() => {
    if (!isAdmin()) {
      setIsAdminMode(false);
      setCurrentAssistantId(import.meta.env.VITE_AI_ASSISTANT_ID);
    }
  }, [isAdmin]);

  const handlePlayback = async (messageId: number, text: string) => {
    if (audioState.isPlaying && audioState.messageId === messageId) {
      logger.info('Pausing audio playback', { messageId }, 'AIChatBot');
      audioService.pause();
      setAudioState((prev: AudioState) => ({ ...prev, isPlaying: false }));
    } else {
      logger.info('Starting audio playback', { messageId, textLength: text.length }, 'AIChatBot');
      setAudioState({ messageId, isPlaying: true, isLoading: true });
      try {
        await audioService.playText(text);
        setAudioState((prev: AudioState) => ({ ...prev, isLoading: false }));
      } catch (error) {
        logger.error('Audio playback error', { error, messageId }, 'AIChatBot');
        setAudioState({ messageId: null, isPlaying: false, isLoading: false });
      }
    }
  };

  const stopPlayback = () => {
    logger.debug('Stopping audio playback', null, 'AIChatBot');
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
    setMessages((prev: Message[]) => [...prev, {
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

  const toggleAdminMode = () => {
    logger.info('Toggling admin mode', { 
      currentMode: isAdminMode ? 'admin' : 'concierge',
      newMode: isAdminMode ? 'concierge' : 'admin'
    }, 'AIChatBot');

    setIsAdminMode((prev: boolean) => !prev);
    setCurrentAssistantId((prev: string) => 
      prev === import.meta.env.VITE_AI_ASSISTANT_ID 
        ? import.meta.env.VITE_AI_ADMIN_ID 
        : import.meta.env.VITE_AI_ASSISTANT_ID
    );
    setMessages([]);
    setThreadId(undefined);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isLoading) return;

    // Check for tour command first
    if (isTourCommand(messageText)) {
      logger.info('Starting guided tour', { messageText }, 'AIChatBot');
      setInputText('');
      setMessages((prev: Message[]) => [...prev, {
        role: 'user',
        content: messageText,
      timestamp: new Date()
      }]);
      startGuidedTour();
      return;
    }

    logger.info('Sending message', { 
      messageText, 
      isAdminMode, 
      assistantId: currentAssistantId,
      threadId 
    }, 'AIChatBot');

    setInputText('');
    setMessages((prev: Message[]) => [...prev, {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          threadId,
          assistantId: currentAssistantId,
          isAdmin: isAdminMode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      logger.debug('Received response', { 
        threadId: data.threadId,
        responseLength: data.response.length 
      }, 'AIChatBot');

      setThreadId(data.threadId);

      const messageIndex = messages.length;
      const aiMessage = {
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, aiMessage]);

      // Auto-play TTS if enabled and not in admin mode
      if (isTTSEnabled && !isAdminMode) {
        logger.debug('Auto-playing TTS response', { messageIndex }, 'AIChatBot');
        setTimeout(() => {
          handlePlayback(messageIndex, stripMarkdown(data.response));
        }, 100); // Small delay to ensure message is rendered
      }
    } catch (error) {
      logger.error('Message send error', { error, messageText }, 'AIChatBot');
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
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
      setIsContinuousMode((prev: boolean) => !prev);
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
    <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'flex' : ''}`}>
      <ContinuousModeModal
        isOpen={showContinuousModal}
        onClose={() => setShowContinuousModal(false)}
        onAccept={handleAcceptContinuousMode}
      />
      
      <div className="flex flex-col items-end space-y-4">
        {!isOpen && (
          <button
            onClick={() => setIsOpen((prev: boolean) => !prev)}
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
                <span className="font-semibold">
                  {isAdminMode ? 'AI Admin Assistant' : 'AI Concierge'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsTTSEnabled((prev: boolean) => !prev)}
                  className={`p-2 rounded-full transition-colors ${
                    isTTSEnabled ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={isTTSEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {isTTSEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                {isAdmin() && (
                  <button
                    onClick={toggleAdminMode}
                    className="relative w-8 h-8 p-1 rounded-full hover:bg-gray-100 transition-all duration-300"
                    title={isAdminMode ? 'Switch to Concierge' : 'Switch to Admin'}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-4 h-0.5 bg-gray-600 absolute transform transition-all duration-300 ${isAdminMode ? 'rotate-45' : 'rotate-0'}`} />
                      <div className={`w-4 h-0.5 bg-gray-600 absolute transform transition-all duration-300 ${isAdminMode ? '-rotate-45' : 'rotate-90'}`} />
                    </div>
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded((prev: boolean) => !prev)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  {isExpanded ? <Minimize className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopPlayback();
                  }}
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
                    isContinuousMode ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={isContinuousMode ? 'Stop continuous mode' : 'Start continuous mode'}
                >
                  <Mic size={20} />
                </button>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  rows={1}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputText.trim()}
                  className={`p-2 rounded-full ${
                    isLoading || !inputText.trim()
                      ? 'text-gray-400 bg-gray-100'
                      : 'text-white bg-[#8B1538] hover:bg-[#6B1028]'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatBot;
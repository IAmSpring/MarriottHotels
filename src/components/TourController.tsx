import React, { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourState, TourAction, TourSection } from '../types';
import { useLocation } from 'react-router-dom';
import { audioManager } from '../utils/audioManager';
import { isStaticBuild, getStaticResponse } from '../lib/openai';
import { Buffer } from 'buffer';
import { fetchApi, handleApiError } from '../lib/staticApi';
import { navigationLogger } from '../utils/navigationLogger';

const tourSections: TourSection[] = [
  {
    id: 'hero',
    name: 'Welcome',
    description: 'Start your journey with Marriott Hotels',
    narration: 'Welcome to Marriott Hotels. Our site showcases our commitment to extraordinary experiences and world-class hospitality. You can easily search for your perfect destination, select your dates, and begin your journey.',
    element: '#hero-section'
  },
  {
    id: 'dining',
    name: 'Dining Experience',
    description: 'Discover culinary excellence',
    narration: 'Our dining section highlights the exceptional culinary experiences available at Marriott properties. From fine dining restaurants to casual cafes, we offer a diverse range of dining options to satisfy every palate.',
    element: '#dining-section'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Explore exciting destinations',
    narration: 'The adventure section presents exciting destinations and experiences waiting to be discovered. From mountain retreats to urban escapes, find your next unforgettable adventure with Marriott.',
    element: '#adventure-section'
  },
  {
    id: 'boutique',
    name: 'Boutique Hotels',
    description: 'Unique and intimate stays',
    narration: 'Our boutique hotels offer intimate and unique experiences. Each property has its own character and charm, providing personalized service and distinctive accommodations.',
    element: '#boutique-section'
  },
  {
    id: 'featured',
    name: 'Featured Hotels',
    description: 'Our most popular properties',
    narration: 'Discover our featured hotels, carefully selected to showcase the best of Marriott hospitality. These properties represent the pinnacle of comfort, luxury, and service excellence.',
    element: '#featured-section'
  },
  {
    id: 'bonvoy',
    name: 'Bonvoy Rewards',
    description: 'Exclusive member benefits',
    narration: 'Join Marriott Bonvoy to unlock exclusive benefits and rewards. Our loyalty program offers points for stays, room upgrades, and unique experiences around the world.',
    element: '#bonvoy-section'
  },
  {
    id: 'experience',
    name: 'Experiences',
    description: 'Curated activities and events',
    narration: 'The experiences section showcases our curated collection of activities and events. From spa treatments to local tours, enhance your stay with these carefully selected experiences.',
    element: '#experience-section'
  },
  {
    id: 'destinations',
    name: 'Destination Guides',
    description: 'Expert travel insights',
    narration: 'Our destination guides provide expert insights and recommendations for your travels. Learn about local attractions, dining spots, and hidden gems in each location.',
    element: '#destinations-section'
  }
];

const initialState: TourState = {
  isPlaying: false,
  currentSectionIndex: 0,
  sections: tourSections,
  audio: null,
  isLoading: false
};

function tourReducer(state: TourState, action: TourAction): TourState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'NEXT_SECTION':
      const nextIndex = Math.min(state.currentSectionIndex + 1, state.sections.length - 1);
      return {
        ...state,
        currentSectionIndex: nextIndex,
        isPlaying: nextIndex !== state.currentSectionIndex ? state.isPlaying : false
      };
    case 'PREVIOUS_SECTION':
      const prevIndex = Math.max(state.currentSectionIndex - 1, 0);
      return {
        ...state,
        currentSectionIndex: prevIndex,
        isPlaying: prevIndex !== state.currentSectionIndex ? state.isPlaying : false
      };
    case 'JUMP_TO_SECTION':
      return {
        ...state,
        currentSectionIndex: action.payload,
        isPlaying: action.payload !== state.currentSectionIndex ? state.isPlaying : false
      };
    case 'SET_AUDIO':
      return {
        ...state,
        audio: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

// Move cache outside component to persist across re-renders
const CACHE_VERSION = '1';
const CACHE_PREFIX = 'marriott_tts_';

// Enhanced audio cache with versioning and timestamps
interface CachedAudio {
  data: string;
  timestamp: number;
  version: string;
}

// Initialize cache map
const audioCache = new Map<string, CachedAudio>();

// Load cache from localStorage on module load
try {
  const savedCache = localStorage.getItem(CACHE_PREFIX + 'cache');
  if (savedCache) {
    const parsed = JSON.parse(savedCache);
    if (parsed.version === CACHE_VERSION) {
      Object.entries(parsed.data).forEach(([key, value]) => {
        audioCache.set(key, value as CachedAudio);
      });
      console.log('Loaded TTS cache:', audioCache.size, 'entries');
    }
  }
} catch (error) {
  console.warn('Failed to load TTS cache:', error);
}

// Save cache to localStorage
const saveCache = () => {
  try {
    const cacheData = Object.fromEntries(audioCache.entries());
    localStorage.setItem(CACHE_PREFIX + 'cache', JSON.stringify({
      version: CACHE_VERSION,
      data: cacheData
    }));
  } catch (error) {
    console.warn('Failed to save TTS cache:', error);
  }
};

const loadAndPlayAudio = async (audioData: string, cacheKey: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    try {
    // Check cache first
    const cached = audioCache.get(cacheKey);
      if (cached && cached.version === CACHE_VERSION) {
      console.log('Using cached audio for:', cacheKey);
        // Create a new audio instance from cached data
        const audio = new Audio();
        audio.src = `data:audio/mp3;base64,${cached.data}`;
        
        const onCanPlay = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
          resolve(audio);
        };

        const onError = (e: Event) => {
          console.error('Cached audio loading error:', e);
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
          // Remove failed audio from cache
          audioCache.delete(cacheKey);
          saveCache();
          reject(new Error('Failed to load cached audio'));
        };

        audio.addEventListener('canplaythrough', onCanPlay, { once: true });
        audio.addEventListener('error', onError, { once: true });
      audio.load();
      return;
    }

    console.log('Loading new audio for:', cacheKey);
      const audio = new Audio();
      audio.src = `data:audio/mp3;base64,${audioData}`;
    
    const onCanPlay = () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
        // Store in cache with timestamp
        audioCache.set(cacheKey, {
          data: audioData,
          timestamp: Date.now(),
          version: CACHE_VERSION
        });
        saveCache();
      resolve(audio);
    };

      const onError = (e: Event) => {
        console.error('New audio loading error:', e);
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
        reject(new Error('Failed to load new audio'));
    };

      audio.addEventListener('canplaythrough', onCanPlay, { once: true });
      audio.addEventListener('error', onError, { once: true });
    audio.load();
    } catch (error) {
      console.error('Audio setup error:', error);
      reject(error);
    }
  });
};

// Cache cleanup function (called periodically)
const cleanupCache = () => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  let cleaned = 0;

  for (const [key, value] of audioCache.entries()) {
    if (value.version !== CACHE_VERSION || now - value.timestamp > maxAge) {
      audioCache.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log('Cleaned', cleaned, 'old cache entries');
    saveCache();
  }
};

const handleTTS = async (text: string) => {
  try {
    if (isStaticBuild()) {
      console.log('Static build - skipping TTS');
      return;
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.audioData) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
      audio.play();
    }
  } catch (error) {
    console.error('TTS Error:', error);
  }
};

const TourController: React.FC = () => {
  const [state, dispatch] = useReducer(tourReducer, initialState);
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const [isRightMouseDown, setIsRightMouseDown] = useState(false);

  // Listen for tour start event
  useEffect(() => {
    const handleTourStart = () => {
      navigationLogger.info('Starting guided tour from voice command');
      if (audioRef.current) {
        audioRef.current.pause();
      }
      dispatch({ type: 'JUMP_TO_SECTION', payload: 0 });
      dispatch({ type: 'PLAY' });
    };

    window.addEventListener('startTour', handleTourStart);
    return () => window.removeEventListener('startTour', handleTourStart);
  }, []);

  // Add cache cleanup on mount
  useEffect(() => {
    cleanupCache();
    const cleanupInterval = setInterval(cleanupCache, 60 * 60 * 1000); // Every hour
    return () => clearInterval(cleanupInterval);
  }, []);

  // Add effect to handle section changes
  useEffect(() => {
    scrollToSection(state.currentSectionIndex);
  }, [state.currentSectionIndex]);

  const scrollToSection = (index: number) => {
    const section = state.sections[index];
    const element = document.querySelector(section.element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle right-click events
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent default context menu
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) { // Right mouse button
        setIsRightMouseDown(true);
        if (e.clientY < window.innerHeight / 2) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        setIsRightMouseDown(false);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle audio interruption from other sources
  useEffect(() => {
    const handleOtherAudioPlaying = (source: string) => {
      if (source !== 'tour' && state.isPlaying) {
        dispatch({ type: 'PAUSE' });
      }
    };

    audioManager.addPlayCallback(handleOtherAudioPlaying);
    return () => {
      audioManager.removePlayCallback(handleOtherAudioPlaying);
    };
  }, [state.isPlaying]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioManager.setAudio(null);
      }
    };
  }, []);

  const setupAudioListeners = (audio: HTMLAudioElement) => {
    // Remove any existing listeners
    const newAudio = audio.cloneNode() as HTMLAudioElement;
    
    const onEnded = () => {
      console.log('Audio ended');
      if (state.currentSectionIndex < state.sections.length - 1 && state.isPlaying) {
        dispatch({ type: 'NEXT_SECTION' });
      } else {
        dispatch({ type: 'PAUSE' });
      }
      audioManager.setAudio(null);
      newAudio.removeEventListener('ended', onEnded);
    };

    const onError = (error: Event) => {
      console.error('Audio playback error:', error);
      dispatch({ type: 'PAUSE' });
      audioManager.setAudio(null);
      newAudio.removeEventListener('error', onError);
    };

    const onPause = () => {
      console.log('Audio paused');
      if (!newAudio.ended) {
        audioManager.setAudio(null);
      }
      newAudio.removeEventListener('pause', onPause);
    };

    newAudio.addEventListener('ended', onEnded);
    newAudio.addEventListener('error', onError);
    newAudio.addEventListener('pause', onPause);

    return newAudio;
  };

  const generateAndPlayAudio = async (text: string) => {
    try {
      // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      audioManager.setAudio(null);
    }

      dispatch({ type: 'SET_LOADING', payload: true });

      if (isStaticBuild()) {
        // In static mode, just pause after a short delay
        setTimeout(() => {
          dispatch({ type: 'PAUSE' });
          dispatch({ type: 'SET_LOADING', payload: false });
        }, 500);
        return;
      }
      
      // Clean the text for TTS and create cache key
      const cleanText = text.replace(/[*#\[\]]/g, '');
      const cacheKey = `${cleanText}_${CACHE_VERSION}`;

      // Check cache first
      const cached = audioCache.get(cacheKey);
      if (cached && cached.version === CACHE_VERSION) {
        const audio = await loadAndPlayAudio(cached.data, cacheKey);
        const newAudio = setupAudioListeners(audio);
        audioRef.current = newAudio;
        audioManager.setAudio(newAudio, 'tour');
        dispatch({ type: 'SET_AUDIO', payload: newAudio });
        
        if (state.isPlaying) {
          await newAudio.play();
        }
        return;
      }

      // Call the TTS API endpoint if not cached
      const response = await fetchApi('tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.audioData) {
        throw new Error('No audio data received from TTS API');
      }

      const audio = await loadAndPlayAudio(data.audioData, cacheKey);
      const newAudio = setupAudioListeners(audio);
      audioRef.current = newAudio;
      audioManager.setAudio(newAudio, 'tour');
      dispatch({ type: 'SET_AUDIO', payload: newAudio });
      
      if (state.isPlaying) {
        await newAudio.play();
      }
    } catch (error) {
      const { error: errorMessage, isStatic } = handleApiError(error);
      console.error('TTS Error:', errorMessage);
      if (!isStatic) {
      dispatch({ type: 'PAUSE' });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Setup effect
  useEffect(() => {
    if (isFirstRender.current) {
      inactivityTimerRef.current = setTimeout(() => {
        dispatch({ type: 'PLAY' });
      }, 5000);
      isFirstRender.current = false;
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Location change effect
  useEffect(() => {
    dispatch({ type: 'PAUSE' });
    dispatch({ type: 'JUMP_TO_SECTION', payload: 0 });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [location]);

  // Playback effect - remove scrollToSection from here since it's handled by the new effect
  useEffect(() => {
    if (state.isPlaying) {
      const currentSection = state.sections[state.currentSectionIndex];
      generateAndPlayAudio(currentSection.narration);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [state.isPlaying, state.currentSectionIndex]);

  const handlePlayPause = () => {
    if (state.isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    dispatch({ type: state.isPlaying ? 'PAUSE' : 'PLAY' });
  };

  const handlePrevious = () => {
    if (state.currentSectionIndex > 0) {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    dispatch({ type: 'PREVIOUS_SECTION' });
    }
  };

  const handleNext = () => {
    if (state.currentSectionIndex < state.sections.length - 1) {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    dispatch({ type: 'NEXT_SECTION' });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-4 z-50">
      <button
        onClick={handlePrevious}
        disabled={state.currentSectionIndex === 0}
        className={`p-2 rounded-full transition-colors ${
          state.currentSectionIndex === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        title="Previous section"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={handlePlayPause}
        disabled={state.isLoading}
        className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${
          state.isPlaying ? 'text-[#8B1538]' : 'text-gray-700'
        }`}
        title={state.isPlaying ? "Pause tour" : "Play tour"}
      >
        {state.isLoading ? (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-[#8B1538] border-r-[#8B1538] border-b-[#8B1538] border-l-transparent"></div>
          </div>
        ) : state.isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={handleNext}
        disabled={state.currentSectionIndex === state.sections.length - 1}
        className={`p-2 rounded-full transition-colors ${
          state.currentSectionIndex === state.sections.length - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        title="Next section"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TourController; 
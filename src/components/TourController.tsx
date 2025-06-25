import React, { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourState, TourAction, TourSection } from '../types';
import { useLocation } from 'react-router-dom';
import { audioManager } from '../utils/audioManager';

const tourSections: TourSection[] = [
  {
    id: 'hero',
    name: 'Welcome',
    description: 'Start your journey with Marriott Hotels',
    narration: 'Welcome to Marriott Hotels. Our hero section showcases our commitment to extraordinary experiences and world-class hospitality. You can easily search for your perfect destination, select your dates, and begin your journey.',
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

// Audio cache for TTS
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

const TourController: React.FC = () => {
  const [state, dispatch] = useReducer(tourReducer, initialState);
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const [isRightMouseDown, setIsRightMouseDown] = useState(false);

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
    audio.addEventListener('ended', () => {
      if (state.currentSectionIndex < state.sections.length - 1 && state.isPlaying) {
        dispatch({ type: 'NEXT_SECTION' });
      } else {
        dispatch({ type: 'PAUSE' });
      }
      audioManager.setAudio(null);
    });

    audio.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
      dispatch({ type: 'PAUSE' });
      audioManager.setAudio(null);
    });

    audio.addEventListener('pause', () => {
      if (!audio.ended) {
        audioManager.setAudio(null);
      }
    });
  };

  const generateAndPlayAudio = async (text: string) => {
    const cacheKey = `tour-${state.currentSectionIndex}-${text.substring(0, 50)}`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      audioManager.setAudio(null);
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Check cache first
      const cached = audioCache.get(cacheKey);
      if (cached) {
        const audio = await loadAndPlayAudio(cached.data, cacheKey);
        setupAudioListeners(audio);
        audioRef.current = audio;
        audioManager.setAudio(audio, 'tour');
        await audio.play();
        return;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error('Failed to generate speech: ' + (error.details || error.error));
      }

      const { audioData } = await response.json();
      
      if (!audioData) {
        throw new Error('No audio data received');
      }

      const audio = await loadAndPlayAudio(audioData, cacheKey);
      setupAudioListeners(audio);
      audioRef.current = audio;
      audioManager.setAudio(audio, 'tour');
      await audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
      dispatch({ type: 'PAUSE' });
      audioManager.setAudio(null);
      // Remove failed audio from cache
      audioCache.delete(cacheKey);
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
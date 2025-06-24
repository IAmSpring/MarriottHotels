import React, { useEffect, useReducer, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourState, TourAction, TourSection } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
  audio: null
};

function tourReducer(state: TourState, action: TourAction): TourState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'NEXT_SECTION':
      return {
        ...state,
        currentSectionIndex: Math.min(state.currentSectionIndex + 1, state.sections.length - 1)
      };
    case 'PREVIOUS_SECTION':
      return {
        ...state,
        currentSectionIndex: Math.max(state.currentSectionIndex - 1, 0)
      };
    case 'JUMP_TO_SECTION':
      return {
        ...state,
        currentSectionIndex: action.payload
      };
    case 'SET_AUDIO':
      return {
        ...state,
        audio: action.payload
      };
    default:
      return state;
  }
}

const TourController: React.FC = () => {
  const [state, dispatch] = useReducer(tourReducer, initialState);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const isFirstRender = useRef(true);

  const generateAndPlayAudio = async (text: string) => {
    try {
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text
      });

      const audioBlob = await response.arrayBuffer();
      const audioUrl = URL.createObjectURL(new Blob([audioBlob], { type: 'audio/mpeg' }));
      const audio = new Audio(audioUrl);

      audio.addEventListener('ended', () => {
        if (state.isPlaying) {
          dispatch({ type: 'NEXT_SECTION' });
        }
      });

      dispatch({ type: 'SET_AUDIO', payload: audio });
      audio.play();
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  const scrollToSection = (index: number) => {
    const section = state.sections[index];
    const element = document.querySelector(section.element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Start auto-play after 5 seconds of inactivity on first load
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
    };
  }, []);

  useEffect(() => {
    if (state.isPlaying) {
      const currentSection = state.sections[state.currentSectionIndex];
      if (state.audio) {
        state.audio.pause();
        state.audio.currentTime = 0;
      }
      generateAndPlayAudio(currentSection.narration);
      scrollToSection(state.currentSectionIndex);
    } else if (state.audio) {
      state.audio.pause();
    }
  }, [state.isPlaying, state.currentSectionIndex]);

  const handlePlayPause = () => {
    dispatch({ type: state.isPlaying ? 'PAUSE' : 'PLAY' });
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_SECTION' });
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT_SECTION' });
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-4">
      <button
        onClick={handlePrevious}
        disabled={state.currentSectionIndex === 0}
        className={`p-2 rounded-full ${
          state.currentSectionIndex === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handlePlayPause}
        className="p-2 rounded-full bg-[#8B1538] text-white hover:bg-[#6B1028]"
      >
        {state.isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={handleNext}
        disabled={state.currentSectionIndex === state.sections.length - 1}
        className={`p-2 rounded-full ${
          state.currentSectionIndex === state.sections.length - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="text-sm text-gray-600">
        {state.sections[state.currentSectionIndex].name}
      </div>
    </div>
  );
};

export default TourController; 
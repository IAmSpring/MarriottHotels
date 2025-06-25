export interface Room {
  type: string;
  price: number;
  description: string;
  beds: string;
  occupancy: string;
  size: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  description: string;
  reviews: number;
  amenities: string[];
  rooms: Room[];
  type?: 'standard' | 'boutique' | 'luxury';
  featured?: boolean;
  images?: string[];
}

export interface Experience {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  images: string[];
  highlights: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  popularHotels: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  location: string;
  openingHours: string;
}

export interface Adventure {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  images: string[];
  included: string[];
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  description: string;
  type: 'hotel' | 'dining' | 'experience';
  validUntil: string;
  terms: string[];
}

export interface BookingFilters {
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}

export interface BookingDetails {
  hotelId: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export interface TourSection {
  id: string;
  name: string;
  description: string;
  narration: string;
  element: string; // CSS selector for the section
}

export interface TourState {
  isPlaying: boolean;
  currentSectionIndex: number;
  sections: TourSection[];
  audio: HTMLAudioElement | null;
  isLoading: boolean;
}

export type TourAction = 
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'NEXT_SECTION' }
  | { type: 'PREVIOUS_SECTION' }
  | { type: 'JUMP_TO_SECTION'; payload: number }
  | { type: 'SET_AUDIO'; payload: HTMLAudioElement | null }
  | { type: 'SET_LOADING'; payload: boolean }; 
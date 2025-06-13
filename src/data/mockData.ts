export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  type: 'standard' | 'boutique' | 'luxury';
  featured?: boolean;
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

export interface Reward {
  id: string;
  name: string;
  points: number;
  description: string;
  type: 'hotel' | 'dining' | 'experience';
  validUntil: string;
  terms: string[];
}

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Marriott Grand Plaza',
    location: 'New York City, USA',
    description: 'Luxury hotel in the heart of Manhattan with stunning city views.',
    price: 299,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
    ],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service'],
    type: 'luxury',
    featured: true
  },
  // Add more hotels...
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'tin-lung-heen',
    name: 'Tin Lung Heen',
    cuisine: 'Cantonese',
    description: 'Two Michelin-starred Cantonese restaurant offering refined dim sum and signature dishes with panoramic views of Hong Kong.',
    price: 200,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/2814828/pexels-photo-2814828.jpeg',
      'https://images.pexels.com/photos/2814832/pexels-photo-2814832.jpeg',
    ],
    location: 'The Ritz-Carlton, Hong Kong',
    openingHours: '11:30 AM - 10:30 PM'
  },
  {
    id: '1',
    name: 'The Burgundy Room',
    cuisine: 'French',
    description: 'Fine dining experience with authentic French cuisine.',
    price: 150,
    rating: 4.7,
    images: [
      'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    ],
    location: 'Marriott Grand Plaza, New York',
    openingHours: '5:30 PM - 10:30 PM'
  },
  // Add more restaurants...
];

export const mockAdventures: Adventure[] = [
  {
    id: '1',
    name: 'Mountain Trek Experience',
    location: 'Swiss Alps',
    description: 'Guided mountain trek with stunning views and luxury accommodations.',
    price: 599,
    duration: '3 days',
    difficulty: 'moderate',
    images: [
      'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg',
      'https://images.pexels.com/photos/870711/pexels-photo-870711.jpeg',
    ],
    included: ['Equipment', 'Guide', 'Meals', 'Accommodation']
  },
  // Add more adventures...
];

export const mockExperiences: Experience[] = [
  {
    id: '1',
    name: 'Wine Tasting Tour',
    type: 'Culinary',
    description: 'Exclusive wine tasting experience in Napa Valley.',
    price: 299,
    duration: '4 hours',
    location: 'Napa Valley, USA',
    images: [
      'https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg',
      'https://images.pexels.com/photos/39351/purple-grapes-vineyard-napa-valley-napa-vineyard-39351.jpeg',
    ],
    highlights: ['Private tour', 'Premium wines', 'Gourmet lunch', 'Expert guide']
  },
  // Add more experiences...
];

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Maldives',
    country: 'Maldives',
    description: 'Paradise on Earth with crystal clear waters and luxury resorts.',
    images: [
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
    ],
    highlights: ['Overwater villas', 'Coral reefs', 'Water sports', 'Spa retreats'],
    bestTimeToVisit: 'November to April',
    popularHotels: ['1', '2', '3']
  },
  // Add more destinations...
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Free Night Stay',
    points: 50000,
    description: 'Redeem for a free night at any category 5 hotel.',
    type: 'hotel',
    validUntil: '2024-12-31',
    terms: ['Blackout dates apply', 'Subject to availability', 'Cannot be combined with other offers']
  },
  // Add more rewards...
];

// Helper function to get featured hotels
export const getFeaturedHotels = () => mockHotels.filter(hotel => hotel.featured);

// Helper function to get hotels by type
export const getHotelsByType = (type: Hotel['type']) => mockHotels.filter(hotel => hotel.type === type);

// Helper function to get experiences by type
export const getExperiencesByType = (type: string) => mockExperiences.filter(exp => exp.type === type);

// Helper function to get destinations by country
export const getDestinationsByCountry = (country: string) => mockDestinations.filter(dest => dest.country === country); 
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
  reviews: number;
  rooms: Room[];
  totalRooms: number;
  occupiedRooms: number;
  avgDailyRate: number;
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

export interface Room {
  type: string;
  price: number;
  description: string;
  beds: string;
  occupancy: string;
  size: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  lastLogin: Date;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Booking {
  id: string;
  guestName: string;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  totalAmount: number;
  roomType: string;
}

export interface Revenue {
  date: Date;
  amount: number;
  source: 'DIRECT' | 'OTA' | 'CORPORATE';
  hotelId: string;
}

export interface Complaint {
  id: string;
  guestName: string;
  hotelName: string;
  date: Date;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  category: string;
  description: string;
}

export interface MaintenanceRequest {
  id: string;
  hotelName: string;
  roomNumber: string;
  issue: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dateReported: Date;
}

export interface StaffSchedule {
  id: string;
  employeeName: string;
  department: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  date: Date;
  hotelName: string;
}

export interface Inventory {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  hotelName: string;
  lastUpdated: Date;
}

export const mockHotels: Hotel[] = [
  {
    id: 'sandbourne-santa-monica',
    name: 'Sandbourne Santa Monica',
    location: 'Santa Monica, California, USA',
    description: 'A luxurious boutique hotel steps away from Santa Monica Beach, offering a perfect blend of coastal charm and modern luxury.',
    price: 450,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      'https://images.pexels.com/photos/261156/pexels-photo-261156.jpeg',
      'https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg'
    ],
    amenities: ['Beach Access', 'Rooftop Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Valet Parking'],
    type: 'boutique',
    featured: true,
    reviews: 856,
    rooms: [
      {
        type: 'Ocean View Room',
        price: 450,
        description: 'Elegant room with stunning ocean views and private balcony',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '475 sq ft'
      },
      {
        type: 'Luxury Suite',
        price: 750,
        description: 'Spacious suite with separate living area and ocean views',
        beds: '1 King',
        occupancy: '3 Adults',
        size: '750 sq ft'
      },
      {
        type: 'Penthouse Suite',
        price: 1200,
        description: 'Ultimate luxury with panoramic views and private terrace',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,200 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
  {
    id: 'trailborn-highlands',
    name: 'Trailborn Highlands',
    location: 'Asheville, North Carolina, USA',
    description: 'Nestled in the Blue Ridge Mountains, this boutique retreat offers a perfect blend of rustic charm and modern comfort.',
    price: 380,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
      'https://images.pexels.com/photos/2662117/pexels-photo-2662117.jpeg',
      'https://images.pexels.com/photos/2662118/pexels-photo-2662118.jpeg'
    ],
    amenities: ['Mountain Views', 'Hiking Trails', 'Spa', 'Farm-to-Table Restaurant', 'Yoga Studio'],
    type: 'boutique',
    featured: true,
    reviews: 634,
    rooms: [
      {
        type: 'Mountain View Room',
        price: 380,
        description: 'Cozy room with stunning mountain views',
        beds: '1 King or 2 Queen',
        occupancy: '2-4 Adults',
        size: '400 sq ft'
      },
      {
        type: 'Highland Suite',
        price: 580,
        description: 'Luxurious suite with fireplace and private balcony',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '650 sq ft'
      }
    ],
    totalRooms: 400,
    occupiedRooms: 320,
    avgDailyRate: 450
  },
  {
    id: 'park-lane-hong-kong',
    name: 'Park Lane Hong Kong',
    location: 'Causeway Bay, Hong Kong',
    description: 'A sophisticated urban retreat in the heart of Hong Kong, offering stunning views of Victoria Harbour and the city skyline.',
    price: 520,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg',
      'https://images.pexels.com/photos/2417843/pexels-photo-2417843.jpeg',
      'https://images.pexels.com/photos/2417844/pexels-photo-2417844.jpeg'
    ],
    amenities: ['Harbour Views', 'Rooftop Bar', 'Spa', 'Fine Dining', 'Executive Lounge', 'Fitness Center'],
    type: 'boutique',
    featured: true,
    reviews: 923,
    rooms: [
      {
        type: 'Deluxe City View',
        price: 520,
        description: 'Modern room with city skyline views',
        beds: '1 King or 2 Queen',
        occupancy: '2-3 Adults',
        size: '450 sq ft'
      },
      {
        type: 'Harbour Suite',
        price: 820,
        description: 'Luxury suite with Victoria Harbour views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '700 sq ft'
      },
      {
        type: 'Executive Suite',
        price: 1100,
        description: 'Premium suite with lounge access and harbour views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '900 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
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
    featured: true,
    reviews: 1247,
    rooms: [
      {
        type: 'City View Room',
        price: 299,
        description: 'Modern room with stunning city views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '400 sq ft'
      },
      {
        type: 'Executive Suite',
        price: 499,
        description: 'Spacious suite with separate living area',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '650 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
  {
    id: 'obr-001',
    name: 'Ocean Breeze Resort',
    location: 'Miami Beach, FL',
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities.',
    price: 320,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      'https://images.pexels.com/photos/261156/pexels-photo-261156.jpeg'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access', 'Fitness Center'],
    type: 'luxury',
    reviews: 1247,
    rooms: [
      {
        type: 'Ocean View Room',
        price: 320,
        description: 'Spacious room with stunning ocean views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '450 sq ft'
      },
      {
        type: 'Luxury Suite',
        price: 550,
        description: 'Premium suite with separate living area',
        beds: '1 King',
        occupancy: '3 Adults',
        size: '750 sq ft'
      }
    ],
    totalRooms: 400,
    occupiedRooms: 320,
    avgDailyRate: 450
  },
  {
    id: 'cch-003',
    name: 'City Central Hotel',
    location: 'Manhattan, NY',
    description: 'Modern urban hotel in the heart of Manhattan with easy access to attractions.',
    price: 280,
    rating: 4.3,
    images: [
      'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg'
    ],
    amenities: ['WiFi', 'Restaurant', 'Gym', 'Parking', 'Business Center'],
    type: 'standard',
    reviews: 2156,
    rooms: [
      {
        type: 'City View Room',
        price: 280,
        description: 'Modern room with city views',
        beds: '1 King or 2 Double',
        occupancy: '2 Adults',
        size: '350 sq ft'
      },
      {
        type: 'Executive Suite',
        price: 450,
        description: 'Spacious suite with living area',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '600 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
  {
    id: 'dos-004',
    name: 'Desert Oasis Spa Resort',
    location: 'Scottsdale, AZ',
    description: 'Tranquil desert resort featuring award-winning spa treatments and golf course.',
    price: 380,
    rating: 4.7,
    images: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/258245/pexels-photo-258245.jpeg',
      'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Golf Course', 'Tennis Courts'],
    type: 'luxury',
    reviews: 743,
    rooms: [
      {
        type: 'Desert View Room',
        price: 380,
        description: 'Room with desert landscape views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '475 sq ft'
      },
      {
        type: 'Spa Suite',
        price: 580,
        description: 'Suite with private spa bath',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '700 sq ft'
      }
    ],
    totalRooms: 400,
    occupiedRooms: 320,
    avgDailyRate: 450
  },
  {
    id: 'cis-005',
    name: 'Coastal Inn & Suites',
    location: 'San Diego, CA',
    description: 'Comfortable coastal accommodation with easy beach access and family-friendly amenities.',
    price: 180,
    rating: 4.1,
    images: [
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      'https://images.pexels.com/photos/261156/pexels-photo-261156.jpeg',
      'https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg'
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Beach Access', 'Kids Club'],
    type: 'standard',
    reviews: 1534,
    rooms: [
      {
        type: 'Standard Room',
        price: 180,
        description: 'Comfortable room with basic amenities',
        beds: '2 Queen',
        occupancy: '4 Adults',
        size: '400 sq ft'
      },
      {
        type: 'Family Suite',
        price: 280,
        description: 'Suite with kitchenette',
        beds: '2 Queen + Sofa Bed',
        occupancy: '6 Adults',
        size: '600 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
  {
    id: 'hdb-006',
    name: 'Historic Downtown Boutique',
    location: 'Charleston, SC',
    description: 'Charming boutique hotel in historic district with Southern hospitality and elegance.',
    price: 220,
    rating: 4.5,
    images: [
      'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg',
      'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg',
      'https://images.pexels.com/photos/2417843/pexels-photo-2417843.jpeg'
    ],
    amenities: ['WiFi', 'Restaurant', 'Spa', 'Garden', 'Afternoon Tea'],
    type: 'boutique',
    reviews: 687,
    rooms: [
      {
        type: 'Historic Room',
        price: 220,
        description: 'Charming room with period features',
        beds: '1 Queen',
        occupancy: '2 Adults',
        size: '300 sq ft'
      },
      {
        type: 'Garden Suite',
        price: 350,
        description: 'Suite with garden views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '500 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
  {
    id: 'lsr-007',
    name: 'Lakeside Retreat',
    location: 'Lake Tahoe, CA',
    description: 'Serene lakeside hotel with breathtaking mountain and water views.',
    price: 290,
    rating: 4.6,
    images: [
      'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg',
      'https://images.pexels.com/photos/753619/pexels-photo-753619.jpeg',
      'https://images.pexels.com/photos/753623/pexels-photo-753623.jpeg'
    ],
    amenities: ['WiFi', 'Restaurant', 'Gym', 'Parking', 'Lake Access', 'Water Sports'],
    type: 'luxury',
    reviews: 956,
    rooms: [
      {
        type: 'Lake View Room',
        price: 290,
        description: 'Room with lake views',
        beds: '1 King or 2 Queen',
        occupancy: '4 Adults',
        size: '425 sq ft'
      },
      {
        type: 'Waterfront Suite',
        price: 490,
        description: 'Suite with private balcony',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '650 sq ft'
      }
    ],
    totalRooms: 400,
    occupiedRooms: 320,
    avgDailyRate: 450
  },
  {
    id: 'bci-008',
    name: 'Budget Comfort Inn',
    location: 'Austin, TX',
    description: 'Clean, comfortable, and affordable accommodation in the heart of Austin.',
    price: 95,
    rating: 3.8,
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
    ],
    amenities: ['WiFi', 'Parking', 'Continental Breakfast', 'Business Center'],
    type: 'standard',
    reviews: 2341,
    rooms: [
      {
        type: 'Standard Room',
        price: 95,
        description: 'Basic comfortable room',
        beds: '2 Double',
        occupancy: '4 Adults',
        size: '300 sq ft'
      },
      {
        type: 'Business Room',
        price: 120,
        description: 'Room with work desk',
        beds: '1 Queen',
        occupancy: '2 Adults',
        size: '325 sq ft'
      }
    ],
    totalRooms: 300,
    occupiedRooms: 250,
    avgDailyRate: 350
  },
  {
    id: 'lms-009',
    name: 'Luxury Metropolitan Suite',
    location: 'Chicago, IL',
    description: 'Ultra-luxury suites with panoramic city views and personalized concierge service.',
    price: 520,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      'https://images.pexels.com/photos/260932/pexels-photo-260932.jpeg',
      'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg'
    ],
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Gym', 'Concierge', 'Valet Parking'],
    type: 'luxury',
    reviews: 423,
    rooms: [
      {
        type: 'City Suite',
        price: 520,
        description: 'Luxury suite with city views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '800 sq ft'
      },
      {
        type: 'Penthouse Suite',
        price: 1200,
        description: 'Ultimate luxury experience',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,500 sq ft'
      }
    ],
    totalRooms: 400,
    occupiedRooms: 320,
    avgDailyRate: 450
  }
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
    id: 'es-fum',
    name: 'Es Fum',
    cuisine: 'Mediterranean',
    description: 'Michelin-starred restaurant offering innovative Mediterranean cuisine with a focus on local Mallorcan ingredients and stunning sea views.',
    price: 180,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
      'https://images.pexels.com/photos/3535384/pexels-photo-3535384.jpeg',
    ],
    location: 'St. Regis Mardavall Mallorca Resort, Spain',
    openingHours: '7:00 PM - 10:30 PM'
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
  }
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
    id: 'resorts',
    name: 'Resort Escapes',
    type: 'Resort',
    description: 'Indulge in luxury at our world-class resorts with pristine beaches, spa treatments, and unparalleled service.',
    price: 599,
    duration: '3-7 days',
    location: 'Various Locations',
    images: [
      'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg',
      'https://images.pexels.com/photos/3225532/pexels-photo-3225532.jpeg',
    ],
    highlights: ['Private Beach Access', 'Spa Treatments', 'Water Sports', 'Gourmet Dining', 'Luxury Accommodations']
  },
  {
    id: 'cities',
    name: 'City Getaways',
    type: 'Urban',
    description: 'Explore vibrant cities and urban adventures with curated experiences in the world\'s most exciting metropolises.',
    price: 399,
    duration: '2-5 days',
    location: 'Global Cities',
    images: [
      'https://images.pexels.com/photos/5379219/pexels-photo-5379219.jpeg',
      'https://images.pexels.com/photos/5379220/pexels-photo-5379220.jpeg',
    ],
    highlights: ['City Tours', 'Cultural Events', 'Shopping Districts', 'Local Cuisine', 'Nightlife']
  },
  {
    id: 'dining',
    name: 'Dining Excellence',
    type: 'Culinary',
    description: 'Savor exceptional culinary experiences with Michelin-starred chefs and unique gastronomic adventures.',
    price: 299,
    duration: '2-4 hours',
    location: 'Select Restaurants',
    images: [
      'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg',
      'https://images.pexels.com/photos/2549019/pexels-photo-2549019.jpeg',
    ],
    highlights: ['Chef\'s Table', 'Wine Pairing', 'Cooking Classes', 'Food Tours', 'Private Dining']
  },
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
  }
];

export const mockDestinations: Destination[] = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    description: 'Experience the energy of the city that never sleeps, with world-class hotels, dining, shopping, and entertainment.',
    images: [
      'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg',
      'https://images.pexels.com/photos/378571/pexels-photo-378571.jpeg',
    ],
    highlights: ['Times Square', 'Central Park', 'Broadway Shows', 'World-Class Shopping', 'Fine Dining'],
    bestTimeToVisit: 'April to June or September to November',
    popularHotels: ['marriott-marquis', 'st-regis-ny', 'ritz-carlton-ny']
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    description: 'Discover a city of superlatives, where luxury meets tradition in the heart of the Arabian Desert.',
    images: [
      'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg',
      'https://images.pexels.com/photos/1519089/pexels-photo-1519089.jpeg',
    ],
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Desert Safaris', 'Palm Jumeirah', 'Gold Souk'],
    bestTimeToVisit: 'November to March',
    popularHotels: ['burj-al-arab', 'atlantis-palm', 'ritz-carlton-dubai']
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    description: 'Fall in love with the City of Light, where romance, culture, and gastronomy create unforgettable memories.',
    images: [
      'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg',
      'https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg'
    ],
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées', 'French Cuisine'],
    bestTimeToVisit: 'June to August or September to October',
    popularHotels: ['ritz-paris', 'four-seasons-paris', 'le-bristol']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Immerse yourself in a fascinating blend of ultra-modern technology and traditional culture in Japan\'s capital.',
    images: [
      'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
      'https://images.pexels.com/photos/1388031/pexels-photo-1388031.jpeg',
    ],
    highlights: ['Shibuya Crossing', 'Imperial Palace', 'Tokyo Skytree', 'Tsukiji Market', 'Japanese Gardens'],
    bestTimeToVisit: 'March to May or September to November',
    popularHotels: ['park-hyatt-tokyo', 'mandarin-oriental-tokyo', 'ritz-carlton-tokyo']
  },
  {
    id: 'mount-rainier',
    name: 'Mount Rainier',
    country: 'United States',
    description: 'Experience the majestic beauty of the Pacific Northwest with stunning mountain views, pristine wilderness, and luxurious accommodations.',
    images: [
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
      'https://images.pexels.com/photos/417075/pexels-photo-417075.jpeg',
    ],
    highlights: ['National Park Access', 'Hiking Trails', 'Wildlife Viewing', 'Scenic Drives', 'Mountain Climbing'],
    bestTimeToVisit: 'July to September',
    popularHotels: ['rainier-lodge', 'mountain-view-resort']
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas',
    country: 'United States',
    description: 'Discover the entertainment capital of the world, featuring world-class shows, casinos, dining, and luxury resorts.',
    images: [
      'https://images.pexels.com/photos/415999/pexels-photo-415999.jpeg',
      'https://images.pexels.com/photos/416000/pexels-photo-416000.jpeg',
    ],
    highlights: ['Casino Resorts', 'Live Shows', 'Fine Dining', 'Shopping', 'Nightlife'],
    bestTimeToVisit: 'March to May and September to November',
    popularHotels: ['bellagio', 'venetian', 'caesars-palace']
  },
  {
    id: 'maldives',
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
  }
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

// Generate mock data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@marriott.com',
    role: 'ADMIN',
    lastLogin: new Date('2024-02-20T10:30:00'),
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@marriott.com',
    role: 'MANAGER',
    lastLogin: new Date('2024-02-19T15:45:00'),
    status: 'ACTIVE',
  },
  // Add more mock users...
];

export const mockBookings: Booking[] = [
  {
    id: 'B1',
    guestName: 'Michael Brown',
    hotelName: 'Marriott Downtown',
    checkIn: new Date('2024-03-01'),
    checkOut: new Date('2024-03-05'),
    status: 'CONFIRMED',
    totalAmount: 1200,
    roomType: 'Deluxe Suite',
  },
  {
    id: 'B2',
    guestName: 'Emma Wilson',
    hotelName: 'Marriott Resort',
    checkIn: new Date('2024-03-10'),
    checkOut: new Date('2024-03-15'),
    status: 'PENDING',
    totalAmount: 2500,
    roomType: 'Ocean View Suite',
  },
  // Add more mock bookings...
];

export const mockRevenue: Revenue[] = [
  {
    date: new Date('2024-02-01'),
    amount: 150000,
    source: 'DIRECT',
    hotelId: 'H1',
  },
  {
    date: new Date('2024-02-02'),
    amount: 125000,
    source: 'OTA',
    hotelId: 'H1',
  },
  // Add more mock revenue data...
];

export const mockComplaints: Complaint[] = [
  {
    id: 'C1',
    guestName: 'David Lee',
    hotelName: 'Marriott Downtown',
    date: new Date('2024-02-18'),
    status: 'NEW',
    category: 'Room Service',
    description: 'Delayed room service delivery',
  },
  {
    id: 'C2',
    guestName: 'Lisa Chen',
    hotelName: 'Marriott Resort',
    date: new Date('2024-02-17'),
    status: 'IN_PROGRESS',
    category: 'Cleanliness',
    description: 'Room not properly cleaned',
  },
  // Add more mock complaints...
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'M1',
    hotelName: 'Marriott Downtown',
    roomNumber: '405',
    issue: 'AC not working',
    priority: 'HIGH',
    status: 'PENDING',
    dateReported: new Date('2024-02-19'),
  },
  {
    id: 'M2',
    hotelName: 'Marriott Resort',
    roomNumber: '712',
    issue: 'Leaking faucet',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    dateReported: new Date('2024-02-18'),
  },
  // Add more mock maintenance requests...
];

export const mockStaffSchedules: StaffSchedule[] = [
  {
    id: 'S1',
    employeeName: 'James Wilson',
    department: 'Housekeeping',
    shift: 'MORNING',
    date: new Date('2024-02-20'),
    hotelName: 'Marriott Downtown',
  },
  {
    id: 'S2',
    employeeName: 'Maria Garcia',
    department: 'Front Desk',
    shift: 'AFTERNOON',
    date: new Date('2024-02-20'),
    hotelName: 'Marriott Downtown',
  },
  // Add more mock schedules...
];

export const mockInventory: Inventory[] = [
  {
    id: 'I1',
    itemName: 'Bath Towels',
    category: 'Linens',
    quantity: 500,
    reorderPoint: 100,
    hotelName: 'Marriott Downtown',
    lastUpdated: new Date('2024-02-15'),
  },
  {
    id: 'I2',
    itemName: 'Shampoo Bottles',
    category: 'Toiletries',
    quantity: 1000,
    reorderPoint: 200,
    hotelName: 'Marriott Downtown',
    lastUpdated: new Date('2024-02-16'),
  },
  // Add more mock inventory...
]; 
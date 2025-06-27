import { Hotel } from '../types/hotel';

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
  guestEmail: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  totalPrice: number;
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
    id: '1',
    name: 'Marriott Downtown',
    location: 'New York',
    description: 'Luxury hotel in the heart of Manhattan',
    rating: 4.5,
    rooms: 405,
    status: 'ACTIVE',
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'],
    images: ['/images/hotel1.jpg', '/images/hotel2.jpg'],
    price: {
      base: 299,
      currency: 'USD'
    },
    contact: {
      phone: '+1-212-555-0123',
      email: 'downtown@marriott.com',
      address: '123 Broadway, New York, NY 10007'
    },
    checkInTime: '15:00',
    checkOutTime: '11:00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Marriott Beach Resort',
    location: 'Miami',
    description: 'Beachfront resort with stunning ocean views',
    rating: 4.8,
    rooms: 712,
    status: 'MAINTENANCE',
    amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports'],
    images: ['/images/resort1.jpg', '/images/resort2.jpg'],
    price: {
      base: 399,
      currency: 'USD'
    },
    contact: {
      phone: '+1-305-555-0123',
      email: 'beach@marriott.com',
      address: '456 Ocean Drive, Miami Beach, FL 33139'
    },
    checkInTime: '16:00',
    checkOutTime: '10:00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Marriott City Center',
    location: 'Los Angeles',
    description: 'Modern hotel in downtown LA',
    rating: 4.3,
    rooms: 550,
    status: 'ACTIVE',
    amenities: ['Pool', 'Business Center', 'Restaurant', 'Bar'],
    images: ['/images/la1.jpg', '/images/la2.jpg'],
    price: {
      base: 279,
      currency: 'USD'
    },
    contact: {
      phone: '+1-213-555-0123',
      email: 'la@marriott.com',
      address: '789 Grand Ave, Los Angeles, CA 90017'
    },
    checkInTime: '15:00',
    checkOutTime: '11:00',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
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
    lastLogin: new Date('2024-03-20T08:00:00Z'),
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@marriott.com',
    role: 'MANAGER',
    lastLogin: new Date('2024-03-19T15:30:00Z'),
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@marriott.com',
    role: 'STAFF',
    lastLogin: new Date('2024-03-20T07:45:00Z'),
    status: 'ACTIVE'
  }
];

export const mockBookings = [
  {
    id: '1',
    guestName: 'Michael Brown',
    hotelName: 'Marriott Downtown',
    checkIn: '2/29/2024',
    status: 'CONFIRMED'
  },
  {
    id: '2',
    guestName: 'Emma Wilson',
    hotelName: 'Marriott Resort',
    checkIn: '3/6/2024',
    status: 'PENDING'
  }
];

export const mockRevenue = [
  { date: 'Jan', amount: 150000 },
  { date: 'Feb', amount: 145000 },
  { date: 'Mar', amount: 160000 },
  { date: 'Apr', amount: 155000 },
  { date: 'May', amount: 140000 },
  { date: 'Jun', amount: 135000 }
];

export const mockComplaints = [
  {
    id: '1',
    hotelName: 'Marriott Downtown',
    guestName: 'John Smith',
    issue: 'AC not working',
    status: 'OPEN',
    priority: 'HIGH'
  },
  {
    id: '2',
    hotelName: 'Marriott Resort',
    guestName: 'Sarah Johnson',
    issue: 'Noisy neighbors',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM'
  }
];

export const mockMaintenanceRequests = [
  {
    id: '1',
    hotelName: 'Marriott Downtown',
    roomNumber: '405',
    issue: 'AC not working',
    priority: 'HIGH'
  },
  {
    id: '2',
    hotelName: 'Marriott Resort',
    roomNumber: '712',
    issue: 'Leaking faucet',
    priority: 'MEDIUM'
  }
];

export const mockStaffSchedules: StaffSchedule[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    department: 'Front Desk',
    shift: 'MORNING',
    date: new Date('2024-03-20T08:00:00Z'),
    hotelName: 'Marriott Downtown'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    department: 'Housekeeping',
    shift: 'AFTERNOON',
    date: new Date('2024-03-20T16:00:00Z'),
    hotelName: 'Marriott Beach Resort'
  },
  {
    id: '3',
    employeeName: 'Michael Chen',
    department: 'Restaurant',
    shift: 'NIGHT',
    date: new Date('2024-03-20T00:00:00Z'),
    hotelName: 'Marriott City Center'
  }
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
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
  image: string;
  weather: string;
  hotelIds: string[];
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
    type: 'LUXURY',
    location: 'New York',
    description: 'Luxury hotel in the heart of Manhattan',
    rating: 4.5,
    reviews: 1205,
    status: 'ACTIVE',
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'],
    image: '/images/hotel1.jpg',
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
    rooms: [
      {
        id: 'md-1',
        hotelId: '1',
        type: 'Deluxe Room',
        price: 299,
        description: 'Spacious room with city views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '400 sq ft'
      },
      {
        id: 'md-2',
        hotelId: '1',
        type: 'Executive Suite',
        price: 499,
        description: 'Luxury suite with separate living area',
        beds: '1 King',
        occupancy: '2-3 Adults',
        size: '600 sq ft'
      }
    ],
    policies: [
      'No smoking',
      'Pet friendly',
      'Check-in time: 3:00 PM',
      'Check-out time: 11:00 AM'
    ],
    features: [
      'City views',
      '24/7 room service',
      'Business center',
      'Fitness center'
    ]
  },
  {
    id: '2',
    name: 'Marriott Beach Resort',
    type: 'RESORT',
    location: 'Miami',
    description: 'Beachfront resort with stunning ocean views',
    rating: 4.8,
    reviews: 892,
    status: 'ACTIVE',
    amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports'],
    image: '/images/resort1.jpg',
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
    rooms: [
      {
        id: 'mbr-1',
        hotelId: '2',
        type: 'Ocean View Room',
        price: 399,
        description: 'Room with stunning ocean views',
        beds: '2 Queen',
        occupancy: '2-4 Adults',
        size: '450 sq ft'
      },
      {
        id: 'mbr-2',
        hotelId: '2',
        type: 'Beach Villa',
        price: 699,
        description: 'Private villa steps from the beach',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '800 sq ft'
      }
    ],
    policies: [
      'No smoking',
      'Pet friendly',
      'Beach access included',
      'Water sports equipment rental available'
    ],
    features: [
      'Ocean views',
      'Private beach',
      'Water sports',
      'Beach service'
    ]
  },
  {
    id: '3',
    name: 'Marriott City Center',
    type: 'BUSINESS',
    location: 'Los Angeles',
    description: 'Modern hotel in downtown LA',
    rating: 4.3,
    reviews: 1567,
    status: 'ACTIVE',
    amenities: ['Pool', 'Business Center', 'Restaurant', 'Bar'],
    image: '/images/la1.jpg',
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
    rooms: [
      {
        id: 'mcc-1',
        hotelId: '3',
        type: 'Business Room',
        price: 279,
        description: 'Modern room with work desk',
        beds: '1 Queen',
        occupancy: '1-2 Adults',
        size: '350 sq ft'
      },
      {
        id: 'mcc-2',
        hotelId: '3',
        type: 'Executive Suite',
        price: 429,
        description: 'Suite with meeting area',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '550 sq ft'
      }
    ],
    policies: [
      'No smoking',
      'Pet friendly',
      'Business center access',
      'Meeting rooms available'
    ],
    features: [
      'Downtown location',
      'Business facilities',
      'Express check-in/out',
      'Conference rooms'
    ]
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
    id: 'miami',
    name: 'Miami Beach',
    country: 'United States',
    description: 'Experience the vibrant culture and beautiful beaches of Miami.',
    image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
    weather: 'Warm and Sunny',
    hotelIds: ['rcmb-001', 'dos-004']
  },
  {
    id: 'nyc',
    name: 'New York City',
    country: 'United States',
    description: 'The city that never sleeps, offering endless entertainment and cultural experiences.',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
    weather: 'Seasonal',
    hotelIds: ['1', '4']
  },
  {
    id: 'aspen',
    name: 'Aspen',
    country: 'United States',
    description: 'World-renowned ski resort town with luxury accommodations and mountain views.',
    image: 'https://images.pexels.com/photos/754268/pexels-photo-754268.jpeg',
    weather: 'Alpine Climate',
    hotelIds: ['3', 'jmas-002']
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    country: 'United States',
    description: 'Perfect weather, beautiful beaches, and family-friendly attractions.',
    image: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg',
    weather: 'Mild Year-round',
    hotelIds: ['cis-005']
  },
  {
    id: 'charleston',
    name: 'Charleston',
    country: 'United States',
    description: 'Historic charm meets Southern hospitality in this coastal gem.',
    image: 'https://images.pexels.com/photos/2889493/pexels-photo-2889493.jpeg',
    weather: 'Subtropical',
    hotelIds: ['hdb-006']
  },
  {
    id: 'lake-tahoe',
    name: 'Lake Tahoe',
    country: 'United States',
    description: 'Crystal clear waters and mountain adventures await.',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    weather: 'Alpine',
    hotelIds: ['lsr-007']
  },
  {
    id: 'austin',
    name: 'Austin',
    country: 'United States',
    description: 'Live music capital with a vibrant food scene and tech culture.',
    image: 'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg',
    weather: 'Hot Summers',
    hotelIds: ['bci-008']
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    description: 'Iconic architecture, world-class dining, and lakefront beauty.',
    image: 'https://images.pexels.com/photos/1334605/pexels-photo-1334605.jpeg',
    weather: 'Four Seasons',
    hotelIds: ['lms-009']
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    country: 'China',
    description: 'Where East meets West in a dazzling harbor city.',
    image: 'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg',
    weather: 'Subtropical',
    hotelIds: ['park-lane-hong-kong']
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
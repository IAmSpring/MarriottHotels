import type { Hotel, Room, Price } from '../types/hotel';

export type HotelType = 'LUXURY' | 'BUSINESS' | 'RESORT' | 'BOUTIQUE';

export interface Hotel {
  id: string;
  name: string;
  type: HotelType;
  location: string;
  description: string;
  price: Price;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  rooms: Room[];
  status: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  checkInTime: string;
  checkOutTime: string;
  policies: string[];
  features: string[];
}

// Featured hotels at the start
export const hotels: Hotel[] = [
  {
    id: 'rcmb-001',
    name: 'The Ritz-Carlton Miami Beach',
    type: 'LUXURY',
    location: 'Miami Beach, FL',
    rating: 4.8,
    reviews: 1247,
    price: {
      base: 420,
      currency: 'USD'
    },
    image: '/MarriottHotels/images/miami-beach.jpg',
    description: 'Experience luxury oceanfront living at its finest at The Ritz-Carlton Miami Beach. This five-star resort offers breathtaking views of the Atlantic Ocean and Biscayne Bay.',
    amenities: [
      'Private Beach Access',
      'Luxury Spa',
      'Ocean-view Pool',
      'Fine Dining Restaurant',
      '24/7 Room Service',
      'Fitness Center',
      'Business Center',
      'Valet Parking'
    ],
    rooms: [
      {
        id: 'rcmb-001-deluxe',
        type: 'Deluxe Ocean View',
        price: 420,
        description: 'Spacious room with stunning ocean views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '450 sq ft'
      },
      {
        id: 'rcmb-001-club',
        type: 'Club Level Suite',
        price: 750,
        description: 'Luxury suite with club lounge access',
        beds: '1 King',
        occupancy: '3 Adults',
        size: '800 sq ft'
      },
      {
        id: 'rcmb-001-pres',
        type: 'Presidential Suite',
        price: 1200,
        description: 'Ultimate luxury with panoramic ocean views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,200 sq ft'
      }
    ],
    status: 'ACTIVE',
    contact: {
      phone: '+1 (305) 555-0123',
      email: 'ritzcarlton.miami@marriott.com',
      address: '1 Lincoln Road, Miami Beach, FL 33139'
    },
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    policies: [
      'No smoking',
      'Pet friendly (with fee)',
      'Cancellation policy: 48 hours',
      'Resort fee includes beach amenities'
    ],
    features: [
      'Beachfront location',
      'Ocean views',
      'Club lounge access',
      'Luxury spa services'
    ]
  },
  {
    id: 'jmas-002',
    name: 'JW Marriott Aspen Snowmass',
    type: 'LUXURY',
    location: 'Aspen, CO',
    rating: 4.9,
    reviews: 892,
    price: {
      base: 650,
      currency: 'USD'
    },
    image: '/MarriottHotels/images/aspen.jpg',
    description: 'Nestled in the heart of Snowmass Village, this luxury mountain resort offers ski-in/ski-out access and stunning Rocky Mountain views.',
    amenities: [
      'Ski-in/Ski-out Access',
      'Heated Outdoor Pool',
      'Mountain Spa',
      'Ski Valet',
      'Alpine Restaurant',
      'Fitness Center',
      'Kids Club',
      'Fire Pit Lounge'
    ],
    rooms: [
      {
        id: 'jmas-002-mv',
        type: 'Mountain View Room',
        price: 650,
        description: 'Cozy room with mountain views',
        beds: '2 Queen',
        occupancy: '4 Adults',
        size: '400 sq ft'
      },
      {
        id: 'jmas-002-fs',
        type: 'Fireplace Suite',
        price: 950,
        description: 'Suite with private fireplace and balcony',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '650 sq ft'
      },
      {
        id: 'jmas-002-ph',
        type: 'Penthouse Suite',
        price: 1500,
        description: 'Luxury penthouse with panoramic views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,500 sq ft'
      }
    ],
    status: 'ACTIVE',
    contact: {
      phone: '+1 (970) 555-0123',
      email: 'jwmarriott.aspen@marriott.com',
      address: '100 Elbert Lane, Snowmass Village, CO 81615'
    },
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    policies: [
      'No smoking',
      'Pet friendly',
      'Cancellation policy: 72 hours',
      'Resort fee includes ski valet'
    ],
    features: [
      'Ski-in/Ski-out',
      'Mountain views',
      'Luxury spa',
      'Winter sports'
    ]
  },
  {
    id: 'mmny-003',
    name: 'Marriott Marquis New York',
    type: 'LUXURY',
    location: 'Manhattan, NY',
    rating: 4.5,
    reviews: 2156,
    price: {
      base: 315,
      currency: 'USD'
    },
    image: '/MarriottHotels/images/new-york.jpg',
    description: 'Located in the heart of Times Square, this iconic hotel offers modern luxury and unparalleled access to New York City\'s most famous attractions.',
    amenities: [
      'Times Square Views',
      'Broadway Concierge',
      'Fitness Center',
      'Business Center',
      'Multiple Restaurants',
      'Meeting Spaces',
      'Express Check-in',
      'Concierge Lounge'
    ],
    rooms: [
      {
        id: 'mmny-003-cv',
        type: 'City View Room',
        price: 315,
        description: 'Modern room with city views',
        beds: '1 King or 2 Double',
        occupancy: '2 Adults',
        size: '400 sq ft'
      },
      {
        id: 'mmny-003-ts',
        type: 'Times Square View Suite',
        price: 550,
        description: 'Suite overlooking Times Square',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '600 sq ft'
      },
      {
        id: 'mmny-003-ps',
        type: 'Presidential Suite',
        price: 1000,
        description: 'Luxury suite with panoramic views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '1,000 sq ft'
      }
    ],
    status: 'ACTIVE',
    contact: {
      phone: '+1 (212) 555-0123',
      email: 'marriottmarquis.ny@marriott.com',
      address: '1535 Broadway, New York, NY 10036'
    },
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    policies: [
      'No smoking',
      'Pet friendly (with fee)',
      'Cancellation policy: 24 hours',
      'Valet parking available'
    ],
    features: [
      'Times Square location',
      'City views',
      'Theater district',
      'Business facilities'
    ]
  },
  {
    id: 'mhhi-004',
    name: 'Marriott Halekulani Hawaii',
    type: 'RESORT',
    location: 'Honolulu, HI',
    rating: 4.9,
    reviews: 1563,
    price: {
      base: 550,
      currency: 'USD'
    },
    image: '/MarriottHotels/images/hawaii.jpg',
    description: 'An oceanfront paradise in Waikiki Beach, offering world-class Hawaiian hospitality, stunning Pacific views, and exclusive beach access.',
    amenities: [
      'Private Beach',
      'Infinity Pool',
      'Spa Services',
      'Beachfront Dining',
      'Water Sports',
      'Cultural Activities',
      'Kids Club',
      'Concierge'
    ],
    rooms: [
      {
        id: 'mhhi-004-ov',
        type: 'Ocean View',
        price: 550,
        description: 'Room with stunning ocean views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '500 sq ft'
      },
      {
        id: 'mhhi-004-bs',
        type: 'Beach Suite',
        price: 850,
        description: 'Luxury suite steps from the beach',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '750 sq ft'
      },
      {
        id: 'mhhi-004-rp',
        type: 'Royal Penthouse',
        price: 1800,
        description: 'Ultimate luxury with panoramic views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '2,000 sq ft'
      }
    ],
    status: 'ACTIVE',
    contact: {
      phone: '+1 (808) 555-0123',
      email: 'halekulani.hawaii@marriott.com',
      address: '2199 Kalia Road, Honolulu, HI 96815'
    },
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    policies: [
      'No smoking',
      'Pet friendly (with restrictions)',
      'Cancellation policy: 72 hours',
      'Resort fee includes beach amenities'
    ],
    features: [
      'Beachfront location',
      'Ocean views',
      'Cultural experiences',
      'Water activities'
    ]
  },
  {
    id: 'msf-005',
    name: 'Marriott St. Francis San Francisco',
    type: 'LUXURY',
    location: 'San Francisco, CA',
    rating: 4.7,
    reviews: 1892,
    price: {
      base: 450,
      currency: 'USD'
    },
    image: '/MarriottHotels/images/san-francisco.jpg',
    description: 'A historic landmark in Union Square, combining timeless luxury with modern amenities and spectacular city views of San Francisco.',
    amenities: [
      'Historic Building',
      'City Views',
      'Fine Dining',
      'Luxury Spa',
      'Fitness Center',
      'Meeting Spaces',
      'Concierge',
      'Valet Parking'
    ],
    rooms: [
      {
        id: 'msf-005-td',
        type: 'Tower Deluxe',
        price: 450,
        description: 'Modern room with city views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '425 sq ft'
      },
      {
        id: 'msf-005-ts',
        type: 'Tower Suite',
        price: 750,
        description: 'Spacious suite with living area',
        beds: '1 King',
        occupancy: '3 Adults',
        size: '800 sq ft'
      },
      {
        id: 'msf-005-ps',
        type: 'Presidential Suite',
        price: 1500,
        description: 'Luxury suite with panoramic views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,600 sq ft'
      }
    ],
    status: 'ACTIVE',
    contact: {
      phone: '+1 (415) 555-0123',
      email: 'stfrancis.sf@marriott.com',
      address: '335 Powell Street, San Francisco, CA 94102'
    },
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    policies: [
      'No smoking',
      'Pet friendly (with fee)',
      'Cancellation policy: 48 hours',
      'Valet parking only'
    ],
    features: [
      'Historic property',
      'Union Square location',
      'City views',
      'Fine dining'
    ]
  },
  {
    id: 'rcla-006',
    name: 'The Ritz-Carlton Los Angeles',
    type: 'LUXURY',
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviews: 1435,
    price: {
      base: 495,
      currency: 'USD'
    },
    image: '/MarriottHotels/images/los-angeles.jpg',
    description: 'Experience the height of luxury in downtown LA, featuring panoramic city views, world-class dining, and an award-winning spa.',
    amenities: [
      'Rooftop Pool',
      'Luxury Spa',
      'Fine Dining',
      'City Views',
      'Valet Parking',
      'Fitness Center',
      'Club Lounge',
      'Concierge Service'
    ],
    rooms: [
      {
        id: 'rcla-006-dlx',
        type: 'Deluxe City View',
        price: 495,
        description: 'Modern room with stunning city views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '450 sq ft'
      },
      {
        id: 'rcla-006-club',
        type: 'Club Level Suite',
        price: 795,
        description: 'Luxury suite with club access',
        beds: '1 King',
        occupancy: '3 Adults',
        size: '750 sq ft'
      },
      {
        id: 'rcla-006-pres',
        type: 'Presidential Suite',
        price: 1500,
        description: 'Ultimate luxury with panoramic views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,800 sq ft'
      }
    ],
    status: 'ACTIVE',
    contact: {
      phone: '+1 (213) 555-0123',
      email: 'ritzcarlton.la@marriott.com',
      address: '900 W Olympic Blvd, Los Angeles, CA 90015'
    },
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    policies: [
      'No smoking',
      'Pet friendly (with fee)',
      'Cancellation policy: 48 hours',
      'Valet parking only'
    ],
    features: [
      'Downtown location',
      'City views',
      'Club lounge access',
      'Spa services'
    ]
  },
  {
    id: "1",
    name: "The Marriott Grand Luxe",
    type: "LUXURY",
    location: "New York City, NY",
    description: "Experience unparalleled luxury in the heart of Manhattan. Our five-star hotel combines classic elegance with modern sophistication, offering breathtaking views of the city skyline, world-class dining, and exceptional service that exceeds every expectation.",
    price: {
      base: 599,
      currency: "USD"
    },
    rating: 4.8,
    reviews: 2456,
    image: '/MarriottHotels/images/new-york.jpg',
    amenities: [
      "Spa", "Pool", "Fine Dining", "Fitness Center", "Business Center",
      "Concierge", "Room Service", "Valet Parking", "Rooftop Bar",
      "Executive Lounge", "Butler Service", "Wine Cellar"
    ],
    rooms: [
      {
        id: "gl-1",
        type: "Deluxe Suite",
        price: 799,
        description: "Spacious suite with floor-to-ceiling windows offering panoramic city views, separate living area, and marble bathroom with deep soaking tub",
        beds: "1 King",
        occupancy: "2-3",
        size: "600 sq ft"
      },
      {
        id: "gl-2",
        type: "Presidential Suite",
        price: 1299,
        description: "Ultimate luxury with private terrace, dining room, butler's pantry, and spectacular skyline views",
        beds: "1 King + 1 Queen Sofa Bed",
        occupancy: "2-4",
        size: "1200 sq ft"
      },
      {
        id: "gl-3",
        type: "Executive Room",
        price: 599,
        description: "Refined comfort with city views, work desk, and access to Executive Lounge",
        beds: "1 King",
        occupancy: "2",
        size: "400 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (212) 555-0123",
      email: "grandluxe@marriott.com",
      address: "123 Park Avenue, New York, NY 10022"
    },
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    policies: [
      "No smoking",
      "Pet friendly (up to 25 lbs)",
      "Cancellation policy: 24 hours",
      "Extra bed available upon request",
      "Children under 12 stay free",
      "Minimum check-in age: 21"
    ],
    features: [
      "City views",
      "24/7 security",
      "Express check-in/out",
      "Michelin-starred restaurant",
      "Helipad access",
      "Electric vehicle charging"
    ]
  },
  {
    id: "2",
    name: "Ocean Breeze Resort",
    type: "RESORT",
    location: "Miami Beach, FL",
    description: "Discover paradise at our beachfront resort where luxury meets tropical elegance. Immerse yourself in the vibrant Miami Beach lifestyle with private beach access, multiple infinity pools, and world-class spa treatments, all while enjoying spectacular ocean views and impeccable service.",
    price: {
      base: 320,
      currency: "USD"
    },
    rating: 4.8,
    reviews: 1247,
    image: '/MarriottHotels/images/miami-beach.jpg',
    amenities: [
      "Private Beach", "Multiple Pools", "Spa", "Restaurant", "Beach Bar",
      "Fitness Center", "Room Service", "Water Sports", "Kids Club",
      "Tennis Courts", "Yoga Studio", "Beach Cabanas"
    ],
    rooms: [
      {
        id: "ob-1",
        type: "Ocean View Room",
        price: 450,
        description: "Bright, airy room with private balcony overlooking the Atlantic Ocean, featuring modern coastal décor",
        beds: "1 King",
        occupancy: "2",
        size: "500 sq ft"
      },
      {
        id: "ob-2",
        type: "Beachfront Suite",
        price: 750,
        description: "Luxurious suite with direct beach views, separate living area, and wraparound balcony",
        beds: "1 King + 1 Sofa Bed",
        occupancy: "2-4",
        size: "800 sq ft"
      },
      {
        id: "ob-3",
        type: "Pool Villa",
        price: 1200,
        description: "Private villa with personal plunge pool, garden, and beach access",
        beds: "2 Queens",
        occupancy: "4",
        size: "1000 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (305) 555-0123",
      email: "oceanbreeze@resort.com",
      address: "123 Ocean Drive, Miami Beach, FL 33139"
    },
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    policies: [
      "No smoking",
      "Pet friendly (beach access restricted)",
      "Cancellation policy: 48 hours",
      "Beach towels provided",
      "Resort fee includes activities",
      "Age restriction for spa services"
    ],
    features: [
      "Ocean views",
      "Beach service",
      "Water sports",
      "Sunset yoga classes",
      "Beach volleyball",
      "Live entertainment"
    ]
  },
  {
    id: "3",
    name: "Mountain Peak Lodge",
    type: "BOUTIQUE",
    location: "Aspen, CO",
    description: "An intimate mountain retreat where luxury meets alpine adventure. Our boutique lodge offers personalized service, stunning mountain views, and direct access to world-class skiing. Experience the perfect blend of rustic charm and contemporary comfort in the heart of the Rockies.",
    price: {
      base: 450,
      currency: "USD"
    },
    rating: 4.9,
    reviews: 892,
    image: '/MarriottHotels/images/aspen.jpg',
    amenities: [
      "Ski-in/Ski-out", "Hot Tubs", "Gourmet Restaurant", "Après-ski Bar",
      "Spa", "Fitness Center", "Ski Valet", "Equipment Rental",
      "Heated Pool", "Fire Pits", "Wine Cellar", "Game Room"
    ],
    rooms: [
      {
        id: "mp-1",
        type: "Mountain View Suite",
        price: 650,
        description: "Cozy suite with stone fireplace, private balcony, and panoramic mountain views",
        beds: "1 King",
        occupancy: "2-3",
        size: "600 sq ft"
      },
      {
        id: "mp-2",
        type: "Alpine Penthouse",
        price: 1100,
        description: "Luxury penthouse with full kitchen, multiple fireplaces, and wraparound terrace",
        beds: "2 Kings",
        occupancy: "4-6",
        size: "1200 sq ft"
      },
      {
        id: "mp-3",
        type: "Chalet Room",
        price: 450,
        description: "Charming room with rustic décor and mountain views",
        beds: "1 Queen",
        occupancy: "2",
        size: "400 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (970) 555-0123",
      email: "mountainpeak@lodge.com",
      address: "123 Mountain Road, Aspen, CO 81611"
    },
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    policies: [
      "No smoking",
      "Pet friendly",
      "Cancellation policy: 72 hours",
      "Ski storage included",
      "Complimentary ski shuttle",
      "Altitude acclimation program"
    ],
    features: [
      "Mountain views",
      "Ski-in/ski-out",
      "Fireplace",
      "Ski concierge",
      "Heated boot storage",
      "Adventure planning"
    ]
  },
  {
    id: "4",
    name: "City Central Hotel",
    type: "BUSINESS",
    location: "Manhattan, NY",
    description: "A sophisticated urban retreat designed for the modern business traveler. Our hotel offers seamless connectivity, flexible meeting spaces, and premium amenities in the heart of Manhattan's business district, ensuring a productive and comfortable stay.",
    price: {
      base: 280,
      currency: "USD"
    },
    rating: 4.3,
    reviews: 2156,
    image: '/MarriottHotels/images/new-york.jpg',
    amenities: [
      "Business Center", "High-speed WiFi", "Executive Lounge", "Conference Rooms",
      "Restaurant", "Bar", "Fitness Center", "Room Service",
      "Print/Copy Services", "Tech Support", "Coffee Bar", "Shoe Shine"
    ],
    rooms: [
      {
        id: "cc-1",
        type: "Business Room",
        price: 280,
        description: "Well-appointed room with ergonomic workspace and city views",
        beds: "1 Queen",
        occupancy: "1-2",
        size: "400 sq ft"
      },
      {
        id: "cc-2",
        type: "Executive Suite",
        price: 450,
        description: "Spacious suite with separate living area and meeting space",
        beds: "1 King",
        occupancy: "2-3",
        size: "600 sq ft"
      },
      {
        id: "cc-3",
        type: "Smart Room",
        price: 320,
        description: "Tech-enabled room with automated controls and superior connectivity",
        beds: "1 Queen",
        occupancy: "2",
        size: "450 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (212) 555-0124",
      email: "citycentral@hotel.com",
      address: "123 Business Street, Manhattan, NY 10001"
    },
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    policies: [
      "No smoking",
      "Pet friendly",
      "Cancellation policy: 24 hours",
      "Late check-out available",
      "Business services included",
      "Meeting room priority"
    ],
    features: [
      "Business facilities",
      "Central location",
      "Express check-in/out",
      "24/7 IT support",
      "Mobile key access",
      "Digital concierge"
    ]
  },
  {
    id: "5",
    name: "Desert Oasis Resort",
    type: "RESORT",
    location: "Scottsdale, AZ",
    description: "An exclusive desert sanctuary where luxury meets the natural beauty of the Sonoran Desert. Indulge in world-class golf, rejuvenating spa treatments, and stunning sunset views while enjoying our meticulously landscaped grounds and exceptional service.",
    price: {
      base: 399,
      currency: "USD"
    },
    rating: 4.7,
    reviews: 1823,
    image: '/MarriottHotels/images/miami-beach.jpg',
    amenities: [
      "Championship Golf Course", "Desert Spa", "Multiple Pools", "Tennis Courts",
      "Fine Dining", "Pool Bar", "Fitness Center", "Room Service",
      "Desert Gardens", "Yoga Studio", "Kids Club", "Adventure Center"
    ],
    rooms: [
      {
        id: "do-1",
        type: "Desert View Room",
        price: 399,
        description: "Serene room with private patio overlooking the desert landscape",
        beds: "1 King",
        occupancy: "2",
        size: "450 sq ft"
      },
      {
        id: "do-2",
        type: "Casita Suite",
        price: 699,
        description: "Private casita with living area and outdoor shower",
        beds: "1 King + 1 Sofa Bed",
        occupancy: "2-4",
        size: "800 sq ft"
      },
      {
        id: "do-3",
        type: "Golf Villa",
        price: 899,
        description: "Luxury villa with golf course views and private pool",
        beds: "2 Queens",
        occupancy: "4",
        size: "1000 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (480) 555-0123",
      email: "desertoasis@resort.com",
      address: "123 Desert Road, Scottsdale, AZ 85259"
    },
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    policies: [
      "No smoking",
      "Pet friendly",
      "Cancellation policy: 48 hours",
      "Golf tee times included",
      "Resort credit available",
      "Desert adventure waivers required"
    ],
    features: [
      "Desert views",
      "Golf access",
      "Spa treatments",
      "Desert excursions",
      "Stargazing tours",
      "Native gardens"
    ]
  },
  {
    id: "sandbourne-santa-monica",
    name: "Sandbourne Santa Monica",
    type: "LUXURY",
    location: "Santa Monica, California, USA",
    rating: 4.9,
    price: {
      base: 450,
      currency: "USD"
    },
    image: "/MarriottHotels/images/los-angeles.jpg",
    description: "A luxurious boutique hotel steps away from Santa Monica Beach, offering a perfect blend of coastal charm and modern luxury.",
    reviews: 856,
    amenities: [
      "Beach Access",
      "Rooftop Pool",
      "Spa",
      "Restaurant",
      "Fitness Center",
      "Valet Parking"
    ],
    rooms: [
      {
        id: "ssm-001",
        type: "Ocean View Room",
        price: 450,
        description: "Elegant room with stunning ocean views and private balcony",
        beds: "1 King",
        occupancy: "2 Adults",
        size: "475 sq ft"
      },
      {
        id: "ssm-002",
        type: "Luxury Suite",
        price: 750,
        description: "Spacious suite with separate living area and ocean views",
        beds: "1 King",
        occupancy: "3 Adults",
        size: "750 sq ft"
      },
      {
        id: "ssm-003",
        type: "Penthouse Suite",
        price: 1200,
        description: "Ultimate luxury with panoramic views and private terrace",
        beds: "2 King",
        occupancy: "4 Adults",
        size: "1,200 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (310) 555-0123",
      email: "sandbournesantamonica@boutique.com",
      address: "123 Beach Road, Santa Monica, CA 90401"
    },
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    policies: [
      "No smoking",
      "Pet friendly",
      "Cancellation policy: 48 hours"
    ],
    features: [
      "Coastal charm",
      "Modern luxury",
      "Beach access"
    ]
  },
  {
    id: "trailborn-highlands",
    name: "Trailborn Highlands",
    type: "BOUTIQUE",
    location: "Asheville, North Carolina, USA",
    rating: 4.8,
    price: {
      base: 380,
      currency: "USD"
    },
    image: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
    description: "Nestled in the Blue Ridge Mountains, this boutique retreat offers a perfect blend of rustic charm and modern comfort.",
    reviews: 634,
    amenities: [
      "Mountain Views",
      "Hiking Trails",
      "Spa",
      "Farm-to-Table Restaurant",
      "Yoga Studio",
      "Private Balconies"
    ],
    rooms: [
      {
        id: "th-001",
        type: "Mountain View Room",
        price: 380,
        description: "Cozy room with stunning mountain views",
        beds: "1 King or 2 Queen",
        occupancy: "2-4 Adults",
        size: "400 sq ft"
      },
      {
        id: "th-002",
        type: "Highland Suite",
        price: 580,
        description: "Luxurious suite with fireplace and private balcony",
        beds: "1 King",
        occupancy: "2 Adults",
        size: "650 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (828) 555-0123",
      email: "trailbornhighlands@boutique.com",
      address: "123 Blue Ridge Road, Asheville, NC 28801"
    },
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    policies: [
      "No smoking",
      "Pet friendly",
      "Cancellation policy: 48 hours"
    ],
    features: [
      "Mountain views",
      "Rustic charm",
      "Modern comfort"
    ]
  },
  {
    id: "park-lane-hong-kong",
    name: "Park Lane Hong Kong",
    type: "LUXURY",
    location: "Causeway Bay, Hong Kong",
    rating: 4.9,
    price: {
      base: 520,
      currency: "USD"
    },
    image: "https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg",
    description: "A sophisticated urban retreat in the heart of Hong Kong, offering stunning views of Victoria Harbour and the city skyline.",
    reviews: 923,
    amenities: [
      "Harbour Views",
      "Rooftop Bar",
      "Spa",
      "Fine Dining",
      "Executive Lounge",
      "Fitness Center"
    ],
    rooms: [
      {
        id: "plhk-001",
        type: "Deluxe City View",
        price: 520,
        description: "Modern room with city skyline views",
        beds: "1 King or 2 Queen",
        occupancy: "2-3 Adults",
        size: "450 sq ft"
      },
      {
        id: "plhk-002",
        type: "Harbour Suite",
        price: 820,
        description: "Luxury suite with Victoria Harbour views",
        beds: "1 King",
        occupancy: "2 Adults",
        size: "700 sq ft"
      },
      {
        id: "plhk-003",
        type: "Executive Suite",
        price: 1100,
        description: "Premium suite with lounge access and harbour views",
        beds: "1 King",
        occupancy: "2 Adults",
        size: "900 sq ft"
      }
    ],
    status: "ACTIVE",
    contact: {
      phone: "+1 (852) 555-0123",
      email: "parklanehongkong@hotel.com",
      address: "123 Harbour Road, Causeway Bay, Hong Kong"
    },
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    policies: [
      "No smoking",
      "Pet friendly",
      "Cancellation policy: 48 hours"
    ],
    features: [
      "Harbour views",
      "Rooftop bar",
      "Spa"
    ]
  }
]; 
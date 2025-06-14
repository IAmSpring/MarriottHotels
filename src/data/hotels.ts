import { Hotel } from '../types/hotel';

export const hotels: Hotel[] = [
  {
    id: 'ocean-breeze-resort',
    type: 'luxury',
    name: 'Ocean Breeze Resort',
    location: 'Miami Beach, FL',
    rating: 4.8,
    price: 320,
    images: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'],
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities.',
    reviews: 1247,
    amenities: [
      'WiFi',
      'Pool',
      'Spa',
      'Restaurant',
      'Beach Access',
      'Fitness Center'
    ],
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
    ]
  },
  {
    id: 'mpl-002',
    type: 'boutique',
    name: 'Mountain Peak Lodge',
    location: 'Aspen, CO',
    rating: 4.9,
    price: 450,
    images: ['https://images.pexels.com/photos/2962353/pexels-photo-2962353.jpeg'],
    description: 'Exclusive mountain retreat with panoramic alpine views and premium ski access.',
    reviews: 892,
    amenities: [
      'WiFi',
      'Spa',
      'Restaurant',
      'Gym',
      'Ski Storage',
      'Heated Pool'
    ],
    rooms: [
      {
        type: 'Mountain View Room',
        price: 450,
        description: 'Cozy room with mountain views',
        beds: '2 Queen',
        occupancy: '4 Adults',
        size: '400 sq ft'
      },
      {
        type: 'Alpine Suite',
        price: 750,
        description: 'Luxury suite with fireplace',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '800 sq ft'
      }
    ]
  },
  {
    id: 'cch-003',
    type: 'standard',
    name: 'City Central Hotel',
    location: 'Manhattan, NY',
    rating: 4.3,
    price: 280,
    images: ['https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'],
    description: 'Modern urban hotel in the heart of Manhattan with easy access to attractions.',
    reviews: 2156,
    amenities: [
      'WiFi',
      'Restaurant',
      'Gym',
      'Parking',
      'Business Center'
    ],
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
    ]
  },
  {
    id: 'dos-004',
    type: 'luxury',
    name: 'Desert Oasis Spa Resort',
    location: 'Scottsdale, AZ',
    rating: 4.7,
    price: 380,
    images: ['https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'],
    description: 'Tranquil desert resort featuring award-winning spa treatments and golf course.',
    reviews: 743,
    amenities: [
      'WiFi',
      'Pool',
      'Spa',
      'Restaurant',
      'Golf Course',
      'Tennis Courts'
    ],
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
    ]
  },
  {
    id: 'cis-005',
    type: 'boutique',
    name: 'Coastal Inn & Suites',
    location: 'San Diego, CA',
    rating: 4.1,
    price: 180,
    images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'],
    description: 'Comfortable coastal accommodation with easy beach access and family-friendly amenities.',
    reviews: 1534,
    amenities: [
      'WiFi',
      'Pool',
      'Parking',
      'Beach Access',
      'Kids Club'
    ],
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
    ]
  },
  {
    id: 'hdb-006',
    type: 'standard',
    name: 'Historic Downtown Boutique',
    location: 'Charleston, SC',
    rating: 4.5,
    price: 220,
    images: ['https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg'],
    description: 'Charming boutique hotel in historic district with Southern hospitality and elegance.',
    reviews: 687,
    amenities: [
      'WiFi',
      'Restaurant',
      'Spa',
      'Garden',
      'Afternoon Tea'
    ],
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
    ]
  },
  {
    id: 'lsr-007',
    type: 'luxury',
    name: 'Lakeside Retreat',
    location: 'Lake Tahoe, CA',
    rating: 4.6,
    price: 290,
    images: ['/images/lakeside-retreat.jpg'],
    description: 'Serene lakeside hotel with breathtaking mountain and water views.',
    reviews: 956,
    amenities: [
      'WiFi',
      'Restaurant',
      'Gym',
      'Parking',
      'Lake Access',
      'Water Sports'
    ],
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
    ]
  },
  {
    id: 'bci-008',
    type: 'standard',
    name: 'Budget Comfort Inn',
    location: 'Austin, TX',
    rating: 3.8,
    price: 95,
    images: ['/images/budget-comfort.jpg'],
    description: 'Clean, comfortable, and affordable accommodation in the heart of Austin.',
    reviews: 2341,
    amenities: [
      'WiFi',
      'Parking',
      'Continental Breakfast',
      'Business Center'
    ],
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
    ]
  },
  {
    id: 'lms-009',
    type: 'boutique',
    name: 'Luxury Metropolitan Suite',
    location: 'Chicago, IL',
    rating: 4.9,
    price: 520,
    images: ['/images/luxury-metro.jpg'],
    description: 'Ultra-luxury suites with panoramic city views and personalized concierge service.',
    reviews: 423,
    amenities: [
      'WiFi',
      'Spa',
      'Restaurant',
      'Gym',
      'Concierge',
      'Valet Parking'
    ],
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
    ]
  },
  {
    id: 'sandbourne-santa-monica',
    type: 'luxury',
    name: 'Sandbourne Santa Monica',
    location: 'Santa Monica, California, USA',
    rating: 4.9,
    price: 450,
    images: ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'],
    description: 'A luxurious boutique hotel steps away from Santa Monica Beach, offering a perfect blend of coastal charm and modern luxury.',
    reviews: 856,
    amenities: [
      'Beach Access',
      'Rooftop Pool',
      'Spa',
      'Restaurant',
      'Fitness Center',
      'Valet Parking'
    ],
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
    ]
  },
  {
    id: 'trailborn-highlands',
    type: 'boutique',
    name: 'Trailborn Highlands',
    location: 'Asheville, North Carolina, USA',
    rating: 4.8,
    price: 380,
    images: ['https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'],
    description: 'Nestled in the Blue Ridge Mountains, this boutique retreat offers a perfect blend of rustic charm and modern comfort.',
    reviews: 634,
    amenities: [
      'Mountain Views',
      'Hiking Trails',
      'Spa',
      'Farm-to-Table Restaurant',
      'Yoga Studio',
      'Private Balconies'
    ],
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
    ]
  },
  {
    id: 'park-lane-hong-kong',
    type: 'luxury',
    name: 'Park Lane Hong Kong',
    location: 'Causeway Bay, Hong Kong',
    rating: 4.9,
    price: 520,
    images: ['https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg'],
    description: 'A sophisticated urban retreat in the heart of Hong Kong, offering stunning views of Victoria Harbour and the city skyline.',
    reviews: 923,
    amenities: [
      'Harbour Views',
      'Rooftop Bar',
      'Spa',
      'Fine Dining',
      'Executive Lounge',
      'Fitness Center'
    ],
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
    ]
  },
  {
    id: 'rcmb-001',
    type: 'luxury',
    name: 'The Ritz-Carlton Miami Beach',
    location: 'Miami Beach, FL',
    rating: 4.8,
    price: 320,
    images: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'],
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities.',
    reviews: 1247,
    amenities: [
      'WiFi',
      'Pool',
      'Spa',
      'Restaurant',
      'Beach Access',
      'Fitness Center'
    ],
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
    ]
  }
]; 
import { Hotel } from '../types/hotel';

export const hotels: Hotel[] = [
  {
    id: 'obr-001',
    name: 'Ocean Breeze Resort',
    location: 'Miami Beach, FL',
    rating: 4.8,
    price: 320,
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
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
    name: 'Mountain Peak Lodge',
    location: 'Aspen, CO',
    rating: 4.9,
    price: 450,
    image: 'https://images.pexels.com/photos/2962353/pexels-photo-2962353.jpeg',
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
    name: 'City Central Hotel',
    location: 'Manhattan, NY',
    rating: 4.3,
    price: 280,
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
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
    name: 'Desert Oasis Spa Resort',
    location: 'Scottsdale, AZ',
    rating: 4.7,
    price: 380,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
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
    name: 'Coastal Inn & Suites',
    location: 'San Diego, CA',
    rating: 4.1,
    price: 180,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
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
    name: 'Historic Downtown Boutique',
    location: 'Charleston, SC',
    rating: 4.5,
    price: 220,
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg',
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
    name: 'Lakeside Retreat',
    location: 'Lake Tahoe, CA',
    rating: 4.6,
    price: 290,
    image: '/images/lakeside-retreat.jpg',
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
    name: 'Budget Comfort Inn',
    location: 'Austin, TX',
    rating: 3.8,
    price: 95,
    image: '/images/budget-comfort.jpg',
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
    name: 'Luxury Metropolitan Suite',
    location: 'Chicago, IL',
    rating: 4.9,
    price: 520,
    image: '/images/luxury-metro.jpg',
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
  }
]; 
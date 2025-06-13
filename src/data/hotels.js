export const hotels = [
  {
    id: 'rcmb-001',
    name: 'The Ritz-Carlton Miami Beach',
    location: 'Miami Beach, FL',
    rating: 4.8,
    price: 420,
    image: '/images/miami-beach.jpg',
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
        type: 'Deluxe Ocean View',
        price: 420,
        description: 'Spacious room with stunning ocean views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '450 sq ft'
      },
      {
        type: 'Club Level Suite',
        price: 750,
        description: 'Luxury suite with club lounge access',
        beds: '1 King',
        occupancy: '3 Adults',
        size: '800 sq ft'
      },
      {
        type: 'Presidential Suite',
        price: 1200,
        description: 'Ultimate luxury with panoramic ocean views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,200 sq ft'
      }
    ]
  },
  {
    id: 'jmas-002',
    name: 'JW Marriott Aspen Snowmass',
    location: 'Aspen, CO',
    rating: 4.9,
    price: 650,
    image: '/images/aspen.jpg',
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
        type: 'Mountain View Room',
        price: 650,
        description: 'Cozy room with mountain views',
        beds: '2 Queen',
        occupancy: '4 Adults',
        size: '400 sq ft'
      },
      {
        type: 'Fireplace Suite',
        price: 950,
        description: 'Suite with private fireplace and balcony',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '650 sq ft'
      },
      {
        type: 'Penthouse Suite',
        price: 1500,
        description: 'Luxury penthouse with panoramic views',
        beds: '2 King',
        occupancy: '4 Adults',
        size: '1,500 sq ft'
      }
    ]
  },
  {
    id: 'mmny-003',
    name: 'Marriott Marquis New York',
    location: 'Manhattan, NY',
    rating: 4.5,
    price: 315,
    image: '/images/new-york.jpg',
    description: 'Located in the heart of Times Square, this iconic hotel offers modern luxury and unparalleled access to New York City's most famous attractions.',
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
        type: 'City View Room',
        price: 315,
        description: 'Modern room with city views',
        beds: '1 King or 2 Double',
        occupancy: '2 Adults',
        size: '400 sq ft'
      },
      {
        type: 'Times Square View Suite',
        price: 550,
        description: 'Suite overlooking Times Square',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '600 sq ft'
      },
      {
        type: 'Presidential Suite',
        price: 1000,
        description: 'Luxury suite with panoramic views',
        beds: '1 King',
        occupancy: '2 Adults',
        size: '1,000 sq ft'
      }
    ]
  }
]; 
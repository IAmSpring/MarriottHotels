// Tool definitions for the Marriott AI Assistant
export const ASSISTANT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_hotels",
      description: "Search for hotels based on location, dates, and preferences",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City or area to search for hotels"
          },
          checkIn: {
            type: "string",
            description: "Check-in date in YYYY-MM-DD format"
          },
          checkOut: {
            type: "string",
            description: "Check-out date in YYYY-MM-DD format"
          },
          guests: {
            type: "integer",
            description: "Number of guests"
          },
          preferences: {
            type: "array",
            items: { type: "string" },
            description: "List of preferences (e.g., ['pool', 'spa', 'beachfront'])"
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_hotel_details",
      description: "Get detailed information about a specific hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Check room availability and rates for a specific hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          checkIn: {
            type: "string",
            description: "Check-in date in YYYY-MM-DD format"
          },
          checkOut: {
            type: "string",
            description: "Check-out date in YYYY-MM-DD format"
          },
          guests: {
            type: "integer",
            description: "Number of guests"
          },
          roomType: {
            type: "string",
            description: "Specific room type to check"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_local_attractions",
      description: "Get information about attractions near a hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          category: {
            type: "string",
            description: "Type of attraction (e.g., restaurants, shopping, entertainment)"
          },
          radius: {
            type: "number",
            description: "Search radius in miles"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_dining_options",
      description: "Get dining options at a specific hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          cuisine: {
            type: "string",
            description: "Type of cuisine"
          },
          mealType: {
            type: "string",
            description: "Type of meal (breakfast, lunch, dinner)"
          }
        },
        required: ["hotelId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_bonvoy_info",
      description: "Get Marriott Bonvoy program information",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Specific topic about Bonvoy (e.g., points, status, benefits)"
          }
        },
        required: ["topic"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_transportation",
      description: "Get transportation options to/from hotel",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "Unique identifier of the hotel"
          },
          fromTo: {
            type: "string",
            description: "Location to/from hotel (e.g., airport, attraction)"
          },
          type: {
            type: "string",
            description: "Type of transportation (e.g., shuttle, taxi, public)"
          }
        },
        required: ["hotelId", "fromTo"]
      }
    }
  }
];

// Tool implementations
export async function searchHotels(params: any) {
  return {
    hotels: [
      {
        id: 'dtla-1',
        name: 'JW Marriott Los Angeles L.A. LIVE',
        location: 'Downtown LA',
        rating: 4.5,
        amenities: ['Pool', 'Spa', 'Restaurant', 'Fitness Center'],
        price: { from: 299, currency: 'USD' },
        thumbnail: '/images/hotels/jw-marriott-la-live.jpg'
      },
      {
        id: 'dtla-2',
        name: 'The Ritz-Carlton, Los Angeles',
        location: 'Downtown LA',
        rating: 4.8,
        amenities: ['Pool', 'Spa', 'Fine Dining', 'Luxury Suites'],
        price: { from: 499, currency: 'USD' },
        thumbnail: '/images/hotels/ritz-carlton-la.jpg'
      }
    ],
    totalResults: 2,
    filters: {
      priceRange: { min: 299, max: 499, currency: 'USD' },
      amenities: ['Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Fine Dining']
    }
  };
}

export async function getHotelDetails(params: any) {
  return {
    id: params.hotelId,
    name: 'JW Marriott Los Angeles L.A. LIVE',
    description: 'Luxury hotel in downtown LA with world-class amenities',
    rating: 4.5,
    address: '900 W Olympic Blvd, Los Angeles, CA 90015',
    coordinates: { lat: 34.0459, lng: -118.2644 },
    amenities: [
      { name: 'Pool', description: 'Rooftop pool with city views' },
      { name: 'Spa', description: 'Full-service spa with luxury treatments' },
      { name: 'Restaurants', description: '4 on-site dining options' },
      { name: 'Fitness Center', description: '24/7 state-of-the-art facility' }
    ],
    rooms: [
      { type: 'Deluxe King', size: '400 sq ft', view: 'City View', amenities: ['King Bed', 'Work Desk', 'Mini Bar'] },
      { type: 'Executive Suite', size: '650 sq ft', view: 'Downtown View', amenities: ['Separate Living Area', 'Club Access', 'City Views'] },
      { type: 'Presidential Suite', size: '1,500 sq ft', view: 'Panoramic View', amenities: ['Butler Service', 'Private Terrace', 'Dining Room'] }
    ],
    images: [
      { url: '/images/hotels/jw-marriott-la-live-exterior.jpg', caption: 'Hotel Exterior' },
      { url: '/images/hotels/jw-marriott-la-live-lobby.jpg', caption: 'Grand Lobby' },
      { url: '/images/hotels/jw-marriott-la-live-room.jpg', caption: 'Deluxe King Room' }
    ],
    policies: {
      checkIn: '4:00 PM',
      checkOut: '11:00 AM',
      parking: 'Valet parking available',
      pets: 'Pet-friendly, additional fees apply'
    }
  };
}

export async function checkAvailability(params: any) {
  return {
    available: true,
    rooms: [
      {
        type: 'Deluxe King',
        price: 299,
        dates: ['2024-07-01', '2024-07-08'],
        amenities: ['King Bed', 'City View', 'Work Desk'],
        cancellation: 'Free cancellation until 48 hours before check-in',
        bonvoyPoints: 30000
      },
      {
        type: 'Executive Suite',
        price: 499,
        dates: ['2024-07-01', '2024-07-08'],
        amenities: ['Separate Living Area', 'Club Access', 'City Views'],
        cancellation: 'Free cancellation until 72 hours before check-in',
        bonvoyPoints: 50000
      }
    ],
    rateDetails: {
      currency: 'USD',
      taxRate: 0.15,
      resortFee: 25,
      bonvoyMemberDiscount: 0.1
    }
  };
}

export async function getLocalAttractions(params: any) {
  return {
    attractions: [
      {
        name: 'L.A. LIVE',
        type: 'Entertainment',
        distance: 0.1,
        description: 'Sports & entertainment district',
        rating: 4.5,
        website: 'https://www.lalive.com',
        openHours: '24/7',
        image: '/images/attractions/la-live.jpg'
      },
      {
        name: 'Crypto.com Arena',
        type: 'Sports',
        distance: 0.2,
        description: 'Home of Lakers and Clippers',
        rating: 4.7,
        website: 'https://www.cryptoarena.com',
        openHours: 'Event dependent',
        image: '/images/attractions/crypto-arena.jpg'
      }
    ],
    categories: ['Entertainment', 'Sports', 'Dining', 'Shopping'],
    transportOptions: ['Walking', 'Hotel Shuttle', 'Taxi']
  };
}

export async function getDiningOptions(params: any) {
  return {
    restaurants: [
      {
        name: 'WP24 by Wolfgang Puck',
        cuisine: 'Asian Fusion',
        priceRange: '$$$$',
        hours: { dinner: '5:30 PM - 10:00 PM' },
        description: 'Fine dining with city views',
        reservationRequired: true,
        dressCode: 'Business Casual',
        menu: {
          highlights: ['Peking Duck', 'Dim Sum', 'Seafood'],
          dietary: ['Vegetarian', 'Gluten-Free']
        }
      },
      {
        name: 'Ford's Filling Station L.A. LIVE',
        cuisine: 'American',
        priceRange: '$$$',
        hours: {
          breakfast: '6:30 AM - 11:00 AM',
          lunch: '11:30 AM - 2:30 PM',
          dinner: '5:00 PM - 10:00 PM'
        },
        description: 'Casual dining with craft cocktails',
        reservationRequired: false,
        dressCode: 'Casual',
        menu: {
          highlights: ['Craft Burgers', 'Local Beer', 'Farm-to-Table'],
          dietary: ['Vegan', 'Gluten-Free']
        }
      }
    ],
    inRoomDining: {
      available: true,
      hours: '24/7',
      menu: 'Full restaurant menu available'
    }
  };
}

export async function getBonvoyInfo(params: any) {
  return {
    program: {
      name: 'Marriott Bonvoy',
      description: 'Marriott's award-winning loyalty program',
      tiers: [
        {
          name: 'Member',
          requirements: '0-9 nights',
          benefits: ['Free WiFi', 'Member Rates', 'Mobile Check-In']
        },
        {
          name: 'Silver Elite',
          requirements: '10-24 nights',
          benefits: ['10% Bonus Points', 'Priority Late Checkout', 'Ultimate Reservation Guarantee']
        },
        {
          name: 'Gold Elite',
          requirements: '25-49 nights',
          benefits: ['25% Bonus Points', 'Enhanced Room Upgrade', '2 PM Late Checkout']
        },
        {
          name: 'Platinum Elite',
          requirements: '50-74 nights',
          benefits: ['50% Bonus Points', 'Lounge Access', 'Welcome Gift']
        }
      ],
      points: {
        earning: '10 points per USD at most hotels',
        redemption: 'Free nights starting at 5,000 points',
        transfer: 'Transfer to 40+ airline partners'
      },
      benefits: {
        rooms: ['Free Night Awards', 'Room Upgrades', 'Welcome Gifts'],
        experiences: ['Member Exclusive Rates', 'Mobile Key', 'Points Sharing']
      }
    }
  };
}

export async function checkTransportation(params: any) {
  return {
    options: [
      {
        type: 'Hotel Shuttle',
        schedule: 'Every 30 minutes',
        price: 25,
        duration: '30-45 minutes',
        reservationRequired: true,
        availability: '24/7'
      },
      {
        type: 'Taxi/Rideshare',
        providers: ['Uber', 'Lyft', 'Local Taxi'],
        estimatedPrice: { range: { min: 35, max: 45 } },
        duration: '25-35 minutes',
        availability: '24/7'
      },
      {
        type: 'Public Transportation',
        route: 'Metro Blue Line to 7th St/Metro Center',
        price: 1.75,
        duration: '45-60 minutes',
        schedule: '5:00 AM - 12:00 AM'
      }
    ],
    distances: {
      airport: { LAX: '18 miles', BUR: '15 miles' },
      downtown: '0.5 miles',
      convention_center: '0.3 miles'
    }
  };
} 
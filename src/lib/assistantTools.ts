// Tool definitions for the Marriott AI Assistant
import { hotels } from '../data/hotels';

export const ASSISTANT_TOOLS = [
  {
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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
    type: "function" as const,
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

// Enhanced tool implementations with real hotel data
export async function searchHotels(params: any) {
  try {
    const { location, checkIn, checkOut, guests = 2, preferences = [] } = params;
    
    // Filter hotels by location (case-insensitive)
    let filteredHotels = hotels.filter(hotel => 
      hotel.location.toLowerCase().includes(location.toLowerCase()) ||
      hotel.name.toLowerCase().includes(location.toLowerCase())
    );

    // Filter by preferences if provided
    if (preferences.length > 0) {
      filteredHotels = filteredHotels.filter(hotel =>
        preferences.some((pref: string) =>
          hotel.amenities.some(amenity =>
            amenity.toLowerCase().includes(pref.toLowerCase())
          )
        )
      );
    }

    // Add availability simulation
    const hotelsWithAvailability = filteredHotels.map(hotel => ({
      ...hotel,
      availability: {
        available: Math.random() > 0.1, // 90% availability
        roomsAvailable: Math.floor(Math.random() * 10) + 1,
        lastUpdated: new Date().toISOString()
      },
      searchCriteria: {
        location,
        checkIn,
        checkOut,
        guests,
        preferences
      }
    }));

    return {
      hotels: hotelsWithAvailability,
      totalResults: hotelsWithAvailability.length,
      searchCriteria: {
        location,
        checkIn,
        checkOut,
        guests,
        preferences
      },
      filters: {
        priceRange: {
          min: Math.min(...hotelsWithAvailability.map(h => h.price.base)),
          max: Math.max(...hotelsWithAvailability.map(h => h.price.base)),
          currency: 'USD'
        },
        amenities: [...new Set(hotelsWithAvailability.flatMap(h => h.amenities))],
        types: [...new Set(hotelsWithAvailability.map(h => h.type))]
      }
    };
  } catch (error) {
    console.error('Error in searchHotels:', error);
    return {
      error: 'Failed to search hotels',
      hotels: [],
      totalResults: 0
    };
  }
}

export async function getHotelDetails(params: any) {
  try {
    const { hotelId } = params;
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return {
        error: 'Hotel not found',
        hotelId
      };
    }

    // Enhanced hotel details with additional information
    return {
      ...hotel,
      detailedAmenities: hotel.amenities.map(amenity => ({
        name: amenity,
        description: getAmenityDescription(amenity),
        available: true,
        hours: getAmenityHours(amenity)
      })),
      nearbyAttractions: getNearbyAttractions(hotel.location),
      weather: getWeatherInfo(hotel.location),
      specialOffers: getSpecialOffers(hotel.id),
      reviews: generateReviews(hotel.rating, hotel.reviews),
      sustainability: {
        greenCertified: true,
        energyEfficient: true,
        recyclingProgram: true,
        localSourcing: true
      }
    };
  } catch (error) {
    console.error('Error in getHotelDetails:', error);
    return {
      error: 'Failed to get hotel details',
      hotelId: params.hotelId
    };
  }
}

export async function checkAvailability(params: any) {
  try {
    const { hotelId, checkIn, checkOut, guests = 2, roomType } = params;
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return {
        error: 'Hotel not found',
        hotelId
      };
    }

    // Simulate availability check
    const availableRooms = hotel.rooms.map(room => ({
      ...room,
      available: Math.random() > 0.2, // 80% availability
      quantity: Math.floor(Math.random() * 5) + 1,
      rate: {
        base: room.price,
        total: room.price * 1.15, // Including tax
        currency: 'USD',
        bonvoyPoints: Math.floor(room.price * 10),
        memberDiscount: room.price * 0.1
      },
      cancellation: {
        policy: 'Free cancellation until 48 hours before check-in',
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      },
      amenities: getRoomAmenities(room.type)
    }));

    const availableCount = availableRooms.filter(r => r.available).length;

    return {
      hotelId,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      guests,
      available: availableCount > 0,
      rooms: availableRooms,
      rateDetails: {
        currency: 'USD',
        taxRate: 0.15,
        resortFee: hotel.type === 'LUXURY' ? 35 : 25,
        bonvoyMemberDiscount: 0.1,
        earlyBookingDiscount: 0.05,
        lastMinuteDiscount: availableCount > 3 ? 0.15 : 0
      },
      policies: {
        checkIn: hotel.checkInTime,
        checkOut: hotel.checkOutTime,
        cancellation: hotel.policies.find(p => p.includes('Cancellation')) || '48 hours notice required',
        deposit: 'Credit card required for guarantee'
      }
    };
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    return {
      error: 'Failed to check availability',
      hotelId: params.hotelId
    };
  }
}

export async function getLocalAttractions(params: any) {
  try {
    const { hotelId, category, radius = 5 } = params;
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return {
        error: 'Hotel not found',
        hotelId
      };
    }

    const attractions = getAttractionsByLocation(hotel.location, category, radius);

    return {
      hotelId,
      hotelName: hotel.name,
      location: hotel.location,
      category,
      radius,
      attractions,
      categories: ['Restaurants', 'Shopping', 'Entertainment', 'Cultural', 'Outdoor', 'Sports'],
      transportOptions: ['Walking', 'Hotel Shuttle', 'Taxi', 'Public Transit', 'Rental Car'],
      recommendations: attractions.slice(0, 3).map(attr => ({
        name: attr.name,
        reason: `Popular ${attr.type} destination near the hotel`,
        distance: attr.distance
      }))
    };
  } catch (error) {
    console.error('Error in getLocalAttractions:', error);
    return {
      error: 'Failed to get local attractions',
      hotelId: params.hotelId
    };
  }
}

export async function getDiningOptions(params: any) {
  try {
    const { hotelId, cuisine, mealType } = params;
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return {
        error: 'Hotel not found',
        hotelId
      };
    }

    const restaurants = getRestaurantsByHotel(hotel, cuisine, mealType);

    return {
      hotelId,
      hotelName: hotel.name,
      restaurants,
      inRoomDining: {
        available: true,
        hours: "24/7",
        menu: "Full restaurant menu available",
        deliveryFee: 5,
        minimumOrder: 25
      },
      specialDining: {
        privateDining: true,
        chefTable: hotel.type === 'LUXURY',
        winePairing: hotel.type === 'LUXURY',
        dietaryAccommodations: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal']
      },
      reservations: {
        required: hotel.type === 'LUXURY',
        advanceNotice: hotel.type === 'LUXURY' ? '24 hours' : '2 hours',
        contact: hotel.contact.phone
      }
    };
  } catch (error) {
    console.error('Error in getDiningOptions:', error);
    return {
      error: 'Failed to get dining options',
      hotelId: params.hotelId
    };
  }
}

export async function getBonvoyInfo(params: any) {
  try {
    const { topic } = params;
    
    const bonvoyData = {
      program: {
        name: "Marriott Bonvoy",
        description: "Marriott's award-winning loyalty program",
        tiers: [
          {
            name: "Member",
            requirements: "0-9 nights",
            benefits: ["Free WiFi", "Member Rates", "Mobile Check-In", "Points Earning"]
          },
          {
            name: "Silver Elite",
            requirements: "10-24 nights",
            benefits: ["10% Bonus Points", "Priority Late Checkout", "Ultimate Reservation Guarantee", "Elite Rollover Nights"]
          },
          {
            name: "Gold Elite",
            requirements: "25-49 nights",
            benefits: ["25% Bonus Points", "Enhanced Room Upgrade", "2 PM Late Checkout", "Welcome Gift", "Elite Rollover Nights"]
          },
          {
            name: "Platinum Elite",
            requirements: "50-74 nights",
            benefits: ["50% Bonus Points", "Lounge Access", "Welcome Gift", "Guaranteed Room Type", "Elite Rollover Nights"]
          },
          {
            name: "Titanium Elite",
            requirements: "75-99 nights",
            benefits: ["75% Bonus Points", "Enhanced Room Upgrade", "Guaranteed Room Type", "Elite Rollover Nights", "Choice Benefit"]
          },
          {
            name: "Ambassador Elite",
            requirements: "100+ nights",
            benefits: ["75% Bonus Points", "Ambassador Service", "Guaranteed Room Type", "Elite Rollover Nights", "Choice Benefit"]
          }
        ],
        points: {
          earning: "10 points per USD at most hotels",
          redemption: "Free nights starting at 5,000 points",
          transfer: "Transfer to 40+ airline partners",
          expiration: "Points expire after 24 months of inactivity"
        },
        benefits: {
          rooms: ["Free Night Awards", "Room Upgrades", "Welcome Gifts", "Late Checkout"],
          experiences: ["Member Exclusive Rates", "Mobile Key", "Points Sharing", "Elite Status Gifts"],
          partnerships: ["Airline Partners", "Car Rental Partners", "Shopping Partners"]
        }
      }
    };

    // Return specific topic if requested
    if (topic) {
      const topicLower = topic.toLowerCase();
      if (topicLower.includes('points')) {
        return { points: bonvoyData.program.points };
      } else if (topicLower.includes('tier') || topicLower.includes('status')) {
        return { tiers: bonvoyData.program.tiers };
      } else if (topicLower.includes('benefit')) {
        return { benefits: bonvoyData.program.benefits };
      }
    }

    return bonvoyData;
  } catch (error) {
    console.error('Error in getBonvoyInfo:', error);
    return {
      error: 'Failed to get Bonvoy information',
      topic: params.topic
    };
  }
}

export async function checkTransportation(params: any) {
  try {
    const { hotelId, fromTo, type } = params;
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return {
        error: 'Hotel not found',
        hotelId
      };
    }

    const transportOptions = getTransportationOptions(hotel, fromTo, type);

    return {
      hotelId,
      hotelName: hotel.name,
      fromTo,
      type,
      options: transportOptions,
      distances: getDistances(hotel.location, fromTo),
      recommendations: transportOptions.slice(0, 2).map(option => ({
        type: option.type,
        reason: option.type === 'Hotel Shuttle' ? 'Complimentary service' : 'Most convenient option',
        estimatedTime: option.duration
      })),
      booking: {
        advanceReservation: type === 'Hotel Shuttle',
        contact: hotel.contact.phone,
        conciergeAssistance: true
      }
    };
  } catch (error) {
    console.error('Error in checkTransportation:', error);
    return {
      error: 'Failed to check transportation',
      hotelId: params.hotelId
    };
  }
}

// Helper functions
function getAmenityDescription(amenity: string): string {
  const descriptions: Record<string, string> = {
    'Pool': 'Heated outdoor pool with lounge chairs and towel service',
    'Spa': 'Full-service spa with massage, facials, and wellness treatments',
    'Restaurant': 'On-site dining with local and international cuisine',
    'Fitness Center': '24/7 gym with modern equipment and personal training',
    'Business Center': 'Professional business facilities with printing and meeting rooms',
    'Valet Parking': 'Convenient valet parking service available 24/7',
    'Room Service': '24-hour in-room dining with full restaurant menu',
    'Concierge': 'Personalized assistance for reservations and local recommendations'
  };
  return descriptions[amenity] || 'Available for guest use';
}

function getAmenityHours(amenity: string): string {
  const hours: Record<string, string> = {
    'Pool': '6:00 AM - 10:00 PM',
    'Spa': '9:00 AM - 8:00 PM',
    'Restaurant': '6:30 AM - 11:00 PM',
    'Fitness Center': '24/7',
    'Business Center': '6:00 AM - 10:00 PM',
    'Valet Parking': '24/7',
    'Room Service': '24/7',
    'Concierge': '24/7'
  };
  return hours[amenity] || 'Hours vary';
}

function getNearbyAttractions(location: string): any[] {
  const attractions: Record<string, any[]> = {
    'Miami Beach, FL': [
      { name: 'South Beach', type: 'Beach', distance: 0.5, rating: 4.8 },
      { name: 'Lincoln Road Mall', type: 'Shopping', distance: 0.3, rating: 4.5 },
      { name: 'Art Deco District', type: 'Cultural', distance: 0.8, rating: 4.7 }
    ],
    'Aspen, CO': [
      { name: 'Aspen Mountain', type: 'Skiing', distance: 0.2, rating: 4.9 },
      { name: 'Downtown Aspen', type: 'Shopping', distance: 0.5, rating: 4.6 },
      { name: 'Maroon Bells', type: 'Hiking', distance: 12, rating: 4.8 }
    ],
    'Manhattan, NY': [
      { name: 'Times Square', type: 'Entertainment', distance: 0.1, rating: 4.3 },
      { name: 'Central Park', type: 'Park', distance: 1.2, rating: 4.7 },
      { name: 'Broadway Theaters', type: 'Entertainment', distance: 0.3, rating: 4.6 }
    ]
  };
  return attractions[location] || [];
}

function getWeatherInfo(location: string): any {
  const weather: Record<string, any> = {
    'Miami Beach, FL': { temp: 85, condition: 'Sunny', humidity: 70 },
    'Aspen, CO': { temp: 45, condition: 'Partly Cloudy', humidity: 40 },
    'Manhattan, NY': { temp: 72, condition: 'Clear', humidity: 55 }
  };
  return weather[location] || { temp: 70, condition: 'Unknown', humidity: 50 };
}

function getSpecialOffers(hotelId: string): any[] {
  return [
    { name: 'Weekend Getaway', discount: 15, validUntil: '2024-12-31' },
    { name: 'Advance Purchase', discount: 10, validUntil: '2024-11-30' },
    { name: 'Bonvoy Member Rate', discount: 5, validUntil: '2024-12-31' }
  ];
}

function generateReviews(rating: number, count: number): any[] {
  const reviews = [];
  for (let i = 0; i < Math.min(count, 5); i++) {
    reviews.push({
      id: `review-${i}`,
      rating: rating + (Math.random() - 0.5) * 0.5,
      comment: `Great experience at this hotel!`,
      author: `Guest${i + 1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  return reviews;
}

function getRoomAmenities(roomType: string): string[] {
  const amenities: Record<string, string[]> = {
    'Deluxe': ['King Bed', 'Work Desk', 'Mini Bar', 'Coffee Maker', 'Free WiFi'],
    'Suite': ['Separate Living Area', 'Club Access', 'City Views', 'Butler Service'],
    'Presidential': ['Butler Service', 'Private Terrace', 'Dining Room', 'Luxury Bath']
  };
  return amenities[roomType] || ['Standard Amenities'];
}

function getAttractionsByLocation(location: string, category?: string, radius: number = 5): any[] {
  const allAttractions: Record<string, any[]> = {
    'Miami Beach, FL': [
      { name: 'South Beach', type: 'Beach', distance: 0.5, rating: 4.8, category: 'Outdoor' },
      { name: 'Lincoln Road Mall', type: 'Shopping', distance: 0.3, rating: 4.5, category: 'Shopping' },
      { name: 'Art Deco District', type: 'Cultural', distance: 0.8, rating: 4.7, category: 'Cultural' },
      { name: 'Versace Mansion', type: 'Cultural', distance: 1.2, rating: 4.4, category: 'Cultural' }
    ],
    'Aspen, CO': [
      { name: 'Aspen Mountain', type: 'Skiing', distance: 0.2, rating: 4.9, category: 'Sports' },
      { name: 'Downtown Aspen', type: 'Shopping', distance: 0.5, rating: 4.6, category: 'Shopping' },
      { name: 'Maroon Bells', type: 'Hiking', distance: 12, rating: 4.8, category: 'Outdoor' }
    ],
    'Manhattan, NY': [
      { name: 'Times Square', type: 'Entertainment', distance: 0.1, rating: 4.3, category: 'Entertainment' },
      { name: 'Central Park', type: 'Park', distance: 1.2, rating: 4.7, category: 'Outdoor' },
      { name: 'Broadway Theaters', type: 'Entertainment', distance: 0.3, rating: 4.6, category: 'Entertainment' }
    ]
  };

  let attractions = allAttractions[location] || [];
  
  if (category) {
    attractions = attractions.filter(attr => 
      attr.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  return attractions.filter(attr => attr.distance <= radius);
}

function getRestaurantsByHotel(hotel: any, cuisine?: string, mealType?: string): any[] {
  const restaurants = [
    {
      name: "Main Restaurant",
      cuisine: "International",
      priceRange: "$$$",
      hours: { breakfast: "6:30 AM - 11:00 AM", lunch: "11:30 AM - 2:30 PM", dinner: "5:00 PM - 10:00 PM" },
      description: "Elegant dining with local and international cuisine",
      reservationRequired: false,
      dressCode: "Smart Casual",
      menu: { highlights: ["Local Specialties", "International Dishes"], dietary: ["Vegetarian", "Gluten-Free"] }
    },
    {
      name: "Lounge Bar",
      cuisine: "Bar & Grill",
      priceRange: "$$",
      hours: { lunch: "11:00 AM - 2:00 PM", dinner: "5:00 PM - 11:00 PM" },
      description: "Casual dining with craft cocktails",
      reservationRequired: false,
      dressCode: "Casual",
      menu: { highlights: ["Craft Cocktails", "Bar Snacks"], dietary: ["Vegan", "Gluten-Free"] }
    }
  ];

  if (cuisine) {
    restaurants.push({
      name: `${cuisine} Restaurant`,
      cuisine: cuisine,
      priceRange: "$$$$",
      hours: { lunch: "12:00 PM - 2:00 PM", dinner: "6:00 PM - 10:00 PM" },
      description: `Specialized ${cuisine} cuisine`,
      reservationRequired: true,
      dressCode: "Business Casual",
      menu: { highlights: [`${cuisine} Specialties`], dietary: ["Vegetarian", "Gluten-Free"] }
    });
  }

  return restaurants;
}

function getTransportationOptions(hotel: any, fromTo: string, type?: string): any[] {
  const options = [
    {
      type: "Hotel Shuttle",
      schedule: "Every 30 minutes",
      price: 25,
      duration: "30-45 minutes",
      reservationRequired: true,
      availability: "24/7"
    },
    {
      type: "Taxi/Rideshare",
      providers: ["Uber", "Lyft", "Local Taxi"],
      estimatedPrice: { range: { min: 35, max: 45 } },
      duration: "25-35 minutes",
      availability: "24/7"
    },
    {
      type: "Public Transportation",
      route: "Local transit options",
      price: 2.75,
      duration: "45-60 minutes",
      schedule: "5:00 AM - 12:00 AM"
    }
  ];

  if (type) {
    return options.filter(option => 
      option.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  return options;
}

function getDistances(location: string, fromTo: string): any {
  const distances: Record<string, any> = {
    'Miami Beach, FL': { airport: { MIA: "12 miles", FLL: "18 miles" }, downtown: "8 miles" },
    'Aspen, CO': { airport: { ASE: "4 miles" }, downtown: "0.5 miles" },
    'Manhattan, NY': { airport: { JFK: "15 miles", LGA: "8 miles" }, downtown: "2 miles" }
  };
  return distances[location] || { airport: "Unknown", downtown: "Unknown" };
} 
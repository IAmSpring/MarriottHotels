import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.order.deleteMany();
  await prisma.experienceBooking.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        password: hashedPassword,
        role: 'USER',
        bonvoyNumber: 'MB123456789',
        bonvoyPoints: 45000,
        bonvoyStatus: 'PLATINUM'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        password: hashedPassword,
        role: 'USER',
        bonvoyNumber: 'MB987654321',
        bonvoyPoints: 125000,
        bonvoyStatus: 'TITANIUM'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        password: hashedPassword,
        role: 'USER',
        bonvoyNumber: 'MB456789123',
        bonvoyPoints: 25000,
        bonvoyStatus: 'GOLD'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        password: hashedPassword,
        role: 'USER',
        bonvoyNumber: 'MB789123456',
        bonvoyPoints: 85000,
        bonvoyStatus: 'PLATINUM'
      }
    }),
    prisma.user.create({
      data: {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        password: hashedPassword,
        role: 'USER',
        bonvoyNumber: 'MB321654987',
        bonvoyPoints: 15000,
        bonvoyStatus: 'SILVER'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@marriott.com',
        password: hashedPassword,
        role: 'ADMIN',
        bonvoyNumber: 'MB999999999',
        bonvoyPoints: 500000,
        bonvoyStatus: 'AMBASSADOR'
      }
    })
  ]);

  console.log('👥 Created users');

  // Create hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Marriott Marquis Times Square',
        location: 'New York, NY',
        address: '1535 Broadway, New York, NY 10036',
        description: 'Located in the heart of Times Square, this iconic hotel offers stunning city views and world-class amenities.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 4.5
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'The Ritz-Carlton Los Angeles',
        location: 'Los Angeles, CA',
        address: '900 W Olympic Blvd, Los Angeles, CA 90015',
        description: 'Luxury hotel in downtown LA featuring rooftop pool and spa with panoramic city views.',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        rating: 4.8
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'W Chicago - Lakeshore',
        location: 'Chicago, IL',
        address: '644 N Lake Shore Dr, Chicago, IL 60611',
        description: 'Contemporary hotel on Lake Michigan with stunning views and vibrant nightlife scene.',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        rating: 4.3
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'The St. Regis San Francisco',
        location: 'San Francisco, CA',
        address: '125 3rd St, San Francisco, CA 94103',
        description: 'Elegant luxury hotel in the heart of San Francisco with butler service and fine dining.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 4.7
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Marriott Marquis Washington DC',
        location: 'Washington, DC',
        address: '901 Massachusetts Ave NW, Washington, DC 20001',
        description: 'Modern hotel near the Capitol with rooftop bar and conference facilities.',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        rating: 4.4
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'The Ritz-Carlton Miami',
        location: 'Miami, FL',
        address: '330 SW 27th Ave, Miami, FL 33135',
        description: 'Beachfront luxury resort with private beach access and tropical gardens.',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        rating: 4.6
      }
    })
  ]);

  console.log('🏨 Created hotels');

  // Create amenities for each hotel
  const amenityCategories = ['dining', 'fitness', 'spa', 'business', 'pool', 'entertainment'];
  
  for (const hotel of hotels) {
    await Promise.all([
      // Dining amenities
      prisma.amenity.create({
        data: {
          name: '24/7 Room Service',
          category: 'dining',
          description: 'Round-the-clock in-room dining service',
          hotelId: hotel.id
        }
      }),
      prisma.amenity.create({
        data: {
          name: 'Fine Dining Restaurant',
          category: 'dining',
          description: 'Award-winning restaurant with seasonal menus',
          hotelId: hotel.id
        }
      }),
      
      // Fitness amenities
      prisma.amenity.create({
        data: {
          name: 'Fitness Center',
          category: 'fitness',
          description: 'State-of-the-art gym with personal training',
          hotelId: hotel.id
        }
      }),
      prisma.amenity.create({
        data: {
          name: 'Yoga Studio',
          category: 'fitness',
          description: 'Peaceful studio for yoga and meditation',
          hotelId: hotel.id
        }
      }),
      
      // Spa amenities
      prisma.amenity.create({
        data: {
          name: 'Spa & Wellness Center',
          category: 'spa',
          description: 'Full-service spa with massage and treatments',
          hotelId: hotel.id
        }
      }),
      
      // Business amenities
      prisma.amenity.create({
        data: {
          name: 'Business Center',
          category: 'business',
          description: 'Conference rooms and business services',
          hotelId: hotel.id
        }
      }),
      prisma.amenity.create({
        data: {
          name: 'High-Speed WiFi',
          category: 'business',
          description: 'Complimentary high-speed internet access',
          hotelId: hotel.id
        }
      }),
      
      // Pool amenities
      prisma.amenity.create({
        data: {
          name: 'Swimming Pool',
          category: 'pool',
          description: 'Heated outdoor pool with cabanas',
          hotelId: hotel.id
        }
      }),
      
      // Entertainment amenities
      prisma.amenity.create({
        data: {
          name: 'Rooftop Bar',
          category: 'entertainment',
          description: 'Stylish rooftop bar with city views',
          hotelId: hotel.id
        }
      })
    ]);
  }

  console.log('🏊 Created amenities');

  // Create rooms for each hotel
  const roomTypes = [
    { type: 'Standard Room', price: 200, capacity: 2, amenities: 'King bed, city view, work desk' },
    { type: 'Deluxe Room', price: 300, capacity: 2, amenities: 'King bed, city view, work desk, mini bar' },
    { type: 'Suite', price: 500, capacity: 4, amenities: 'King bed, living room, city view, work desk, mini bar, jacuzzi' },
    { type: 'Presidential Suite', price: 1200, capacity: 6, amenities: 'Multiple bedrooms, living room, dining room, city view, work desk, mini bar, jacuzzi, butler service' }
  ];

  for (const hotel of hotels) {
    for (const roomType of roomTypes) {
      await prisma.room.create({
        data: {
          hotelId: hotel.id,
          type: roomType.type,
          description: `${roomType.type} with ${roomType.amenities}`,
          price: roomType.price,
          capacity: roomType.capacity,
          amenities: roomType.amenities,
          imageUrl: `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&room=${roomType.type}`,
          available: Math.random() > 0.3 // 70% availability
        }
      });
    }
  }

  console.log('🛏️ Created rooms');

  // Create restaurants for each hotel
  const restaurantData = [
    { name: 'The Grand Dining Room', cuisine: 'American', priceRange: '$$$', openTime: '06:00', closeTime: '22:00' },
    { name: 'Sakura Sushi Bar', cuisine: 'Japanese', priceRange: '$$', openTime: '11:00', closeTime: '23:00' },
    { name: 'Tuscany Italian', cuisine: 'Italian', priceRange: '$$$', openTime: '17:00', closeTime: '23:00' },
    { name: 'Café Express', cuisine: 'International', priceRange: '$', openTime: '06:00', closeTime: '18:00' }
  ];

  for (const hotel of hotels) {
    for (const restaurant of restaurantData) {
      await prisma.restaurant.create({
        data: {
          hotelId: hotel.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          priceRange: restaurant.priceRange,
          openTime: restaurant.openTime,
          closeTime: restaurant.closeTime,
          description: `Authentic ${restaurant.cuisine} cuisine in an elegant setting`,
          imageUrl: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&restaurant=${restaurant.name}`
        }
      });
    }
  }

  console.log('🍽️ Created restaurants');

  // Create experiences for each hotel
  const experienceData = [
    { name: 'Spa Day Package', type: 'spa', price: 150, duration: 180, description: 'Full day spa experience with massage and treatments' },
    { name: 'City Tour', type: 'tour', price: 75, duration: 240, description: 'Guided city tour with local expert' },
    { name: 'Cooking Class', type: 'class', price: 120, duration: 180, description: 'Learn to cook local cuisine with our chef' },
    { name: 'Wine Tasting', type: 'event', price: 85, duration: 120, description: 'Premium wine tasting experience' },
    { name: 'Golf Package', type: 'golf', price: 200, duration: 300, description: 'Golf at nearby championship course' }
  ];

  for (const hotel of hotels) {
    for (const experience of experienceData) {
      await prisma.experience.create({
        data: {
          hotelId: hotel.id,
          name: experience.name,
          type: experience.type,
          description: experience.description,
          price: experience.price,
          duration: experience.duration,
          imageUrl: `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&experience=${experience.name}`,
          available: Math.random() > 0.2 // 80% availability
        }
      });
    }
  }

  console.log('🎯 Created experiences');

  // Create bookings
  const bookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
  const rooms = await prisma.room.findMany();
  
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
    
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 30) + 1);
    
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 7) + 1);
    
    await prisma.booking.create({
      data: {
        userId: user.id,
        hotelId: room.hotelId,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: Math.floor(Math.random() * 4) + 1,
        totalPrice: room.price * (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        status
      }
    });
  }

  console.log('📅 Created bookings');

  // Create reviews
  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const hotel = hotels[Math.floor(Math.random() * hotels.length)];
    
    await prisma.review.create({
      data: {
        userId: user.id,
        hotelId: hotel.id,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
        comment: `Great stay at ${hotel.name}! The service was excellent and the amenities were top-notch. Would definitely recommend to others.`
      }
    });
  }

  console.log('⭐ Created reviews');

  // Create conversations (AI chat history)
  const conversationTopics = [
    'Hotel booking assistance',
    'Room upgrade inquiry',
    'Restaurant reservation help',
    'Local attraction recommendations',
    'Check-in time questions',
    'Amenity information request'
  ];

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const topic = conversationTopics[Math.floor(Math.random() * conversationTopics.length)];
    
    await prisma.conversation.create({
      data: {
        userId: user.id,
        userMessage: `I need help with ${topic.toLowerCase()}.`,
        aiResponse: `I'd be happy to help you with ${topic.toLowerCase()}. Let me provide you with the information you need.`,
        threadId: `thread_${Math.random().toString(36).substr(2, 9)}`
      }
    });
  }

  console.log('💬 Created conversations');

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${users.length} users, ${hotels.length} hotels, and various amenities, rooms, restaurants, and experiences`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
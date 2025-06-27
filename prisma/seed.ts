import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.$transaction([
    prisma.conversation.deleteMany(),
    prisma.review.deleteMany(),
    prisma.experienceBooking.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.reservation.deleteMany(),
    prisma.restaurant.deleteMany(),
    prisma.amenity.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.room.deleteMany(),
    prisma.hotel.deleteMany(),
    prisma.order.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create admin users
  const adminUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@marriott.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        bonvoyNumber: 'ADMIN001',
        bonvoyPoints: 100000,
        bonvoyStatus: 'AMBASSADOR'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@marriott.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'MANAGER',
        bonvoyNumber: 'ADMIN002',
        bonvoyPoints: 75000,
        bonvoyStatus: 'TITANIUM'
      }
    })
  ]);

  // Create sample users with various statuses
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: await bcrypt.hash('password123', 10),
        bonvoyNumber: 'BV123456',
        bonvoyPoints: 50000,
        bonvoyStatus: 'GOLD'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: await bcrypt.hash('password123', 10),
        bonvoyNumber: 'BV789012',
        bonvoyPoints: 100000,
        bonvoyStatus: 'PLATINUM'
      }
    }),
    prisma.user.create({
      data: {
        name: 'David Chen',
        email: 'david@example.com',
        password: await bcrypt.hash('password123', 10),
        bonvoyNumber: 'BV345678',
        bonvoyPoints: 25000,
        bonvoyStatus: 'SILVER'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sophie Martin',
        email: 'sophie@example.com',
        password: await bcrypt.hash('password123', 10),
        bonvoyNumber: 'BV901234',
        bonvoyPoints: 150000,
        bonvoyStatus: 'AMBASSADOR'
      }
    })
  ]);

  // Create sample hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Marriott Downtown',
        location: 'New York City, NY',
        address: '85 West Street, New York, NY 10006',
        description: 'Luxury hotel in the heart of Manhattan',
        imageUrl: '/images/new-york.jpg',
        rating: 4.8
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Marriott Resort',
        location: 'Miami Beach, FL',
        address: '4525 Collins Avenue, Miami Beach, FL 33140',
        description: 'Beachfront resort with stunning ocean views',
        imageUrl: '/images/miami-beach.jpg',
        rating: 4.7
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Marriott Mountain Lodge',
        location: 'Aspen, CO',
        address: '315 E Dean St, Aspen, CO 81611',
        description: 'Ski-in/ski-out luxury mountain resort',
        imageUrl: '/images/aspen.jpg',
        rating: 4.9
      }
    })
  ]);

  // Create rooms for each hotel
  for (const hotel of hotels) {
    await prisma.room.createMany({
      data: [
        {
          hotelId: hotel.id,
          type: 'standard',
          description: 'Comfortable room with modern amenities',
          price: 299.99,
          capacity: 2,
          amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Coffee Maker']),
          imageUrl: '/images/standard-room.jpg'
        },
        {
          hotelId: hotel.id,
          type: 'deluxe',
          description: 'Spacious room with premium amenities',
          price: 499.99,
          capacity: 3,
          amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Balcony', 'Lounge Access', 'Room Service']),
          imageUrl: '/images/deluxe-room.jpg'
        },
        {
          hotelId: hotel.id,
          type: 'suite',
          description: 'Luxury suite with separate living area',
          price: 799.99,
          capacity: 4,
          amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Balcony', 'Kitchen', 'Living Room', 'Butler Service']),
          imageUrl: '/images/suite-room.jpg'
        }
      ]
    });
  }

  // Create amenities for each hotel
  const amenityCategories = ['dining', 'fitness', 'spa', 'business', 'pool'];
  for (const hotel of hotels) {
    for (const category of amenityCategories) {
      await prisma.amenity.create({
        data: {
          hotelId: hotel.id,
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Center`,
          category,
          description: `World-class ${category} facilities available 24/7`,
          imageUrl: `/images/${category}.jpg`
        }
      });
    }
  }

  // Create restaurants for each hotel
  const restaurants = [
    { name: 'La Cucina', cuisine: 'Italian', priceRange: '$$$' },
    { name: 'Sakura', cuisine: 'Japanese', priceRange: '$$$$' },
    { name: 'The Grill', cuisine: 'American', priceRange: '$$' },
    { name: 'Le Bistro', cuisine: 'French', priceRange: '$$$$' }
  ];

  for (const hotel of hotels) {
    for (const restaurant of restaurants) {
      await prisma.restaurant.create({
        data: {
          hotelId: hotel.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          priceRange: restaurant.priceRange,
          openTime: '11:00',
          closeTime: '23:00',
          description: `Authentic ${restaurant.cuisine} cuisine in an elegant setting`,
          imageUrl: `/images/${restaurant.cuisine.toLowerCase()}-restaurant.jpg`
        }
      });
    }
  }

  // Create experiences for each hotel
  const experiences = [
    { name: 'Luxury Spa Day', type: 'spa', price: 299.99, duration: 180 },
    { name: 'Golf Tournament', type: 'golf', price: 199.99, duration: 240 },
    { name: 'City Tour', type: 'tour', price: 149.99, duration: 180 },
    { name: 'Cooking Class', type: 'class', price: 179.99, duration: 120 },
    { name: 'Wine Tasting', type: 'event', price: 129.99, duration: 90 }
  ];

  for (const hotel of hotels) {
    for (const exp of experiences) {
      await prisma.experience.create({
        data: {
          hotelId: hotel.id,
          name: exp.name,
          type: exp.type,
          description: `Unforgettable ${exp.type} experience`,
          price: exp.price,
          duration: exp.duration,
          imageUrl: `/images/${exp.type}.jpg`
        }
      });
    }
  }

  // Create sample bookings with various statuses
  const rooms = await prisma.room.findMany();
  const bookings = [
    {
      userId: users[0].id,
      hotelId: hotels[0].id,
      roomId: rooms[0].id,
      checkIn: new Date('2024-02-29'),
      checkOut: new Date('2024-03-05'),
      guests: 2,
      totalPrice: 1499.95,
      status: 'CONFIRMED'
    },
    {
      userId: users[1].id,
      hotelId: hotels[1].id,
      roomId: rooms[1].id,
      checkIn: new Date('2024-03-10'),
      checkOut: new Date('2024-03-15'),
      guests: 3,
      totalPrice: 2499.95,
      status: 'PENDING'
    },
    {
      userId: users[2].id,
      hotelId: hotels[2].id,
      roomId: rooms[2].id,
      checkIn: new Date('2024-03-20'),
      checkOut: new Date('2024-03-25'),
      guests: 4,
      totalPrice: 3999.95,
      status: 'CONFIRMED'
    }
  ];

  for (const booking of bookings) {
    await prisma.booking.create({
      data: booking
    });
  }

  // Create sample reviews with various ratings
  for (const user of users) {
    for (const hotel of hotels) {
      await prisma.review.create({
        data: {
          userId: user.id,
          hotelId: hotel.id,
          rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
          comment: 'Excellent stay! The service was impeccable and the facilities were top-notch.'
        }
      });
    }
  }

  // Create sample conversations
  const conversations = [
    {
      userId: users[0].id,
      userMessage: "I'd like to book a room for next week",
      aiResponse: "I'd be happy to help you book a room. Could you please let me know your preferred dates and location?",
      threadId: "thread_abc123"
    },
    {
      userId: users[1].id,
      userMessage: "What dining options are available?",
      aiResponse: "We have several restaurants including Italian, Japanese, American, and French cuisine. Would you like more details about any specific restaurant?",
      threadId: "thread_def456"
    }
  ];

  for (const conv of conversations) {
    await prisma.conversation.create({
      data: conv
    });
  }

  console.log('Database has been seeded with enhanced data! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
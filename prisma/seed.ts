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

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        bonvoyNumber: 'BV123456',
        bonvoyPoints: 50000,
        bonvoyStatus: 'GOLD'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        bonvoyNumber: 'BV789012',
        bonvoyPoints: 100000,
        bonvoyStatus: 'PLATINUM'
      }
    })
  ]);

  // Create sample hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Marriott Aspen',
        location: 'Aspen, Colorado',
        address: '123 Mountain View Drive, Aspen, CO 81611',
        description: 'Luxury mountain resort with spectacular views of the Rockies',
        imageUrl: '/images/aspen.jpg',
        rating: 4.8
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Marriott Miami Beach',
        location: 'Miami Beach, Florida',
        address: '456 Ocean Drive, Miami Beach, FL 33139',
        description: 'Beachfront paradise with world-class amenities',
        imageUrl: '/images/miami-beach.jpg',
        rating: 4.7
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Marriott New York Times Square',
        location: 'New York City, New York',
        address: '789 Broadway, New York, NY 10019',
        description: 'Modern luxury in the heart of Manhattan',
        imageUrl: '/images/new-york.jpg',
        rating: 4.6
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
          description: 'Comfortable room with city views',
          price: 299.99,
          capacity: 2,
          amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar']),
          imageUrl: '/images/standard-room.jpg'
        },
        {
          hotelId: hotel.id,
          type: 'deluxe',
          description: 'Spacious room with premium amenities',
          price: 499.99,
          capacity: 3,
          amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Balcony', 'Lounge Access']),
          imageUrl: '/images/deluxe-room.jpg'
        },
        {
          hotelId: hotel.id,
          type: 'suite',
          description: 'Luxury suite with separate living area',
          price: 799.99,
          capacity: 4,
          amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Balcony', 'Kitchen', 'Living Room']),
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
          description: `World-class ${category} facilities`,
          imageUrl: `/images/${category}.jpg`
        }
      });
    }
  }

  // Create restaurants for each hotel
  const cuisines = ['Italian', 'Japanese', 'American', 'French'];
  for (const hotel of hotels) {
    for (const cuisine of cuisines) {
      await prisma.restaurant.create({
        data: {
          hotelId: hotel.id,
          name: `${cuisine} Restaurant`,
          cuisine,
          priceRange: '$$$',
          openTime: '11:00',
          closeTime: '23:00',
          description: `Authentic ${cuisine} cuisine in an elegant setting`,
          imageUrl: `/images/${cuisine.toLowerCase()}-restaurant.jpg`
        }
      });
    }
  }

  // Create experiences for each hotel
  const experienceTypes = ['spa', 'golf', 'tour', 'class', 'event'];
  for (const hotel of hotels) {
    for (const type of experienceTypes) {
      await prisma.experience.create({
        data: {
          hotelId: hotel.id,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Experience`,
          type,
          description: `Unforgettable ${type} experience`,
          price: 199.99,
          duration: 120,
          imageUrl: `/images/${type}.jpg`
        }
      });
    }
  }

  // Create sample bookings
  const rooms = await prisma.room.findMany();
  for (const user of users) {
    await prisma.booking.create({
      data: {
        userId: user.id,
        hotelId: hotels[0].id,
        roomId: rooms[0].id,
        checkIn: new Date('2024-07-01'),
        checkOut: new Date('2024-07-05'),
        guests: 2,
        totalPrice: 1199.96,
        status: 'CONFIRMED'
      }
    });
  }

  // Create sample reviews
  for (const user of users) {
    for (const hotel of hotels) {
      await prisma.review.create({
        data: {
          userId: user.id,
          hotelId: hotel.id,
          rating: 5,
          comment: 'Excellent stay! Would definitely recommend.'
        }
      });
    }
  }

  console.log('Database has been seeded! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
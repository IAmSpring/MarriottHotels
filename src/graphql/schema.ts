import { gql } from 'apollo-server-express';
import { prisma } from '../lib/prisma';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: Int!
    name: String
    email: String!
    password: String!
    role: String!
    bonvoyNumber: String
    bonvoyPoints: Int!
    bonvoyStatus: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    bookings: [Booking!]!
    orders: [Order!]!
    reviews: [Review!]!
    conversations: [Conversation!]!
  }

  type Hotel {
    id: String!
    name: String!
    location: String!
    address: String!
    description: String!
    imageUrl: String!
    rating: Float!
    amenities: [Amenity!]!
    rooms: [Room!]!
    restaurants: [Restaurant!]!
    experiences: [Experience!]!
    reviews: [Review!]!
    bookings: [Booking!]!
  }

  type Room {
    id: String!
    hotelId: String!
    hotel: Hotel!
    type: String!
    description: String!
    price: Float!
    capacity: Int!
    amenities: String!
    imageUrl: String!
    available: Boolean!
    bookings: [Booking!]!
  }

  type Amenity {
    id: String!
    name: String!
    category: String!
    description: String!
    imageUrl: String
    hotelId: String!
    hotel: Hotel!
  }

  type Restaurant {
    id: String!
    name: String!
    hotelId: String!
    hotel: Hotel!
    cuisine: String!
    priceRange: String!
    openTime: String!
    closeTime: String!
    description: String!
    imageUrl: String!
    reservations: [Reservation!]!
  }

  type Reservation {
    id: String!
    restaurantId: String!
    restaurant: Restaurant!
    date: DateTime!
    time: String!
    partySize: Int!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Experience {
    id: String!
    name: String!
    hotelId: String!
    hotel: Hotel!
    type: String!
    description: String!
    price: Float!
    duration: Int!
    imageUrl: String!
    available: Boolean!
    bookings: [ExperienceBooking!]!
  }

  type ExperienceBooking {
    id: String!
    experienceId: String!
    experience: Experience!
    date: DateTime!
    participants: Int!
    status: String!
    specialRequests: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Booking {
    id: Int!
    userId: Int!
    user: User!
    hotelId: String!
    hotel: Hotel!
    roomId: String!
    room: Room!
    checkIn: DateTime!
    checkOut: DateTime!
    guests: Int!
    totalPrice: Float!
    status: String!
    orderId: Int
    order: Order
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Order {
    id: Int!
    userId: Int!
    user: User!
    bookings: [Booking!]!
    stripeId: String!
    amount: Float!
    currency: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Review {
    id: String!
    userId: Int!
    user: User!
    hotelId: String!
    hotel: Hotel!
    rating: Int!
    comment: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Conversation {
    id: String!
    userId: Int!
    user: User!
    userMessage: String!
    aiResponse: String!
    threadId: String
    timestamp: DateTime!
  }

  type Query {
    # User queries
    users: [User!]!
    user(id: Int!): User
    userByEmail(email: String!): User
    
    # Hotel queries
    hotels: [Hotel!]!
    hotel(id: String!): Hotel
    hotelsByLocation(location: String!): [Hotel!]!
    hotelsByRating(minRating: Float!): [Hotel!]!
    
    # Room queries
    rooms: [Room!]!
    room(id: String!): Room
    roomsByHotel(hotelId: String!): [Room!]!
    availableRooms(hotelId: String!, checkIn: DateTime!, checkOut: DateTime!): [Room!]!
    
    # Amenity queries
    amenities: [Amenity!]!
    amenity(id: String!): Amenity
    amenitiesByHotel(hotelId: String!): [Amenity!]!
    amenitiesByCategory(category: String!): [Amenity!]!
    
    # Restaurant queries
    restaurants: [Restaurant!]!
    restaurant(id: String!): Restaurant
    restaurantsByHotel(hotelId: String!): [Restaurant!]!
    restaurantsByCuisine(cuisine: String!): [Restaurant!]!
    
    # Reservation queries
    reservations: [Reservation!]!
    reservation(id: String!): Reservation
    reservationsByRestaurant(restaurantId: String!): [Reservation!]!
    reservationsByDate(date: DateTime!): [Reservation!]!
    
    # Experience queries
    experiences: [Experience!]!
    experience(id: String!): Experience
    experiencesByHotel(hotelId: String!): [Experience!]!
    experiencesByType(type: String!): [Experience!]!
    
    # Experience Booking queries
    experienceBookings: [ExperienceBooking!]!
    experienceBooking(id: String!): ExperienceBooking
    experienceBookingsByExperience(experienceId: String!): [ExperienceBooking!]!
    
    # Booking queries
    bookings: [Booking!]!
    booking(id: Int!): Booking
    bookingsByUser(userId: Int!): [Booking!]!
    bookingsByHotel(hotelId: String!): [Booking!]!
    bookingsByStatus(status: String!): [Booking!]!
    
    # Order queries
    orders: [Order!]!
    order(id: Int!): Order
    ordersByUser(userId: Int!): [Order!]!
    ordersByStatus(status: String!): [Order!]!
    
    # Review queries
    reviews: [Review!]!
    review(id: String!): Review
    reviewsByHotel(hotelId: String!): [Review!]!
    reviewsByUser(userId: Int!): [Review!]!
    
    # Conversation queries
    conversations: [Conversation!]!
    conversation(id: String!): Conversation
    conversationsByUser(userId: Int!): [Conversation!]!
  }

  input UserInput {
    name: String
    email: String!
    password: String!
    role: String
    bonvoyNumber: String
    bonvoyPoints: Int
    bonvoyStatus: String
  }

  input HotelInput {
    name: String!
    location: String!
    address: String!
    description: String!
    imageUrl: String!
    rating: Float
  }

  input RoomInput {
    hotelId: String!
    type: String!
    description: String!
    price: Float!
    capacity: Int!
    amenities: String!
    imageUrl: String!
    available: Boolean
  }

  input AmenityInput {
    name: String!
    category: String!
    description: String!
    imageUrl: String
    hotelId: String!
  }

  input RestaurantInput {
    name: String!
    hotelId: String!
    cuisine: String!
    priceRange: String!
    openTime: String!
    closeTime: String!
    description: String!
    imageUrl: String!
  }

  input ReservationInput {
    restaurantId: String!
    date: DateTime!
    time: String!
    partySize: Int!
    status: String
  }

  input ExperienceInput {
    name: String!
    hotelId: String!
    type: String!
    description: String!
    price: Float!
    duration: Int!
    imageUrl: String!
    available: Boolean
  }

  input ExperienceBookingInput {
    experienceId: String!
    date: DateTime!
    participants: Int!
    status: String
    specialRequests: String
  }

  input BookingInput {
    userId: Int!
    hotelId: String!
    roomId: String!
    checkIn: DateTime!
    checkOut: DateTime!
    guests: Int!
    totalPrice: Float!
    status: String
  }

  input OrderInput {
    userId: Int!
    stripeId: String!
    amount: Float!
    currency: String
    status: String
  }

  input ReviewInput {
    userId: Int!
    hotelId: String!
    rating: Int!
    comment: String!
  }

  input ConversationInput {
    userId: Int!
    userMessage: String!
    aiResponse: String!
    threadId: String
  }

  type Mutation {
    # User mutations
    createUser(input: UserInput!): User!
    updateUser(id: Int!, input: UserInput!): User!
    deleteUser(id: Int!): User!
    
    # Hotel mutations
    createHotel(input: HotelInput!): Hotel!
    updateHotel(id: String!, input: HotelInput!): Hotel!
    deleteHotel(id: String!): Hotel!
    
    # Room mutations
    createRoom(input: RoomInput!): Room!
    updateRoom(id: String!, input: RoomInput!): Room!
    deleteRoom(id: String!): Room!
    
    # Amenity mutations
    createAmenity(input: AmenityInput!): Amenity!
    updateAmenity(id: String!, input: AmenityInput!): Amenity!
    deleteAmenity(id: String!): Amenity!
    
    # Restaurant mutations
    createRestaurant(input: RestaurantInput!): Restaurant!
    updateRestaurant(id: String!, input: RestaurantInput!): Restaurant!
    deleteRestaurant(id: String!): Restaurant!
    
    # Reservation mutations
    createReservation(input: ReservationInput!): Reservation!
    updateReservation(id: String!, input: ReservationInput!): Reservation!
    deleteReservation(id: String!): Reservation!
    
    # Experience mutations
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: String!, input: ExperienceInput!): Experience!
    deleteExperience(id: String!): Experience!
    
    # Experience Booking mutations
    createExperienceBooking(input: ExperienceBookingInput!): ExperienceBooking!
    updateExperienceBooking(id: String!, input: ExperienceBookingInput!): ExperienceBooking!
    deleteExperienceBooking(id: String!): ExperienceBooking!
    
    # Booking mutations
    createBooking(input: BookingInput!): Booking!
    updateBooking(id: Int!, input: BookingInput!): Booking!
    deleteBooking(id: Int!): Booking!
    
    # Order mutations
    createOrder(input: OrderInput!): Order!
    updateOrder(id: Int!, input: OrderInput!): Order!
    deleteOrder(id: Int!): Order!
    
    # Review mutations
    createReview(input: ReviewInput!): Review!
    updateReview(id: String!, input: ReviewInput!): Review!
    deleteReview(id: String!): Review!
    
    # Conversation mutations
    createConversation(input: ConversationInput!): Conversation!
    updateConversation(id: String!, input: ConversationInput!): Conversation!
    deleteConversation(id: String!): Conversation!
  }
`;

export const resolvers = {
  Query: {
    // User queries
    users: async () => {
      return prisma.user.findMany();
    },
    user: async (_: unknown, { id }: { id: number }) => {
      return prisma.user.findUnique({ where: { id } });
    },
    userByEmail: async (_: unknown, { email }: { email: string }) => {
      return prisma.user.findUnique({ where: { email } });
    },

    // Hotel queries - include related data
    hotels: async () => {
      return prisma.hotel.findMany({
        include: {
          amenities: true,
          rooms: true,
          restaurants: true,
          experiences: true,
          reviews: true,
          bookings: true,
        },
      });
    },
    hotel: async (_: unknown, { id }: { id: string }) => {
      return prisma.hotel.findUnique({
        where: { id },
        include: {
          amenities: true,
          rooms: true,
          restaurants: true,
          experiences: true,
          reviews: true,
          bookings: true,
        },
      });
    },
    hotelsByLocation: async (_: unknown, { location }: { location: string }) => {
      return prisma.hotel.findMany({
        where: { location },
        include: {
          amenities: true,
          rooms: true,
          restaurants: true,
          experiences: true,
          reviews: true,
          bookings: true,
        },
      });
    },
    hotelsByRating: async (_: unknown, { minRating }: { minRating: number }) => {
      return prisma.hotel.findMany({
        where: { rating: { gte: minRating } },
        include: {
          amenities: true,
          rooms: true,
          restaurants: true,
          experiences: true,
          reviews: true,
          bookings: true,
        },
      });
    },

    // Room queries - include related data
    rooms: async () => {
      return prisma.room.findMany({
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },
    room: async (_: unknown, { id }: { id: string }) => {
      return prisma.room.findUnique({
        where: { id },
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },
    roomsByHotel: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.room.findMany({
        where: { hotelId },
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },
    availableRooms: async (_: unknown, { hotelId, checkIn, checkOut }: { hotelId: string; checkIn: Date; checkOut: Date }) => {
      return prisma.room.findMany({
        where: {
          hotelId,
          available: true,
          bookings: {
            none: {
              OR: [
                { checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }
              ]
            }
          }
        },
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },

    // Amenity queries - include related data
    amenities: async () => {
      return prisma.amenity.findMany({
        include: {
          hotel: true,
        },
      });
    },
    amenity: async (_: unknown, { id }: { id: string }) => {
      return prisma.amenity.findUnique({
        where: { id },
        include: {
          hotel: true,
        },
      });
    },
    amenitiesByHotel: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.amenity.findMany({
        where: { hotelId },
        include: {
          hotel: true,
        },
      });
    },
    amenitiesByCategory: async (_: unknown, { category }: { category: string }) => {
      return prisma.amenity.findMany({
        where: { category },
        include: {
          hotel: true,
        },
      });
    },

    // Restaurant queries - include related data
    restaurants: async () => {
      return prisma.restaurant.findMany({
        include: {
          hotel: true,
          reservations: true,
        },
      });
    },
    restaurant: async (_: unknown, { id }: { id: string }) => {
      return prisma.restaurant.findUnique({
        where: { id },
        include: {
          hotel: true,
          reservations: true,
        },
      });
    },
    restaurantsByHotel: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.restaurant.findMany({
        where: { hotelId },
        include: {
          hotel: true,
          reservations: true,
        },
      });
    },
    restaurantsByCuisine: async (_: unknown, { cuisine }: { cuisine: string }) => {
      return prisma.restaurant.findMany({
        where: { cuisine },
        include: {
          hotel: true,
          reservations: true,
        },
      });
    },

    // Reservation queries - include related data
    reservations: async () => {
      return prisma.reservation.findMany({
        include: {
          restaurant: true,
        },
      });
    },
    reservation: async (_: unknown, { id }: { id: string }) => {
      return prisma.reservation.findUnique({
        where: { id },
        include: {
          restaurant: true,
        },
      });
    },
    reservationsByRestaurant: async (_: unknown, { restaurantId }: { restaurantId: string }) => {
      return prisma.reservation.findMany({
        where: { restaurantId },
        include: {
          restaurant: true,
        },
      });
    },
    reservationsByDate: async (_: unknown, { date }: { date: Date }) => {
      return prisma.reservation.findMany({
        where: { date },
        include: {
          restaurant: true,
        },
      });
    },

    // Experience queries - include related data
    experiences: async () => {
      return prisma.experience.findMany({
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },
    experience: async (_: unknown, { id }: { id: string }) => {
      return prisma.experience.findUnique({
        where: { id },
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },
    experiencesByHotel: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.experience.findMany({
        where: { hotelId },
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },
    experiencesByType: async (_: unknown, { type }: { type: string }) => {
      return prisma.experience.findMany({
        where: { type },
        include: {
          hotel: true,
          bookings: true,
        },
      });
    },

    // Experience Booking queries - include related data
    experienceBookings: async () => {
      return prisma.experienceBooking.findMany({
        include: {
          experience: true,
        },
      });
    },
    experienceBooking: async (_: unknown, { id }: { id: string }) => {
      return prisma.experienceBooking.findUnique({
        where: { id },
        include: {
          experience: true,
        },
      });
    },
    experienceBookingsByExperience: async (_: unknown, { experienceId }: { experienceId: string }) => {
      return prisma.experienceBooking.findMany({
        where: { experienceId },
        include: {
          experience: true,
        },
      });
    },

    // Booking queries - include related data
    bookings: async () => {
      return prisma.booking.findMany({
        include: {
          user: true,
          hotel: true,
          room: true,
          order: true,
        },
      });
    },
    booking: async (_: unknown, { id }: { id: number }) => {
      return prisma.booking.findUnique({
        where: { id },
        include: {
          user: true,
          hotel: true,
          room: true,
          order: true,
        },
      });
    },
    bookingsByUser: async (_: unknown, { userId }: { userId: number }) => {
      return prisma.booking.findMany({
        where: { userId },
        include: {
          user: true,
          hotel: true,
          room: true,
          order: true,
        },
      });
    },
    bookingsByHotel: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.booking.findMany({
        where: { hotelId },
        include: {
          user: true,
          hotel: true,
          room: true,
          order: true,
        },
      });
    },
    bookingsByStatus: async (_: unknown, { status }: { status: string }) => {
      return prisma.booking.findMany({
        where: { status },
        include: {
          user: true,
          hotel: true,
          room: true,
          order: true,
        },
      });
    },

    // Order queries - include related data
    orders: async () => {
      return prisma.order.findMany({
        include: {
          user: true,
          bookings: true,
        },
      });
    },
    order: async (_: unknown, { id }: { id: number }) => {
      return prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
          bookings: true,
        },
      });
    },
    ordersByUser: async (_: unknown, { userId }: { userId: number }) => {
      return prisma.order.findMany({
        where: { userId },
        include: {
          user: true,
          bookings: true,
        },
      });
    },
    ordersByStatus: async (_: unknown, { status }: { status: string }) => {
      return prisma.order.findMany({
        where: { status },
        include: {
          user: true,
          bookings: true,
        },
      });
    },

    // Review queries - include related data
    reviews: async () => {
      return prisma.review.findMany({
        include: {
          user: true,
          hotel: true,
        },
      });
    },
    review: async (_: unknown, { id }: { id: string }) => {
      return prisma.review.findUnique({
        where: { id },
        include: {
          user: true,
          hotel: true,
        },
      });
    },
    reviewsByHotel: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.review.findMany({
        where: { hotelId },
        include: {
          user: true,
          hotel: true,
        },
      });
    },
    reviewsByUser: async (_: unknown, { userId }: { userId: number }) => {
      return prisma.review.findMany({
        where: { userId },
        include: {
          user: true,
          hotel: true,
        },
      });
    },

    // Conversation queries - include related data
    conversations: async () => {
      return prisma.conversation.findMany({
        include: {
          user: true,
        },
      });
    },
    conversation: async (_: unknown, { id }: { id: string }) => {
      return prisma.conversation.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    },
    conversationsByUser: async (_: unknown, { userId }: { userId: number }) => {
      return prisma.conversation.findMany({
        where: { userId },
        include: {
          user: true,
        },
      });
    },
  },

  Mutation: {
    // User mutations
    createUser: async (_: unknown, { input }: { input: any }) => {
      return prisma.user.create({ data: input });
    },
    updateUser: async (_: unknown, { id, input }: { id: number; input: any }) => {
      return prisma.user.update({ where: { id }, data: input });
    },
    deleteUser: async (_: unknown, { id }: { id: number }) => {
      return prisma.user.delete({ where: { id } });
    },

    // Hotel mutations
    createHotel: async (_: unknown, { input }: { input: any }) => {
      return prisma.hotel.create({ data: input });
    },
    updateHotel: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.hotel.update({ where: { id }, data: input });
    },
    deleteHotel: async (_: unknown, { id }: { id: string }) => {
      return prisma.hotel.delete({ where: { id } });
    },

    // Room mutations
    createRoom: async (_: unknown, { input }: { input: any }) => {
      return prisma.room.create({ data: input });
    },
    updateRoom: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.room.update({ where: { id }, data: input });
    },
    deleteRoom: async (_: unknown, { id }: { id: string }) => {
      return prisma.room.delete({ where: { id } });
    },

    // Amenity mutations
    createAmenity: async (_: unknown, { input }: { input: any }) => {
      return prisma.amenity.create({ data: input });
    },
    updateAmenity: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.amenity.update({ where: { id }, data: input });
    },
    deleteAmenity: async (_: unknown, { id }: { id: string }) => {
      return prisma.amenity.delete({ where: { id } });
    },

    // Restaurant mutations
    createRestaurant: async (_: unknown, { input }: { input: any }) => {
      return prisma.restaurant.create({ data: input });
    },
    updateRestaurant: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.restaurant.update({ where: { id }, data: input });
    },
    deleteRestaurant: async (_: unknown, { id }: { id: string }) => {
      return prisma.restaurant.delete({ where: { id } });
    },

    // Reservation mutations
    createReservation: async (_: unknown, { input }: { input: any }) => {
      return prisma.reservation.create({ data: input });
    },
    updateReservation: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.reservation.update({ where: { id }, data: input });
    },
    deleteReservation: async (_: unknown, { id }: { id: string }) => {
      return prisma.reservation.delete({ where: { id } });
    },

    // Experience mutations
    createExperience: async (_: unknown, { input }: { input: any }) => {
      return prisma.experience.create({ data: input });
    },
    updateExperience: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.experience.update({ where: { id }, data: input });
    },
    deleteExperience: async (_: unknown, { id }: { id: string }) => {
      return prisma.experience.delete({ where: { id } });
    },

    // Experience Booking mutations
    createExperienceBooking: async (_: unknown, { input }: { input: any }) => {
      return prisma.experienceBooking.create({ data: input });
    },
    updateExperienceBooking: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.experienceBooking.update({ where: { id }, data: input });
    },
    deleteExperienceBooking: async (_: unknown, { id }: { id: string }) => {
      return prisma.experienceBooking.delete({ where: { id } });
    },

    // Booking mutations
    createBooking: async (_: unknown, { input }: { input: any }) => {
      return prisma.booking.create({ data: input });
    },
    updateBooking: async (_: unknown, { id, input }: { id: number; input: any }) => {
      return prisma.booking.update({ where: { id }, data: input });
    },
    deleteBooking: async (_: unknown, { id }: { id: number }) => {
      return prisma.booking.delete({ where: { id } });
    },

    // Order mutations
    createOrder: async (_: unknown, { input }: { input: any }) => {
      return prisma.order.create({ data: input });
    },
    updateOrder: async (_: unknown, { id, input }: { id: number; input: any }) => {
      return prisma.order.update({ where: { id }, data: input });
    },
    deleteOrder: async (_: unknown, { id }: { id: number }) => {
      return prisma.order.delete({ where: { id } });
    },

    // Review mutations
    createReview: async (_: unknown, { input }: { input: any }) => {
      return prisma.review.create({ data: input });
    },
    updateReview: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.review.update({ where: { id }, data: input });
    },
    deleteReview: async (_: unknown, { id }: { id: string }) => {
      return prisma.review.delete({ where: { id } });
    },

    // Conversation mutations
    createConversation: async (_: unknown, { input }: { input: any }) => {
      return prisma.conversation.create({ data: input });
    },
    updateConversation: async (_: unknown, { id, input }: { id: string; input: any }) => {
      return prisma.conversation.update({ where: { id }, data: input });
    },
    deleteConversation: async (_: unknown, { id }: { id: string }) => {
      return prisma.conversation.delete({ where: { id } });
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
}); 
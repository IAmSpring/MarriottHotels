import { gql } from 'apollo-server-express';
import { prisma } from '../lib/prisma';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String
    email: String!
    role: String!
    bonvoyNumber: String
    bonvoyPoints: Int
    bonvoyStatus: String
    createdAt: String!
    updatedAt: String!
    bookings: [Booking!]
    orders: [Order!]
    reviews: [Review!]
    conversations: [Conversation!]
  }

  type Hotel {
    id: String!
    name: String!
    location: String!
    address: String!
    description: String!
    imageUrl: String!
    rating: Float!
    amenities: [Amenity!]
    rooms: [Room!]
    restaurants: [Restaurant!]
    experiences: [Experience!]
    reviews: [Review!]
    bookings: [Booking!]
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
    bookings: [Booking!]
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
    reservations: [Reservation!]
  }

  type Reservation {
    id: String!
    restaurantId: String!
    restaurant: Restaurant!
    date: String!
    time: String!
    partySize: Int!
    status: String!
    createdAt: String!
    updatedAt: String!
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
    bookings: [ExperienceBooking!]
  }

  type ExperienceBooking {
    id: String!
    experienceId: String!
    experience: Experience!
    date: String!
    participants: Int!
    status: String!
    specialRequests: String
    createdAt: String!
    updatedAt: String!
  }

  type Booking {
    id: Int!
    userId: Int!
    user: User!
    hotelId: String!
    hotel: Hotel!
    roomId: String!
    room: Room!
    checkIn: String!
    checkOut: String!
    guests: Int!
    totalPrice: Float!
    status: String!
    orderId: Int
    order: Order
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: Int!
    userId: Int!
    user: User!
    bookings: [Booking!]
    stripeId: String!
    amount: Float!
    currency: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Review {
    id: String!
    userId: Int!
    user: User!
    hotelId: String!
    hotel: Hotel!
    rating: Int!
    comment: String!
    createdAt: String!
    updatedAt: String!
  }

  type Conversation {
    id: String!
    userId: Int!
    user: User!
    userMessage: String!
    aiResponse: String!
    threadId: String
    timestamp: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    hotels: [Hotel!]!
    hotel(id: String!): Hotel
    rooms(hotelId: String!): [Room!]!
    room(id: String!): Room
    bookings(userId: Int): [Booking!]!
    booking(id: Int!): Booking
    experiences(hotelId: String!): [Experience!]!
    experience(id: String!): Experience
    restaurants(hotelId: String!): [Restaurant!]!
    restaurant(id: String!): Restaurant
    reviews(hotelId: String!): [Review!]!
    review(id: String!): Review
    conversations(userId: Int!): [Conversation!]!
  }

  input UserInput {
    name: String
    email: String!
    password: String!
    role: String
  }

  input BookingInput {
    userId: Int!
    hotelId: String!
    roomId: String!
    checkIn: String!
    checkOut: String!
    guests: Int!
    totalPrice: Float!
  }

  input ReviewInput {
    userId: Int!
    hotelId: String!
    rating: Int!
    comment: String!
  }

  type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: Int!, input: UserInput!): User
    deleteUser(id: Int!): User
    createBooking(input: BookingInput!): Booking
    updateBookingStatus(id: Int!, status: String!): Booking
    createReview(input: ReviewInput!): Review
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    user: async (_, { id }) => {
      return prisma.user.findUnique({ where: { id } });
    },
    hotels: async () => {
      return prisma.hotel.findMany();
    },
    hotel: async (_, { id }) => {
      return prisma.hotel.findUnique({ where: { id } });
    },
    rooms: async (_, { hotelId }) => {
      return prisma.room.findMany({ where: { hotelId } });
    },
    room: async (_, { id }) => {
      return prisma.room.findUnique({ where: { id } });
    },
    bookings: async (_, { userId }) => {
      return prisma.booking.findMany({
        where: userId ? { userId } : undefined,
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
    },
    booking: async (_, { id }) => {
      return prisma.booking.findUnique({
        where: { id },
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
    },
    experiences: async (_, { hotelId }) => {
      return prisma.experience.findMany({ where: { hotelId } });
    },
    experience: async (_, { id }) => {
      return prisma.experience.findUnique({ where: { id } });
    },
    restaurants: async (_, { hotelId }) => {
      return prisma.restaurant.findMany({ where: { hotelId } });
    },
    restaurant: async (_, { id }) => {
      return prisma.restaurant.findUnique({ where: { id } });
    },
    reviews: async (_, { hotelId }) => {
      return prisma.review.findMany({ where: { hotelId } });
    },
    review: async (_, { id }) => {
      return prisma.review.findUnique({ where: { id } });
    },
    conversations: async (_, { userId }) => {
      return prisma.conversation.findMany({ where: { userId } });
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      return prisma.user.create({ data: input });
    },
    updateUser: async (_, { id, input }) => {
      return prisma.user.update({
        where: { id },
        data: input,
      });
    },
    deleteUser: async (_, { id }) => {
      return prisma.user.delete({ where: { id } });
    },
    createBooking: async (_, { input }) => {
      return prisma.booking.create({
        data: input,
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
    },
    updateBookingStatus: async (_, { id, status }) => {
      return prisma.booking.update({
        where: { id },
        data: { status },
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
    },
    createReview: async (_, { input }) => {
      return prisma.review.create({
        data: input,
        include: {
          user: true,
          hotel: true,
        },
      });
    },
  },
}; 
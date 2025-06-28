import { gql } from 'apollo-server-express';
import { prisma } from '../lib/prisma';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { hotels } from '../data/hotels';
import type { Hotel as HotelType, Room as RoomType, Booking as BookingType, Price } from '../types/hotel';
import type { Prisma } from '@prisma/client';

interface Context {
  hotels: typeof hotels;
  rooms: RoomType[];
  bookings: BookingType[];
  users: any[]; // We'll keep this as any for now since we don't have a full User type
}

interface QueryResolvers {
  hotel: (_: unknown, { id }: { id: string }, context: Context) => HotelType | undefined;
  hotels: (_: unknown, args: unknown, context: Context) => HotelType[];
  room: (_: unknown, { id }: { id: string }, context: Context) => RoomType | undefined;
  hotelRooms: (_: unknown, { hotelId }: { hotelId: string }, context: Context) => RoomType[];
  booking: (_: unknown, { id }: { id: string }, context: Context) => BookingType | undefined;
  userBookings: (_: unknown, { userId }: { userId: string }, context: Context) => BookingType[];
}

interface MutationResolvers {
  createHotel: (_: unknown, { input }: { input: Partial<HotelType> }, context: Context) => HotelType;
  updateHotel: (_: unknown, { id, input }: { id: string; input: Partial<HotelType> }, context: Context) => HotelType;
  deleteHotel: (_: unknown, { id }: { id: string }, context: Context) => boolean;
  createRoom: (_: unknown, { input }: { input: Partial<RoomType> }, context: Context) => RoomType;
  updateRoom: (_: unknown, { id, input }: { id: string; input: Partial<RoomType> }, context: Context) => RoomType;
  deleteRoom: (_: unknown, { id }: { id: string }, context: Context) => boolean;
  createBooking: (_: unknown, { input }: { input: Partial<BookingType> }, context: Context) => BookingType;
  updateBooking: (_: unknown, { id, status }: { id: string; status: string }, context: Context) => BookingType;
  deleteBooking: (_: unknown, { id }: { id: string }, context: Context) => boolean;
}

interface UserInput {
  name: string;
  email: string;
  password: string;
}

interface HotelInput {
  name: string;
  type: string;
  location: string;
  description: string;
  price: {
    base: number;
    currency: string;
  };
  amenities: string[];
}

interface RoomInput {
  hotelId: string;
  type: string;
  price: number;
  description: string;
  beds: string;
  occupancy: string;
  size: string;
}

interface BookingInput {
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface ReviewInput {
  userId: number;
  hotelId: string;
  rating: number;
  comment: string;
}

export const typeDefs = gql`
  scalar Int
  scalar Float
  scalar ID

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
    id: ID!
    name: String!
    type: String!
    location: String!
    description: String!
    price: Price!
    rating: Float!
    reviews: Int!
    image: String!
    amenities: [String!]!
    rooms: [Room!]!
  }

  type Room {
    id: ID!
    type: String!
    price: Float!
    description: String!
    beds: String!
    occupancy: String!
    size: String!
  }

  type Price {
    base: Float!
    currency: String!
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
    id: ID!
    userId: ID!
    hotelId: ID!
    roomId: ID!
    checkIn: String!
    checkOut: String!
    guests: Int!
    totalPrice: Float!
    status: String!
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
    hotel(id: ID!): Hotel
    rooms(hotelId: ID!): [Room!]!
    room(id: ID!): Room
    bookings(userId: ID): [Booking!]!
    booking(id: ID!): Booking
    experiences(hotelId: String!): [Experience!]!
    experience(id: String!): Experience
    restaurants(hotelId: String!): [Restaurant!]!
    restaurant(id: String!): Restaurant
    reviews(hotelId: String!): [Review!]!
    review(id: String!): Review
    conversations(userId: Int!): [Conversation!]!
    hotelRooms(hotelId: ID!): [Room!]!
    userBookings(userId: ID!): [Booking!]!
  }

  input UserInput {
    name: String
    email: String!
    password: String!
    role: String
  }

  input HotelInput {
    name: String!
    type: String!
    location: String!
    description: String!
    price: PriceInput!
    rating: Float!
    reviews: Int!
    image: String!
    amenities: [String!]!
  }

  input PriceInput {
    base: Float!
    currency: String!
  }

  input RoomInput {
    type: String!
    price: Float!
    description: String!
    beds: String!
    occupancy: String!
    size: String!
  }

  input BookingInput {
    userId: ID!
    hotelId: ID!
    roomId: ID!
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
    createHotel(input: HotelInput!): Hotel!
    updateHotel(id: ID!, input: HotelInput!): Hotel!
    deleteHotel(id: ID!): Boolean!
    createRoom(input: RoomInput!): Room!
    updateRoom(id: ID!, input: RoomInput!): Room!
    deleteRoom(id: ID!): Boolean!
    createBooking(input: BookingInput!): Booking!
    updateBooking(id: ID!, status: String!): Booking!
    deleteBooking(id: ID!): Boolean!
    createReview(input: ReviewInput!): Review
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    user: async (_: unknown, { id }: { id: number }) => {
      return prisma.user.findUnique({ where: { id } });
    },
    hotels: (_: unknown, _args: unknown, context: Context): HotelType[] => {
      return context.hotels;
    },
    hotel: (_: unknown, { id }: { id: string }, context: Context): HotelType | undefined => {
      return context.hotels.find((h: HotelType) => h.id === id);
    },
    rooms: async (_: unknown, { hotelId }: { hotelId: string }, context: Context) => {
      return context.rooms.filter((r: RoomType) => r.hotelId === hotelId);
    },
    room: (_: unknown, { id }: { id: string }, context: Context): RoomType | undefined => {
      return context.rooms.find((r: RoomType) => r.id === id);
    },
    bookings: async (_: unknown, { userId }: { userId?: string }) => {
      return prisma.booking.findMany({
        where: userId ? { userId: parseInt(userId, 10) } : undefined,
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
    },
    booking: (_: unknown, { id }: { id: string }, context: Context): BookingType | undefined => {
      return context.bookings.find((b: BookingType) => b.id === id);
    },
    experiences: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.experience.findMany({ where: { hotelId } });
    },
    experience: async (_: unknown, { id }: { id: string }) => {
      return prisma.experience.findUnique({ where: { id } });
    },
    restaurants: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.restaurant.findMany({ where: { hotelId } });
    },
    restaurant: async (_: unknown, { id }: { id: string }) => {
      return prisma.restaurant.findUnique({ where: { id } });
    },
    reviews: async (_: unknown, { hotelId }: { hotelId: string }) => {
      return prisma.review.findMany({ where: { hotelId } });
    },
    review: async (_: unknown, { id }: { id: string }) => {
      return prisma.review.findUnique({ where: { id } });
    },
    conversations: async (_: unknown, { userId }: { userId: number }) => {
      return prisma.conversation.findMany({ where: { userId } });
    },
    hotelRooms: (_: unknown, { hotelId }: { hotelId: string }, context: Context): RoomType[] => {
      return context.rooms.filter((r: RoomType) => r.hotelId === hotelId);
    },
    userBookings: (_: unknown, { userId }: { userId: string }, context: Context): BookingType[] => {
      return context.bookings.filter((b: BookingType) => b.userId === userId);
    },
  },
  Mutation: {
    createUser: async (_: unknown, { input }: { input: UserInput }) => {
      return prisma.user.create({ data: input });
    },
    updateUser: async (_: unknown, { id, input }: { id: number; input: UserInput }) => {
      return prisma.user.update({
        where: { id },
        data: input,
      });
    },
    deleteUser: async (_: unknown, { id }: { id: number }) => {
      return prisma.user.delete({ where: { id } });
    },
    createHotel: (_: unknown, { input }: { input: Partial<HotelType> }, context: Context): HotelType => {
      return input as HotelType;
    },
    updateHotel: (_: unknown, { id, input }: { id: string; input: Partial<HotelType> }, context: Context): HotelType => {
      return input as HotelType;
    },
    deleteHotel: (_: unknown, { id }: { id: string }, context: Context): boolean => {
      return true;
    },
    createRoom: (_: unknown, { input }: { input: Partial<RoomType> }, context: Context): RoomType => {
      return input as RoomType;
    },
    updateRoom: (_: unknown, { id, input }: { id: string; input: Partial<RoomType> }, context: Context): RoomType => {
      return input as RoomType;
    },
    deleteRoom: (_: unknown, { id }: { id: string }, context: Context): boolean => {
      return true;
    },
    createBooking: (_: unknown, { input }: { input: Partial<BookingType> }, context: Context): BookingType => {
      return input as BookingType;
    },
    updateBooking: (_: unknown, { id, status }: { id: string; status: string }, context: Context): BookingType => {
      return {} as BookingType;
    },
    deleteBooking: (_: unknown, { id }: { id: string }, context: Context): boolean => {
      return true;
    },
    createReview: async (_: unknown, { input }: { input: ReviewInput }) => {
      const { userId, hotelId, rating, comment } = input;
      return prisma.review.create({
        data: {
          userId,
          hotelId,
          rating,
          comment,
        },
        include: {
          user: true,
          hotel: true,
        },
      });
    },
  },
}; 

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export type { QueryResolvers, MutationResolvers }; 
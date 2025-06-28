import { gql } from 'apollo-server-express';
import { prisma } from '../lib/prisma';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { hotels } from '../data/hotels';

interface Context {
  hotels: typeof hotels;
  rooms: any[];
  bookings: any[];
  users: any[];
}

interface QueryResolvers {
  hotel: (_: unknown, { id }: { id: string }, context: Context) => Hotel | undefined;
  hotels: (_: unknown, args: unknown, context: Context) => Hotel[];
  room: (_: unknown, { id }: { id: string }, context: Context) => Room | undefined;
  hotelRooms: (_: unknown, { hotelId }: { hotelId: string }, context: Context) => Room[];
  booking: (_: unknown, { id }: { id: string }, context: Context) => any;
  userBookings: (_: unknown, { userId }: { userId: string }, context: Context) => any[];
}

interface MutationResolvers {
  createHotel: (_: unknown, { input }: { input: Partial<Hotel> }, context: Context) => Hotel;
  updateHotel: (_: unknown, { id, input }: { id: string; input: Partial<Hotel> }, context: Context) => Hotel;
  deleteHotel: (_: unknown, { id }: { id: string }, context: Context) => boolean;
  createRoom: (_: unknown, { input }: { input: Partial<Room> }, context: Context) => Room;
  updateRoom: (_: unknown, { id, input }: { id: string; input: Partial<Room> }, context: Context) => Room;
  deleteRoom: (_: unknown, { id }: { id: string }, context: Context) => boolean;
  createBooking: (_: unknown, { input }: { input: any }, context: Context) => any;
  updateBooking: (_: unknown, { id, status }: { id: string; status: string }, context: Context) => any;
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
    user: async (_, { id }) => {
      return prisma.user.findUnique({ where: { id } });
    },
    hotels: async (_, args, context) => {
      return context.hotels;
    },
    hotel: async (_, { id }, context) => {
      return context.hotels.find(h => h.id === id);
    },
    rooms: async (_, { hotelId }, context) => {
      return context.rooms.filter(r => r.hotelId === hotelId);
    },
    room: async (_, { id }, context) => {
      return context.rooms.find(r => r.id === id);
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
    booking: async (_, { id }, context) => {
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
    hotelRooms: async (_, { hotelId }, context) => {
      const hotel = context.hotels.find(h => h.id === hotelId);
      return hotel ? hotel.rooms : [];
    },
    userBookings: async (_, { userId }, context) => {
      return prisma.booking.findMany({
        where: { userId },
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
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
    createHotel: async (_, { input }, context) => {
      return prisma.hotel.create({ data: input });
    },
    updateHotel: async (_, { id, input }, context) => {
      return prisma.hotel.update({
        where: { id },
        data: input,
      });
    },
    deleteHotel: async (_, { id }, context) => {
      return prisma.hotel.delete({ where: { id } });
    },
    createRoom: async (_, { input }, context) => {
      return prisma.room.create({ data: input });
    },
    updateRoom: async (_, { id, input }, context) => {
      return prisma.room.update({
        where: { id },
        data: input,
      });
    },
    deleteRoom: async (_, { id }, context) => {
      return prisma.room.delete({ where: { id } });
    },
    createBooking: async (_, { input }, context) => {
      return prisma.booking.create({
        data: input,
        include: {
          user: true,
          hotel: true,
          room: true,
        },
      });
    },
    updateBooking: async (_, { id, status }, context) => {
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
    deleteBooking: async (_, { id }, context) => {
      return prisma.booking.delete({ where: { id } });
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

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export type { QueryResolvers, MutationResolvers }; 
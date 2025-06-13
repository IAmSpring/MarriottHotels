import { gql } from 'apollo-server-express';
import { prisma } from '../lib/prisma.js';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    role: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    user: async (_, { id }) => {
      return prisma.user.findUnique({
        where: { id }
      });
    }
  }
}; 
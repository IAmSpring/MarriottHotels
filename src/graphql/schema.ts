import { gql } from 'apollo-server-express';
import { prisma } from '../lib/prisma';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String
    email: String!
    role: String!
  }

  type Query {
    users: [User!]!
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    },
  },
}; 
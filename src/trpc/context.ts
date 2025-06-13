import * as trpcExpress from '@trpc/server/adapters/express';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const session = await getServerSession(req, res, authOptions);
  return { session };
};

export type Context = Awaited<ReturnType<typeof createContext>>; 
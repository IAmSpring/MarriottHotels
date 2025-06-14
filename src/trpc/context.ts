import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { prisma } from '../lib/prisma.js';

export interface Context {
  req: ExpressRequest;
  res: ExpressResponse;
  prisma: typeof prisma;
  user?: {
    id: number;
    role: string;
  };
}

export function createContext({ req, res }: { req: ExpressRequest; res: ExpressResponse }): Context {
  return {
    req,
    res,
    prisma,
  };
} 
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { mockHotels } from '../data/mockData.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface Context {
  req: ExpressRequest;
  res: ExpressResponse;
  prisma: typeof prisma;
  user?: {
    id: number;
    role: string;
  };
}

interface JWTPayload {
  userId: number;
}

const t = initTRPC.context<Context>().create();

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const token = ctx.req.cookies['auth-token'];
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret') as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new Error('Unauthorized');
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          id: user.id,
          role: user.role
        }
      }
    });
  } catch {
    throw new Error('Unauthorized');
  }
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return next({ ctx });
});

export const appRouter = t.router({
  // Auth procedures
  register: t.procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const exists = await prisma.user.findUnique({
        where: { email: input.email }
      });

      if (exists) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const bonvoyNumber = `BV${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: 'USER',
          bonvoyNumber
        }
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'super-secret',
        { expiresIn: '7d' }
      );

      ctx.res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return { success: true };
    }),

  login: t.procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'super-secret',
        { expiresIn: '7d' }
      );

      ctx.res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    }),

  logout: t.procedure
    .mutation(async ({ ctx }) => {
      ctx.res.clearCookie('auth-token');
      return { success: true };
    }),

  // User procedures
  me: t.procedure
    .use(isAuthenticated)
    .query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user!.id },
        include: {
          bookings: {
            orderBy: { createdAt: 'desc' }
          },
          orders: true,
          reviews: true,
          conversations: true
        }
      });
      return user;
    }),

  // Hotel procedures
  hotels: t.procedure
    .query(() => {
      try {
        return mockHotels;
      } catch (error) {
        console.error('Error fetching hotels:', error);
        throw new Error('Failed to fetch hotels');
      }
    }),

  // Booking procedures
  createBooking: t.procedure
    .use(isAuthenticated)
    .input(z.object({
      hotelId: z.string(),
      roomId: z.string(),
      checkIn: z.string(),
      checkOut: z.string(),
      guests: z.number(),
      totalPrice: z.number()
    }))
    .mutation(async ({ input, ctx }) => {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(input.totalPrice * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          hotelId: input.hotelId,
          userId: ctx.user!.id.toString()
        }
      });

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: ctx.user!.id,
          stripeId: paymentIntent.id,
          amount: input.totalPrice,
          bookings: {
            create: {
              userId: ctx.user!.id,
              hotelId: input.hotelId,
              roomId: input.roomId,
              checkIn: new Date(input.checkIn),
              checkOut: new Date(input.checkOut),
              guests: input.guests,
              totalPrice: input.totalPrice
            }
          }
        },
        include: {
          bookings: true
        }
      });

      return {
        order,
        clientSecret: paymentIntent.client_secret
      };
    }),

  // Admin procedures
  users: t.procedure
    .use(isAdmin)
    .query(async () => {
      return prisma.user.findMany({
        include: {
          bookings: true,
          orders: true,
          reviews: true,
          conversations: true
        }
      });
    }),

  bookings: t.procedure
    .use(isAdmin)
    .query(async () => {
      return prisma.booking.findMany({
        include: {
          user: true,
          order: true
        }
      });
    })
});

export type AppRouter = typeof appRouter;

export const createContext = ({ req, res }: { req: ExpressRequest; res: ExpressResponse }): Context => ({
  req,
  res,
  prisma
});
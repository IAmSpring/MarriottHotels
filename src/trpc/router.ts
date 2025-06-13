import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { hotels } from '../data/hotels';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface Context {
  req: Request;
  res: Response;
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
      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          profile: {
            create: {
              bonvoyNumber: `BV${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            }
          }
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
          profile: true,
          bookings: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return user;
    }),

  // Hotel procedures
  hotels: t.procedure
    .query(() => {
      return hotels;
    }),

  // Booking procedures
  createBooking: t.procedure
    .use(isAuthenticated)
    .input(z.object({
      hotelId: z.string(),
      roomType: z.string(),
      checkIn: z.string(),
      checkOut: z.string(),
      guests: z.number(),
      totalPrice: z.number()
    }))
    .mutation(async ({ input, ctx }) => {
      const booking = await prisma.booking.create({
        data: {
          userId: ctx.user!.id,
          ...input,
          checkIn: new Date(input.checkIn),
          checkOut: new Date(input.checkOut)
        }
      });

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(input.totalPrice * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          bookingId: booking.id.toString(),
          hotelId: input.hotelId,
          userId: ctx.user!.id.toString()
        }
      });

      // Create order
      await prisma.order.create({
        data: {
          userId: ctx.user!.id,
          stripeId: paymentIntent.id,
          amount: input.totalPrice,
          bookings: {
            connect: { id: booking.id }
          }
        }
      });

      return {
        booking,
        clientSecret: paymentIntent.client_secret
      };
    }),

  // Admin procedures
  users: t.procedure
    .use(isAdmin)
    .query(async () => {
      return prisma.user.findMany({
        include: {
          profile: true,
          bookings: true
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
    }),

  updateBooking: t.procedure
    .use(isAdmin)
    .input(z.object({
      id: z.number(),
      status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'])
    }))
    .mutation(async ({ input }) => {
      return prisma.booking.update({
        where: { id: input.id },
        data: { status: input.status }
      });
    })
});

export type AppRouter = typeof appRouter;

export const createContext = ({ req, res }: { req: Request; res: Response }): Context => ({
  req,
  res,
  prisma
}); 
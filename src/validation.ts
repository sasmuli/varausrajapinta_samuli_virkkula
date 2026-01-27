import { z } from 'zod';

export const VALID_ROOMS = ['A', 'B', 'C'] as const;

export const createBookingSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const roomIdSchema = z.enum(VALID_ROOMS);

export const bookingIdSchema = z.string().uuid();

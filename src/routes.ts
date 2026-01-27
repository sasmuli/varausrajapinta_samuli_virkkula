import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import {
  createBookingSchema,
  roomIdSchema,
  bookingIdSchema,
} from './validation.js';
import { createBooking, BookingError } from './business-logic.js';
import { bookingStore } from './store.js';
import { ErrorResponse } from './types.js';

export async function registerRoutes(app: FastifyInstance) {
  app.post<{
    Params: { roomId: string };
    Body: { start: string; end: string };
  }>('/rooms/:roomId/bookings', async (request, reply) => {
    try {
      const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
      if (!roomIdResult.success) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Room not found',
        } as ErrorResponse);
      }

      const bodyResult = createBookingSchema.safeParse(request.body);
      if (!bodyResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid request body',
        } as ErrorResponse);
      }

      const booking = createBooking(
        roomIdResult.data,
        bodyResult.data.start,
        bodyResult.data.end
      );

      return reply.status(201).send(booking);
    } catch (error) {
      if (error instanceof BookingError) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
          message: error.message,
        } as ErrorResponse);
      }
      throw error;
    }
  });

  app.get<{
    Params: { roomId: string };
  }>('/rooms/:roomId/bookings', async (request, reply) => {
    const roomIdResult = roomIdSchema.safeParse(request.params.roomId);
    if (!roomIdResult.success) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Room not found',
      } as ErrorResponse);
    }

    const bookings = bookingStore.getBookingsByRoom(roomIdResult.data);
    return reply.status(200).send(bookings);
  });

  app.delete<{
    Params: { bookingId: string };
  }>('/bookings/:bookingId', async (request, reply) => {
    const bookingIdResult = bookingIdSchema.safeParse(request.params.bookingId);
    if (!bookingIdResult.success) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Booking not found',
      } as ErrorResponse);
    }

    const booking = bookingStore.getBookingById(bookingIdResult.data);
    if (!booking) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Booking not found',
      } as ErrorResponse);
    }

    bookingStore.deleteBooking(bookingIdResult.data);
    return reply.status(204).send();
  });
}

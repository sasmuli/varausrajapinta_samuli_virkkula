import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  createBookingSchema,
  roomIdSchema,
  bookingIdSchema,
} from './validation.js';
import { createBooking, BookingError, getBookingsByRoom, deleteBookingById } from './business-logic.js';
import { ErrorResponse, RoomId} from './types.js';

type RoomParams = { roomId: RoomId };


const validateRoomId = async (
  request: FastifyRequest<{ Params: { roomId: string } }>,
  reply: FastifyReply
) => {
  const result = roomIdSchema.safeParse(request.params.roomId);

  if (!result.success) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Room not found',
    } as ErrorResponse);
  }

  (request.params as RoomParams).roomId = result.data;
};


const validateBookingId = async (
  request: FastifyRequest<{ Params: { bookingId: string } }>,
  reply: FastifyReply
) => {
  const result = bookingIdSchema.safeParse(request.params.bookingId);
  if (!result.success) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Booking not found',
    } as ErrorResponse);
  }
};

export async function registerRoutes(app: FastifyInstance) {
  app.post<{
    Params: RoomParams;
    Body: { start: string; end: string };
  }>(
    '/rooms/:roomId/bookings',
    { preHandler: validateRoomId },
    async (request, reply) => {
      try {
        const bodyResult = createBookingSchema.safeParse(request.body);
        if (!bodyResult.success) {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Invalid request body',
          } as ErrorResponse);
        }

        const booking = createBooking(
          request.params.roomId,
          bodyResult.data.start,
          bodyResult.data.end
        );

        return reply.status(201).send(booking);
    } catch (error) {
      if (error instanceof BookingError) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error:
            error.statusCode === 409
              ? 'Conflict'
              : error.statusCode === 404
                ? 'Not Found'
                : 'Bad Request',
          message: error.message,
        } as ErrorResponse);
      }
      throw error;
      }
    }
  );

  app.get<{
    Params: RoomParams;
  }>(
    '/rooms/:roomId/bookings',
    { preHandler: validateRoomId },
    async (request, reply) => {
      const bookings = getBookingsByRoom(request.params.roomId);
      return reply.status(200).send(bookings);
    }
  );

  app.delete<{
    Params: { bookingId: string };
  }>(
    '/bookings/:bookingId',
    { preHandler: validateBookingId },
    async (request, reply) => {
      try {
        deleteBookingById(request.params.bookingId);
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof BookingError) {
          return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            error:
              error.statusCode === 409
                ? 'Conflict'
                : error.statusCode === 404
                  ? 'Not Found'
                  : 'Bad Request',
            message: error.message,
          } as ErrorResponse);
        }
        throw error;
      }
    }
  );
}

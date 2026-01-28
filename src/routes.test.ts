import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildServer } from './server.js';
import { bookingStore } from './store.js';

describe('API Routes', () => {
  beforeEach(() => {
    bookingStore.clear();
  });

  describe('POST /rooms/:roomId/bookings', () => {
    it('should create a booking and return 201', async () => {
      const app = await buildServer();
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toMatchObject({
        roomId: 'A',
        start: start.toISOString(),
        end: end.toISOString(),
      });
      expect(body.id).toBeDefined();

      await app.close();
    });

    it('should return 404 for unknown room', async () => {
      const app = await buildServer();
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/Z/bookings',
        payload: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Room not found');

      await app.close();
    });

    it('should return 404 for room D', async () => {
      const app = await buildServer();
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/D/bookings',
        payload: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Room not found');

      await app.close();
    });

    it('should return 404 for room E', async () => {
      const app = await buildServer();
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/E/bookings',
        payload: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Room not found');

      await app.close();
    });

    it('should return 400 for invalid request body', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: 'invalid-date',
          end: 'invalid-date',
        },
      });

      expect(response.statusCode).toBe(400);

      await app.close();
    });

    it('should return 400 for booking in the past', async () => {
      const app = await buildServer();
      const start = new Date(Date.now() - 1000 * 60 * 60);
      const end = new Date(Date.now() + 1000 * 60 * 60);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Booking cannot be in the past');

      await app.close();
    });

    it('should return 409 for overlapping booking', async () => {
      const app = await buildServer();
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: start1.toISOString(),
          end: end1.toISOString(),
        },
      });

      const start2 = new Date(start1.getTime() + 1000 * 60 * 30);
      const end2 = new Date(end1.getTime() + 1000 * 60 * 30);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: start2.toISOString(),
          end: end2.toISOString(),
        },
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Booking overlaps with existing booking');

      await app.close();
    });

    it('should allow adjacent bookings (end === nextStart)', async () => {
      const app = await buildServer();
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: start1.toISOString(),
          end: end1.toISOString(),
        },
      });

      const start2 = end1;
      const end2 = new Date(start2.getTime() + 1000 * 60 * 60);

      const response = await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: {
          start: start2.toISOString(),
          end: end2.toISOString(),
        },
      });

      expect(response.statusCode).toBe(201);

      await app.close();
    });
  });

  describe('GET /rooms/:roomId/bookings', () => {
    it('should return empty array for room with no bookings', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'GET',
        url: '/rooms/A/bookings',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toEqual([]);

      await app.close();
    });

    it('should return all bookings for a room', async () => {
      const app = await buildServer();
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);
      const start2 = new Date(end1.getTime() + 1000 * 60 * 60);
      const end2 = new Date(start2.getTime() + 1000 * 60 * 60);

      await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: { start: start1.toISOString(), end: end1.toISOString() },
      });

      await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: { start: start2.toISOString(), end: end2.toISOString() },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/rooms/A/bookings',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveLength(2);

      await app.close();
    });

    it('should return 404 for unknown room', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'GET',
        url: '/rooms/Z/bookings',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Room not found');

      await app.close();
    });

    it('should return 404 for room D', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'GET',
        url: '/rooms/D/bookings',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Room not found');

      await app.close();
    });

    it('should return 404 for room E', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'GET',
        url: '/rooms/E/bookings',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Room not found');

      await app.close();
    });
  });

  describe('DELETE /bookings/:bookingId', () => {
    it('should delete a booking and return 204', async () => {
      const app = await buildServer();
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      const createResponse = await app.inject({
        method: 'POST',
        url: '/rooms/A/bookings',
        payload: { start: start.toISOString(), end: end.toISOString() },
      });

      const booking = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'DELETE',
        url: `/bookings/${booking.id}`,
      });

      expect(response.statusCode).toBe(204);

      const getResponse = await app.inject({
        method: 'GET',
        url: '/rooms/A/bookings',
      });

      const bookings = JSON.parse(getResponse.body);
      expect(bookings).toHaveLength(0);

      await app.close();
    });

    it('should return 404 for non-existent booking', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'DELETE',
        url: '/bookings/550e8400-e29b-41d4-a716-446655440000',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Booking not found');

      await app.close();
    });

    it('should return ErrorResponse shape for non-existent booking (404)', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'DELETE',
        url: '/bookings/550e8400-e29b-41d4-a716-446655440000',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);

      expect(body).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
        message: 'Booking not found',
      });

      await app.close();
    });


    it('should return 404 for invalid booking ID format', async () => {
      const app = await buildServer();

      const response = await app.inject({
        method: 'DELETE',
        url: '/bookings/invalid-id',
      });

      expect(response.statusCode).toBe(404);

      await app.close();
    });
  });

  describe('Error Handling', () => {
    it('should return 500 for unexpected errors', async () => {
      const app = await buildServer();

      const originalMethod = bookingStore.getBookingsByRoom;
      bookingStore.getBookingsByRoom = () => {
        throw new Error('Unexpected database error');
      };

      const response = await app.inject({
        method: 'GET',
        url: '/rooms/A/bookings',
      });

      expect(response.statusCode).toBe(500);
      const body = JSON.parse(response.body);
      expect(body).toMatchObject({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });

      bookingStore.getBookingsByRoom = originalMethod;
      await app.close();
    });

    it('should log unexpected errors', async () => {
      const app = await buildServer();
      const logSpy = vi.spyOn(app.log, 'error');

      const originalMethod = bookingStore.getBookingsByRoom;
      bookingStore.getBookingsByRoom = () => {
        throw new Error('Unexpected database error');
      };

      await app.inject({
        method: 'GET',
        url: '/rooms/A/bookings',
      });

      expect(logSpy).toHaveBeenCalledWith(expect.any(Error));

      logSpy.mockRestore();
      bookingStore.getBookingsByRoom = originalMethod;
      await app.close();
    });
  });
});

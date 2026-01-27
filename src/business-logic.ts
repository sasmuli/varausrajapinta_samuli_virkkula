import { Booking, RoomId } from './types.js';
import { bookingStore } from './store.js';

export class BookingError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'BookingError';
  }
}

export function validateBookingTimes(start: string, end: string): void {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();

  if (startDate < now) {
    throw new BookingError('Booking cannot be in the past', 400);
  }

  if (startDate >= endDate) {
    throw new BookingError('Start time must be before end time', 400);
  }
}

export function checkOverlap(
  roomId: RoomId,
  start: string,
  end: string
): void {
  const existingBookings = bookingStore.getBookingsByRoom(roomId);
  const newStart = new Date(start);
  const newEnd = new Date(end);

  for (const booking of existingBookings) {
    const existingStart = new Date(booking.start);
    const existingEnd = new Date(booking.end);

    const overlaps = newStart < existingEnd && newEnd > existingStart;

    if (overlaps) {
      throw new BookingError('Booking overlaps with existing booking', 409);
    }
  }
}

export function createBooking(
  roomId: RoomId,
  start: string,
  end: string
): Booking {
  validateBookingTimes(start, end);
  checkOverlap(roomId, start, end);
  return bookingStore.createBooking(roomId, start, end);
}

import { Booking, RoomId } from './types.js';
import { randomUUID } from 'crypto';

class BookingStore {
  private bookings: Map<string, Booking> = new Map();

  createBooking(roomId: RoomId, start: string, end: string): Booking {
    const booking: Booking = {
      id: randomUUID(),
      roomId,
      start,
      end,
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  getBookingsByRoom(roomId: RoomId): Booking[] {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.roomId === roomId
    );
  }

  getBookingById(bookingId: string): Booking | undefined {
    return this.bookings.get(bookingId);
  }

  deleteBooking(bookingId: string): boolean {
    return this.bookings.delete(bookingId);
  }

  clear(): void {
    this.bookings.clear();
  }
}

export const bookingStore = new BookingStore();

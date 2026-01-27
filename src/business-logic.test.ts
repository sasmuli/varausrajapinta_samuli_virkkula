import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateBookingTimes,
  checkOverlap,
  createBooking,
  BookingError,
} from './business-logic.js';
import { bookingStore } from './store.js';

describe('Business Logic', () => {
  beforeEach(() => {
    bookingStore.clear();
  });

  describe('validateBookingTimes', () => {
    it('should reject booking in the past', () => {
      const past = new Date(Date.now() - 1000 * 60 * 60);
      const future = new Date(Date.now() + 1000 * 60 * 60);

      expect(() =>
        validateBookingTimes(past.toISOString(), future.toISOString())
      ).toThrow(BookingError);
    });

    it('should reject booking where start >= end', () => {
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime());

      expect(() =>
        validateBookingTimes(start.toISOString(), end.toISOString())
      ).toThrow('Start time must be before end time');
    });

    it('should accept valid future booking', () => {
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      expect(() =>
        validateBookingTimes(start.toISOString(), end.toISOString())
      ).not.toThrow();
    });
  });

  describe('checkOverlap', () => {
    it('should detect overlapping bookings', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = new Date(start1.getTime() + 1000 * 60 * 30);
      const end2 = new Date(end1.getTime() + 1000 * 60 * 30);

      expect(() =>
        checkOverlap('A', start2.toISOString(), end2.toISOString())
      ).toThrow('Booking overlaps with existing booking');
    });

    it('should allow adjacent bookings (end === nextStart)', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = end1;
      const end2 = new Date(start2.getTime() + 1000 * 60 * 60);

      expect(() =>
        checkOverlap('A', start2.toISOString(), end2.toISOString())
      ).not.toThrow();
    });

    it('should allow non-overlapping bookings in same room', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = new Date(end1.getTime() + 1000 * 60 * 60);
      const end2 = new Date(start2.getTime() + 1000 * 60 * 60);

      expect(() =>
        checkOverlap('A', start2.toISOString(), end2.toISOString())
      ).not.toThrow();
    });

    it('should allow overlapping times in different rooms', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = new Date(start1.getTime() + 1000 * 60 * 30);
      const end2 = new Date(end1.getTime() + 1000 * 60 * 30);

      expect(() =>
        checkOverlap('B', start2.toISOString(), end2.toISOString())
      ).not.toThrow();
    });

    it('should detect overlap when new booking contains existing', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 120);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = new Date(start1.getTime() - 1000 * 60 * 30);
      const end2 = new Date(end1.getTime() + 1000 * 60 * 30);

      expect(() =>
        checkOverlap('A', start2.toISOString(), end2.toISOString())
      ).toThrow('Booking overlaps with existing booking');
    });

    it('should detect overlap when new booking is contained by existing', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 120);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 120);

      bookingStore.createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = new Date(start1.getTime() + 1000 * 60 * 30);
      const end2 = new Date(end1.getTime() - 1000 * 60 * 30);

      expect(() =>
        checkOverlap('A', start2.toISOString(), end2.toISOString())
      ).toThrow('Booking overlaps with existing booking');
    });
  });

  describe('createBooking', () => {
    it('should create a valid booking', () => {
      const start = new Date(Date.now() + 1000 * 60 * 60);
      const end = new Date(start.getTime() + 1000 * 60 * 60);

      const booking = createBooking('A', start.toISOString(), end.toISOString());

      expect(booking).toMatchObject({
        roomId: 'A',
        start: start.toISOString(),
        end: end.toISOString(),
      });
      expect(booking.id).toBeDefined();
    });

    it('should reject invalid booking', () => {
      const start = new Date(Date.now() - 1000 * 60 * 60);
      const end = new Date(Date.now() + 1000 * 60 * 60);

      expect(() =>
        createBooking('A', start.toISOString(), end.toISOString())
      ).toThrow(BookingError);
    });

    it('should reject overlapping booking', () => {
      const start1 = new Date(Date.now() + 1000 * 60 * 60);
      const end1 = new Date(start1.getTime() + 1000 * 60 * 60);

      createBooking('A', start1.toISOString(), end1.toISOString());

      const start2 = new Date(start1.getTime() + 1000 * 60 * 30);
      const end2 = new Date(end1.getTime() + 1000 * 60 * 30);

      expect(() =>
        createBooking('A', start2.toISOString(), end2.toISOString())
      ).toThrow('Booking overlaps with existing booking');
    });
  });
});

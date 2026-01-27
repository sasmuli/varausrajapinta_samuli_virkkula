export type RoomId = 'A' | 'B' | 'C';

export interface Booking {
  id: string;
  roomId: RoomId;
  start: string;
  end: string;
}

export interface CreateBookingRequest {
  start: string;
  end: string;
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

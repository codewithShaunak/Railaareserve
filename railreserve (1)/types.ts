
export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  RESERVED = 'RESERVED'
}

export interface Seat {
  id: string;
  number: string;
  status: SeatStatus;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  seats: Seat[];
}

export interface Booking {
  id: string;
  trainId: string;
  trainName: string;
  seatNumbers: string[];
  totalPrice: number;
  date: string;
  customerName: string;
}

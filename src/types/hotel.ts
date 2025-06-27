export type HotelType = 'LUXURY' | 'RESORT' | 'BOUTIQUE' | 'BUSINESS' | 'STANDARD';

export interface Price {
  base: number;
  currency: string;
}

export interface Room {
  id?: string;
  type: string;
  price: number;
  description: string;
  beds: string;
  occupancy: string;
  size: string;
}

export interface Contact {
  phone: string;
  email: string;
  address: string;
}

export interface Hotel {
  id: string;
  name: string;
  type: HotelType;
  location: string;
  description: string;
  price: Price;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  rooms: Room[];
  status: 'ACTIVE' | 'INACTIVE';
  contact: Contact;
  checkInTime: string;
  checkOutTime: string;
  policies: string[];
  features: string[];
}

export interface BookingFilters {
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

export interface BookingDetails {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
} 
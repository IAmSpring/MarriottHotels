export type HotelType = 'LUXURY' | 'RESORT' | 'BOUTIQUE' | 'BUSINESS' | 'STANDARD';

export interface Price {
  base: number;
  currency: string;
}

export interface Room {
  id: string;
  hotelId: string;
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
  type: string;
  location: string;
  description: string;
  price: Price;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  rooms: Room[];
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
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

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  popularHotels: string[];
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  bonvoyNumber: string | null;
  bonvoyPoints: number | null;
  bonvoyStatus: string | null;
  createdAt: string;
  updatedAt: string;
} 
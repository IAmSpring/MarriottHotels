export interface Room {
  id?: string;
  type: string;
  price: number;
  description: string;
  beds: string;
  occupancy: string;
  size: string;
}

export interface BookingRoom extends Room {
  id: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  rooms: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';
  amenities: string[];
  images: string[];
  price: {
    base: number;
    currency: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  checkInTime: string;
  checkOutTime: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  type?: 'LUXURY' | 'BUSINESS' | 'RESORT' | 'BOUTIQUE';
}

export interface BookingFilters {
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}

export interface BookingDetails {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
} 
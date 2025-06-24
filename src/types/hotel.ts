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
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  type: 'standard' | 'boutique' | 'luxury';
  featured?: boolean;
  reviews: number;
  rooms: Room[];
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
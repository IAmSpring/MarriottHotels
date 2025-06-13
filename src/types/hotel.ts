export interface Room {
  type: string;
  price: number;
  description: string;
  beds: string;
  occupancy: string;
  size: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  description: string;
  reviews: number;
  amenities: string[];
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
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
} 
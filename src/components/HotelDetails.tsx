import React from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { trpc } from '../utils/trpc';
import type { Hotel, Room } from '../types/hotel';

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hotels, isLoading, error } = trpc.hotels.useQuery();
  const hotel = hotels?.find((h: Hotel) => h.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading hotel details: {error.message}</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-800">Hotel not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <p className="text-xl text-white flex items-center">
              <span className="flex items-center mr-2">
                <Star className="w-5 h-5 fill-current text-yellow-400" />
                {hotel.rating}
              </span>
              • {hotel.location}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">{hotel.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room: Room, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{room.type}</h3>
                    <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>• {room.beds}</p>
                      <p>• Up to {room.occupancy}</p>
                      <p>• {room.size}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${room.price}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                      <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails; 
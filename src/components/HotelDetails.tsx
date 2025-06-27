import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { hotels } from '../data/hotels';
import type { Room } from '../types/hotel';
import BookingModal from './BookingModal';

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hotel = hotels.find((h) => h.id === id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const handleBookNow = (room?: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-800">Hotel not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{hotel.rating}</span>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
          <p className="text-gray-600 mb-4">{hotel.location}</p>
          <p className="text-gray-700 mb-6">{hotel.description}</p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <span className="mr-2">•</span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotel.rooms.map((room, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{room.type}</h3>
                  <p className="text-gray-600 mb-2">{room.description}</p>
                  <div className="text-gray-700 mb-4">
                    <p>Beds: {room.beds}</p>
                    <p>Occupancy: {room.occupancy}</p>
                    <p>Size: {room.size}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#8B1538]">
                      ${room.price}
                      <span className="text-sm font-normal text-gray-500">/night</span>
                    </span>
                    <button
                      onClick={() => handleBookNow(room)}
                      className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6B1028] transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotel.policies.map((policy, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <span className="mr-2">•</span>
                  {policy}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          hotel={hotel}
          selectedRoom={selectedRoom}
        />
      )}
    </div>
  );
};

export default HotelDetails; 
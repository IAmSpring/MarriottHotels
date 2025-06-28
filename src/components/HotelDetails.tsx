import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { hotels, Room } from '../data/hotels';
import BookingModal from '../components/BookingModal';

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hotel = hotels.find(h => h.id === id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Hotel Not Found</h2>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hotel Image */}
        <div className="relative h-96">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 font-semibold">{hotel.rating}</span>
          </div>
        </div>

        {/* Hotel Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
          <p className="text-gray-600 mb-4">{hotel.location}</p>
          <p className="text-gray-700 mb-6">{hotel.description}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-600">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Rooms</h2>
            <div className="space-y-4">
              {hotel.rooms.map((room) => (
                <div
                  key={room.id}
                  className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsBookingModalOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{room.type}</h3>
                      <p className="text-sm text-gray-600">{room.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Beds: {room.beds}</p>
                        <p>Occupancy: {room.occupancy}</p>
                        <p>Size: {room.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${room.price}</p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Policies</h2>
            <div className="space-y-2">
              <p>Check-in: {hotel.checkInTime}</p>
              <p>Check-out: {hotel.checkOutTime}</p>
              {hotel.policies.map((policy, index) => (
                <p key={index} className="text-gray-600">{policy}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedRoom(undefined);
          }}
          hotel={hotel}
          selectedRoom={selectedRoom}
        />
      )}
    </div>
  );
};

export default HotelDetails; 
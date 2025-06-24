import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Wifi, Waves, Coffee, UtensilsCrossed, Dumbbell, Car, MapPin, Users } from 'lucide-react';
import { mockHotels } from '../data/mockData';
import BookingModal from '../components/BookingModal';
import type { Room, BookingRoom } from '../types/hotel';

const amenityIcons = {
  'WiFi': <Wifi className="w-5 h-5" />,
  'Pool': <Waves className="w-5 h-5" />,
  'Spa': <Coffee className="w-5 h-5" />,
  'Restaurant': <UtensilsCrossed className="w-5 h-5" />,
  'Gym': <Dumbbell className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Beach Access': <MapPin className="w-5 h-5" />,
  'Room Service': <Users className="w-5 h-5" />
};

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hotel = mockHotels.find(h => h.id === id);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<BookingRoom | undefined>();

  const handleRoomSelect = (room: Room) => {
    const bookingRoom: BookingRoom = {
      ...room,
      id: room.id || `${hotel?.id}-${room.type.toLowerCase().replace(/\s+/g, '-')}`
    };
    setSelectedRoom(bookingRoom);
    setIsBookingModalOpen(true);
  };

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Hotel not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{hotel.rating}</span>
                </div>
                <span>•</span>
                <span>{hotel.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
              <p className="text-gray-600 mb-6">{hotel.description}</p>

              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    {amenityIcons[amenity as keyof typeof amenityIcons]}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            {hotel.images && hotel.images.length > 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {hotel.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${hotel.name} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
              <div className="space-y-6">
                {hotel.rooms.map((room) => (
                  <div key={room.type} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{room.type}</h3>
                        <p className="text-gray-600">{room.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#8B1538]">${room.price}</div>
                        <div className="text-gray-500">per night</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Beds:</span> {room.beds}
                      </div>
                      <div>
                        <span className="font-medium">Occupancy:</span> {room.occupancy}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {room.size}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRoomSelect(room)}
                      className="w-full bg-[#8B1538] text-white py-2 rounded-lg font-semibold hover:bg-[#6B1028] transition"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[#8B1538]">
                  Starting from ${Math.min(...hotel.rooms.map(r => r.price))}
                </div>
                <div className="text-gray-500">per night</div>
              </div>
              <button
                onClick={() => {
                  const defaultRoom = hotel.rooms[0];
                  if (defaultRoom) {
                    handleRoomSelect(defaultRoom);
                  } else {
                    setSelectedRoom(undefined);
                    setIsBookingModalOpen(true);
                  }
                }}
                className="w-full bg-[#8B1538] text-white py-3 rounded-lg font-semibold hover:bg-[#6B1028] transition"
              >
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotel={hotel}
        selectedRoom={selectedRoom}
      />
    </div>
  );
};

export default HotelDetails; 
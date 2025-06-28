import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { hotels, Room } from '../data/hotels';
import BookingModal from '../components/BookingModal';

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hotel = hotels.find(h => h.id === id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);

  const handleBookRoom = (room?: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

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
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
        <img
            src={hotel.image}
          alt={hotel.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';
          }}
        />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {hotel.type}
            </span>
                </div>
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 text-2xl">★</span>
            <span className="ml-1 text-xl">{hotel.rating}</span>
            <span className="mx-2">•</span>
            <span>{hotel.reviews} reviews</span>
              </div>
          <p className="text-gray-600 mb-6">{hotel.description}</p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="flex items-center text-gray-600">
              <span className="mr-2">📍</span>
              {hotel.location}
            </p>
            </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Price</h3>
            <p className="text-3xl font-bold text-[#8B1538]">
              ${hotel.price.base} <span className="text-gray-500 text-base">per night</span>
            </p>
          </div>
          <button
            onClick={() => handleBookRoom()}
            className="w-full bg-[#8B1538] text-white py-3 rounded-lg hover:bg-[#6d102c] transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Features and Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {hotel.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2">✦</span>
                <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2">•</span>
                <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
      </div>

      {/* Rooms */}
      <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotel.rooms.map((room: Room) => (
            <div key={room.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{room.type}</h3>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="space-y-2 mb-4">
                <p><span className="font-medium">Beds:</span> {room.beds}</p>
                <p><span className="font-medium">Occupancy:</span> {room.occupancy}</p>
                <p><span className="font-medium">Size:</span> {room.size}</p>
                      </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-[#8B1538]">${room.price}</p>
                <button 
                  onClick={() => handleBookRoom(room)}
                  className="bg-[#8B1538] text-white px-4 py-2 rounded hover:bg-[#6d102c] transition-colors"
                >
                  Select
                </button>
                      </div>
                    </div>
          ))}
        </div>
                      </div>

      {/* Policies and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
          <h2 className="text-2xl font-bold mb-6">Policies</h2>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Check-in/Check-out</h3>
              <p className="text-gray-600">Check-in: {hotel.checkInTime}</p>
              <p className="text-gray-600">Check-out: {hotel.checkOutTime}</p>
                      </div>
                      <div>
              <h3 className="font-semibold mb-2">Hotel Policies</h3>
              <ul className="list-disc list-inside space-y-2">
                {hotel.policies.map((policy, index) => (
                  <li key={index} className="text-gray-600">{policy}</li>
                ))}
              </ul>
            </div>
          </div>
                </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Phone:</span><br />
                <a href={`tel:${hotel.contact.phone}`} className="text-blue-600 hover:text-blue-800">
                  {hotel.contact.phone}
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span><br />
                <a href={`mailto:${hotel.contact.email}`} className="text-blue-600 hover:text-blue-800">
                  {hotel.contact.email}
                </a>
              </p>
              <p>
                <span className="font-semibold">Address:</span><br />
                <span className="text-gray-600">{hotel.contact.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRoom(undefined);
        }}
        hotel={hotel}
        selectedRoom={selectedRoom}
      />
    </div>
  );
};

export default HotelDetails; 
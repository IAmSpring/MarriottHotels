import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../../utils/trpc';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hotels } = trpc.hotels.useQuery();
  const hotel = hotels?.find(h => h.id === id);

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState('');

  if (!hotel) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !selectedRoomType) return 0;
    
    const selectedRoom = hotel.rooms.find(r => r.type === selectedRoomType);
    if (!selectedRoom) return 0;
    
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 0;
    
    return days * selectedRoom.price;
  };

  // Get maximum guests from room types
  const maxGuests = Math.max(...hotel.rooms.map(room => 
    parseInt(room.occupancy.split(' ')[0]) || 2
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={hotel.images[0]} 
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl font-bold text-white mb-4">{hotel.name}</h1>
            <p className="text-xl text-white">{hotel.location}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Hotel Info */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-6">About the Property</h2>
            <p className="text-gray-600 mb-8">{hotel.description}</p>

            <h3 className="text-2xl font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-semibold mb-4">Room Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.rooms.map((room) => (
                <div 
                  key={room.type}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedRoomType === room.type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedRoomType(room.type)}
                >
                  <h4 className="text-xl font-semibold mb-2">{room.type}</h4>
                  <p className="text-gray-600 mb-2">{room.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Beds: {room.beds}</p>
                    <p>Max Occupancy: {room.occupancy}</p>
                    <p>Size: {room.size}</p>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-blue-600">${room.price}/night</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-2xl font-semibold mb-6">Book Your Stay</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a room type</option>
                    {hotel.rooms.map(room => (
                      <option key={room.type} value={room.type}>
                        {room.type} - ${room.price}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={date => setCheckIn(date)}
                    minDate={new Date()}
                    className="w-full p-2 border rounded-md"
                    placeholderText="Select check-in date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={date => setCheckOut(date)}
                    minDate={checkIn || new Date()}
                    className="w-full p-2 border rounded-md"
                    placeholderText="Select check-out date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  >
                    {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                {selectedRoomType && checkIn && checkOut && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Room Type:</span>
                        <span>{selectedRoomType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{format(checkIn, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{format(checkOut, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{guests}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${calculateTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={!selectedRoomType || !checkIn || !checkOut}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail; 
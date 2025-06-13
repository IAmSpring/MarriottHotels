import React, { useState } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

console.log('HeroSection.tsx: Starting to render');

const HeroSection: React.FC = () => {
  console.log('HeroSection.tsx: Inside component');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Extraordinary Experiences
          <br />
          Await You
        </h1>
        <p className="text-xl md:text-2xl text-center mb-12">
          Discover exceptional hotels and resorts around the world with
          <br />
          Marriott Bonvoy.
        </p>

        {/* Search Form */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, hotel, or landmark"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Check-in */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  placeholderText="mm/dd/yyyy"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  placeholderText="mm/dd/yyyy"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent text-gray-900"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Find Hotels Button */}
          <div className="mt-6">
            <button className="w-full bg-[#8B1538] text-white py-3 rounded-lg hover:bg-[#6B1028] transition-colors font-semibold">
              Find Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
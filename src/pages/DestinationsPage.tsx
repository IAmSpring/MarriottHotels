import React, { useState } from 'react';
import { mockDestinations } from '../data/mockData';
import { hotels } from '../data/hotels';
import { Search, MapPin, Sun, Hotel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const countries = Array.from(new Set(mockDestinations.map(d => d.country)));
  
  const filteredDestinations = mockDestinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || destination.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const getHotelsByIds = (hotelIds: string[]) => {
    return hotels.filter(hotel => hotelIds.includes(hotel.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#8B1538] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-xl">Discover amazing places and luxurious stays around the world</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-500">{destination.country}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
                
                {/* Weather and Hotels */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Sun className="w-4 h-4 mr-1" />
                    <span>{destination.weather}</span>
                  </div>
                  <div className="flex items-center">
                    <Hotel className="w-4 h-4 mr-1" />
                    <span>{getHotelsByIds(destination.hotelIds).length} Hotels</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/destinations/${destination.id}`)}
                  className="w-full bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6B1028] transition"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage; 
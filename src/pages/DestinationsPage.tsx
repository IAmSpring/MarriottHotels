import React, { useState } from 'react';
import { mockDestinations, mockHotels } from '../data/mockData';
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
    return mockHotels.filter(hotel => hotelIds.includes(hotel.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Dream Destinations
          </h1>
          <p className="text-xl text-gray-600">
            Discover the world's most beautiful locations and plan your perfect stay
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
          </div>
          <div className="md:w-64">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredDestinations.map(destination => (
            <div
              key={destination.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={destination.images[0]}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{destination.country}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{destination.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Sun className="h-5 w-5 mr-2 text-[#8B1538]" />
                    <span className="font-medium">Best Time to Visit:</span>
                  </div>
                  <p className="text-gray-600 ml-7">{destination.bestTimeToVisit}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Hotel className="h-5 w-5 mr-2 text-[#8B1538]" />
                    Popular Hotels
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getHotelsByIds(destination.popularHotels).map(hotel => (
                      <div
                        key={hotel.id}
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                      >
                        <div className="flex items-center">
                          <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-16 h-16 object-cover rounded-lg mr-3"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{hotel.name}</h5>
                            <p className="text-sm text-gray-600">From ${hotel.price}/night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    className="w-full bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6B1028] transition-colors"
                    onClick={() => {
                      const firstHotel = getHotelsByIds(destination.popularHotels)[0];
                      if (firstHotel) {
                        navigate(`/hotels/${firstHotel.id}`);
                      }
                    }}
                  >
                    Explore Hotels
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No destinations found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage; 
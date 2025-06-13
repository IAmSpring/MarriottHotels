import React, { useState } from 'react';
import { mockHotels } from '../data/mockData';
import { Search, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BoutiquePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');

  const boutiqueHotels = mockHotels.filter(hotel => hotel.type === 'boutique');
  
  const priceRanges = {
    all: { min: 0, max: Infinity },
    '0-200': { min: 0, max: 200 },
    '201-400': { min: 201, max: 400 },
    '401+': { min: 401, max: Infinity }
  };

  const filteredHotels = boutiqueHotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const selectedRange = priceRanges[priceRange as keyof typeof priceRanges];
    const matchesPrice = hotel.price >= selectedRange.min && hotel.price <= selectedRange.max;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Boutique Hotels
          </h1>
          <p className="text-xl text-gray-600">
            Discover unique and intimate hotel experiences
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search boutique hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
          </div>
          <div className="md:w-64">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="0-200">$0 - $200</option>
              <option value="201-400">$201 - $400</option>
              <option value="401+">$401+</option>
            </select>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map(hotel => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/hotels/${hotel.id}`)}
            >
              <div className="relative h-48">
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
                  ${hotel.price}/night
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                  <div className="flex items-center">
                    <span className="text-[#8B1538] font-semibold">{hotel.rating}</span>
                    <Star className="h-4 w-4 text-[#8B1538] ml-1 fill-current" />
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotel.location}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{hotel.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <button 
                    className="w-full bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6B1028] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/hotels/${hotel.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No boutique hotels found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoutiquePage; 
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Wifi, Waves, Coffee, UtensilsCrossed, Dumbbell, Car, Calendar, Users, Filter, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { trpc } from '../utils/trpc';
import type { Hotel, BookingFilters } from '../types/hotel';
import Footer from '../components/Footer';

const HotelsPage = () => {
  const { data: hotels, isLoading, error } = trpc.hotels.useQuery(undefined, {
    retry: 3,
    onError: (error) => {
      console.error('Error fetching hotels:', error);
    }
  });
  const [filters, setFilters] = useState<BookingFilters>({
    priceRange: [0, 1000],
    minRating: 0,
    amenities: [],
    checkIn: undefined,
    checkOut: undefined,
    guests: 2
  });

  const amenityIcons = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'Pool': <Waves className="w-5 h-5" />,
    'Spa': <Coffee className="w-5 h-5" />,
    'Restaurant': <UtensilsCrossed className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Parking': <Car className="w-5 h-5" />
  };

  const filteredHotels = useMemo(() => {
    return hotels?.filter(hotel => {
      return (
        hotel.price >= filters.priceRange[0] &&
        hotel.price <= filters.priceRange[1] &&
        hotel.rating >= filters.minRating &&
        (filters.amenities.length === 0 || 
          filters.amenities.every(amenity => 
            hotel.amenities.includes(amenity)
          ))
      );
    });
  }, [hotels, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Check-in */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={filters.checkIn}
                  onChange={(date) => setFilters(prev => ({
                    ...prev,
                    checkIn: date as Date
                  }))}
                  placeholderText="Check-in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Check-out */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <DatePicker
                  selected={filters.checkOut}
                  onChange={(date) => setFilters(prev => ({
                    ...prev,
                    checkOut: date as Date
                  }))}
                  placeholderText="Check-out"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Guests */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={filters.guests}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    guests: parseInt(e.target.value)
                  }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filter Button */}
            <div className="flex items-end">
              <button
                className="w-full px-6 py-3 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B1028] transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full accent-[#8B1538]"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minRating: parseFloat(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4.5}>4.5+</option>
                    <option value={4}>4.0+</option>
                    <option value={3.5}>3.5+</option>
                    <option value={3}>3.0+</option>
                  </select>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                <div className="space-y-2">
                  {Object.keys(amenityIcons).map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            amenities: e.target.checked
                              ? [...prev.amenities, amenity]
                              : prev.amenities.filter(a => a !== amenity)
                          }));
                        }}
                        className="text-[#8B1538]"
                      />
                      <span className="text-sm capitalize">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Dates */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Dates</h4>
                <div className="space-y-2">
                  <DatePicker
                    selected={filters.checkIn}
                    onChange={(date) => setFilters(prev => ({
                      ...prev,
                      checkIn: date as Date
                    }))}
                    placeholderText="Check-in"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  />
                  <DatePicker
                    selected={filters.checkOut}
                    onChange={(date) => setFilters(prev => ({
                      ...prev,
                      checkOut: date as Date
                    }))}
                    placeholderText="Check-out"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Hotel Listings */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHotels?.map((hotel: Hotel) => (
                <Link 
                  key={hotel.id} 
                  to={`/hotels/${hotel.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4">{hotel.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#8B1538]">
                        ${hotel.price}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6B1028] transition">
                        Book Now
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HotelsPage;
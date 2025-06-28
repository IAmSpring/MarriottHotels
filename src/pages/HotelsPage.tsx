import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Wifi, Waves, Coffee, UtensilsCrossed, Dumbbell, Car, Calendar, Users, Filter, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { hotels } from '../data/hotels';
import type { BookingFilters } from '../types/hotel';
import Footer from '../components/Footer';

const HotelsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<BookingFilters>({
    priceRange: [0, 1000],
    minRating: 0,
    amenities: [],
    checkIn: null,
    checkOut: null,
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
    return hotels.filter(hotel => {
      return (
        hotel.price.base >= filters.priceRange[0] &&
        hotel.price.base <= filters.priceRange[1] &&
        hotel.rating >= filters.minRating &&
        (filters.amenities.length === 0 || 
          filters.amenities.every(amenity => 
            hotel.amenities.includes(amenity)
          ))
      );
    });
  }, [filters]);

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#8B1538] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl">Discover luxury accommodations worldwide</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-6">
              <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [0, parseInt(e.target.value)]
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                </div>
              </div>
              
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minRating: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0</span>
                    <span>{filters.minRating}</span>
                    <span>5</span>
                </div>
              </div>
              
                <div>
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="space-y-2">
                    {Object.entries(amenityIcons).map(([amenity, icon]) => (
                      <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                amenities: [...prev.amenities, amenity]
                              }));
                            } else {
                          setFilters(prev => ({
                            ...prev,
                                amenities: prev.amenities.filter(a => a !== amenity)
                          }));
                            }
                        }}
                          className="mr-2"
                      />
                        <span className="flex items-center">
                          {icon}
                          <span className="ml-2">{amenity}</span>
                        </span>
                    </label>
                  ))}
                </div>
              </div>
              
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <DatePicker
                    selected={filters.checkIn}
                    onChange={(date) => setFilters(prev => ({ ...prev, checkIn: date }))}
                    className="w-full p-2 border rounded"
                    placeholderText="Select date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <DatePicker
                    selected={filters.checkOut}
                    onChange={(date) => setFilters(prev => ({ ...prev, checkOut: date }))}
                    className="w-full p-2 border rounded"
                    placeholderText="Select date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <input
                      type="number"
                      min="1"
                      value={filters.guests}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        guests: parseInt(e.target.value)
                      }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hotel List */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                      <p className="text-gray-600">{hotel.location}</p>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#8B1538]">
                        ${hotel.price.base}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </span>
                      <button 
                        className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6B1028] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotelClick(hotel.id);
                        }}
                      >
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
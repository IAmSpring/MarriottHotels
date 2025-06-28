import React, { useState } from 'react';
import { hotels } from '../data/hotels';
import HotelCard from '../components/HotelCard';

const BoutiquePage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);

  // Filter boutique hotels
  const boutiqueHotels = hotels.filter(hotel => {
    const meetsType = hotel.type === 'BOUTIQUE';
    const meetsPrice = hotel.price.base >= priceRange[0] && hotel.price.base <= priceRange[1];
    const meetsRating = hotel.rating >= rating;
    return meetsType && meetsPrice && meetsRating;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Boutique Hotels</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (per night)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 p-2 border rounded"
                min={0}
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 p-2 border rounded"
                min={0}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-24 p-2 border rounded"
              min={0}
              max={5}
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boutiqueHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {boutiqueHotels.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600">
            No hotels match your criteria
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
};

export default BoutiquePage; 
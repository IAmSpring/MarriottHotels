import React from 'react';
import { Link } from 'react-router-dom';
import { hotels } from '../data/hotels';

const DestinationsPage: React.FC = () => {
  // Group hotels by location
  const destinations = hotels.reduce((acc, hotel) => {
    const city = hotel.location.split(',')[0].trim();
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(hotel);
    return acc;
  }, {} as Record<string, typeof hotels>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Popular Destinations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(destinations).map(([city, cityHotels]) => (
          <div key={city} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
                <img
                src={cityHotels[0].image}
                alt={city}
                  className="w-full h-full object-cover"
                />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">{city}</h2>
                  </div>
                </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600">{cityHotels.length} Hotels</p>
                <p className="text-gray-600">
                  Starting from ${Math.min(...cityHotels.map(h => h.price.base))}
                </p>
              </div>
              <div className="space-y-4">
                {cityHotels.map(hotel => (
                  <Link
                        key={hotel.id}
                    to={`/hotels/${hotel.id}`}
                    className="block hover:bg-gray-50 p-4 rounded-lg transition"
                      >
                    <div className="flex justify-between items-start">
                          <div>
                        <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                        <p className="text-sm text-gray-600">{hotel.type}</p>
                          </div>
                      <div className="text-right">
                        <p className="font-semibold">${hotel.price.base}</p>
                        <div className="flex items-center text-yellow-400">
                          <span>★</span>
                          <span className="ml-1 text-gray-600">{hotel.rating}</span>
                        </div>
                      </div>
                  </div>
                  </Link>
                    ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationsPage; 
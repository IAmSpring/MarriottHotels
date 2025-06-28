import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel } from '../data/hotels';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <Link to={`/hotels/${hotel.id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48">
        <img 
          src={hotel.image} 
          alt={hotel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg';
            }}
        />
          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
            ${hotel.price.base}/night
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 font-semibold">{hotel.rating}</span>
            </div>
          </div>
          <div className="text-gray-600 mb-3">
            {hotel.location}
          </div>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hotel.description}</p>
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
          <button 
            className="mt-6 w-full bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6d102c] transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
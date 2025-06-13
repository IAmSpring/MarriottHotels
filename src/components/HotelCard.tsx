import React from 'react';
import { Star } from 'lucide-react';

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{hotel.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
        <p className="text-gray-600 mb-4">{hotel.location}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#8B1538]">
            ${hotel.price}
            <span className="text-sm font-normal text-gray-600">/night</span>
          </div>
          <button className="px-6 py-2 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B1028] transition-colors duration-200">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { hotels } from '../data/hotels';

const FeaturedHotels: React.FC = () => {
  // Show all six featured hotels
  const featuredHotels = hotels.filter(hotel => 
    ['rcmb-001', 'jmas-002', 'mmny-003', 'mhhi-004', 'msf-005', 'rcla-006'].includes(hotel.id)
  );

  return (
    <section id="featured-section" className="py-16 bg-white/90 backdrop-blur-sm bg-[#8B1538]/[0.25]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Marriott Hotels</h2>
        <p className="text-gray-600 text-center mb-12">Discover our most popular destinations and exceptional properties</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHotels.map((hotel) => (
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
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-2">{hotel.location}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#8B1538]">
                    ${hotel.price.base}
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
    </section>
  );
};

export default FeaturedHotels;
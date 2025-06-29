import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { hotels } from '../data/hotels';

// Map of unique images for each hotel
const hotelImages = {
  'rcmb-001': 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', // Miami Beach - tropical beach resort
  'jmas-002': 'https://images.pexels.com/photos/754268/pexels-photo-754268.jpeg', // Aspen - snowy mountain resort
  'mmny-003': 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg', // New York - city skyline
  'mhhi-004': 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg', // Hawaii - tropical paradise
  'sandbourne-santa-monica': 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg', // Santa Monica - beach pier
  'park-lane-hong-kong': 'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg', // Hong Kong - harbor view
};

const FeaturedHotels: React.FC = () => {
  // Show featured hotels with unique images
  const featuredHotels = hotels.filter(hotel => [
    'rcmb-001',    // Ritz-Carlton Miami Beach
    'jmas-002',    // JW Marriott Aspen Snowmass
    'mmny-003',    // Marriott Marquis New York
    'mhhi-004',    // Marriott Halekulani Hawaii
    'sandbourne-santa-monica', // Sandbourne Santa Monica
    'park-lane-hong-kong'     // Park Lane Hong Kong
  ].includes(hotel.id)).map(hotel => ({
    ...hotel,
    image: hotelImages[hotel.id as keyof typeof hotelImages] || hotel.image
  }));

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
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BoutiqueHotels = () => {
  const hotels = [
    {
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      location: 'CALIFORNIA',
      name: 'Sandbourne Santa Monica',
      link: '/hotels/sandbourne-santa-monica',
      description: 'Luxury beachfront resort with stunning ocean views'
    },
    {
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
      location: 'CALIFORNIA',
      name: 'Ocean Breeze Resort',
      link: '/hotels/ocean-breeze-resort',
      description: 'Modern coastal retreat with private beach access'
    },
    {
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
      location: 'NORTH CAROLINA',
      name: 'Trailborn Highlands',
      link: '/hotels/trailborn-highlands',
      description: 'Mountain retreat with panoramic views'
    },
    {
      image: 'https://images.pexels.com/photos/2962353/pexels-photo-2962353.jpeg',
      location: 'NORTH CAROLINA',
      name: 'Mountain Peak Lodge',
      link: '/hotels/mountain-peak-lodge',
      description: 'Exclusive alpine getaway with premium amenities'
    },
    {
      image: 'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg',
      location: 'HONG KONG',
      name: 'Park Lane Hong Kong',
      link: '/hotels/park-lane-hong-kong',
      description: 'Luxury urban oasis with harbor views'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold mb-2">A Fresh Bouquet of Boutique Hotels</h2>
        <p className="text-gray-600 mb-8">New places to stay, handpicked for you.</p>

        <div className="grid grid-cols-12 gap-6">
          {/* Left column - 4 smaller cards */}
          <div className="col-span-8 grid grid-cols-2 gap-6">
            {hotels.slice(0, 4).map((hotel, index) => (
              <Link
                key={index}
                to={hotel.link}
                className="group relative overflow-hidden rounded-xl block aspect-[4/3]"
              >
                <div className="h-full">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                    <div className="absolute bottom-6 left-6">
                      <p className="text-white/80 text-sm font-medium mb-1">{hotel.location}</p>
                      <div className="flex items-center">
                        <h3 className="text-white text-lg font-bold mr-2">{hotel.name}</h3>
                        <ChevronRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-white/80 text-sm mt-2">{hotel.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right column - 1 tall card */}
          <div className="col-span-4">
            <Link
              to={hotels[4].link}
              className="group relative overflow-hidden rounded-xl block h-full"
            >
              <div className="h-full">
                <img
                  src={hotels[4].image}
                  alt={hotels[4].name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white/80 text-sm font-medium mb-1">{hotels[4].location}</p>
                    <div className="flex items-center">
                      <h3 className="text-white text-xl font-bold mr-2">{hotels[4].name}</h3>
                      <ChevronRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-white/80 text-sm mt-2">{hotels[4].description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoutiqueHotels;
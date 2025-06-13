import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BoutiqueHotels = () => {
  const hotels = [
    {
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      location: 'CALIFORNIA',
      name: 'Sandbourne Santa Monica',
      link: '/hotels/sandbourne-santa-monica'
    },
    {
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
      location: 'NORTH CAROLINA',
      name: 'Trailborn Highlands',
      link: '/hotels/trailborn-highlands'
    },
    {
      image: 'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg',
      location: 'HONG KONG',
      name: 'Park Lane Hong Kong, Autograph Collection',
      link: '/hotels/park-lane-hong-kong'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">A Fresh Bouquet of Boutique Hotels</h2>
        <p className="text-gray-600 mb-8">New places to stay, handpicked for you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <Link
              key={index}
              to={hotel.link}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white/80 text-sm font-medium mb-1">{hotel.location}</p>
                    <div className="flex items-center">
                      <h3 className="text-white text-xl font-bold mr-2">{hotel.name}</h3>
                      <ChevronRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoutiqueHotels; 
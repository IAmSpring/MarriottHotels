import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DiningSection = () => {
  const restaurants = [
    {
      image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
      location: 'TIN LUNG HEEN, HONG KONG',
      title: 'Creative Cantonese amid dramatic skyline views',
      link: '/dining/tin-lung-heen'
    },
    {
      image: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
      location: 'ES FUM, MALLORCA, SPAIN',
      title: 'Elevated Mediterranean fare with Spanish flair',
      link: '/dining/es-fum'
    }
  ];

  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <p className="text-sm font-medium text-gray-400 mb-4">TRANSCEND</p>
            <h2 className="text-4xl font-bold mb-6">
              Discover Tastes That Will Change You Forever
            </h2>
            <p className="text-gray-300 mb-8">
              Welcome to our collection of Michelin-star dining around the world.
            </p>
            <Link
              to="/dining"
              className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <span className="mr-2">Explore</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((restaurant, index) => (
                <Link
                  key={index}
                  to={restaurant.link}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={restaurant.image}
                      alt={restaurant.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                      <div className="absolute bottom-6 left-6">
                        <p className="text-white/80 text-sm font-medium mb-1">{restaurant.location}</p>
                        <div className="flex items-center">
                          <h3 className="text-white text-xl font-bold mr-2">{restaurant.title}</h3>
                          <ChevronRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiningSection; 
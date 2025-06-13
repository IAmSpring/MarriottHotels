import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const DestinationGuides = () => {
  const destinations = [
    {
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg',
      city: 'New York',
      country: 'United States',
      properties: 12,
      link: '/destinations/new-york'
    },
    {
      image: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg',
      city: 'Dubai',
      country: 'United Arab Emirates',
      properties: 8,
      link: '/destinations/dubai'
    },
    {
      image: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
      city: 'Paris',
      country: 'France',
      properties: 10,
      link: '/destinations/paris'
    },
    {
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
      city: 'Tokyo',
      country: 'Japan',
      properties: 9,
      link: '/destinations/tokyo'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated guides to the world's most sought-after destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={index}
              to={destination.link}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={destination.image}
                  alt={destination.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{destination.city}</h3>
                    <p className="text-gray-600 text-sm">{destination.country}</p>
                  </div>
                  <div className="flex items-center text-[#8B1538]">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{destination.properties} Hotels</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/destinations"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#8B1538] text-base font-medium rounded-md text-[#8B1538] hover:bg-[#8B1538] hover:text-white transition-colors duration-200"
          >
            Explore All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationGuides; 
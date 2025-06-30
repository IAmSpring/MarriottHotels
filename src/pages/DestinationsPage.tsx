import React from 'react';
import { Link } from 'react-router-dom';
import { mockDestinations } from '../data/mockData';
import { MapPin, Calendar } from 'lucide-react';

const DestinationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Popular Destinations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockDestinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Link to={`/destinations/${destination.id}`}>
              <div className="relative h-64">
                <img
                  src={destination.images[0]}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">{destination.name}</h2>
                    <p className="text-white text-sm">{destination.country}</p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="p-6">
              <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-[#8B1538]" />
                  <span>{destination.highlights.length} Attractions</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-[#8B1538]" />
                  <span className="line-clamp-1">{destination.bestTimeToVisit}</span>
                </div>
              </div>
              <Link
                to={`/destinations/${destination.id}`}
                className="mt-4 block text-center bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6d102c] transition-colors"
              >
                Explore More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationsPage; 
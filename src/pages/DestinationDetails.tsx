import React from 'react';
import { useParams } from 'react-router-dom';
import { mockDestinations, mockHotels } from '../data/mockData';
import { MapPin, Calendar, Hotel, Star } from 'lucide-react';

const DestinationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const destination = mockDestinations.find(d => d.id === id);
  const popularHotels = destination?.popularHotels
    .map(hotelId => mockHotels.find(h => h.id === hotelId))
    .filter(hotel => hotel !== undefined);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600">The destination you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-12">
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
              <p className="text-xl">{destination.country}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
              <p className="text-gray-600 mb-8">{destination.description}</p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 text-[#8B1538] mr-2" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-4">
                {destination.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${destination.name} - Image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-[#8B1538] mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-600 mb-6">{destination.country}</p>

              <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-[#8B1538] mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Best Time to Visit</h3>
              </div>
              <p className="text-gray-600 mb-6">{destination.bestTimeToVisit}</p>

              <div className="flex items-center mb-6">
                <Hotel className="h-6 w-6 text-[#8B1538] mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Popular Hotels</h3>
              </div>
              <div className="space-y-4">
                {popularHotels?.map((hotel, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 text-[#8B1538] mr-2" />
                    <span>{hotel?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#8B1538] text-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Plan Your Trip</h3>
              <p className="mb-6">Ready to explore {destination.name}? Let us help you plan the perfect trip.</p>
              <button className="w-full bg-white text-[#8B1538] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails; 
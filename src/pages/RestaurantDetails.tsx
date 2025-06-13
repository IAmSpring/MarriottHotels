import React from 'react';
import { useParams } from 'react-router-dom';
import { mockRestaurants } from '../data/mockData';
import { Clock, MapPin, Star, DollarSign } from 'lucide-react';

const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = mockRestaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {restaurant.images.map((image, index) => (
            <div key={index} className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`${restaurant.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <p className="text-xl text-gray-600">{restaurant.cuisine} Cuisine</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <Star className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{restaurant.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#8B1538] mr-2" />
              <span className="text-gray-600">{restaurant.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-[#8B1538] mr-2" />
              <span className="text-gray-600">{restaurant.openingHours}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-[#8B1538] mr-2" />
              <span className="text-gray-600">${restaurant.price}+ per person</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 mb-6">{restaurant.description}</p>
          </div>

          <div className="mt-8">
            <button className="bg-[#8B1538] text-white px-8 py-3 rounded-lg hover:bg-[#6B1028] transition-colors">
              Make a Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails; 
import React from 'react';
import { useParams } from 'react-router-dom';
import { mockExperiences } from '../data/mockData';
import { Clock, MapPin, DollarSign, Star } from 'lucide-react';

const ExperienceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const experience = mockExperiences.find(e => e.id === id);

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experience Not Found</h1>
          <p className="text-gray-600">The experience you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {experience.images.map((image, index) => (
            <div key={index} className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`${experience.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Experience Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.name}</h1>
              <p className="text-xl text-gray-600">{experience.type} Experience</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <DollarSign className="h-6 w-6 text-[#8B1538] mr-2" />
              <span className="text-2xl font-bold text-gray-900">${experience.price}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#8B1538] mr-2" />
              <span className="text-gray-600">{experience.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-[#8B1538] mr-2" />
              <span className="text-gray-600">{experience.duration}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Experience</h2>
            <p className="text-gray-600 mb-6">{experience.description}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experience.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <Star className="h-5 w-5 text-[#8B1538] mr-2" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <button className="bg-[#8B1538] text-white px-8 py-3 rounded-lg hover:bg-[#6B1028] transition-colors">
              Book This Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails; 
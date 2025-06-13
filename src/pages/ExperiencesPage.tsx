import React, { useState } from 'react';
import { mockExperiences } from '../data/mockData';
import { Search, Clock, MapPin, Tag } from 'lucide-react';

const ExperiencesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const experienceTypes = Array.from(new Set(mockExperiences.map(e => e.type)));
  
  const filteredExperiences = mockExperiences.filter(experience => {
    const matchesSearch = experience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experience.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || experience.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Extraordinary Experiences
          </h1>
          <p className="text-xl text-gray-600">
            Create unforgettable memories with our curated collection of unique experiences
          </p>
        </div>

        {/* Experience Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {experienceTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type === selectedType ? 'all' : type)}
              className={`p-4 rounded-lg text-center transition-colors ${
                type === selectedType
                  ? 'bg-[#8B1538] text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiences by name, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
          />
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map(experience => (
            <div
              key={experience.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={experience.images[0]}
                  alt={experience.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
                  ${experience.price}
                </div>
                <div className="absolute bottom-4 right-4 bg-[#8B1538] text-white px-2 py-1 rounded-full text-sm">
                  {experience.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{experience.duration}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{experience.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6B1028] transition-colors">
                    Book Experience
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No experiences found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage; 
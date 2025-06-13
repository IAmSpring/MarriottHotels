import React, { useState } from 'react';
import { mockAdventures } from '../data/mockData';
import { Search, Filter, Clock, MapPin } from 'lucide-react';

const AdventuresPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const difficulties = ['easy', 'moderate', 'challenging'];
  
  const filteredAdventures = mockAdventures.filter(adventure => {
    const matchesSearch = adventure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         adventure.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || adventure.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Extraordinary Adventures
          </h1>
          <p className="text-xl text-gray-600">
            Embark on unforgettable journeys with Marriott's curated adventures
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search adventures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
          </div>
          <div className="md:w-64">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Adventures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdventures.map(adventure => (
            <div
              key={adventure.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={adventure.images[0]}
                  alt={adventure.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
                  ${adventure.price}
                </div>
                <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-[#8B1538]">
                  {adventure.difficulty}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{adventure.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{adventure.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{adventure.duration}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{adventure.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {adventure.included.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6B1028] transition-colors">
                    Book Adventure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdventuresPage; 
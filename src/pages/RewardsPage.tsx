import React, { useState } from 'react';
import { mockRewards } from '../data/mockData';
import { Gift, Calendar, Filter, Search } from 'lucide-react';

const RewardsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const rewardTypes = Array.from(new Set(mockRewards.map(r => r.type)));

  const filteredRewards = mockRewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || reward.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Marriott Bonvoy Rewards
          </h1>
          <p className="text-xl text-gray-600">
            Earn points and enjoy exclusive benefits with every stay
          </p>
        </div>

        {/* Program Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-[#8B1538] mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Points</h3>
            <p className="text-gray-600">
              Earn up to 10 points for every dollar spent at our hotels
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-[#8B1538] mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Member Benefits</h3>
            <p className="text-gray-600">
              Enjoy exclusive rates, mobile check-in, and free Wi-Fi
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-[#8B1538] mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Redeem Rewards</h3>
            <p className="text-gray-600">
              Use points for free nights, upgrades, and unique experiences
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
          </div>
          <div className="md:w-64">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">All Rewards</option>
              {rewardTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Rewards
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRewards.map(reward => (
            <div
              key={reward.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{reward.name}</h3>
                  <div className="bg-[#8B1538] text-white px-3 py-1 rounded-full text-sm">
                    {reward.points.toLocaleString()} points
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{reward.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Valid until {new Date(reward.validUntil).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Terms:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {reward.terms.map((term, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-[#8B1538] text-white py-2 rounded-lg hover:bg-[#6B1028] transition-colors">
                    Redeem Reward
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No rewards found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage; 
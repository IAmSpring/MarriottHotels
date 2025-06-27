import React, { useState } from 'react';
import { mockHotels } from '../../data/mockData';

// Hotel Stats Component
const HotelStats = () => {
  const stats = [
    { label: 'Total Hotels', value: mockHotels.length },
    { label: 'Active Hotels', value: mockHotels.filter(h => h.status === 'ACTIVE').length },
    { label: 'Under Maintenance', value: mockHotels.filter(h => h.status === 'MAINTENANCE').length },
    { label: 'Average Rating', value: '4.5★' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// Hotel Actions Component
const HotelActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        Add New Hotel
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Generate Report
      </button>
    </div>
  );
};

// Hotel Filters Component
const HotelFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Search hotels..."
        className="px-4 py-2 border rounded-lg flex-grow"
      />
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Locations</option>
        <option value="new-york">New York</option>
        <option value="miami">Miami</option>
        <option value="los-angeles">Los Angeles</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="maintenance">Under Maintenance</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
};

// Hotel List Component
const HotelList = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rooms</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockHotels.map((hotel) => (
            <tr key={hotel.id}>
              <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{hotel.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">{hotel.rooms}</td>
              <td className="px-6 py-4 whitespace-nowrap">{hotel.rating}★</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  hotel.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : hotel.status === 'MAINTENANCE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hotel.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-[#8B1538] hover:text-[#6d102c] mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HotelsPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Hotels Management</h1>
      </div>
      <HotelStats />
      <HotelActions />
      <HotelFilters />
      <HotelList />
    </div>
  );
};

export default HotelsPage; 
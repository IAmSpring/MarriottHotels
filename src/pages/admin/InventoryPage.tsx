import React from 'react';
import { mockInventory } from '../../data/mockData';

// Inventory Stats Component
const InventoryStats = () => {
  const stats = [
    { label: 'Total Items', value: mockInventory.length },
    { label: 'Low Stock Items', value: mockInventory.filter(i => i.quantity <= i.reorderPoint).length },
    { label: 'Categories', value: new Set(mockInventory.map(i => i.category)).size },
    { label: 'Hotels', value: new Set(mockInventory.map(i => i.hotelName)).size },
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

// Inventory Actions Component
const InventoryActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        Add Item
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Export Inventory
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Generate Report
      </button>
    </div>
  );
};

// Inventory Filters Component
const InventoryFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Search items..."
        className="px-4 py-2 border rounded-lg flex-grow"
      />
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Hotels</option>
        <option value="downtown">Marriott Downtown</option>
        <option value="resort">Marriott Resort</option>
        <option value="city">Marriott City Center</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Categories</option>
        <option value="supplies">Supplies</option>
        <option value="equipment">Equipment</option>
        <option value="amenities">Amenities</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">Stock Level</option>
        <option value="low">Low Stock</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

// Inventory List Component
const InventoryList = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockInventory.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.hotelName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.quantity <= item.reorderPoint
                    ? 'bg-red-100 text-red-800'
                    : item.quantity <= item.reorderPoint * 2
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.quantity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item.reorderPoint}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-[#8B1538] hover:text-[#6d102c] mr-3">Update</button>
                <button className="text-blue-600 hover:text-blue-800">Reorder</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InventoryPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
      </div>
      <InventoryStats />
      <InventoryActions />
      <InventoryFilters />
      <InventoryList />
    </div>
  );
};

export default InventoryPage; 
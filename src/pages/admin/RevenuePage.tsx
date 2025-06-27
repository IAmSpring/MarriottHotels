import React from 'react';
import { mockRevenue } from '../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Revenue Stats Component
const RevenueStats = () => {
  const totalRevenue = mockRevenue.reduce((sum, r) => sum + r.amount, 0);
  const avgRevenue = totalRevenue / mockRevenue.length;
  const directRevenue = mockRevenue.filter(r => r.source === 'DIRECT').reduce((sum, r) => sum + r.amount, 0);
  const otaRevenue = mockRevenue.filter(r => r.source === 'OTA').reduce((sum, r) => sum + r.amount, 0);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
    { label: 'Average Daily Revenue', value: `$${avgRevenue.toLocaleString()}` },
    { label: 'Direct Bookings Revenue', value: `$${directRevenue.toLocaleString()}` },
    { label: 'OTA Revenue', value: `$${otaRevenue.toLocaleString()}` },
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

// Revenue Actions Component
const RevenueActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        Download Report
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Export Data
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Print Summary
      </button>
    </div>
  );
};

// Revenue Filters Component
const RevenueFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <select className="px-4 py-2 border rounded-lg">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Hotels</option>
        <option value="downtown">Marriott Downtown</option>
        <option value="resort">Marriott Resort</option>
        <option value="city">Marriott City Center</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Sources</option>
        <option value="DIRECT">Direct</option>
        <option value="OTA">OTA</option>
        <option value="CORPORATE">Corporate</option>
      </select>
      <input
        type="date"
        className="px-4 py-2 border rounded-lg"
      />
      <input
        type="date"
        className="px-4 py-2 border rounded-lg"
      />
    </div>
  );
};

// Revenue Charts Component
const RevenueCharts = () => {
  const COLORS = ['#8B1538', '#1E3A8A', '#047857'];

  const sourceData = [
    { name: 'Direct', value: mockRevenue.filter(r => r.source === 'DIRECT').reduce((sum, r) => sum + r.amount, 0) },
    { name: 'OTA', value: mockRevenue.filter(r => r.source === 'OTA').reduce((sum, r) => sum + r.amount, 0) },
    { name: 'Corporate', value: mockRevenue.filter(r => r.source === 'CORPORATE').reduce((sum, r) => sum + r.amount, 0) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8B1538" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Revenue by Source</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const RevenuePage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Revenue Analytics</h1>
      </div>
      <RevenueStats />
      <RevenueActions />
      <RevenueFilters />
      <RevenueCharts />
    </div>
  );
};

export default RevenuePage; 
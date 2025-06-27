import React from 'react';
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
} from 'recharts';
import {
  mockBookings,
  mockComplaints,
  mockHotels,
  mockInventory,
  mockMaintenanceRequests,
  mockRevenue,
  mockStaffSchedules,
  mockUsers,
} from '../../data/mockData';
import { ArrowRight, Brain, MessageSquare, Bot, Zap, Building2, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dashboard Components
const DashboardStats = () => {
  const stats = [
    { 
      label: 'Total Hotels', 
      value: mockHotels.length,
      icon: <Building2 className="w-6 h-6 text-[#8B1538]" />,
      link: '/admin/hotels'
    },
    { 
      label: 'Active Bookings', 
      value: mockBookings.filter(b => b.status === 'CONFIRMED').length,
      icon: <DollarSign className="w-6 h-6 text-[#8B1538]" />,
      link: '/admin/bookings'
    },
    { 
      label: 'Open Complaints', 
      value: mockComplaints.filter(c => c.status !== 'RESOLVED').length,
      icon: <AlertTriangle className="w-6 h-6 text-[#8B1538]" />,
      link: '/admin/complaints'
    },
    { 
      label: 'Staff Members', 
      value: mockUsers.length,
      icon: <Users className="w-6 h-6 text-[#8B1538]" />,
      link: '/admin/users'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Link key={index} to={stat.link} className="block">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const CompactAIOverview = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-[#8B1538] mr-2" />
          <h2 className="text-lg font-medium">AI Assistant Status</h2>
        </div>
        <Link
          to="/admin/ai"
          className="text-sm text-[#8B1538] hover:text-[#6d102c] flex items-center"
        >
          View AI Dashboard
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#8B1538]">99.2%</p>
          <p className="text-sm text-gray-600">Success Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#8B1538]">0.85s</p>
          <p className="text-sm text-gray-600">Avg Response</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#8B1538]">15.7k</p>
          <p className="text-sm text-gray-600">Daily Queries</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#8B1538]">8</p>
          <p className="text-sm text-gray-600">Active Models</p>
        </div>
      </div>
    </div>
  );
};

const RevenueChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Revenue Overview</h3>
        <Link
          to="/admin/revenue"
          className="text-sm text-[#8B1538] hover:text-[#6d102c] flex items-center"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
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
  );
};

const BookingTable = () => {
  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Bookings</h3>
        <Link
          to="/admin/bookings"
          className="text-sm text-[#8B1538] hover:text-[#6d102c] flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockBookings.slice(0, 5).map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.guestName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.hotelName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.checkIn}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MaintenanceList = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-medium">Maintenance Requests</h3>
        <Link
          to="/admin/maintenance"
          className="text-sm text-[#8B1538] hover:text-[#6d102c] flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockMaintenanceRequests.slice(0, 5).map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">{request.hotelName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.priority === 'HIGH'
                      ? 'bg-red-100 text-red-800'
                      : request.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {request.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hotel Operations Dashboard</h1>
        <p className="text-gray-600">Overview of all hotel operations and performance metrics</p>
      </div>
      <DashboardStats />
      <CompactAIOverview />
      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BookingTable />
        <MaintenanceList />
      </div>
    </>
  );
};

export default DashboardPage;
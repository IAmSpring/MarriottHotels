import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import {
  mockBookings,
  mockComplaints,
  mockHotels,
  mockInventory,
  mockMaintenanceRequests,
  mockRevenue,
  mockStaffSchedules,
  mockUsers,
} from '../data/mockData';
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
import UsersPage from './admin/UsersPage';

// Dashboard Components
const DashboardStats = () => {
  const stats = [
    { label: 'Total Hotels', value: mockHotels.length },
    { label: 'Active Bookings', value: mockBookings.filter(b => b.status === 'CONFIRMED').length },
    { label: 'Open Complaints', value: mockComplaints.filter(c => c.status !== 'RESOLVED').length },
    { label: 'Staff Members', value: mockUsers.length },
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

const RevenueChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
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
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Bookings</h3>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.checkIn.toLocaleDateString()}
                </td>
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
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Maintenance Requests</h3>
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

// Main Dashboard Page
const Dashboard = () => {
  return (
    <>
      <DashboardStats />
      <RevenueChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BookingTable />
        <MaintenanceList />
      </div>
    </>
  );
};

// Admin App
const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        {/* Add more routes for other admin pages */}
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp; 
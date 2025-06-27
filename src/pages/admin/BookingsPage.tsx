import React from 'react';
import { mockBookings } from '../../data/mockData';

// Booking Stats Component
const BookingStats = () => {
  const stats = [
    { label: 'Total Bookings', value: mockBookings.length },
    { label: 'Confirmed', value: mockBookings.filter(b => b.status === 'CONFIRMED').length },
    { label: 'Pending', value: mockBookings.filter(b => b.status === 'PENDING').length },
    { label: 'Today\'s Check-ins', value: mockBookings.filter(b => b.checkIn === new Date().toLocaleDateString()).length },
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

// Booking Actions Component
const BookingActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        New Booking
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Export Bookings
      </button>
    </div>
  );
};

// Booking Filters Component
const BookingFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Search bookings..."
        className="px-4 py-2 border rounded-lg flex-grow"
      />
      <input
        type="date"
        className="px-4 py-2 border rounded-lg"
      />
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Hotels</option>
        <option value="downtown">Marriott Downtown</option>
        <option value="resort">Marriott Resort</option>
        <option value="city">Marriott City Center</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Status</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="PENDING">Pending</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  );
};

// Booking List Component
const BookingList = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockBookings.map((booking) => (
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
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-[#8B1538] hover:text-[#6d102c] mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-800">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BookingsPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Bookings Management</h1>
      </div>
      <BookingStats />
      <BookingActions />
      <BookingFilters />
      <BookingList />
    </div>
  );
};

export default BookingsPage; 
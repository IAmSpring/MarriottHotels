import React, { useEffect } from 'react';
import { mockStaffSchedules, mockUsers } from '../../data/mockData';

// Staff Schedule Stats Component
const ScheduleStats = () => {
  console.log('Rendering ScheduleStats');
  const currentDate = new Date();
  const todaySchedules = mockStaffSchedules.filter(s => 
    new Date(s.date).toDateString() === currentDate.toDateString()
  );

  const stats = [
    { label: 'Total Staff', value: mockUsers.length },
    { label: 'On Duty Today', value: todaySchedules.length },
    { label: 'Morning Shift', value: todaySchedules.filter(s => s.shift === 'MORNING').length },
    { label: 'Night Shift', value: todaySchedules.filter(s => s.shift === 'NIGHT').length },
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

// Schedule Actions Component
const ScheduleActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        Create Schedule
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Export Schedule
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Send Notifications
      </button>
    </div>
  );
};

// Schedule Filters Component
const ScheduleFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Search staff..."
        className="px-4 py-2 border rounded-lg flex-grow"
      />
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Hotels</option>
        <option value="downtown">Marriott Downtown</option>
        <option value="resort">Marriott Resort</option>
        <option value="city">Marriott City Center</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Departments</option>
        <option value="housekeeping">Housekeeping</option>
        <option value="frontdesk">Front Desk</option>
        <option value="restaurant">Restaurant</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Shifts</option>
        <option value="MORNING">Morning</option>
        <option value="AFTERNOON">Afternoon</option>
        <option value="NIGHT">Night</option>
      </select>
      <input
        type="date"
        className="px-4 py-2 border rounded-lg"
      />
    </div>
  );
};

// Schedule Calendar Component
const ScheduleCalendar = () => {
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockStaffSchedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="px-6 py-4 whitespace-nowrap">{schedule.employeeName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{schedule.department}</td>
              <td className="px-6 py-4 whitespace-nowrap">{schedule.hotelName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{formatDate(schedule.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  schedule.shift === 'MORNING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : schedule.shift === 'AFTERNOON'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {schedule.shift}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-[#8B1538] hover:text-[#6d102c] mr-3">Edit</button>
                <button className="text-red-600 hover:text-red-800">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StaffSchedulePage = () => {
  useEffect(() => {
    console.log('StaffSchedulePage mounted');
    console.log('mockStaffSchedules:', mockStaffSchedules);
    console.log('mockUsers:', mockUsers);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Staff Schedule Management</h1>
      </div>
      <ScheduleStats />
      <ScheduleActions />
      <ScheduleFilters />
      <ScheduleCalendar />
    </div>
  );
};

export default StaffSchedulePage; 
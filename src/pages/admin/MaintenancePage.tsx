import React from 'react';
import { mockMaintenanceRequests } from '../../data/mockData';

// Maintenance Stats Component
const MaintenanceStats = () => {
  const stats = [
    { label: 'Total Requests', value: mockMaintenanceRequests.length },
    { label: 'High Priority', value: mockMaintenanceRequests.filter(m => m.priority === 'HIGH').length },
    { label: 'Medium Priority', value: mockMaintenanceRequests.filter(m => m.priority === 'MEDIUM').length },
    { label: 'Low Priority', value: mockMaintenanceRequests.filter(m => m.priority === 'LOW').length },
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

// Maintenance Actions Component
const MaintenanceActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        New Request
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Assign Staff
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Generate Report
      </button>
    </div>
  );
};

// Maintenance Filters Component
const MaintenanceFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Search requests..."
        className="px-4 py-2 border rounded-lg flex-grow"
      />
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Hotels</option>
        <option value="downtown">Marriott Downtown</option>
        <option value="resort">Marriott Resort</option>
        <option value="city">Marriott City Center</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Priority</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>
  );
};

// Maintenance List Component
const MaintenanceList = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockMaintenanceRequests.map((request) => (
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
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {request.assignedTo || 'Unassigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-[#8B1538] hover:text-[#6d102c] mr-3">Update</button>
                <button className="text-green-600 hover:text-green-800">Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MaintenancePage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Maintenance Management</h1>
      </div>
      <MaintenanceStats />
      <MaintenanceActions />
      <MaintenanceFilters />
      <MaintenanceList />
    </div>
  );
};

export default MaintenancePage; 
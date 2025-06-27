import React from 'react';
import { mockComplaints } from '../../data/mockData';

// Complaints Stats Component
const ComplaintStats = () => {
  const stats = [
    { label: 'Total Complaints', value: mockComplaints.length },
    { label: 'Open', value: mockComplaints.filter(c => c.status === 'OPEN').length },
    { label: 'In Progress', value: mockComplaints.filter(c => c.status === 'IN_PROGRESS').length },
    { label: 'High Priority', value: mockComplaints.filter(c => c.priority === 'HIGH').length },
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

// Complaints Actions Component
const ComplaintActions = () => {
  return (
    <div className="flex gap-4 mb-8">
      <button className="bg-[#8B1538] text-white px-4 py-2 rounded-lg hover:bg-[#6d102c]">
        Add Complaint
      </button>
      <button className="border border-[#8B1538] text-[#8B1538] px-4 py-2 rounded-lg hover:bg-[#8B1538] hover:text-white">
        Generate Report
      </button>
    </div>
  );
};

// Complaints Filters Component
const ComplaintFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Search complaints..."
        className="px-4 py-2 border rounded-lg flex-grow"
      />
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Hotels</option>
        <option value="downtown">Marriott Downtown</option>
        <option value="resort">Marriott Resort</option>
        <option value="city">Marriott City Center</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Status</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>
      <select className="px-4 py-2 border rounded-lg">
        <option value="">All Priority</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>
  );
};

// Complaints List Component
const ComplaintList = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockComplaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="px-6 py-4 whitespace-nowrap">{complaint.hotelName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{complaint.guestName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{complaint.issue}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  complaint.status === 'OPEN'
                    ? 'bg-red-100 text-red-800'
                    : complaint.status === 'IN_PROGRESS'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {complaint.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  complaint.priority === 'HIGH'
                    ? 'bg-red-100 text-red-800'
                    : complaint.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {complaint.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-[#8B1538] hover:text-[#6d102c] mr-3">Update</button>
                <button className="text-green-600 hover:text-green-800">Resolve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ComplaintsPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Complaints Management</h1>
      </div>
      <ComplaintStats />
      <ComplaintActions />
      <ComplaintFilters />
      <ComplaintList />
    </div>
  );
};

export default ComplaintsPage; 
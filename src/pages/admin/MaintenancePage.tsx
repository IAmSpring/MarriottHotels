import React, { useState } from 'react';

interface MaintenanceIssue {
  id: string;
  hotelName: string;
  roomNumber: string;
  issue: string;
  priority: string;
  status: string;
  assignedTo: string;
  reportedDate: string;
}

const mockIssues: MaintenanceIssue[] = [
  {
    id: '1',
    hotelName: 'The Ritz-Carlton Miami Beach',
    roomNumber: '301',
    issue: 'AC not working properly',
    priority: 'High',
    status: 'Open',
    assignedTo: 'John Smith',
    reportedDate: '2024-03-15'
  },
  {
    id: '2',
    hotelName: 'JW Marriott Aspen Snowmass',
    roomNumber: '205',
    issue: 'Leaking faucet in bathroom',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Mike Johnson',
    reportedDate: '2024-03-14'
  },
  {
    id: '3',
    hotelName: 'Marriott Marquis New York',
    roomNumber: '1205',
    issue: 'TV remote not working',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Sarah Wilson',
    reportedDate: '2024-03-13'
  }
];

const MaintenancePage: React.FC = () => {
  const [issues, setIssues] = useState<MaintenanceIssue[]>(mockIssues);
  const [filter, setFilter] = useState('all');

  const filteredIssues = filter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status.toLowerCase() === filter);

  const handleStatusChange = (issueId: string, newStatus: string) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Issues</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg ${filter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('in progress')}
            className={`px-4 py-2 rounded-lg ${filter === 'in progress' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg ${filter === 'resolved' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIssues.map((issue) => (
              <tr key={issue.id}>
                <td className="px-6 py-4 whitespace-nowrap">{issue.hotelName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{issue.roomNumber}</td>
                <td className="px-6 py-4">{issue.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${issue.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    className="rounded border-gray-300"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{issue.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{issue.reportedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenancePage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/bookings')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Bookings
        </button>
        <button
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B1538] hover:bg-[#6B1028]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsPage; 
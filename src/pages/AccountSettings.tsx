import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('marriott_user_name') || 'John Doe';
  const userEmail = localStorage.getItem('marriott_user_email') || 'john@example.com';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      defaultValue={userName}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B1538] focus:ring-[#8B1538]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={userEmail}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B1538] focus:ring-[#8B1538]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="marketing"
                      type="checkbox"
                      className="h-4 w-4 text-[#8B1538] focus:ring-[#8B1538] border-gray-300 rounded"
                    />
                    <label htmlFor="marketing" className="ml-2 block text-sm text-gray-700">
                      Receive marketing emails about special offers
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="notifications"
                      type="checkbox"
                      className="h-4 w-4 text-[#8B1538] focus:ring-[#8B1538] border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                      Receive booking notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
            <button
              onClick={() => navigate('/bookings')}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Save changes logic would go here
                alert('Changes saved successfully!');
                navigate('/bookings');
              }}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#8B1538] hover:bg-[#6B1028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 
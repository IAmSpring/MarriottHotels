import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_HOTELS = gql`
  query GetHotels {
    hotels {
      id
      name
      location
      address
      description
      imageUrl
      rating
      amenities {
        id
        name
        category
        description
      }
      rooms {
        id
        type
        description
        price
        capacity
        available
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      bonvoyNumber
      bonvoyPoints
      bonvoyStatus
      createdAt
      updatedAt
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      bonvoyNumber
      bonvoyPoints
      bonvoyStatus
    }
  }
`;

const GraphQLPlayground: React.FC = () => {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [mutationResult, setMutationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { loading: hotelsLoading, data: hotelsData, error: hotelsError } = useQuery(GET_HOTELS);
  const { loading: usersLoading, data: usersData, error: usersError } = useQuery(GET_USERS);
  
  const [createUser, { loading: createUserLoading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      setMutationResult(data);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleCreateUser = () => {
    const userInput = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'USER',
      bonvoyNumber: `BV${Date.now()}`,
      bonvoyPoints: 0,
      bonvoyStatus: 'MEMBER'
    };

    createUser({ variables: { input: userInput } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            GraphQL Playground
          </h1>
          <p className="text-lg text-gray-600">
            Test your GraphQL schema with real Prisma data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hotels Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Hotels</h2>
            {hotelsLoading && <p className="text-gray-500">Loading hotels...</p>}
            {hotelsError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error: {hotelsError.message}</p>
              </div>
            )}
            {hotelsData && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Found {hotelsData.hotels?.length || 0} hotels
                </p>
                <div className="max-h-96 overflow-y-auto">
                  {hotelsData.hotels?.map((hotel: any) => (
                    <div key={hotel.id} className="border rounded-md p-3 mb-3">
                      <h3 className="font-medium">{hotel.name}</h3>
                      <p className="text-sm text-gray-600">{hotel.location}</p>
                      <p className="text-sm text-gray-600">Rating: {hotel.rating}</p>
                      <p className="text-sm text-gray-600">
                        Rooms: {hotel.rooms?.length || 0} | Amenities: {hotel.amenities?.length || 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Users Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            {usersLoading && <p className="text-gray-500">Loading users...</p>}
            {usersError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error: {usersError.message}</p>
              </div>
            )}
            {usersData && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Found {usersData.users?.length || 0} users
                </p>
                <div className="max-h-96 overflow-y-auto">
                  {usersData.users?.map((user: any) => (
                    <div key={user.id} className="border rounded-md p-3 mb-3">
                      <h3 className="font-medium">{user.name || 'No name'}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">Role: {user.role}</p>
                      <p className="text-sm text-gray-600">
                        Bonvoy: {user.bonvoyNumber || 'N/A'} ({user.bonvoyStatus})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mutation Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mutations</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Create User</h3>
              <button
                onClick={handleCreateUser}
                disabled={createUserLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createUserLoading ? 'Creating...' : 'Create Test User'}
              </button>
            </div>

            {mutationResult && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="font-medium text-green-800 mb-2">User Created Successfully!</h4>
                <pre className="text-sm text-green-700 overflow-x-auto">
                  {JSON.stringify(mutationResult, null, 2)}
                </pre>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h4 className="font-medium text-red-800 mb-2">Mutation Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Schema Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Schema Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Available Types</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• User</li>
                <li>• Hotel</li>
                <li>• Room</li>
                <li>• Amenity</li>
                <li>• Restaurant</li>
                <li>• Reservation</li>
                <li>• Experience</li>
                <li>• ExperienceBooking</li>
                <li>• Booking</li>
                <li>• Order</li>
                <li>• Review</li>
                <li>• Conversation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Query Examples</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• users</li>
                <li>• hotels</li>
                <li>• rooms</li>
                <li>• amenities</li>
                <li>• restaurants</li>
                <li>• bookings</li>
                <li>• reviews</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Mutation Examples</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• createUser</li>
                <li>• createHotel</li>
                <li>• createBooking</li>
                <li>• createReview</li>
                <li>• updateUser</li>
                <li>• deleteUser</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphQLPlayground; 
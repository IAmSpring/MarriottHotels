import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Clock, Download, Phone, Mail, CreditCard } from 'lucide-react';
import Footer from '../components/Footer';

interface Booking {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  image: string;
  confirmationNumber: string;
  rating?: number;
  amenities: string[];
}

const BookingsPage = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('marriott_user_logged_in') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Get user info
    const userName = localStorage.getItem('marriott_user_name') || 'John Doe';
    const userEmail = localStorage.getItem('marriott_user_email') || 'john@example.com';
    setUser({ name: userName, email: userEmail });

    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: '1',
        hotelName: 'The Ritz-Carlton Miami Beach',
        location: 'Miami Beach, FL',
        checkIn: '2025-02-15',
        checkOut: '2025-02-18',
        guests: 2,
        rooms: 1,
        totalPrice: 1260,
        status: 'confirmed',
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        confirmationNumber: 'MAR123456789',
        amenities: ['Ocean View', 'Spa', 'Pool', 'Restaurant']
      },
      {
        id: '2',
        hotelName: 'JW Marriott Aspen Snowmass',
        location: 'Aspen, CO',
        checkIn: '2025-03-10',
        checkOut: '2025-03-14',
        guests: 4,
        rooms: 2,
        totalPrice: 2800,
        status: 'confirmed',
        image: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        confirmationNumber: 'MAR987654321',
        amenities: ['Ski Access', 'Spa', 'Restaurant', 'Gym']
      },
      {
        id: '3',
        hotelName: 'Marriott Marquis New York',
        location: 'Manhattan, NY',
        checkIn: '2024-12-20',
        checkOut: '2024-12-23',
        guests: 2,
        rooms: 1,
        totalPrice: 945,
        status: 'completed',
        image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
        confirmationNumber: 'MAR456789123',
        rating: 4.5,
        amenities: ['City View', 'Business Center', 'Restaurant', 'Gym']
      }
    ];

    setBookings(mockBookings);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('marriott_user_logged_in');
    localStorage.removeItem('marriott_user_email');
    localStorage.removeItem('marriott_user_name');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      
      switch (selectedTab) {
        case 'upcoming':
          return checkInDate > now && booking.status !== 'cancelled';
        case 'past':
          return checkOutDate < now && booking.status !== 'cancelled';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const filteredBookings = filterBookings();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user.name}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Account Settings
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.checkIn) > new Date() && b.status !== 'cancelled').length },
                { id: 'past', label: 'Past Stays', count: bookings.filter(b => new Date(b.checkOut) < new Date() && b.status !== 'cancelled').length },
                { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-[#8B1538] text-[#8B1538]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'upcoming' && "You don't have any upcoming reservations."}
              {selectedTab === 'past' && "You don't have any past stays."}
              {selectedTab === 'cancelled' && "You don't have any cancelled bookings."}
            </p>
            <button 
              onClick={() => navigate('/hotels')}
              className="px-6 py-3 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B1028] transition-colors"
            >
              Book Your Next Stay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Hotel Image */}
                  <div className="md:w-1/3">
                    <img 
                      src={booking.image} 
                      alt={booking.hotelName}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  {/* Booking Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.hotelName}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{booking.guests} guests, {booking.rooms} room{booking.rooms > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <div className="text-2xl font-bold text-gray-900 mt-2">
                          ${booking.totalPrice}
                        </div>
                        <div className="text-sm text-gray-600">total</div>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {booking.amenities.map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    {/* Confirmation Number */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-sm text-gray-600">Confirmation Number</div>
                      <div className="font-mono font-semibold text-gray-900">{booking.confirmationNumber}</div>
                    </div>
                    
                    {/* Rating (for completed stays) */}
                    {booking.rating && (
                      <div className="flex items-center mb-4">
                        <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm font-semibold">{booking.rating}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </button>
                      
                      {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                        <>
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            <Calendar className="h-4 w-4 mr-2" />
                            Modify Booking
                          </button>
                          <button className="flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors">
                            Cancel Booking
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'completed' && !booking.rating && (
                        <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] transition-colors">
                          <Star className="h-4 w-4 mr-2" />
                          Rate Your Stay
                        </button>
                      )}
                      
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Hotel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/hotels')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-[#8B1538] rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Book Another Stay</div>
                <div className="text-sm text-gray-600">Find your next perfect hotel</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Bonvoy Points</div>
                <div className="text-sm text-gray-600">View your rewards balance</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Customer Support</div>
                <div className="text-sm text-gray-600">Get help with your booking</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;
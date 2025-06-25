import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Heart, MapPin, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, userName, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleBookingsClick = () => {
    if (isLoggedIn) {
      navigate('/bookings');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm bg-[#8B1538]/[0.10] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B1538] to-[#A91B47] rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#8B1538]">Marriott</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-[#8B1538] bg-red-50' 
                  : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/hotels') 
                  ? 'text-[#8B1538] bg-red-50' 
                  : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
              }`}
            >
              Search Hotels
            </Link>
            <Link
              to="/deals"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/deals') 
                  ? 'text-[#8B1538] bg-red-50' 
                  : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
              }`}
            >
              Deals
            </Link>
            <button
              onClick={handleBookingsClick}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/bookings') 
                  ? 'text-[#8B1538] bg-red-50' 
                  : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
              }`}
            >
              My Bookings
            </button>
            {isLoggedIn && isAdmin() && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'text-[#8B1538] bg-red-50' 
                    : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-[#8B1538] transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/account-settings')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-[#8B1538] transition-colors"
                >
                  {isAdmin() ? (
                    <Settings className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{userName}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-[#8B1538] rounded-lg hover:bg-[#6B1028] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-[#8B1538] transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
                <button className="px-6 py-2 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B1028] transition-colors">
                  Join Bonvoy
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#8B1538] transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-[#8B1538] bg-red-50' 
                    : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/hotels"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/hotels') 
                    ? 'text-[#8B1538] bg-red-50' 
                    : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Search Hotels
              </Link>
              <Link
                to="/deals"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/deals') 
                    ? 'text-[#8B1538] bg-red-50' 
                    : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <button
                onClick={() => {
                  handleBookingsClick();
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/bookings') 
                    ? 'text-[#8B1538] bg-red-50' 
                    : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
                }`}
              >
                My Bookings
              </button>
              {isLoggedIn && isAdmin() && (
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'text-[#8B1538] bg-red-50' 
                      : 'text-gray-700 hover:text-[#8B1538] hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
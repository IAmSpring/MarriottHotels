import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { trpc } from '../utils/trpc';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = trpc.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // Login successful
      login(result.user.email, result.user.name || result.user.email, result.user.role);
      
      // Redirect based on role
      if (result.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/bookings');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'user') => {
    const credentials = type === 'admin' 
      ? { email: 'admin@test.com', password: 'admin123' }
      : { email: 'user@test.com', password: 'user123' };
    
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password
    }));

    try {
      const result = await loginMutation.mutateAsync({
        email: credentials.email,
        password: credentials.password,
      });

      // Login successful
      login(result.user.email, result.user.name || result.user.email, result.user.role);
      
      // Redirect based on role
      if (result.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/bookings');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B1538] to-[#A91B47] rounded-2xl flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Join Marriott Bonvoy'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Sign in to access your bookings and rewards' 
              : 'Create your account to start earning points'
            }
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#8B1538] focus:ring-[#8B1538] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#8B1538] hover:text-[#6B1028]">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#8B1538] hover:bg-[#6B1028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538] transition-colors duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[#8B1538] hover:text-[#6B1028]"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Demo Account Buttons */}
          {isLogin && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full flex justify-center py-2 px-4 border border-[#8B1538] rounded-md shadow-sm text-sm font-medium text-[#8B1538] hover:bg-[#8B1538] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538]"
              >
                Login as Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538]"
              >
                Login as User
              </button>
            </div>
          )}
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              Google
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Facebook</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
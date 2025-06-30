import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { trpcClient, queryClient } from '../utils/trpc';
import useLoadingStore from '../utils/loadingManager';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import Home from '../pages/Home';
import HotelDetails from '../pages/HotelDetails';
import HotelsPage from '../pages/HotelsPage';
import DealsPage from '../pages/DealsPage';
import BookingsPage from '../pages/BookingsPage';
import LoginPage from '../pages/LoginPage';
import DiningPage from '../pages/DiningPage';
import RestaurantDetails from '../pages/RestaurantDetails';
import AdventuresPage from '../pages/AdventuresPage';
import BoutiquePage from '../pages/BoutiquePage';
import RewardsPage from '../pages/RewardsPage';
import ExperiencesPage from '../pages/ExperiencesPage';
import ExperienceDetails from '../pages/ExperienceDetails';
import DestinationsPage from '../pages/DestinationsPage';
import DestinationDetails from '../pages/DestinationDetails';
import AppPage from '../pages/AppPage';
import AIChatBot from './AIChatBot';
import { NavigationProvider } from '../contexts/NavigationContext';
import { NavigationController } from './NavigationController';
import { NavigationLogViewer } from './NavigationLogViewer';

const AppWrapper: React.FC = () => {
  const { isLoading, setIsLoading } = useLoadingStore();

  useEffect(() => {
    // Track when all resources are loaded
    const handleLoad = () => {
      // Add a small delay for smoother transition
      setTimeout(() => setIsLoading(false), 2000);
    };

    // Wait for window load event
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [setIsLoading]);

  return (
    <NavigationProvider>
      <LoadingScreen isLoading={isLoading} />
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/hotels" element={<HotelsPage />} />
                  <Route path="/hotels/:id" element={<HotelDetails />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dining" element={<DiningPage />} />
                  <Route path="/dining/:id" element={<RestaurantDetails />} />
                  <Route path="/adventures" element={<AdventuresPage />} />
                  <Route path="/boutique" element={<BoutiquePage />} />
                  <Route path="/rewards" element={<RewardsPage />} />
                  <Route path="/experiences" element={<ExperiencesPage />} />
                  <Route path="/experiences/:id" element={<ExperienceDetails />} />
                  <Route path="/destinations" element={<DestinationsPage />} />
                  <Route path="/destinations/:id" element={<DestinationDetails />} />
                  <Route path="/app" element={<AppPage />} />
                </Routes>
                <AIChatBot />
              </div>
            </Router>
            <NavigationController />
            <NavigationLogViewer />
          </QueryClientProvider>
        </trpc.Provider>
      </div>
    </NavigationProvider>
  );
};

export default AppWrapper; 
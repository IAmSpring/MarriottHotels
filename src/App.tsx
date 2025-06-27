import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';
import { trpcClient, queryClient } from './utils/trpc';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import HotelsPage from './pages/HotelsPage';
import DealsPage from './pages/DealsPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import DiningPage from './pages/DiningPage';
import RestaurantDetails from './pages/RestaurantDetails';
import AdventuresPage from './pages/AdventuresPage';
import BoutiquePage from './pages/BoutiquePage';
import RewardsPage from './pages/RewardsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ExperienceDetails from './pages/ExperienceDetails';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetails from './pages/DestinationDetails';
import AppPage from './pages/AppPage';
import AIChatBot from './components/AIChatBot';
import DocsPage from './pages/DocsPage';
import AccountSettings from './pages/AccountSettings';
import TourController from './components/TourController';
import AdminApp from './pages/admin';

// Wrapper component to handle conditional rendering of TourController
const TourControllerWrapper = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  return isHomePage ? (
    <div style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 9999, pointerEvents: 'auto' }}>
      <TourController />
    </div>
  ) : null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Router basename="/MarriottHotels">
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/account-settings" element={<AccountSettings />} />
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
                <Route path="/docs/*" element={<DocsPage />} />
                <Route path="/admin/*" element={<AdminApp />} />
              </Routes>
              <TourControllerWrapper />
              <AIChatBot />
            </div>
          </Router>
        </QueryClientProvider>
      </trpc.Provider>
    </AuthProvider>
  );
};

export default App;
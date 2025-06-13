import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';
import { trpcClient, queryClient } from './utils/trpc';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import HotelsPage from './pages/HotelsPage';
import DealsPage from './pages/DealsPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import DiningPage from './pages/DiningPage';
import AdventuresPage from './pages/AdventuresPage';
import BoutiquePage from './pages/BoutiquePage';
import RewardsPage from './pages/RewardsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import DestinationsPage from './pages/DestinationsPage';
import AppPage from './pages/AppPage';

console.log('App.tsx: Starting to initialize...');

const App: React.FC = () => {
  console.log('App.tsx: Rendering component');
  return (
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
              <Route path="/adventures" element={<AdventuresPage />} />
              <Route path="/boutique" element={<BoutiquePage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/app" element={<AppPage />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
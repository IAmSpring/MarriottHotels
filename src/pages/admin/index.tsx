import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import BookingsPage from './BookingsPage';
import HotelsPage from './HotelsPage';
import ComplaintsPage from './ComplaintsPage';
import MaintenancePage from './MaintenancePage';
import StaffSchedulePage from './StaffSchedulePage';
import InventoryPage from './InventoryPage';
import RevenuePage from './RevenuePage';
import AIRoutes from './AIRoutes';

const AdminApp = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  // Redirect to login if not authenticated or not an admin
  if (!isLoggedIn || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        {/* Main admin routes */}
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="staff" element={<StaffSchedulePage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="revenue" element={<RevenuePage />} />
        
        {/* AI admin routes */}
        <Route path="ai/*" element={<AIRoutes />} />
        
        {/* Catch-all redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp; 
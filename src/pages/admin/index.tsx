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
import ApolloMCPDashboard from './apollo-mcp';
import ApolloMCPOperations from './apollo-mcp/operations';
import ApolloMCPSchema from './apollo-mcp/schema';
import ApolloMCPPlayground from './apollo-mcp/playground';
import ApolloMCPAnalytics from './apollo-mcp/analytics';
import ApolloMCPMonitoring from './apollo-mcp/monitoring';
import ApolloMCPLogs from './apollo-mcp/logs';
import ApolloMCPTest from './apollo-mcp/test';

const AdminApp = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  // Temporarily bypass authentication for debugging
  // TODO: Remove this after fixing the routing issue
  const bypassAuth = true;

  // Redirect to login if not authenticated or not an admin
  if (!bypassAuth && (!isLoggedIn || !isAdmin())) {
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
        
        {/* Apollo MCP routes */}
        <Route path="apollo-mcp" element={<ApolloMCPDashboard />} />
        <Route path="apollo-mcp/test" element={<ApolloMCPTest />} />
        <Route path="apollo-mcp/operations" element={<ApolloMCPOperations />} />
        <Route path="apollo-mcp/schema" element={<ApolloMCPSchema />} />
        <Route path="apollo-mcp/playground" element={<ApolloMCPPlayground />} />
        <Route path="apollo-mcp/analytics" element={<ApolloMCPAnalytics />} />
        <Route path="apollo-mcp/monitoring" element={<ApolloMCPMonitoring />} />
        <Route path="apollo-mcp/logs" element={<ApolloMCPLogs />} />
        
        {/* Catch-all redirect to dashboard - only for unmatched admin routes */}
        {/* <Route path="*" element={<Navigate to="." replace />} /> */}
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp; 
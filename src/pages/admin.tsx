import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import {
  AssistantsPage,
  ConversationsPage,
  DashboardPage as AIDashboardPage,
  InfrastructurePage,
  LogsPage,
  ModelsPage,
  MonitoringPage,
  NewAssistantPage,
  PerformancePage,
  SearchPage,
  StoragePage,
  TrainingPage,
} from './admin/ai';
import DashboardPage from './admin/DashboardPage';
import BookingsPage from './admin/BookingsPage';
import ComplaintsPage from './admin/ComplaintsPage';
import HotelsPage from './admin/HotelsPage';
import InventoryPage from './admin/InventoryPage';
import MaintenancePage from './admin/MaintenancePage';
import RevenuePage from './admin/RevenuePage';
import StaffSchedulePage from './admin/StaffSchedulePage';
import UsersPage from './admin/UsersPage';

const AdminRouter: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Main Admin Routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/staff" element={<StaffSchedulePage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* AI Admin Routes */}
        <Route path="/ai" element={<AIDashboardPage />} />
        <Route path="/ai/logs" element={<LogsPage />} />
        <Route path="/ai/models" element={<ModelsPage />} />
        <Route path="/ai/training" element={<TrainingPage />} />
        <Route path="/ai/search" element={<SearchPage />} />
        <Route path="/ai/storage" element={<StoragePage />} />
        <Route path="/ai/infrastructure" element={<InfrastructurePage />} />
        <Route path="/ai/assistants" element={<AssistantsPage />} />
        <Route path="/ai/assistants/new" element={<NewAssistantPage />} />
        <Route path="/ai/assistants/:assistantId/conversations" element={<ConversationsPage />} />
        <Route path="/ai/conversations" element={<ConversationsPage />} />
        <Route path="/ai/monitoring" element={<MonitoringPage />} />
        <Route path="/ai/performance" element={<PerformancePage />} />

        {/* Catch any unmatched routes and redirect to admin dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRouter; 
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  DashboardPage as AIDashboardPage,
  LogsPage,
  PerformancePage,
  ModelsPage,
  TrainingPage,
  AssistantsPage,
  NewAssistantPage,
  ConversationsPage,
  SearchPage,
  StoragePage,
  InfrastructurePage,
} from './ai';

const AIRoutes = () => {
  return (
    <Routes>
      {/* AI Dashboard */}
      <Route index element={<AIDashboardPage />} />
      
      {/* AI Management Routes */}
      <Route path="logs" element={<LogsPage />} />
      <Route path="performance" element={<PerformancePage />} />
      <Route path="models" element={<ModelsPage />} />
      <Route path="training" element={<TrainingPage />} />
      <Route path="assistants" element={<AssistantsPage />} />
      <Route path="new-assistant" element={<NewAssistantPage />} />
      <Route path="conversations" element={<ConversationsPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="storage" element={<StoragePage />} />
      <Route path="infrastructure" element={<InfrastructurePage />} />
      
      {/* Catch-all redirect to AI dashboard */}
      <Route path="*" element={<Navigate to="/admin/ai" replace />} />
    </Routes>
  );
};

export default AIRoutes; 
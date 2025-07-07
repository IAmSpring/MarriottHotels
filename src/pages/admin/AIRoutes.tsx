import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AssistantsPage from './ai/AssistantsPage';
import ConversationsPage from './ai/ConversationsPage';
import DashboardPage from './ai/DashboardPage';
import InfrastructurePage from './ai/InfrastructurePage';
import LogsPage from './ai/LogsPage';
import ModelsPage from './ai/ModelsPage';
import MonitoringPage from './ai/MonitoringPage';
import NewAssistantPage from './ai/NewAssistantPage';
import PerformancePage from './ai/PerformancePage';
import SearchPage from './ai/SearchPage';
import StoragePage from './ai/StoragePage';
import TrainingPage from './ai/TrainingPage';
import TracingPage from './ai/TracingPage';

const AIRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/assistants" element={<AssistantsPage />} />
      <Route path="/assistants/new" element={<NewAssistantPage />} />
      <Route path="/conversations" element={<ConversationsPage />} />
      <Route path="/infrastructure" element={<InfrastructurePage />} />
      <Route path="/logs" element={<LogsPage />} />
      <Route path="/models" element={<ModelsPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/performance" element={<PerformancePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/storage" element={<StoragePage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/tracing" element={<TracingPage />} />
    </Routes>
  );
};

export default AIRoutes; 
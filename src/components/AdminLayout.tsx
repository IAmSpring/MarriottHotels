import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Book, Box, Database, HardDrive, Home, MessageSquare, Monitor, Search, Settings, Terminal, Users, LineChart, GitBranch } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/admin/bookings', icon: <Book size={20} />, label: 'Bookings' },
    { path: '/admin/hotels', icon: <Box size={20} />, label: 'Hotels' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/revenue', icon: <Activity size={20} />, label: 'Revenue' },
    { path: '/admin/maintenance', icon: <Settings size={20} />, label: 'Maintenance' },
    { path: '/admin/complaints', icon: <MessageSquare size={20} />, label: 'Complaints' },
    { path: '/admin/inventory', icon: <Database size={20} />, label: 'Inventory' },
    { path: '/admin/staff', icon: <Users size={20} />, label: 'Staff Schedule' },
    { 
      label: 'AI Management',
      children: [
        { path: '/admin/ai', icon: <Terminal size={20} />, label: 'Dashboard' },
        { path: '/admin/ai/assistants', icon: <MessageSquare size={20} />, label: 'Assistants' },
        { path: '/admin/ai/conversations', icon: <MessageSquare size={20} />, label: 'Conversations' },
        { path: '/admin/ai/models', icon: <Box size={20} />, label: 'Models' },
        { path: '/admin/ai/monitoring', icon: <Monitor size={20} />, label: 'Monitoring' },
        { path: '/admin/ai/performance', icon: <Activity size={20} />, label: 'Performance' },
        { path: '/admin/ai/infrastructure', icon: <HardDrive size={20} />, label: 'Infrastructure' },
        { path: '/admin/ai/logs', icon: <Terminal size={20} />, label: 'Logs' },
        { path: '/admin/ai/search', icon: <Search size={20} />, label: 'Search' },
        { path: '/admin/ai/storage', icon: <Database size={20} />, label: 'Storage' },
        { path: '/admin/ai/training', icon: <LineChart size={20} />, label: 'Training' },
        { path: '/admin/ai/tracing', icon: <GitBranch size={20} />, label: 'Tracing' }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold">Marriott Admin</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item, index) => (
            item.children ? (
              <div key={index} className="mb-4">
                <div className="px-4 py-2 text-sm font-medium text-gray-600">
                  {item.label}
                </div>
                <div className="ml-4">
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.path}
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive(child.path)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {child.icon}
                      <span className="ml-3">{child.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout; 
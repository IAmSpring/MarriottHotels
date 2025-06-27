import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Building2,
  AlertCircle,
  Wrench,
  ClipboardList,
  Package,
  LogOut,
  DollarSign,
  Brain,
  Database,
  Bot,
  LineChart,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/bookings', icon: CalendarDays, label: 'Bookings' },
    { path: '/admin/hotels', icon: Building2, label: 'Hotels' },
    { path: '/admin/complaints', icon: AlertCircle, label: 'Complaints' },
    { path: '/admin/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/admin/staff', icon: ClipboardList, label: 'Staff Schedule' },
    { path: '/admin/inventory', icon: Package, label: 'Inventory' },
    { path: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
    // AI Section
    { type: 'divider', label: 'AI Management' },
    { path: '/admin/ai', icon: Brain, label: 'AI Dashboard' },
    { path: '/admin/ai/storage', icon: Database, label: 'Vector Storage' },
    { path: '/admin/ai/assistants', icon: Bot, label: 'AI Assistants' },
    { path: '/admin/ai/performance', icon: LineChart, label: 'AI Performance' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#8B1538] text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Marriott Admin</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            item.type === 'divider' ? (
              <div key={index} className="px-6 py-3">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {item.label}
                </h3>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-[#6B1028] text-white'
                    : 'text-gray-300 hover:bg-[#6B1028] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <Link
              to="/admin/logout"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout; 
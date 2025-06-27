import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  AlertTriangle,
  Building2,
  Package,
  Wrench,
  DollarSign,
  Users,
  Clock,
  Bot,
  Database,
  Activity,
  Brain,
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
        isActive
          ? 'bg-[#8B1538] text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`,
      })}
      {label}
    </NavLink>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAISection = location.pathname.startsWith('/admin/ai');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-[#8B1538]">Marriott Admin</h1>
          </div>

          <nav className="space-y-1">
            <NavItem to="/admin" icon={<LayoutDashboard />} label="Dashboard" />
            <NavItem to="/admin/bookings" icon={<CalendarCheck />} label="Bookings" />
            <NavItem to="/admin/complaints" icon={<AlertTriangle />} label="Complaints" />
            <NavItem to="/admin/hotels" icon={<Building2 />} label="Hotels" />
            <NavItem to="/admin/inventory" icon={<Package />} label="Inventory" />
            <NavItem to="/admin/maintenance" icon={<Wrench />} label="Maintenance" />
            <NavItem to="/admin/revenue" icon={<DollarSign />} label="Revenue" />
            <NavItem to="/admin/staff" icon={<Clock />} label="Staff Schedule" />
            <NavItem to="/admin/users" icon={<Users />} label="Users" />

            <div className="pt-4 mt-4 border-t">
              <h2 className="px-4 mb-2 text-xs font-semibold text-gray-600 uppercase">AI Management</h2>
              <NavItem to="/admin/ai" icon={<Brain />} label="AI Dashboard" />
              <NavItem to="/admin/ai/assistants" icon={<Bot />} label="Assistants" />
              <NavItem to="/admin/ai/storage" icon={<Database />} label="Storage" />
              <NavItem to="/admin/ai/performance" icon={<Activity />} label="Performance" />
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Breadcrumb or section title could go here */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, NavItem } from '@/shared/components/Sidebar';
import { LayoutDashboard, Users, Layers, Eye } from 'lucide-react';

const adminNav: NavItem[] = [
  { label: 'Admin Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'User Directory', to: '/admin/users', icon: Users, badge: 'Phase 1' },
  { label: 'Batch Setup', to: '/admin/batches', icon: Layers, badge: 'Phase 2' },
  { label: 'View As Student', to: '/admin/impersonate', icon: Eye, badge: 'Phase 6' },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-1">
      <Sidebar items={adminNav} portalName="Admin Portal" accentColor="rose" />
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

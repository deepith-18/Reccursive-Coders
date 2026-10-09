import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, NavItem } from '@/shared/components/Sidebar';
import { LayoutDashboard, Users, FilePlus } from 'lucide-react';

const trainerNav: NavItem[] = [
  { label: 'Trainer Dashboard', to: '/trainer', icon: LayoutDashboard },
  { label: 'Batch Manager', to: '/trainer/batches', icon: Users, badge: 'Phase 2' },
  { label: 'Question Builder', to: '/trainer/questions', icon: FilePlus, badge: 'Phase 3' },
];

export const TrainerLayout: React.FC = () => {
  return (
    <div className="flex flex-1">
      <Sidebar items={trainerNav} portalName="Trainer Portal" accentColor="purple" />
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

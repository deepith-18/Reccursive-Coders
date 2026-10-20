import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, NavItem } from '@/shared/components/Sidebar';
import { LayoutDashboard, Users, FilePlus, Trophy, Briefcase, ShieldAlert } from 'lucide-react';

const trainerNav: NavItem[] = [
  { label: 'Trainer Dashboard', to: '/trainer', icon: LayoutDashboard },
  { label: 'Batch Manager', to: '/trainer/batches', icon: Users, badge: 'Cohorts' },
  { label: 'Question Builder', to: '/trainer/questions', icon: FilePlus, badge: 'Author' },
  { label: 'Mock Assessments', to: '/trainer/assessments', icon: ShieldAlert, badge: 'Radar' },
  { label: 'Placement Drives', to: '/trainer/placements', icon: Briefcase, badge: 'Hiring' },
  { label: 'Leaderboard', to: '/trainer/leaderboard', icon: Trophy, badge: 'Ranked' },
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

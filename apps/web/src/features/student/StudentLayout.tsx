import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, NavItem } from '@/shared/components/Sidebar';
import { LayoutDashboard, Code, FileText, User, Trophy } from 'lucide-react';

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student', icon: LayoutDashboard },
  { label: 'Coding Practice', to: '/student/practice', icon: Code, badge: 'Sandbox' },
  { label: 'Assignments', to: '/student/assignments', icon: FileText, badge: 'Active' },
  { label: 'Leaderboard', to: '/student/leaderboard', icon: Trophy, badge: 'Ranked' },
  { label: 'Profile', to: '/student/profile', icon: User },
];

export const StudentLayout: React.FC = () => {
  return (
    <div className="flex flex-1">
      <Sidebar items={studentNav} portalName="Student Portal" />
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

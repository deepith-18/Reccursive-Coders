import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/30">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-muted-foreground glass-panel">
        <p>&copy; {new Date().getFullYear()} Training &amp; Placement Platform. Monorepo Architecture.</p>
      </footer>
    </div>
  );
};

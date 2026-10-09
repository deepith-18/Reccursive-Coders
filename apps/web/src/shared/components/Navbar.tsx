import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Shield, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const getActivePortal = () => {
    if (location.pathname.startsWith('/student')) return 'STUDENT';
    if (location.pathname.startsWith('/trainer')) return 'TRAINER';
    if (location.pathname.startsWith('/admin')) return 'ADMIN';
    return null;
  };

  const activePortal = getActivePortal();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              PLACEMENT<span className="text-blue-500">PLATFORM</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Phase 0
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium hidden sm:block">
              Training &amp; Placement Suite
            </p>
          </div>
        </Link>

        {/* Portal Switcher Navigation */}
        <nav className="flex items-center gap-1.5 bg-secondary/60 p-1 rounded-xl border border-white/5">
          <Link
            to="/student"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePortal === 'STUDENT'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student</span>
          </Link>

          <Link
            to="/trainer"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePortal === 'TRAINER'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trainer</span>
          </Link>

          <Link
            to="/admin"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePortal === 'ADMIN'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>

        {/* Status indicator / User profile shell */}
        <div className="flex items-center gap-3">
          {activePortal ? (
            <StatusBadge status={activePortal} />
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Foundation Ready</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

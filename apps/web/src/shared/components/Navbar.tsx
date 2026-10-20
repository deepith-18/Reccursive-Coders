import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Code,
  FileText,
  Trophy,
  User as UserIcon,
  Users,
  FilePlus,
  Shield,
  LogOut,
  LogIn,
  Sparkles,
  Command,
  LayoutDashboard,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '@/features/auth/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const role = user?.role
    ? user.role.startsWith('ROLE_')
      ? user.role.substring(5)
      : user.role
    : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPortalHome = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'TRAINER') return '/trainer';
    if (role === 'STUDENT') return '/student';
    return '/';
  };

  const isLinkActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== '/student' &&
        path !== '/trainer' &&
        path !== '/admin' &&
        location.pathname.startsWith(path))
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to={getPortalHome()} className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-white/15 flex items-center justify-center text-white shadow-md group-hover:border-violet-500/50 group-hover:scale-105 transition-all">
            <Command className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              <span>Recursive</span>
              <span className="text-zinc-500 font-light">/</span>
              <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                Coders
              </span>
              {role && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  {role}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 font-medium hidden sm:block">
              Placement &amp; Training Suite
            </p>
          </div>
        </Link>

        {/* Role-Isolated Portal Navigation */}
        {isAuthenticated && role && (
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] backdrop-blur-md">
            {role === 'STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    location.pathname === '/student'
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student/practice"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/student/practice')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Practice</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/student/assignments')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Assignments</span>
                </Link>
                <Link
                  to="/student/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/student/leaderboard')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/student/profile"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/student/profile')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {role === 'TRAINER' && (
              <>
                <Link
                  to="/trainer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    location.pathname === '/trainer'
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Overview</span>
                </Link>
                <Link
                  to="/trainer/batches"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/trainer/batches')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/trainer/questions"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/trainer/questions')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <FilePlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Question Builder</span>
                </Link>
                <Link
                  to="/trainer/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/trainer/leaderboard')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Batch Leaderboard</span>
                </Link>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Control Center</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/admin/users')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  <span>Users Directory</span>
                </Link>
                <Link
                  to="/admin/batches"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/admin/batches')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Command className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/admin/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/admin/leaderboard')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Global Rank</span>
                </Link>
              </>
            )}
          </nav>
        )}

        {/* User profile shell / Auth status */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                  <span>{user.fullName}</span>
                  <StatusBadge status={role || 'USER'} />
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">{user.email}</div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 border border-white/[0.08] hover:border-rose-500/25 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold shadow-md shadow-white/5 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

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
  Layers,
  Sparkles,
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
    return location.pathname === path || (path !== '/student' && path !== '/trainer' && path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to={getPortalHome()} className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              RECURSIVE<span className="text-indigo-400">CODERS</span>
              {role && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                  {role}
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium hidden sm:block">
              Intensive Training &amp; Placement Suite
            </p>
          </div>
        </Link>

        {/* Role-Isolated Portal Navigation */}
        {isAuthenticated && role && (
          <nav className="hidden md:flex items-center gap-1 bg-secondary/40 p-1 rounded-xl border border-white/5">
            {role === 'STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/student'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student/practice"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/student/practice')
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Practice</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/student/assignments')
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Assignments</span>
                </Link>
                <Link
                  to="/student/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/student/leaderboard')
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/student/profile"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/student/profile')
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {role === 'TRAINER' && (
              <>
                <Link
                  to="/trainer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/trainer'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </Link>
                <Link
                  to="/trainer/batches"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/batches')
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/trainer/questions"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/questions')
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Question Builder</span>
                </Link>
                <Link
                  to="/trainer/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/leaderboard')
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Batch Leaderboard</span>
                </Link>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Control Center</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/admin/users')
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Users Directory</span>
                </Link>
                <Link
                  to="/admin/batches"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/admin/batches')
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/admin/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive('/admin/leaderboard')
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
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
                <div className="text-[11px] text-muted-foreground font-mono">{user.email}</div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-secondary hover:bg-rose-500/10 hover:text-rose-400 text-muted-foreground border border-white/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
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

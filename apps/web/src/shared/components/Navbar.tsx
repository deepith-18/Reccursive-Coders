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
  Briefcase,
  Bell,
  CheckCheck,
  Menu,
  X,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '@/features/auth/AuthContext';
import { RecursiveCodersLogo } from './RecursiveCodersLogo';
import { notificationApi, NotificationResponse } from '@/api/notifications';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const role = user?.role
    ? user.role.startsWith('ROLE_')
      ? user.role.substring(5)
      : user.role
    : null;

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<NotificationResponse[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(false);

  // Close mobile navigation drawer whenever route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // silent
    }
  };

  const handleToggleNotifications = async () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);
    if (nextState) {
      setIsLoadingNotifications(true);
      try {
        const res = await notificationApi.getMyNotifications({ size: 10 });
        if (res?.content) {
          setNotifications(res.content);
        }
      } catch {
        // silent
      } finally {
        setIsLoadingNotifications(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silent
    }
  };

  const handleNotificationClick = async (notif: NotificationResponse) => {
    if (!notif.read) {
      try {
        await notificationApi.markAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch {
        // silent
      }
    }
    setNotificationsOpen(false);
    if (notif.linkUrl) {
      navigate(notif.linkUrl);
    }
  };

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
        <Link to={getPortalHome()} className="flex items-center gap-2 group shrink-0">
          <RecursiveCodersLogo size="md" showText={true} showTagline={true} />
          {role && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 hidden md:inline-block ml-1">
              {role}
            </span>
          )}
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
                  to="/student/placements"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/student/placements')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Placements</span>
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
                  to="/trainer/placements"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/trainer/placements')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Placement Drives</span>
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
                  to="/admin/placements"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLinkActive('/admin/placements')
                      ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Drives</span>
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

              {/* Notification Bell & Dropdown Tray */}
              <div className="relative">
                <button
                  onClick={handleToggleNotifications}
                  title="Notifications"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer relative"
                >
                  <Bell className="w-4 h-4 text-cyan-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-zinc-950 text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card border border-white/[0.12] shadow-2xl p-4 z-[70] space-y-3 backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    {isLoadingNotifications ? (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        No notifications yet.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-white/[0.04]">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`pt-2 pb-1 px-2.5 rounded-xl transition cursor-pointer ${
                              n.read
                                ? 'opacity-65 hover:bg-white/[0.03]'
                                : 'bg-cyan-950/20 border border-cyan-500/20 hover:bg-cyan-900/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-white leading-tight">
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <div className="text-[10px] text-zinc-500 mt-1.5 font-mono">
                              {new Date(n.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Navigation Drawer Toggle */}
              {role && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle Navigation Drawer"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer md:hidden"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4 text-violet-400" /> : <Menu className="w-4 h-4" />}
                </button>
              )}

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

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && isAuthenticated && role && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#14151e]/98 backdrop-blur-2xl p-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="pb-3 mb-3 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">{role} Portal</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">{user?.email}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {role === 'STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    location.pathname === '/student'
                      ? 'bg-violet-500/20 text-white border border-violet-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-violet-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student/practice"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/practice')
                      ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>Practice</span>
                </Link>
                <Link
                  to="/student/company-archive"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/company-archive')
                      ? 'bg-blue-500/20 text-white border border-blue-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Company Qs</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/assignments')
                      ? 'bg-amber-500/20 text-white border border-amber-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Assignments</span>
                </Link>
                <Link
                  to="/student/assessments"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/assessments')
                      ? 'bg-rose-500/20 text-white border border-rose-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Mock Tests</span>
                </Link>
                <Link
                  to="/student/placements"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/placements')
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Placements</span>
                </Link>
                <Link
                  to="/student/leaderboard"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/leaderboard')
                      ? 'bg-yellow-500/20 text-white border border-yellow-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/student/profile"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/student/profile')
                      ? 'bg-sky-500/20 text-white border border-sky-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-sky-400" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {role === 'TRAINER' && (
              <>
                <Link
                  to="/trainer"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    location.pathname === '/trainer'
                      ? 'bg-fuchsia-500/20 text-white border border-fuchsia-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span>Overview</span>
                </Link>
                <Link
                  to="/trainer/batches"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/trainer/batches')
                      ? 'bg-violet-500/20 text-white border border-violet-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Users className="w-4 h-4 text-violet-400" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/trainer/questions"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/trainer/questions')
                      ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <FilePlus className="w-4 h-4 text-emerald-400" />
                  <span>Questions</span>
                </Link>
                <Link
                  to="/trainer/assessments"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/trainer/assessments')
                      ? 'bg-rose-500/20 text-white border border-rose-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Assessments</span>
                </Link>
                <Link
                  to="/trainer/placements"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/trainer/placements')
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Placements</span>
                </Link>
                <Link
                  to="/trainer/leaderboard"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/trainer/leaderboard')
                      ? 'bg-yellow-500/20 text-white border border-yellow-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Leaderboard</span>
                </Link>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-amber-500/20 text-white border border-amber-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Control Center</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/admin/users')
                      ? 'bg-violet-500/20 text-white border border-violet-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Users className="w-4 h-4 text-violet-400" />
                  <span>Users</span>
                </Link>
                <Link
                  to="/admin/batches"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/admin/batches')
                      ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Command className="w-4 h-4 text-emerald-400" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/admin/placements"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/admin/placements')
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Drives</span>
                </Link>
                <Link
                  to="/admin/leaderboard"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/admin/leaderboard')
                      ? 'bg-yellow-500/20 text-white border border-yellow-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Global Rank</span>
                </Link>
                <Link
                  to="/admin/impersonate"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isLinkActive('/admin/impersonate')
                      ? 'bg-rose-500/20 text-white border border-rose-500/30'
                      : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span>Impersonate</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

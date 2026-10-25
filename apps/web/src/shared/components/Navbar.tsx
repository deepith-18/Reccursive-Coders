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
  ArrowRight,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '@/features/auth/AuthContext';
import { RecursiveCodersLogo } from './RecursiveCodersLogo';
import { notificationApi, NotificationResponse } from '@/api/notifications';
import { ThemeToggle } from './ThemeToggle';

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
  const [portalDropdownOpen, setPortalDropdownOpen] = React.useState(false);

  // Close mobile navigation drawer whenever route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setPortalDropdownOpen(false);
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-emerald-500/20 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to={getPortalHome()} className="flex items-center gap-2 group shrink-0">
          <RecursiveCodersLogo size="md" showText={true} showTagline={true} />
          {role && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hidden md:inline-block ml-1">
              {role}
            </span>
          )}
        </Link>

        {/* Role-Isolated Portal Navigation */}
        {isAuthenticated && role && (
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-emerald-950/40 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-emerald-500/20 backdrop-blur-md">
            {role === 'STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/student'
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student/practice"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/practice')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Practice</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/assignments')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Assignments</span>
                </Link>
                <Link
                  to="/student/placements"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/placements')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Placements</span>
                </Link>
                <Link
                  to="/student/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/leaderboard')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/student/profile"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/profile')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {role === 'TRAINER' && (
              <>
                <Link
                  to="/trainer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/trainer'
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Overview</span>
                </Link>
                <Link
                  to="/trainer/batches"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/batches')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/trainer/questions"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/questions')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <FilePlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Question Builder</span>
                </Link>
                <Link
                  to="/trainer/placements"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/placements')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Placement Drives</span>
                </Link>
                <Link
                  to="/trainer/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/leaderboard')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Batch Leaderboard</span>
                </Link>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Control Center</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/users')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Users Directory</span>
                </Link>
                <Link
                  to="/admin/batches"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/batches')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Command className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/admin/placements"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/placements')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Drives</span>
                </Link>
                <Link
                  to="/admin/leaderboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/leaderboard')
                      ? 'bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Global Rank</span>
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Public Navigation matching Dhee Coding Lab structure */}
        {!isAuthenticated && (
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-100/80 dark:bg-emerald-950/40 p-1 rounded-2xl border border-zinc-200/80 dark:border-emerald-500/20 backdrop-blur-md">
            <a
              href="/#home"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-emerald-900/40 transition"
            >
              HOME
            </a>
            <a
              href="/#programs"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-emerald-900/40 transition"
            >
              PROGRAMS
            </a>
            <a
              href="/#about"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-emerald-900/40 transition"
            >
              ABOUT US
            </a>
            <Link
              to="/login?portal=student"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 transition flex items-center gap-1"
            >
              <span>STUDENT PORTAL</span>
            </Link>
            <a
              href="/#sandbox"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-emerald-900/40 transition"
            >
              ONLINE-LEARNING
            </a>
            <a
              href="/#placements"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-emerald-900/40 transition"
            >
              SUCCESS STORIES
            </a>
            <a
              href="/#batches"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-emerald-900/40 transition"
            >
              NEW BATCHES
            </a>
          </nav>
        )}

        {/* User Profile Pill & Controls */}
        <div className="flex items-center gap-3">
          {/* Universal Theme Toggle in Navbar */}
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* User Identity Chip */}
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-end gap-1.5">
                  <span>{user.fullName}</span>
                  <StatusBadge status={role || 'USER'} />
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{user.email}</div>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  title="Notifications"
                  className="p-2.5 rounded-2xl bg-zinc-100/90 hover:bg-zinc-200/80 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-emerald-500/30 transition-all cursor-pointer relative"
                >
                  <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-[#0f1d18]/95 border border-zinc-200/80 dark:border-emerald-500/30 shadow-2xl p-4 z-[70] space-y-3 backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-emerald-900/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    {isLoadingNotifications ? (
                      <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        No notifications yet.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-zinc-100 dark:divide-emerald-900/30">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`pt-2 pb-1.5 px-3 rounded-xl transition cursor-pointer ${
                              n.read
                                ? 'opacity-70 hover:bg-zinc-50 dark:hover:bg-emerald-950/40'
                                : 'bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-mono">
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

              {/* Mobile Drawer Toggle */}
              {role && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle Navigation Drawer"
                  className="p-2.5 rounded-2xl bg-zinc-100/90 dark:bg-emerald-950/60 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-emerald-500/30 md:hidden cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4 text-emerald-600" /> : <Menu className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-2.5 rounded-2xl bg-zinc-100/90 hover:bg-rose-50 dark:bg-emerald-950/60 dark:hover:bg-rose-950/30 text-zinc-600 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-400 border border-zinc-200/80 dark:border-emerald-500/30 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Unauthenticated Visitor Actions matching Reference Layout */
            <div className="flex items-center gap-2">
              {/* Portals Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100/80 dark:bg-emerald-950/50 hover:bg-zinc-200/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-emerald-500/30 text-xs font-bold transition"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Portals</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {portalDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-emerald-500/30 shadow-2xl p-2 z-[70] space-y-1 animate-in fade-in">
                    <Link
                      to="/login?portal=student"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold">Student Portal</div>
                        <div className="text-[10px] text-zinc-400 font-normal">SelfStudy &amp; Coding Arena</div>
                      </div>
                    </Link>
                    <Link
                      to="/login?portal=trainer"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition"
                    >
                      <Users className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-bold">Trainer Studio</div>
                        <div className="text-[10px] text-zinc-400 font-normal">Batches &amp; Assessments</div>
                      </div>
                    </Link>
                    <Link
                      to="/login?portal=admin"
                      onClick={() => setPortalDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition"
                    >
                      <Shield className="w-4 h-4 text-cyan-600" />
                      <div>
                        <div className="font-bold">Admin Center</div>
                        <div className="text-[10px] text-zinc-400 font-normal">Operations &amp; Registry</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Practice Coding CTA (Orange/Amber gradient matching reference) */}
              <a
                href="/#sandbox"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Practice Coding</span>
              </a>

              {/* Enroll Now -> Button */}
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>ENROLL NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Drawer Toggle for Public Visitors */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Public Menu"
                className="p-2 rounded-xl bg-zinc-100/80 dark:bg-emerald-950/50 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-emerald-500/30 xl:hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-emerald-600" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Responsive Public Navigation Drawer */}
      {mobileMenuOpen && !isAuthenticated && (
        <div className="xl:hidden border-t border-zinc-200/80 dark:border-emerald-500/20 bg-white/95 dark:bg-[#0c1613]/98 backdrop-blur-2xl p-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <a
              href="/#home"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50"
            >
              HOME
            </a>
            <a
              href="/#programs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50"
            >
              PROGRAMS
            </a>
            <a
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50"
            >
              ABOUT US
            </a>
            <Link
              to="/login?portal=student"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-black"
            >
              STUDENT PORTAL
            </Link>
            <a
              href="/#sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50"
            >
              ONLINE-LEARNING
            </a>
            <a
              href="/#placements"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50"
            >
              SUCCESS STORIES
            </a>
            <a
              href="/#batches"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50"
            >
              NEW BATCHES
            </a>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-center"
            >
              ENROLL NOW &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Responsive Authenticated Navigation Drawer */}
      {mobileMenuOpen && isAuthenticated && role && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-emerald-500/20 bg-white/95 dark:bg-[#0c1613]/98 backdrop-blur-2xl p-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="pb-3 mb-3 border-b border-zinc-200 dark:border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{role} Portal</span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">{user?.email}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {role === 'STUDENT' && (
              <>
                <Link
                  to="/student"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/student'
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student/practice"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/practice')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Practice</span>
                </Link>
                <Link
                  to="/student/company-archive"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/company-archive')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Company Qs</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/assignments')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Assignments</span>
                </Link>
                <Link
                  to="/student/assessments"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/assessments')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Mock Tests</span>
                </Link>
                <Link
                  to="/student/placements"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/placements')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Placements</span>
                </Link>
                <Link
                  to="/student/leaderboard"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/leaderboard')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/student/profile"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/student/profile')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {role === 'TRAINER' && (
              <>
                <Link
                  to="/trainer"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/trainer'
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Overview</span>
                </Link>
                <Link
                  to="/trainer/batches"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/batches')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/trainer/questions"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/questions')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <FilePlus className="w-4 h-4 text-emerald-600" />
                  <span>Questions</span>
                </Link>
                <Link
                  to="/trainer/placements"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/placements')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>Placements</span>
                </Link>
                <Link
                  to="/trainer/leaderboard"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/trainer/leaderboard')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Leaderboard</span>
                </Link>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Control Center</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/users')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Users</span>
                </Link>
                <Link
                  to="/admin/batches"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/batches')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Command className="w-4 h-4 text-emerald-600" />
                  <span>Batches</span>
                </Link>
                <Link
                  to="/admin/placements"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/placements')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>Drives</span>
                </Link>
                <Link
                  to="/admin/leaderboard"
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isLinkActive('/admin/leaderboard')
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60'
                      : 'bg-zinc-50 dark:bg-emerald-950/30 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Global Rank</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

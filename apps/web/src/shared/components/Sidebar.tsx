import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LucideIcon, Settings, HelpCircle, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/features/auth/AuthContext';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

interface SidebarProps {
  items: NavItem[];
  portalName: string;
  accentColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, portalName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 shrink-0 p-5 min-h-[calc(100vh-4rem)] flex flex-col justify-between hidden md:flex select-none">
      <div>
        {/* Portal Identifier Pill */}
        <div className="mb-6 px-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-[11px] uppercase font-bold tracking-wider">
              {portalName}
            </h2>
          </div>
        </div>

        {/* Navigation Items (Dribbble pill style with active rounded background) */}
        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student' || item.to === '/trainer' || item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 shadow-sm border border-emerald-200/80 dark:border-emerald-500/30'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                          isActive
                            ? 'bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/50'
                            : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-transparent'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Controls matching the reference image */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-emerald-500/20 space-y-2">
        <NavLink
          to="/student/profile"
          className="flex items-center gap-3 px-4 py-2 rounded-2xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
        >
          <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span>Settings</span>
        </NavLink>

        <a
          href="mailto:support@recursivecoders.in"
          className="flex items-center gap-3 px-4 py-2 rounded-2xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span>Help &amp; Docs</span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>

        {/* Theme Switcher matching Dribbble reference bottom-left */}
        <div className="pt-3 px-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

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
  return (
    <aside className="w-64 shrink-0 border-r border-white/[0.06] p-4 min-h-[calc(100vh-4rem)] bg-card/20 backdrop-blur-md hidden md:block">
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400/80 animate-pulse" />
          <h2 className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
            {portalName}
          </h2>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student' || item.to === '/trainer' || item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        isActive
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                          : 'bg-white/[0.04] text-zinc-400 border-white/[0.06] group-hover:border-white/10'
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
    </aside>
  );
};

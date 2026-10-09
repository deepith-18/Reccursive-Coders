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
    <aside className="w-64 shrink-0 border-r border-white/10 p-4 min-h-[calc(100vh-4rem)] bg-card/40 backdrop-blur-md hidden md:block">
      <div className="mb-6 px-3">
        <h2 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground/80">
          {portalName} Navigation
        </h2>
      </div>

      <nav className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student' || item.to === '/trainer' || item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-muted-foreground group-hover:bg-white/10'
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

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabels = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabels && (
        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className="relative inline-flex items-center h-8 w-16 shrink-0 cursor-pointer rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-zinc-200/80 dark:bg-emerald-950/60 border border-zinc-300/80 dark:border-emerald-500/30 shadow-inner"
      >
        {/* Background icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] pointer-events-none">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <Moon className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-300" />
        </div>

        {/* Sliding thumb */}
        <span
          className={`relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 transform ${
            isDark
              ? 'translate-x-8 bg-emerald-500 text-zinc-950'
              : 'translate-x-0 bg-amber-400 text-amber-950'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-zinc-950" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-950" />
          )}
        </span>
      </button>
    </div>
  );
};

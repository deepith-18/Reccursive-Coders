import React from 'react';
import { cn } from '@placement/ui';

interface StatusBadgeProps {
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'STUDENT' | 'TRAINER' | 'ADMIN' | 'HEALTHY' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case 'UP':
      case 'HEALTHY':
      case 'ACCEPTED':
      case 'ACTIVE':
        return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case 'DOWN':
      case 'FAILED':
      case 'REJECTED':
        return 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30';
      case 'DEGRADED':
      case 'PENDING':
      case 'WARNING':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      case 'STUDENT':
        return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case 'TRAINER':
        return 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30';
      case 'ADMIN':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      default:
        return 'bg-zinc-200/80 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300 border-zinc-300/80 dark:border-zinc-700/60';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md tracking-wide',
        getBadgeStyle(),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90 animate-pulse" />
      {status}
    </span>
  );
};

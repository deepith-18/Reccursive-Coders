import React from 'react';
import { cn } from '@placement/ui';

interface StatusBadgeProps {
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'STUDENT' | 'TRAINER' | 'ADMIN' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case 'UP':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'DOWN':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'DEGRADED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'STUDENT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'TRAINER':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ADMIN':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        getBadgeStyle(),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

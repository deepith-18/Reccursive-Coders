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
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      case 'DOWN':
      case 'FAILED':
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
      case 'DEGRADED':
      case 'PENDING':
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'STUDENT':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/25';
      case 'TRAINER':
        return 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25';
      case 'ADMIN':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      default:
        return 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md tracking-wide',
        getBadgeStyle(),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90 animate-pulse" />
      {status}
    </span>
  );
};

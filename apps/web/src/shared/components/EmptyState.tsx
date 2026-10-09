import React from 'react';
import { LucideIcon, Layers } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  badge?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Layers,
  title,
  description,
  actionText,
  onAction,
  badge = 'Coming in Next Phase',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-card border border-white/10 my-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-blue-400 border border-primary/30">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        {badge}
      </div>

      <div className="p-4 rounded-2xl bg-secondary/80 text-blue-400 border border-border shadow-inner mb-4 group-hover:scale-105 transition-transform duration-300">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-white mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

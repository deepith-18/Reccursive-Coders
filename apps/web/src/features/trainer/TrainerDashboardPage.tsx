import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { Briefcase, Users, CheckCircle2, TrendingUp } from 'lucide-react';

export const TrainerDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Trainer Console</h1>
          <p className="text-sm text-muted-foreground">
            Manage assigned cohorts, monitor problem submissions, and track batch performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Batches</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0</div>
          <p className="text-xs text-muted-foreground">Assigned cohorts</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Assignments</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0</div>
          <p className="text-xs text-muted-foreground">Published assignments</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Batch Analytics</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">-- %</div>
          <p className="text-xs text-muted-foreground">Average completion rate</p>
        </div>
      </div>

      <EmptyState
        icon={Briefcase}
        title="Trainer Portal Initialized"
        description="The trainer portal shell is active. Cohort assignments, markdown question authoring, test case validators, and submission grading tools will be provided in Phases 2 and 3."
        badge="Phase 0 Verified"
      />
    </div>
  );
};

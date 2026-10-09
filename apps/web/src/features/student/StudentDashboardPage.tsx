import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { LayoutDashboard, Flame, Award, Calendar } from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track daily practice, assignments, rank, and upcoming placement drives.
          </p>
        </div>
      </div>

      {/* Metric Cards Shell */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">0 Days</div>
          <p className="text-xs text-muted-foreground">Timezone: Asia/Kolkata (Phase 5)</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Score &amp; Rank</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">-- pts</div>
          <p className="text-xs text-muted-foreground">Batch &amp; Global Leaderboard</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Activity Heatmap</span>
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">Ready</div>
          <p className="text-xs text-muted-foreground">GitHub-style activity tracking</p>
        </div>
      </div>

      <EmptyState
        icon={LayoutDashboard}
        title="Student Portal Initialized"
        description="The student shell is ready. In subsequent phases, this dashboard will feature dynamic problem sets, active submissions, Judge0 execution logs, and placement drives."
        badge="Phase 0 Verified"
      />
    </div>
  );
};

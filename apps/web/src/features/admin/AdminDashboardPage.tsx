import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { ShieldCheck, UserCheck, School, Briefcase } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Platform Administration</h1>
          <p className="text-sm text-muted-foreground">
            System overview, role management, batch orchestration, and student impersonation tools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <UserCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0</div>
          <p className="text-xs text-muted-foreground">Bulk CSV import in Phase 1</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Trainers</span>
            <School className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0</div>
          <p className="text-xs text-muted-foreground">Instructor management</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Batches</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0</div>
          <p className="text-xs text-muted-foreground">Active cohorts</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Placement Drives</span>
            <Briefcase className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0</div>
          <p className="text-xs text-muted-foreground">Phase 7 Placement</p>
        </div>
      </div>

      <EmptyState
        icon={ShieldCheck}
        title="Admin Portal Initialized"
        description="The administrator control room is ready. User management, CSV onboarding, batch configuration, and audit logging will be activated across upcoming phases."
        badge="Phase 0 Verified"
      />
    </div>
  );
};

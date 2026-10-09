import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { Eye } from 'lucide-react';

export const AdminImpersonationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">View As Student (Impersonation)</h1>
        <p className="text-sm text-muted-foreground">
          Safely view the student portal through any student's perspective with full read-only safety and audit logging.
        </p>
      </div>

      <EmptyState
        icon={Eye}
        title="Read-Only Student Impersonation"
        description="Phase 6 will deliver read-only student impersonation, banner notification, and security audit logging."
        badge="Phase 6 Scope"
      />
    </div>
  );
};

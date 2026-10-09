import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { UserPlus } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">User Directory &amp; RBAC</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform roles (STUDENT, TRAINER, ADMIN), reset passwords, and upload bulk student CSVs.
        </p>
      </div>

      <EmptyState
        icon={UserPlus}
        title="User Management &amp; CSV Onboarding"
        description="Phase 1 will provide complete user directory, bulk CSV upload, force password reset on first login, and audit log tracking."
        badge="Phase 1 Scope"
      />
    </div>
  );
};

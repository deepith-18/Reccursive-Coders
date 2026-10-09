import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { UserCheck } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Student Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your education credentials, technical skills, resume, and portfolio links.
        </p>
      </div>

      <EmptyState
        icon={UserCheck}
        title="Profile &amp; Placement Readiness"
        description="Comprehensive profile management, resume upload, GitHub &amp; LinkedIn links, and verification status will be integrated in Phase 2."
        badge="Phase 2 Scope"
      />
    </div>
  );
};

import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { FileCode } from 'lucide-react';

export const StudentAssignmentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Batch Assignments</h1>
        <p className="text-sm text-muted-foreground">
          Assigned by your trainers with strict deadlines and automated scoring.
        </p>
      </div>

      <EmptyState
        icon={FileCode}
        title="No Assignments Available Yet"
        description="Assigned tasks, deadlines, and submission history will appear here once assignments are published in Phase 3."
        badge="Phase 3 Scope"
      />
    </div>
  );
};

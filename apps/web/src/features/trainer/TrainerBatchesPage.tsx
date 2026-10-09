import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { Users2 } from 'lucide-react';

export const TrainerBatchesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Batch Management</h1>
        <p className="text-sm text-muted-foreground">
          View assigned training batches, enrolled students, and track progress milestones.
        </p>
      </div>

      <EmptyState
        icon={Users2}
        title="Trainer Batches"
        description="Batches and student rosters will be linked to trainers in Phase 2."
        badge="Phase 2 Scope"
      />
    </div>
  );
};

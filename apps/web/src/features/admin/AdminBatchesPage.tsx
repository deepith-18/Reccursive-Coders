import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { Layers } from 'lucide-react';

export const AdminBatchesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Batch Management</h1>
        <p className="text-sm text-muted-foreground">
          Create training batches, assign trainers, set timelines, and allocate student quotas.
        </p>
      </div>

      <EmptyState
        icon={Layers}
        title="Batch Configuration"
        description="Batches and trainer allocations will be implemented in Phase 2."
        badge="Phase 2 Scope"
      />
    </div>
  );
};

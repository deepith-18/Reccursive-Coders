import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { FileEdit } from 'lucide-react';

export const TrainerQuestionBuilderPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Coding Question Builder</h1>
        <p className="text-sm text-muted-foreground">
          Create problem statements in Markdown with difficulty tags, memory/time limits, and sample &amp; hidden test cases.
        </p>
      </div>

      <EmptyState
        icon={FileEdit}
        title="Question &amp; Test Case Authoring"
        description="The markdown editor, test case manager (sample vs hidden), and language limits will be built in Phase 3."
        badge="Phase 3 Scope"
      />
    </div>
  );
};

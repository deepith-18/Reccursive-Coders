import React from 'react';
import { EmptyState } from '@/shared/components/EmptyState';
import { Code2 } from 'lucide-react';

export const StudentPracticePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Coding Practice</h1>
        <p className="text-sm text-muted-foreground">
          Solve algorithmic challenges using the integrated Monaco editor and Judge0 sandbox.
        </p>
      </div>

      <EmptyState
        icon={Code2}
        title="Coding Sandbox &amp; Monaco Editor"
        description="Phase 4 will deliver the full Monaco coding workspace with multi-language execution (Java, Python, C++, JS), sample test run and hidden submission verdicts."
        badge="Phase 4 Scope"
      />
    </div>
  );
};

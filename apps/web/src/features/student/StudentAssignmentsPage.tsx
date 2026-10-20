import React, { useState, useEffect } from 'react';
import {
  assignmentApi,
  AssignmentSummaryResponse,
  AssignmentResponse,
} from '@/api/assignments';
import { questionApi, QuestionResponse, QuestionDifficulty } from '@/api/questions';
import {
  FileText,
  Calendar,
  Award,
  X,
  Loader2,
  ChevronRight,
  Code,
  ArrowRight,
} from 'lucide-react';
import { CodingWorkspace } from './CodingWorkspace';

export const StudentAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected Assignment Details Modal
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentResponse | null>(null);

  // Problem view inside assignment
  const [viewingQuestion, setViewingQuestion] = useState<QuestionResponse | null>(null);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await assignmentApi.getMyAssignments();
      setAssignments(data || []);
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenAssignment = async (id: string) => {
    try {
      const details = await assignmentApi.getAssignmentById(id);
      setSelectedAssignment(details);
    } catch (err) {
      console.error('Failed to fetch assignment details', err);
    }
  };

  const handleOpenQuestion = async (questionId: string) => {
    try {
      const q = await questionApi.getQuestionById(questionId);
      setViewingQuestion(q);
    } catch (err) {
      console.error('Failed to fetch question', err);
    }
  };

  const formatDueDate = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return { text: 'Past Due', isUrgent: true, isPast: true };
    }
    if (diffDays <= 1) {
      return { text: 'Due Tomorrow', isUrgent: true, isPast: false };
    }
    return { text: `Due in ${diffDays} days`, isUrgent: false, isPast: false };
  };

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
    }
  };

  const activeAssignments = assignments.filter((a) => !a.isPastDue);
  const pastDueAssignments = assignments.filter((a) => a.isPastDue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-amber-400" />
          Batch Assignments
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Complete mandatory coding assignments scheduled by your cohort trainers before the deadline.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Assignments</p>
          <p className="text-2xl font-black text-white">{assignments.length}</p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Active Tasks</p>
          <p className="text-2xl font-black text-emerald-300">{activeAssignments.length}</p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Past Due / Closed</p>
          <p className="text-2xl font-black text-rose-300">{pastDueAssignments.length}</p>
        </div>
      </div>

      {/* Assignment List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-400 mb-3" />
          <p className="text-xs text-zinc-400">Loading cohort assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card">
          <FileText className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Assignments Assigned Yet</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Your trainers haven't published any assignments for your enrolled batch yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map((assignment) => {
            const dueStatus = formatDueDate(assignment.dueDate);
            return (
              <div
                key={assignment.id}
                onClick={() => handleOpenAssignment(assignment.id)}
                className="p-5 rounded-2xl glass-card cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        dueStatus.isPast
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                          : dueStatus.isUrgent
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                      }`}
                    >
                      {dueStatus.text}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                      {assignment.batchCode}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                      {assignment.title}
                    </h3>
                  </div>

                  {assignment.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      {assignment.totalPoints} Total Points
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      {assignment.questionCount} Problems
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                      {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span className="text-xs text-violet-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>View Problems</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ASSIGNMENT DETAILS MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{selectedAssignment.title}</h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Batch: {selectedAssignment.batchName} ({selectedAssignment.batchCode})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 rounded-xl hover:bg-white/[0.05] text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Assignment Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    Deadline: {new Date(selectedAssignment.dueDate).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Award className="w-4 h-4 text-amber-400" />
                    Total Points: {selectedAssignment.totalPoints} pts
                  </span>
                </div>
                {selectedAssignment.isPastDue && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/25">
                    Past Due
                  </span>
                )}
              </div>

              {selectedAssignment.description && (
                <div className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06]">
                  {selectedAssignment.description}
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Assigned Problems ({selectedAssignment.questions.length})</span>
                  <span className="text-xs text-zinc-500">Click problem to open interactive workspace</span>
                </h3>

                {selectedAssignment.questions.map((q, idx) => (
                  <div
                    key={q.questionId}
                    onClick={() => handleOpenQuestion(q.questionId)}
                    className="p-4 rounded-2xl glass-card cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">#{idx + 1}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                          {q.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyBadge(
                            q.difficulty
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      {q.tags && <p className="text-[11px] text-zinc-400">{q.tags}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-bold">
                        {q.points} pts
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMMERSIVE CODING WORKSPACE FOR ASSIGNED PROBLEM */}
      {viewingQuestion && (
        <CodingWorkspace
          question={viewingQuestion}
          assignmentId={selectedAssignment?.id}
          onClose={() => setViewingQuestion(null)}
        />
      )}
    </div>
  );
};

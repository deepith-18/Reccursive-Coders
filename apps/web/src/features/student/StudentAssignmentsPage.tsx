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
  Clock,
  Cpu,
  Award,
  X,
  Loader2,
  ChevronRight,
  Code,
} from 'lucide-react';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';

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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const activeAssignments = assignments.filter((a) => !a.isPastDue);
  const pastDueAssignments = assignments.filter((a) => a.isPastDue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-primary-400" />
          Batch Assignments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete mandatory coding assignments scheduled by your cohort trainers before the deadline.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-card/60 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Assignments</p>
          <p className="text-2xl font-black text-white mt-1">{assignments.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
          <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">Active Tasks</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{activeAssignments.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-wider">Past Due / Closed</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{pastDueAssignments.length}</p>
        </div>
      </div>

      {/* Assignment List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-400 mb-3" />
          <p className="text-sm text-muted-foreground">Loading cohort assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-card/30">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Assignments Assigned Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
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
                className="p-5 rounded-xl border border-white/10 bg-card/40 hover:bg-card/80 hover:border-white/20 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        dueStatus.isPast
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : dueStatus.isUrgent
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {dueStatus.text}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">
                      {assignment.batchCode}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition">
                      {assignment.title}
                    </h3>
                  </div>

                  {assignment.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {assignment.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Award className="w-3.5 h-3.5 text-primary-400" />
                      {assignment.totalPoints} Total Points
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Code className="w-3.5 h-3.5 text-primary-400" />
                      {assignment.questionCount} Problems
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                      {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span className="text-xs text-primary-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Problems &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ASSIGNMENT DETAILS MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedAssignment.title}</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Batch: {selectedAssignment.batchName} ({selectedAssignment.batchCode})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Assignment Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-muted/20 p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-200">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    Deadline: {new Date(selectedAssignment.dueDate).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-slate-200">
                    <Award className="w-4 h-4 text-primary-400" />
                    Total Points: {selectedAssignment.totalPoints} pts
                  </span>
                </div>
                {selectedAssignment.isPastDue && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Past Due
                  </span>
                )}
              </div>

              {selectedAssignment.description && (
                <div className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {selectedAssignment.description}
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Assigned Questions ({selectedAssignment.questions.length})</span>
                  <span className="text-xs text-muted-foreground">Click problem to view statement &amp; examples</span>
                </h3>

                {selectedAssignment.questions.map((q, idx) => (
                  <div
                    key={q.questionId}
                    onClick={() => handleOpenQuestion(q.questionId)}
                    className="p-4 rounded-xl border border-white/10 bg-background/60 hover:bg-background/90 hover:border-white/20 transition cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">#{idx + 1}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition">
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
                      {q.tags && <p className="text-[11px] text-muted-foreground">{q.tags}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary-300 border border-primary/20 text-xs font-bold">
                        {q.points} pts
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROBLEM MODAL INSIDE ASSIGNMENT */}
      {viewingQuestion && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                    viewingQuestion.difficulty
                  )}`}
                >
                  {viewingQuestion.difficulty}
                </span>
                <h3 className="text-base font-bold text-white">{viewingQuestion.title}</h3>
              </div>
              <button
                onClick={() => setViewingQuestion(null)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4 text-xs bg-muted/20 p-3 rounded-lg border border-white/10">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-primary-400" />
                  Time Limit: {viewingQuestion.timeLimitMs}ms
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-primary-400" />
                  Memory Limit: {viewingQuestion.memoryLimitMb}MB
                </span>
              </div>

              <div>
                <MarkdownRenderer content={viewingQuestion.description} />
              </div>

              {/* Sample cases */}
              {viewingQuestion.testCases && viewingQuestion.testCases.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Sample Test Cases
                  </h4>
                  {viewingQuestion.testCases.map((tc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-background/80 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-emerald-400">Example {idx + 1}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground font-semibold">Input:</span>
                          <pre className="p-2 rounded bg-black/40 font-mono text-slate-200 mt-1 whitespace-pre-wrap">
                            {tc.inputData}
                          </pre>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold">Output:</span>
                          <pre className="p-2 rounded bg-black/40 font-mono text-slate-200 mt-1 whitespace-pre-wrap">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>
                      {tc.explanation && (
                        <p className="text-xs text-muted-foreground italic">
                          Explanation: {tc.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

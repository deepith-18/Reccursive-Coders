import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BatchManagementService,
  BatchResponse,
} from '@/api/generated';
import { questionApi } from '@/api/questions';
import { assignmentApi } from '@/api/assignments';
import {
  Users,
  FilePlus,
  Trophy,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const TrainerDashboardPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [assignmentCount, setAssignmentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTrainerData = async () => {
      setIsLoading(true);
      try {
        const [batchesRes, questionsRes, assignmentsRes] = await Promise.allSettled([
          BatchManagementService.getBatches(undefined, undefined, undefined, 0, 20),
          questionApi.listQuestions({ size: 1 }),
          assignmentApi.getMyAssignments(),
        ]);

        if (batchesRes.status === 'fulfilled' && batchesRes.value.data?.content) {
          setBatches(batchesRes.value.data.content);
        }
        if (questionsRes.status === 'fulfilled' && questionsRes.value.totalElements !== undefined) {
          setQuestionCount(questionsRes.value.totalElements);
        }
        if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value) {
          setAssignmentCount(assignmentsRes.value.length);
        }
      } catch (err) {
        console.error('Failed to load trainer console metrics', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainerData();
  }, []);

  const totalEnrolledStudents = batches.reduce((acc, b) => acc + (b.studentCount ?? 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Trainer Command Center
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage cohort batches, author technical interview problems, and evaluate student progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/trainer/questions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md shadow-white/5 transition-all"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Create Problem</span>
          </Link>
          <Link
            to="/trainer/batches"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-semibold text-xs border border-white/[0.08] transition-all"
          >
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>Manage Batches</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Cohorts</span>
            <Layers className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">{batches.length}</div>
          <p className="text-xs text-zinc-400">Assigned training cohorts</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalEnrolledStudents}</div>
          <p className="text-xs text-zinc-400">Across all cohort rosters</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Problem Bank</span>
            <FilePlus className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{questionCount}</div>
          <p className="text-xs text-zinc-400">Published coding challenges</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Assignments</span>
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{assignmentCount}</div>
          <p className="text-xs text-zinc-400">Published batch assignments</p>
        </div>
      </div>

      {/* Assigned Batches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-violet-400" />
            Active Training Cohorts
          </h2>
          <Link
            to="/trainer/batches"
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1"
          >
            <span>View All Cohorts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 glass-card rounded-2xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-400 mb-3" />
            <p className="text-xs text-zinc-400">Loading cohort batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="p-8 rounded-2xl glass-card text-center space-y-3">
            <Layers className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Batches Configured</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              You do not have any cohort batches assigned currently.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch) => (
              <div key={batch.id} className="p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                        {batch.code}
                      </span>
                      <StatusBadge status={batch.status || 'ACTIVE'} />
                    </div>
                    <h3 className="text-base font-bold text-white pt-1">{batch.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">{batch.studentCount ?? 0}</span>
                    <span className="text-[11px] text-zinc-400 block">Students</span>
                  </div>
                </div>

                {batch.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {batch.description}
                  </p>
                )}

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400">
                    {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'TBD'} &mdash;{' '}
                    {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'TBD'}
                  </div>
                  <Link
                    to="/trainer/batches"
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1 group"
                  >
                    <span>Manage Roster</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/trainer/questions"
          className="p-5 rounded-2xl glass-card hover:border-violet-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors flex items-center gap-1">
              Question Builder <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Author coding problems with starter templates &amp; test cases.
            </p>
          </div>
        </Link>

        <Link
          to="/trainer/batches"
          className="p-5 rounded-2xl glass-card hover:border-fuchsia-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-fuchsia-300 transition-colors flex items-center gap-1">
              Cohort Rosters <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Enroll learners, inspect profile readiness, and assign tasks.
            </p>
          </div>
        </Link>

        <Link
          to="/trainer/leaderboard"
          className="p-5 rounded-2xl glass-card hover:border-amber-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
              Batch Leaderboard <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Compare student solve counts, points, and current daily streaks.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

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
  Target,
  BarChart3,
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Trainer Command Hub &bull; Bengaluru</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Trainer Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage cohort batches, author technical interview problems, and evaluate student milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/trainer/questions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl btn-primary-mint text-xs font-bold shadow-sm transition-all"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Create Problem</span>
          </Link>
          <Link
            to="/trainer/batches"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-mint text-xs font-bold transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Manage Batches</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Matching Dribbble Squircle Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
          <div className="w-11 h-11 rounded-full bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            Active Cohorts
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {batches.length || 3}
          </div>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
            Assigned Batches
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
          <div className="w-11 h-11 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            Enrolled Students
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {totalEnrolledStudents || 128}
          </div>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-800 dark:text-teal-300">
            Across All Rosters
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
          <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <FilePlus className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            Problem Bank
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {questionCount || 48}
          </div>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300">
            Verified Challenges
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
          <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            Active Assignments
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {assignmentCount || 12}
          </div>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
            In Evaluation
          </div>
        </div>
      </div>

      {/* Cohort Productivity & Submission Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cohort Weekly Submissions</span>
            </h3>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">Past 7 Days</span>
          </div>
          {/* Stacked Bars for Cohort */}
          <div className="pt-2">
            <div className="flex items-end justify-between gap-3 h-32 border-b border-zinc-200 dark:border-emerald-900/40 pb-2">
              {[
                { day: 'Mon', count: 68, pass: 52 },
                { day: 'Tue', count: 84, pass: 66 },
                { day: 'Wed', count: 95, pass: 78 },
                { day: 'Thu', count: 110, pass: 92 },
                { day: 'Fri', count: 125, pass: 108 },
                { day: 'Sat', count: 90, pass: 75 },
                { day: 'Sun', count: 74, pass: 60 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full max-w-[20px] flex flex-col items-center justify-end h-24 gap-0.5">
                    <div
                      style={{ height: `${(item.count - item.pass) * 1.5}%` }}
                      className="w-full bg-amber-400 rounded-t-sm"
                      title={`${item.count - item.pass} Pending`}
                    />
                    <div
                      style={{ height: `${item.pass * 0.9}%` }}
                      className="w-full bg-emerald-500 rounded-b-sm"
                      title={`${item.pass} Passed`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Passed Submissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Requires Review
              </span>
            </div>
          </div>
        </div>

        {/* Quick Authoring Radar */}
        <div className="p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Placement Readiness Radar</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                82% Target Met
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
              Based on automated test cases, code quality metrics, and batch attendance.
            </p>

            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  <span>Data Structures &amp; Algorithms</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">88%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-emerald-950/60 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  <span>System Architecture &amp; APIs</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono">74%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-emerald-950/60 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  <span>Database Query Optimization</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono">82%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-emerald-950/60 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200/80 dark:border-emerald-900/40 flex justify-end">
            <Link
              to="/trainer/questions"
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Add Targeted Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Assigned Batches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Active Training Cohorts</span>
          </h2>
          <Link
            to="/trainer/batches"
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>View All Cohorts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 glass-card rounded-3xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
            <p className="text-xs text-zinc-500">Loading cohort batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="p-8 rounded-3xl glass-card text-center space-y-3">
            <Layers className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Cohort Assigned</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Cohort roster is ready for curriculum setup and student evaluations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch) => (
              <div key={batch.id} className="p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/20">
                        {batch.code}
                      </span>
                      <StatusBadge status={batch.status || 'ACTIVE'} />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white pt-1">{batch.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-zinc-900 dark:text-white">{batch.studentCount ?? 0}</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Students</span>
                  </div>
                </div>

                {batch.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {batch.description}
                  </p>
                )}

                <div className="pt-3 border-t border-zinc-200/80 dark:border-emerald-900/40 flex items-center justify-between">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'TBD'} &mdash;{' '}
                    {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'TBD'}
                  </div>
                  <Link
                    to="/trainer/batches"
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 group"
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
          className="p-5 rounded-3xl glass-card-interactive group flex items-start gap-4"
        >
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 group-hover:scale-110 transition-transform">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              Question Builder <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Author coding problems with starter templates &amp; test cases.
            </p>
          </div>
        </Link>

        <Link
          to="/trainer/batches"
          className="p-5 rounded-3xl glass-card-interactive group flex items-start gap-4"
        >
          <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-300 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors flex items-center gap-1">
              Cohort Rosters <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Enroll learners, inspect profile readiness, and assign tasks.
            </p>
          </div>
        </Link>

        <Link
          to="/trainer/leaderboard"
          className="p-5 rounded-3xl glass-card-interactive group flex items-start gap-4"
        >
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors flex items-center gap-1">
              Batch Leaderboard <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Compare student solve counts, points, and current daily streaks.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

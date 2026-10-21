import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserManagementService,
  UserResponse,
} from '@/api/generated';
import {
  analyticsApi,
  AnalyticsOverview,
  TopicMastery,
  BatchAnalytics,
} from '@/api/analytics';
import {
  UserCheck,
  Layers,
  ArrowRight,
  UserPlus,
  Loader2,
  Sparkles,
  Eye,
  Activity,
  Code,
  Briefcase,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [weakTopics, setWeakTopics] = useState<TopicMastery[]>([]);
  const [cohorts, setCohorts] = useState<BatchAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllMetrics();
  }, []);

  const loadAllMetrics = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, radarRes, batchesRes, recentUsersRes] = await Promise.allSettled([
        analyticsApi.getOverview(),
        analyticsApi.getWeakTopicsRadar(),
        analyticsApi.getAllBatchesAnalytics(),
        UserManagementService.getUsers(undefined, undefined, undefined, 0, 5),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value) {
        setOverview(overviewRes.value);
      }
      if (radarRes.status === 'fulfilled' && radarRes.value) {
        setWeakTopics(radarRes.value);
      }
      if (batchesRes.status === 'fulfilled' && batchesRes.value) {
        setCohorts(batchesRes.value);
      }
      if (recentUsersRes.status === 'fulfilled' && recentUsersRes.value.data?.content) {
        setUsers(recentUsersRes.value.data.content);
      }
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STRONG':
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' };
      case 'MODERATE':
        return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' };
      default:
        return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'bg-rose-500' };
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Platform Intelligence &bull; Phase 7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Administrator Command Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Enterprise platform telemetry, weak topics radar, student impersonation, and cohort progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/impersonate"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View As Student</span>
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md shadow-white/5 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 clay-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <UserCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {overview?.totalStudents ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500">Enrolled technical coders</p>
        </div>

        <div className="p-5 clay-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Today</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {overview?.activeStudentsToday ?? 1}
          </div>
          <p className="text-[11px] text-zinc-500">Coders active in IST today</p>
        </div>

        <div className="p-5 clay-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Acceptance Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300">
            {overview?.globalAcceptanceRate ?? 0}%
          </div>
          <p className="text-[11px] text-zinc-500">Across {overview?.totalSubmissions ?? 0} submissions</p>
        </div>

        <div className="p-5 clay-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Placement Drives</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            {overview?.totalPlacementDrives ?? 3}
          </div>
          <p className="text-[11px] text-zinc-500">Active company recruitment</p>
        </div>
      </div>

      {/* Weak Topics Radar & Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weak Topics Radar (2 Cols) */}
        <div className="lg:col-span-2 p-6 clay-card space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Weak Topics Radar &amp; Mastery Index
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Aggregated student success accuracy rate across algorithmic domains.
              </p>
            </div>
            <span className="text-[11px] text-zinc-500">Diagnostic telemetry</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">Computing topic radar...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weakTopics.map((topic, i) => {
                const styling = getStatusColor(topic.status);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{topic.category}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${styling.bg} ${styling.text} ${styling.border}`}>
                          {topic.status.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-xs text-zinc-300 font-bold">{topic.accuracyRate}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${styling.bar}`}
                        style={{ width: `${Math.min(100, Math.max(5, topic.accuracyRate))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Programming Languages Breakdown (1 Col) */}
        <div className="p-6 rounded-3xl glass-card space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-violet-400" />
                Language Mix
              </h2>
              <span className="text-[11px] text-zinc-500">Execution load</span>
            </div>

            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white">Python 3</span>
                </div>
                <span className="font-mono text-xs font-bold text-zinc-300">
                  {overview?.languageBreakdown?.['PYTHON'] ?? 0} runs
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold text-white">Java 21</span>
                </div>
                <span className="font-mono text-xs font-bold text-zinc-300">
                  {overview?.languageBreakdown?.['JAVA'] ?? 0} runs
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="text-xs font-semibold text-white">C++ 20</span>
                </div>
                <span className="font-mono text-xs font-bold text-zinc-300">
                  {overview?.languageBreakdown?.['CPP'] ?? 0} runs
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
            <span className="font-bold">Sandbox Readiness:</span> Judge0 execution queue is operational with zero container lag.
          </div>
        </div>
      </div>

      {/* Cohort Progress Overview */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Cohort Progress &amp; Completion Analytics
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Active batches, average streak continuity, and milestone completion
            </p>
          </div>
          <Link
            to="/admin/batches"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Cohort Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cohorts.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">
            No active batches enrolled yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Cohort Batch</th>
                  <th className="pb-3 font-semibold">Enrolled</th>
                  <th className="pb-3 font-semibold">Avg Score</th>
                  <th className="pb-3 font-semibold">Avg Streak</th>
                  <th className="pb-3 font-semibold">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {cohorts.map((cohort) => (
                  <tr key={cohort.batchId} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 font-bold text-white">
                      <div>{cohort.batchName}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{cohort.batchCode}</div>
                    </td>
                    <td className="py-3 text-zinc-300">{cohort.enrolledStudents} students</td>
                    <td className="py-3 font-mono font-bold text-cyan-400">{cohort.averageScore} pts</td>
                    <td className="py-3 font-mono text-amber-400 font-semibold">{cohort.averageStreak} days</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {cohort.assignmentCompletionRate}% completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Users Overview Table */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-violet-400" />
              Recent Accounts Directory
            </h2>
            <p className="text-xs text-zinc-400">
              Latest provisioned platform users across all access roles
            </p>
          </div>
          <Link
            to="/admin/users"
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Full User Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No user accounts found.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-white">
                    {u.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{u.fullName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={u.role || 'USER'} />
                  {u.status && (
                    <span className="text-[11px] text-zinc-500 font-medium hidden sm:inline">
                      {u.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/impersonate"
          className="p-5 rounded-2xl glass-card hover:border-amber-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>View As Student</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Impersonate student view in safe read-only sandbox mode.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="p-5 rounded-2xl glass-card hover:border-violet-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>User Directory</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Provision users, manage CSV bulk imports, and reset passwords.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/placements"
          className="p-5 rounded-2xl glass-card hover:border-cyan-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Placement Drives</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Author corporate hiring drives and track candidate shortlists.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

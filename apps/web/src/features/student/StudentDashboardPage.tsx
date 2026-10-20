import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BatchManagementService,
  StudentProfilesService,
  BatchResponse,
  StudentProfileResponse,
} from '@/api/generated';
import { scoringApi, DailyHeatmapDto, StudentScoringOverviewDto } from '@/api/scoring';
import { ActivityHeatmap } from './ActivityHeatmap';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Flame,
  Award,
  Layers,
  UserCheck,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Loader2,
  Trophy,
  Swords,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CodeBattlesModal } from './CodeBattlesModal';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeBatch, setActiveBatch] = useState<BatchResponse | null>(null);
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [scoringOverview, setScoringOverview] = useState<StudentScoringOverviewDto | null>(null);
  const [heatmapData, setHeatmapData] = useState<DailyHeatmapDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBattleModalOpen, setIsBattleModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [batchRes, profileRes, overviewRes, heatmapRes] = await Promise.allSettled([
          BatchManagementService.getMyActiveBatch(),
          StudentProfilesService.getMyProfile(),
          scoringApi.getMyScoringOverview(),
          scoringApi.getMyHeatmap(365),
        ]);

        if (batchRes.status === 'fulfilled' && batchRes.value.data) {
          setActiveBatch(batchRes.value.data);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          setProfile(profileRes.value.data);
        }
        if (overviewRes.status === 'fulfilled' && overviewRes.value) {
          setScoringOverview(overviewRes.value);
        }
        if (heatmapRes.status === 'fulfilled' && heatmapRes.value) {
          setHeatmapData(heatmapRes.value);
        }
      } catch {
        // Handled silently
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const completion = profile?.completionPercentage ?? 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track daily practice, cohort progress, assignments, and upcoming placement drives.
          </p>
        </div>
      </div>

      {/* Profile Completion Callout if not 100% */}
      {completion < 100 && !isLoading && (
        <div className="p-5 rounded-2xl glass-card border border-amber-500/20 bg-gradient-to-r from-amber-950/20 to-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              {completion}%
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Complete Your Placement Profile
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h4>
              <p className="text-xs text-zinc-400">
                Your profile is {completion}% complete. Add your resume, skills, and degree details to qualify for recruiters.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shrink-0"
          >
            Finish Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            {scoringOverview?.currentStreak ?? 0} <span className="text-lg font-bold text-amber-400">Days</span>
          </div>
          <p className="text-xs text-zinc-400">
            Longest record: <strong className="text-amber-300">{scoringOverview?.longestStreak ?? 0} days</strong> (Asia/Kolkata)
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Score &amp; Standing</span>
            <Award className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {scoringOverview?.totalScore ?? 0} <span className="text-lg font-bold text-violet-400">pts</span>
          </div>
          <p className="text-xs text-zinc-400">
            Global Rank: <strong className="text-white">{scoringOverview?.globalRank ? `#${scoringOverview.globalRank}` : 'Unranked'}</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Problems Solved</span>
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {scoringOverview?.problemsSolved ?? 0}
          </div>
          <p className="text-xs text-zinc-400">Across practice questions and assignments</p>
        </div>
      </div>

      {/* GitHub-style Activity Heatmap (Asia/Kolkata IST) */}
      <ActivityHeatmap
        heatmapData={heatmapData}
        currentStreak={scoringOverview?.currentStreak ?? 0}
        longestStreak={scoringOverview?.longestStreak ?? 0}
        totalScore={scoringOverview?.totalScore ?? 0}
        problemsSolved={scoringOverview?.problemsSolved ?? 0}
      />

      {/* Code Battles Modal */}
      <CodeBattlesModal
        isOpen={isBattleModalOpen}
        onClose={() => setIsBattleModalOpen(false)}
      />

      {/* Code Battles Live Banner */}
      <div className="p-6 rounded-3xl glass-card border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-card to-card flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/20 shrink-0">
            <div className="w-full h-full bg-[#12131a] rounded-[14px] flex items-center justify-center">
              <Swords className="w-7 h-7 text-violet-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Live Code Battles Arena</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                18 Coders Online
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              Challenge fellow candidates in Bengaluru 1v1 speed coding matches. Climb the regional leaderboard and win placement recommendation badges!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsBattleModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-xl shadow-violet-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
        >
          <Swords className="w-4 h-4" />
          <span>Launch Code Battle</span>
        </button>
      </div>

      {/* Cohort / Enrolled Batch Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            Enrolled Training Batch
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 glass-card rounded-2xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
          </div>
        ) : activeBatch ? (
          <div className="p-6 rounded-2xl glass-card relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-card">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-300 font-bold border border-violet-500/20">
                    {activeBatch.code}
                  </span>
                  <StatusBadge status={activeBatch.status || 'ACTIVE'} />
                </div>
                <h3 className="text-xl font-bold text-white">{activeBatch.name}</h3>
                {activeBatch.description && (
                  <p className="text-xs text-zinc-400 max-w-xl">{activeBatch.description}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-xs text-zinc-400">
                {activeBatch.trainer?.fullName && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Lead Trainer</span>
                    <div className="text-white font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                      {activeBatch.trainer.fullName}
                    </div>
                    {activeBatch.trainer.email && (
                      <div className="text-[11px] text-zinc-400">{activeBatch.trainer.email}</div>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Duration &amp; Students</span>
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {activeBatch.startDate ? new Date(activeBatch.startDate).toLocaleDateString() : 'TBD'} &mdash;{' '}
                    {activeBatch.endDate ? new Date(activeBatch.endDate).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Enrolled Students: {activeBatch.studentCount ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-card text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mx-auto text-zinc-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Active Batch Assigned</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              You are not currently enrolled in an active training cohort. Your training coordinator or administrator will assign you to a batch shortly.
            </p>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/student/profile"
          className="p-5 rounded-2xl glass-card hover:border-violet-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors flex items-center gap-1">
              Placement Profile <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Update college, CGPA, technical skills stack, and resume.
            </p>
          </div>
        </Link>

        <Link
          to="/student/practice"
          className="p-5 rounded-2xl glass-card hover:border-emerald-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              Coding Practice <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Algorithmic problem bank with Monaco editor &amp; Judge0 execution.
            </p>
          </div>
        </Link>

        <Link
          to="/student/leaderboard"
          className="p-5 rounded-2xl glass-card hover:border-amber-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
              Leaderboards <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Global and cohort batch standings with streak recognition.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

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
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeBatch, setActiveBatch] = useState<BatchResponse | null>(null);
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [scoringOverview, setScoringOverview] = useState<StudentScoringOverviewDto | null>(null);
  const [heatmapData, setHeatmapData] = useState<DailyHeatmapDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track daily practice, cohort progress, assignments, and upcoming placement drives.
          </p>
        </div>
      </div>

      {/* Profile Completion Callout if not 100% */}
      {completion < 100 && !isLoading && (
        <div className="p-5 rounded-2xl glass-card border border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-background flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              {completion}%
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Complete Your Placement Profile
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h4>
              <p className="text-xs text-muted-foreground">
                Your profile is {completion}% complete. Add your resume, skills, and degree details to qualify for recruiters.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all shrink-0"
          >
            Finish Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          </div>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            {scoringOverview?.currentStreak ?? 0} <span className="text-lg font-bold text-amber-400">Days</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Longest record: <strong className="text-purple-300">{scoringOverview?.longestStreak ?? 0} days</strong> (Asia/Kolkata)
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Score &amp; Standing</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {scoringOverview?.totalScore ?? 0} <span className="text-lg font-bold text-primary-400">pts</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Global Rank: <strong className="text-white">{scoringOverview?.globalRank ? `#${scoringOverview.globalRank}` : 'Unranked'}</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Problems Solved</span>
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {scoringOverview?.problemsSolved ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">Across practice questions and assignments</p>
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

      {/* Cohort / Enrolled Batch Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-400" />
            Enrolled Training Batch
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 glass-card rounded-2xl border border-white/10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
          </div>
        ) : activeBatch ? (
          <div className="p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden bg-gradient-to-br from-primary-950/20 via-card to-background">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-300 font-bold border border-primary-500/20">
                    {activeBatch.code}
                  </span>
                  <StatusBadge status={activeBatch.status || 'ACTIVE'} />
                </div>
                <h3 className="text-xl font-bold text-white">{activeBatch.name}</h3>
                {activeBatch.description && (
                  <p className="text-xs text-muted-foreground max-w-xl">{activeBatch.description}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground">
                {activeBatch.trainer?.fullName && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Trainer</span>
                    <div className="text-white font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-primary-400" />
                      {activeBatch.trainer.fullName}
                    </div>
                    {activeBatch.trainer.email && (
                      <div className="text-[11px] text-muted-foreground">{activeBatch.trainer.email}</div>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration &amp; Students</span>
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {activeBatch.startDate ? new Date(activeBatch.startDate).toLocaleDateString() : 'TBD'} &mdash;{' '}
                    {activeBatch.endDate ? new Date(activeBatch.endDate).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Enrolled Students: {activeBatch.studentCount ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-card border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-muted-foreground">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Active Batch Assigned</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              You are not currently enrolled in an active training cohort. Your training coordinator or administrator will assign you to a batch shortly.
            </p>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/student/profile"
          className="p-5 rounded-2xl glass-card border border-white/10 hover:border-primary-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors flex items-center gap-1">
              Placement Profile <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Update college, CGPA, technical skills stack, and resume.
            </p>
          </div>
        </Link>

        <Link
          to="/student/practice"
          className="p-5 rounded-2xl glass-card border border-white/10 hover:border-primary-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              Coding Practice <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Algorithmic problem bank with Monaco editor &amp; Judge0 execution.
            </p>
          </div>
        </Link>

        <Link
          to="/student/leaderboard"
          className="p-5 rounded-2xl glass-card border border-white/10 hover:border-amber-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
              Leaderboards <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Global and cohort batch standings with streak recognition.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

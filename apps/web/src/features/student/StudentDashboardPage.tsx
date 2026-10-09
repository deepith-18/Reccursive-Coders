import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BatchManagementService,
  StudentProfilesService,
  BatchResponse,
  StudentProfileResponse,
} from '@/api/generated';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Flame,
  Award,
  Calendar,
  Layers,
  UserCheck,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeBatch, setActiveBatch] = useState<BatchResponse | null>(null);
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [batchRes, profileRes] = await Promise.allSettled([
          BatchManagementService.getMyActiveBatch(),
          StudentProfilesService.getMyProfile(),
        ]);

        if (batchRes.status === 'fulfilled' && batchRes.value.data) {
          setActiveBatch(batchRes.value.data);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          setProfile(profileRes.value.data);
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
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">0 Days</div>
          <p className="text-xs text-muted-foreground">Timezone: Asia/Kolkata (Phase 5)</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Score &amp; Rank</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">0 pts</div>
          <p className="text-xs text-muted-foreground">Batch &amp; Global Leaderboard (Phase 5)</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Activity Heatmap</span>
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">Active</div>
          <p className="text-xs text-muted-foreground">GitHub-style activity tracking (Phase 5)</p>
        </div>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/student/profile"
          className="p-5 rounded-2xl glass-card border border-white/10 hover:border-primary-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors flex items-center gap-1">
              Academic &amp; Placement Profile <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Update college, CGPA, technical skills stack, and upload your resume document.
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
              Coding Practice &amp; Submissions <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Practice algorithmic coding questions with Dockerized Judge0 execution (Phase 3 &amp; 4).
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

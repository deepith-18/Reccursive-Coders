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
  Zap,
  Clock,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Play,
  Sparkles,
  Swords,
  ArrowRight,
  Layers,
  GraduationCap,
  Loader2,
  Calendar,
  Circle,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CodeBattlesModal } from './CodeBattlesModal';

interface DailyTask {
  id: string;
  timeRange: string;
  title: string;
  lesson: string;
  completed: boolean;
}

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeBatch, setActiveBatch] = useState<BatchResponse | null>(null);
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [scoringOverview, setScoringOverview] = useState<StudentScoringOverviewDto | null>(null);
  const [heatmapData, setHeatmapData] = useState<DailyHeatmapDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBattleModalOpen, setIsBattleModalOpen] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('Fullstack & DSA');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);

  // Interactive Daily Schedule Tasks (matching the "Task" widget from reference image)
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 'task-1',
      timeRange: '07:00 - 07:45 AM',
      title: 'Dynamic Programming: Knapsack & Subsets',
      lesson: 'Lesson 5 • Algorithm Optimization',
      completed: true,
    },
    {
      id: 'task-2',
      timeRange: '08:00 - 09:45 AM',
      title: 'Distributed Systems: Rate Limiter Design',
      lesson: 'Lesson 3 • High-Level Architecture',
      completed: true,
    },
    {
      id: 'task-3',
      timeRange: '10:00 - 10:45 AM',
      title: 'Placement Assessment: Infosys & TCS Radar',
      lesson: 'Timed Assessment • 45 mins',
      completed: false,
    },
    {
      id: 'task-4',
      timeRange: '12:00 - 02:45 PM',
      title: 'Spring Boot REST API & JWT Security',
      lesson: 'Lesson 5 • Enterprise Backend',
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

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

  const completion = profile?.completionPercentage ?? 85;
  const currentStreak = scoringOverview?.currentStreak ?? 44;
  const solvedCount = scoringOverview?.problemsSolved ?? 115;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
      {/* =========================================================================
          Top Header Bar (Reference Image Style: Section Title, Track Filter pill,
          Notification & User summary)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Dashboard &bull; Welcome, {user?.fullName || 'Candidate'}
            </h1>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
              Autumn 2026 Cohort
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Track daily practice, cohort progress, assignments, and upcoming placement drives.
          </p>
        </div>

        {/* Top interactive filter pill */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="appearance-none bg-white/90 dark:bg-emerald-950/60 border border-zinc-200 dark:border-emerald-500/30 text-zinc-800 dark:text-zinc-200 font-bold text-xs py-2 px-4 pr-8 rounded-full shadow-sm hover:border-emerald-500/40 cursor-pointer focus:outline-none"
            >
              <option value="Fullstack & DSA">DSA &amp; System Design</option>
              <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
              <option value="Enterprise Spring">Core Java &amp; Spring</option>
              <option value="Placement Drives">Placement Drives 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsBattleModalOpen(true)}
            className="px-4 py-2 rounded-full btn-primary-mint text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1v1 Code Battle</span>
          </button>
        </div>
      </div>

      {/* Profile Completion Callout if not 100% */}
      {completion < 100 && !isLoading && (
        <div className="p-5 rounded-3xl glass-card border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-white/70 dark:via-emerald-950/40 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black text-sm shrink-0">
              {completion}%
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Complete Your Placement Profile
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Your profile is {completion}% complete. Add your resume, skills, and degree details to qualify for recruiters.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl btn-secondary-mint text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <span>Finish Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* =========================================================================
          MAIN GRID: Matches the exact Dribbble layout
          - Left Column: Learning Days, Progress Wave, Skills Donut
          - Right Column: Productivity Bars, Task Schedule, Current Courses
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 Cols on large screen) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Learning Days (3 Squircle Cards from Reference Image) */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">
              Learning Days
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Days In A Row */}
              <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
                <div className="w-11 h-11 rounded-full bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  Days In A Row
                </div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">
                  {currentStreak}
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                  +38% streak
                </div>
              </div>

              {/* Card 2: Days This Month */}
              <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
                <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  Days This Month
                </div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">
                  19
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  Active Month
                </div>
              </div>

              {/* Card 3: Total Days / Solved */}
              <div className="p-5 rounded-3xl glass-card flex flex-col items-center text-center space-y-2 hover:scale-[1.02] transition-transform">
                <div className="w-11 h-11 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  Total Solved
                </div>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">
                  {solvedCount}
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-800 dark:text-teal-300">
                  +20% pace
                </div>
              </div>
            </div>
          </div>

          {/* Section: Progress Wave Spline (Matching Reference Image) */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">Progress</h3>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Algorithms</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>System Design</span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-emerald-950/60 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-emerald-500/20">
                01 - 07 June ▾
              </div>
            </div>

            {/* Custom SVG Spline Wave Chart with interactive floating tooltip pill */}
            <div className="relative pt-4">
              {/* Floating Tooltip matching reference "35h 10m" */}
              <div className="absolute top-2 right-[32%] z-10 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black shadow-lg shadow-amber-400/30 flex items-center gap-1 animate-bounce">
                <span>35h 10m</span>
              </div>

              <svg viewBox="0 0 500 160" className="w-full h-36 overflow-visible">
                <defs>
                  <linearGradient id="emeraldWave" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="amberWave" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="30" y1="20" x2="490" y2="20" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="30" y1="60" x2="490" y2="60" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="30" y1="100" x2="490" y2="100" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                <line x1="30" y1="140" x2="490" y2="140" stroke="currentColor" strokeOpacity="0.1" />

                {/* Y-axis labels */}
                <text x="5" y="24" fontSize="9" fill="currentColor" opacity="0.4">40</text>
                <text x="5" y="64" fontSize="9" fill="currentColor" opacity="0.4">30</text>
                <text x="5" y="104" fontSize="9" fill="currentColor" opacity="0.4">20</text>
                <text x="5" y="144" fontSize="9" fill="currentColor" opacity="0.4">0</text>

                {/* Background Wave (Emerald) */}
                <path
                  d="M 30 140 Q 90 135 150 110 T 270 85 T 380 40 T 490 70 L 490 140 L 30 140 Z"
                  fill="url(#emeraldWave)"
                />
                <path
                  d="M 30 140 Q 90 135 150 110 T 270 85 T 380 40 T 490 70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Foreground Wave (Amber) */}
                <path
                  d="M 30 140 Q 110 138 180 125 T 320 95 T 410 75 T 490 90 L 490 140 L 30 140 Z"
                  fill="url(#amberWave)"
                />
                <path
                  d="M 30 140 Q 110 138 180 125 T 320 95 T 410 75 T 490 90"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data point dot for tooltip */}
                <circle cx="340" cy="50" r="4.5" fill="#132b21" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="340" y1="50" x2="340" y2="140" stroke="#f59e0b" strokeDasharray="2 2" strokeWidth="1.5" opacity="0.7" />

                {/* X-axis days */}
                <text x="40" y="155" fontSize="9" fill="currentColor" opacity="0.5">Mon</text>
                <text x="110" y="155" fontSize="9" fill="currentColor" opacity="0.5">Tue</text>
                <text x="180" y="155" fontSize="9" fill="currentColor" opacity="0.5">Wed</text>
                <text x="250" y="155" fontSize="9" fill="currentColor" opacity="0.5">Thu</text>
                <text x="330" y="155" fontSize="9" fill="currentColor" opacity="0.5">Fri</text>
                <text x="400" y="155" fontSize="9" fill="currentColor" opacity="0.5">Sat</text>
                <text x="470" y="155" fontSize="9" fill="currentColor" opacity="0.5">Sun</text>
              </svg>
            </div>
          </div>

          {/* Section: Skills Donut Gauge (Matching Reference Image) */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">Skills Breakdown</h3>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Outer Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-zinc-200 dark:text-emerald-950/60"
                    fill="none"
                  />
                  {/* Donut Segments */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="120"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="190"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#047857"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="220"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                    52
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Total Lessons
                  </span>
                </div>
              </div>

              {/* Skills Legend Table */}
              <div className="space-y-2 text-xs font-semibold w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-6">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Dynamic Programming</span>
                  </div>
                  <span className="font-mono text-zinc-900 dark:text-white">12</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-6">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Trees &amp; Graph Theory</span>
                  </div>
                  <span className="font-mono text-zinc-900 dark:text-white">10</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-6">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <span>System Architecture</span>
                  </div>
                  <span className="font-mono text-zinc-900 dark:text-white">15</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-6">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-emerald-400" />
                    <span>PostgreSQL &amp; Redis</span>
                  </div>
                  <span className="font-mono text-zinc-900 dark:text-white">10</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-6">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    <span>React &amp; Spring Boot</span>
                  </div>
                  <span className="font-mono text-zinc-900 dark:text-white">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols on large screen) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: Productivity Stacked Bar Chart (Matching Reference Image) */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">Productivity</h3>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>DSA</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Architecture</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-800 dark:bg-teal-400" />
                    <span>Fullstack</span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-emerald-950/60 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-emerald-500/20">
                01 - 14 May ▾
              </div>
            </div>

            {/* Segmented Daily Stacked Bars */}
            <div className="pt-2">
              <div className="flex items-end justify-between gap-1.5 h-36 border-b border-zinc-200 dark:border-emerald-900/40 pb-2">
                {[
                  { d: 1, a: 12, b: 35, c: 20 },
                  { d: 2, a: 15, b: 40, c: 15 },
                  { d: 3, a: 20, b: 25, c: 10 },
                  { d: 4, a: 25, b: 45, c: 20 },
                  { d: 5, a: 10, b: 30, c: 15 },
                  { d: 6, a: 30, b: 50, c: 10 },
                  { d: 7, a: 28, b: 55, c: 12 },
                  { d: 8, a: 15, b: 35, c: 10 },
                  { d: 9, a: 32, b: 40, c: 20 },
                  { d: 10, a: 12, b: 25, c: 15 },
                  { d: 11, a: 28, b: 45, c: 15 },
                  { d: 12, a: 18, b: 35, c: 10 },
                  { d: 13, a: 25, b: 40, c: 18 },
                  { d: 14, a: 30, b: 48, c: 12 },
                ].map((item) => (
                  <div key={item.d} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full max-w-[14px] flex flex-col items-center justify-end h-28 gap-0.5">
                      {/* Top bar: Amber */}
                      <div
                        style={{ height: `${item.a}%` }}
                        className="w-full bg-amber-400 rounded-t-sm transition-all group-hover:brightness-110"
                      />
                      {/* Middle bar: Emerald */}
                      <div
                        style={{ height: `${item.b}%` }}
                        className="w-full bg-emerald-500 transition-all group-hover:brightness-110"
                      />
                      {/* Bottom bar: Teal */}
                      <div
                        style={{ height: `${item.c}%` }}
                        className="w-full bg-teal-800 dark:bg-teal-400 rounded-b-sm transition-all group-hover:brightness-110"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                      {item.d}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Task Daily Schedule (Matching Reference Image) */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">Daily Schedule</h3>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>TODAY | {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
              </span>
            </div>

            {/* List of Tasks with interactive checkmark */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-zinc-50/80 dark:bg-emerald-950/20 border-zinc-200/80 dark:border-emerald-900/30 opacity-70'
                      : 'bg-white dark:bg-emerald-950/40 border-emerald-500/25 hover:border-emerald-500/50 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    {/* Time Badge Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-amber-300 dark:bg-emerald-900/80 dark:text-emerald-200 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{task.timeRange}</span>
                    </div>
                    <div
                      className={`text-xs font-bold leading-snug transition-all ${
                        task.completed
                          ? 'line-through text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {task.lesson}
                    </div>
                  </div>

                  {/* Completion Checkmark Button */}
                  <button
                    type="button"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      task.completed
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'border border-zinc-300 dark:border-emerald-500/40 text-zinc-400 hover:text-emerald-500'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Current Courses / Modules (Matching Reference Image) */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">Current Tracks</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Course 1 */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-emerald-950/30 border border-zinc-200/80 dark:border-emerald-900/40 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  DSA Mastery
                </div>
                <div className="text-xs font-black text-zinc-900 dark:text-white font-mono">
                  3/15
                </div>
              </div>

              {/* Course 2 */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-emerald-950/30 border border-zinc-200/80 dark:border-emerald-900/40 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  Architecture
                </div>
                <div className="text-xs font-black text-zinc-900 dark:text-white font-mono">
                  5/7
                </div>
              </div>

              {/* Course 3 */}
              <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-emerald-950/30 border border-zinc-200/80 dark:border-emerald-900/40 flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  Placement
                </div>
                <div className="text-xs font-black text-zinc-900 dark:text-white font-mono">
                  1/2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Cohort Batch Status Card & Live Arena
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Batch */}
        <div className="p-6 rounded-3xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Enrolled Training Cohort</span>
            </h3>
            {activeBatch && <StatusBadge status={activeBatch.status || 'ACTIVE'} />}
          </div>

          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : activeBatch ? (
            <div className="space-y-3">
              <div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/20">
                  {activeBatch.code}
                </span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                  {activeBatch.name}
                </h4>
                {activeBatch.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                    {activeBatch.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-emerald-900/40 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Lead Trainer: <strong>{activeBatch.trainer?.fullName || 'Assigned Lead'}</strong></span>
                </div>
                <span>Students: <strong>{activeBatch.studentCount ?? 42}</strong></span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Standard Placement Cohort Active &bull; Bengaluru Campus
              </p>
              <Link
                to="/student/assignments"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                <span>View Assigned Problem Sets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* 1v1 Battle Card */}
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                  Live 1v1 Code Battles Arena
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm">
                Compete against cohort peers in real-time speed coding matches. Climb the Bengaluru rank board and unlock verified certificates.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
              <Swords className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200/80 dark:border-emerald-900/40">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              18 Engineers in matchmaking
            </span>
            <button
              type="button"
              onClick={() => setIsBattleModalOpen(true)}
              className="px-5 py-2 rounded-2xl btn-primary-mint text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Launch Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Full Activity Heatmap Drawer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showHeatmap ? 'Hide 365-Day Activity Heatmap' : 'Show 365-Day Activity Heatmap'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHeatmap ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showHeatmap && (
          <div className="animate-in fade-in duration-300">
            <ActivityHeatmap
              heatmapData={heatmapData}
              currentStreak={currentStreak}
              longestStreak={scoringOverview?.longestStreak ?? 50}
              totalScore={scoringOverview?.totalScore ?? 840}
              problemsSolved={solvedCount}
            />
          </div>
        )}
      </div>

      {/* Code Battles Modal */}
      <CodeBattlesModal
        isOpen={isBattleModalOpen}
        onClose={() => setIsBattleModalOpen(false)}
      />
    </div>
  );
};

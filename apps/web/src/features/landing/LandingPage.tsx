import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HealthService, ApiResponseHealthResponse } from '@/api/generated';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { useAuth } from '@/features/auth/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle2,
  Server,
  ArrowRight,
  Terminal,
  Sparkles,
  Cpu,
  Trophy,
  Flame,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const { data: healthResponse, isLoading, isError, refetch } = useQuery<ApiResponseHealthResponse>({
    queryKey: ['system-health'],
    queryFn: async () => {
      return await HealthService.checkHealth();
    },
    retry: 1,
  });

  const healthData = healthResponse?.data;

  // Auto-redirect authenticated users directly into their specific portal
  if (isAuthenticated && user?.role) {
    const role = user.role.startsWith('ROLE_') ? user.role.substring(5) : user.role;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'TRAINER') return <Navigate to="/trainer" replace />;
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-zinc-300 border border-white/[0.1] shadow-inner backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Next-Generation Technical Placement Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Accelerate Engineering Placements with{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
            Recursive Coders
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
          The unified technical assessment platform. Real-time in-browser code execution,
          automated daily streak tracking, batch assignments, and cohort leaderboards.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-semibold text-sm border border-white/[0.08] transition-all"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>OpenAPI Docs</span>
          </a>
        </div>
      </div>

      {/* Metrics Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card text-center space-y-1">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>&lt; 50ms</span>
          </div>
          <div className="text-xs text-zinc-400 font-medium">Native Sandbox Runtime</div>
        </div>

        <div className="p-4 rounded-2xl glass-card text-center space-y-1">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>IST Stored</span>
          </div>
          <div className="text-xs text-zinc-400 font-medium">Asia/Kolkata Daily Streaks</div>
        </div>

        <div className="p-4 rounded-2xl glass-card text-center space-y-1">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Ranked</span>
          </div>
          <div className="text-xs text-zinc-400 font-medium">Cohort Batch Leaderboards</div>
        </div>

        <div className="p-4 rounded-2xl glass-card text-center space-y-1">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
            <Shield className="w-5 h-5 text-violet-400" />
            <span>Role-Isolated</span>
          </div>
          <div className="text-xs text-zinc-400 font-medium">Zero Cross-Portal Leakage</div>
        </div>
      </div>

      {/* Live System Infrastructure Health Probe */}
      <div className="p-6 rounded-3xl glass-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/[0.05] text-zinc-300 border border-white/[0.1]">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                System Health &amp; Runtime Status
              </h2>
              <p className="text-xs text-zinc-400">
                Spring Boot 3 API &amp; Database Probe (<code className="text-zinc-300">GET /api/v1/health</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="text-xs text-zinc-400 animate-pulse">Probing system...</span>
            )}
            {healthData && (
              <StatusBadge status={healthData.status === 'UP' ? 'HEALTHY' : 'DOWN'} />
            )}
            {isError && (
              <button
                onClick={() => refetch()}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                Retry connection
              </button>
            )}
          </div>
        </div>

        {healthData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[11px] text-zinc-400 block font-medium">Service</span>
              <span className="text-xs font-mono font-bold text-white">{healthData.service}</span>
            </div>
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[11px] text-zinc-400 block font-medium">Profile</span>
              <span className="text-xs font-mono font-bold text-violet-400">
                {healthData.activeProfile || 'development'}
              </span>
            </div>
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[11px] text-zinc-400 block font-medium">Storage Engine</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {String((healthData.details as Record<string, unknown>)?.['database'] ? 'Postgres / H2' : 'Connected')}
              </span>
            </div>
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[11px] text-zinc-400 block font-medium">Sandbox Compilers</span>
              <span className="text-xs font-mono font-bold text-amber-300">Python 3.11 / Java 21 / Judge0</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400">
            Backend API is running on <code className="text-zinc-200">http://localhost:8080</code>.
          </p>
        )}
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Student Workspace</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              In-browser coding sandbox with instant sample runs, daily activity heatmaps, and batch assignments.
            </p>
          </div>
          <ul className="text-xs text-zinc-400 space-y-2 border-t border-white/[0.06] pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full Python 3, Java 21, and C++ runners</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Interactive custom STDIN testing</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Trainer Command</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Manage cohort batches, author questions with sample &amp; hidden test cases, and review student progress.
            </p>
          </div>
          <ul className="text-xs text-zinc-400 space-y-2 border-t border-white/[0.06] pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Question builder with starter code templates</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Batch-scoped leaderboards &amp; submissions</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Administrator Hub</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Enterprise control center for bulk student CSV uploads, batch provisioning, and secure user management.
            </p>
          </div>
          <ul className="text-xs text-zinc-400 space-y-2 border-t border-white/[0.06] pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Bulk CSV user provisioning with temporary passwords</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Security audit trails &amp; trainer impersonation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

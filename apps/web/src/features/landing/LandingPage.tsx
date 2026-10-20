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
  Zap,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Gen Placement &amp; Training Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Supercharge Tech Placements with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Recursive Coders
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          The all-in-one suite for campus recruitment training. Real-time Monaco coding sandbox,
          automated Judge0 test evaluation, batch-isolated assignments, and competitive cohort leaderboards.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            <span>Sign In to Your Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/80 hover:bg-secondary text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>OpenAPI Documentation</span>
          </a>
        </div>
      </div>

      {/* Backend API Health Live Probe */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                System Infrastructure Status
              </h2>
              <p className="text-xs text-muted-foreground">
                Spring Boot 3 API &amp; Database Health (<code className="text-indigo-400">GET /api/v1/health</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="text-xs text-muted-foreground animate-pulse">Probing API...</span>
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
            <div className="bg-secondary/30 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Service</span>
              <span className="text-xs font-mono font-bold text-white">{healthData.service}</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Profile</span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {healthData.activeProfile || 'development'}
              </span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Storage Engine</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {String((healthData.details as Record<string, unknown>)?.['database'] ? 'Postgres / H2' : 'Connected')}
              </span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Execution Engine</span>
              <span className="text-xs font-mono font-bold text-cyan-400">Host Python / Java / Judge0</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Backend is running on <code className="text-indigo-400">http://localhost:8080</code>.
          </p>
        )}
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Student Workspace</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Monaco editor with real-time test runner, Asia/Kolkata daily streaks, and batch-assigned problems.
            </p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2 border-t border-white/5 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Python 3, Java 21, and C++ compilers
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Instant custom STDIN execution &amp; output
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Trainer Command</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Cohort management, coding problem authoring with sample/hidden test cases, and cohort leaderboard tracking.
            </p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2 border-t border-white/5 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Markdown problem description builder
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Batch performance analytics &amp; submissions
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Administrator Hub</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Role-based access control, CSV bulk user provisioning, secure trainer impersonation, and audit logging.
            </p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2 border-t border-white/5 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              Bulk student CSV uploads
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              Global system monitoring &amp; audit trails
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

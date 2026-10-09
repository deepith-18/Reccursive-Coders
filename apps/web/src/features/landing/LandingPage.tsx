import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HealthService, ApiResponseHealthResponse } from '@/api/generated';
import { StatusBadge } from '@/shared/components/StatusBadge';
import {
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle2,
  Server,
  Layers,
  ExternalLink,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { data: healthResponse, isLoading, isError, refetch } = useQuery<ApiResponseHealthResponse>({
    queryKey: ['system-health'],
    queryFn: async () => {
      return await HealthService.checkHealth();
    },
    retry: 1,
  });

  const healthData = healthResponse?.data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          Phase 0: Foundation Complete
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Training &amp; Placement <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Unified Platform
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          A high-performance training company suite spanning Student, Trainer, and Admin portals.
          Built on Spring Boot 3 (Java 21), React 18 + Vite, PostgreSQL, and Judge0 code execution.
        </p>
      </div>

      {/* Backend API Health Live Probe */}
      <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Backend API &amp; Database Health Probe
              </h2>
              <p className="text-xs text-muted-foreground">
                Live verification via generated OpenAPI client (<code className="text-blue-400">GET /api/v1/health</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="text-xs text-muted-foreground animate-pulse">Probing API...</span>
            )}
            {healthData && (
              <StatusBadge status={healthData.status || 'UP'} />
            )}
            {isError && (
              <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                Offline (Start backend via Docker or mvnw)
              </span>
            )}
            <button
              onClick={() => refetch()}
              className="text-xs px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-white font-medium border border-white/10 cursor-pointer"
            >
              Re-check
            </button>
          </div>
        </div>

        {healthData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-secondary/40 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Service Name</span>
              <span className="text-sm font-bold text-white font-mono">{healthData.service}</span>
            </div>
            <div className="bg-secondary/40 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Active Profile</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{healthData.activeProfile}</span>
            </div>
            <div className="bg-secondary/40 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">Database</span>
              <span className="text-sm font-bold text-blue-400 font-mono">
                {String((healthData.details as Record<string, unknown>)?.['database'] ? 'Postgres/H2 Connected' : 'Ready')}
              </span>
            </div>
            <div className="bg-secondary/40 p-3 rounded-xl border border-white/5">
              <span className="text-[11px] text-muted-foreground block font-medium">OpenAPI Specs</span>
              <a
                href="http://localhost:8080/swagger-ui.html"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Swagger UI <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Backend is running on <code className="text-blue-400">http://localhost:8080</code>. Use{' '}
            <code className="text-amber-300">cd apps/api &amp;&amp; .\mvnw.cmd spring-boot:run</code> or{' '}
            <code className="text-emerald-300">docker compose up</code> to launch backend &amp; Postgres.
          </p>
        )}
      </div>

      {/* Role Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Portal */}
        <Link
          to="/student"
          className="group p-6 rounded-2xl glass-card border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Student Portal
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                For learners &amp; applicants
              </p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 border-t border-white/5 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Monaco coding editor &amp; Judge0 run/submit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Asia/Kolkata streak + GitHub activity heatmap
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Batch &amp; global rank leaderboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Placement drives &amp; application tracker
              </li>
            </ul>
          </div>
          <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Student Shell</span> &rarr;
          </div>
        </Link>

        {/* Trainer Portal */}
        <Link
          to="/trainer"
          className="group p-6 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                Trainer Portal
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                For instructors &amp; mentors
              </p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 border-t border-white/5 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Manage assigned cohorts &amp; curricula
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Markdown questions + sample &amp; hidden tests
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Assignment deadlines &amp; automated grading
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Cohort analytics &amp; weak topic detection
              </li>
            </ul>
          </div>
          <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Trainer Shell</span> &rarr;
          </div>
        </Link>

        {/* Admin Portal */}
        <Link
          to="/admin"
          className="group p-6 rounded-2xl glass-card border border-white/10 hover:border-rose-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                Admin Portal
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                For training operations &amp; platform leads
              </p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 border-t border-white/5 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                Bulk CSV user upload &amp; RBAC enforcement
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                Batch setup &amp; trainer allocation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                "View as Student" read-only impersonation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                Comprehensive audit logs &amp; security trail
              </li>
            </ul>
          </div>
          <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Admin Shell</span> &rarr;
          </div>
        </Link>
      </div>

      {/* Architecture Foundations Summary */}
      <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" /> Monorepo Foundation Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="p-3 rounded-xl bg-card border border-white/5">
            <span className="font-semibold text-white block mb-1">Backend</span>
            Spring Boot 3.3, Java 21, Flyway baseline, OpenAPI 3.0, MapStruct, and unified ErrorResponse envelope.
          </div>
          <div className="p-3 rounded-xl bg-card border border-white/5">
            <span className="font-semibold text-white block mb-1">Frontend</span>
            React 18 + Vite, TypeScript (strict), TanStack Query, Tailwind CSS, Lucide Icons, and auto-generated API client.
          </div>
          <div className="p-3 rounded-xl bg-card border border-white/5">
            <span className="font-semibold text-white block mb-1">Tooling &amp; Infra</span>
            pnpm workspaces + Turborepo, Docker Compose (PostgreSQL 16 + Judge0), and GitHub Actions CI.
          </div>
        </div>
      </div>
    </div>
  );
};

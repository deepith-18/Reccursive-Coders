import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  Users,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { RecursiveCodersLogo } from '@/shared/components/RecursiveCodersLogo';

type PortalRole = 'STUDENT' | 'TRAINER' | 'ADMIN';

interface RoleConfig {
  id: PortalRole;
  title: string;
  badge: string;
  tagline: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  defaultEmail: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'STUDENT',
    title: 'Student Portal',
    badge: 'Developer Academy',
    tagline: 'Sharpen algorithms, complete cohort assignments & qualify for top hiring drives.',
    features: ['Monaco Coding IDE', 'Live Assessments', 'Placement Radar'],
    icon: GraduationCap,
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    defaultEmail: 'student@domain.edu',
  },
  {
    id: 'TRAINER',
    title: 'Trainer Portal',
    badge: 'Training Workspace',
    tagline: 'Manage assigned cohorts, author verified coding challenges & monitor milestones.',
    features: ['Cohort Analytics', 'Question Builder', 'Batch Evaluations'],
    icon: Users,
    accentColor: 'text-teal-600 dark:text-teal-400',
    defaultEmail: 'trainer@domain.edu',
  },
  {
    id: 'ADMIN',
    title: 'Admin Portal',
    badge: 'Operations Console',
    tagline: 'Enterprise user provisioning, batch governance, audit logs & placement orchestration.',
    features: ['User Directory', 'Batch Allocation', 'Safety Impersonation'],
    icon: Shield,
    accentColor: 'text-amber-600 dark:text-amber-400',
    defaultEmail: 'admin@domain.com',
  },
];

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<PortalRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const user = await login(email.trim(), password);
      if (fromLocation) {
        navigate(fromLocation, { replace: true });
      } else {
        const role = user?.role
          ? user.role.startsWith('ROLE_')
            ? user.role.substring(5)
            : user.role
          : 'STUDENT';
        if (role === 'ADMIN') navigate('/admin', { replace: true });
        else if (role === 'TRAINER') navigate('/trainer', { replace: true });
        else navigate('/student', { replace: true });
      }
    } catch (err: unknown) {
      const apiErr = err as { body?: { message?: string }; message?: string };
      setError(apiErr.body?.message || apiErr.message || 'Server error encountered. You can launch in Instant Demo mode.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fast-Login Helper
  const handleQuickDemo = (role: PortalRole) => {
    setSelectedRole(role);
    setError(null);
    loginAsDemo(role);
    if (role === 'ADMIN') navigate('/admin', { replace: true });
    else if (role === 'TRAINER') navigate('/trainer', { replace: true });
    else navigate('/student', { replace: true });
  };

  const currentRoleConfig: RoleConfig = ROLES.find((r) => r.id === selectedRole) || ROLES[0]!;

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-8 sm:py-12 select-none">
      <div className="w-full max-w-4xl space-y-8">
        {/* Brand & Introduction Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <RecursiveCodersLogo size="lg" showText={true} showTagline={true} />
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-2">
            Placement &amp; Training Platform
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg">
            Choose your assigned role to access your dedicated workspace. All sessions are authenticated with enterprise token security.
          </p>

          {/* Quick 1-Click Demo Badges */}
          <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Fill:
            </span>
            <button
              type="button"
              onClick={() => handleQuickDemo('STUDENT')}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 cursor-pointer transition-all"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('TRAINER')}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-100 hover:bg-teal-200 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700/60 cursor-pointer transition-all"
            >
              Trainer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 cursor-pointer transition-all"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* 3 Distinct Role-Selection Tiles (Soft Frosted Dribbble Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id);
                  setError(null);
                }}
                className={`text-left p-5 rounded-3xl transition-all relative overflow-hidden group cursor-pointer border ${
                  isSelected
                    ? 'bg-white/95 dark:bg-emerald-950/80 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                    : 'glass-card border-zinc-200/80 dark:border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/30'
                        : 'bg-zinc-100 dark:bg-emerald-950/40 border-zinc-200 dark:border-emerald-900/40'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${role.accentColor}`} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-100 dark:bg-emerald-950/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-emerald-900/40'
                    }`}
                  >
                    {role.badge}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {role.tagline}
                  </p>
                </div>

                {/* Features list */}
                <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-emerald-900/40 space-y-1.5">
                  {role.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Login Form Container (Frosted Rounded Card) */}
        <div className="glass-card p-6 sm:p-8 max-w-md mx-auto space-y-6 relative overflow-hidden rounded-3xl">
          {/* Active Role Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-emerald-900/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                Sign In to {currentRoleConfig.title}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              Role: {selectedRole}
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span className="leading-tight">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemo(selectedRole)}
                className="mt-1 text-left font-bold underline hover:no-underline text-emerald-700 dark:text-emerald-400 cursor-pointer text-[11px]"
              >
                &rarr; Launch {currentRoleConfig.title} in Instant Demo Mode
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentRoleConfig.defaultEmail}
                className="w-full px-4 py-2.5 clay-input text-xs placeholder:text-zinc-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your confidential password"
                  className="w-full px-4 py-2.5 pr-10 clay-input text-xs placeholder:text-zinc-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 btn-primary-mint text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 shadow-lg rounded-2xl"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate &amp; Launch Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="pt-2 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
            Protected by Argon2/BCrypt hashing and JWT session authorization.
          </div>
        </div>
      </div>
    </div>
  );
};

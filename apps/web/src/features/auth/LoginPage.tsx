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
  borderColor: string;
  activeBg: string;
  defaultEmailPlaceholder: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'STUDENT',
    title: 'Student Portal',
    badge: 'Developer Academy',
    tagline: 'Sharpen algorithms, complete cohort assignments & qualify for top hiring drives.',
    features: ['Monaco Coding IDE', 'Live Assessments', 'Placement Drives'],
    icon: GraduationCap,
    accentColor: 'text-violet-400',
    borderColor: 'border-violet-500/40',
    activeBg: 'from-violet-950/40 via-violet-900/20 to-transparent',
    defaultEmailPlaceholder: 'student@domain.edu',
  },
  {
    id: 'TRAINER',
    title: 'Trainer Portal',
    badge: 'Training Workspace',
    tagline: 'Manage assigned cohorts, author verified coding challenges & monitor milestones.',
    features: ['Cohort Analytics', 'Question Builder', 'Batch Evaluations'],
    icon: Users,
    accentColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/40',
    activeBg: 'from-fuchsia-950/40 via-fuchsia-900/20 to-transparent',
    defaultEmailPlaceholder: 'trainer@domain.edu',
  },
  {
    id: 'ADMIN',
    title: 'Admin Portal',
    badge: 'Operations Console',
    tagline: 'Enterprise user provisioning, batch governance, audit logs & placement orchestration.',
    features: ['User Directory', 'Batch Allocation', 'Platform Analytics'],
    icon: Shield,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    activeBg: 'from-amber-950/40 via-amber-900/20 to-transparent',
    defaultEmailPlaceholder: 'admin@domain.com',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
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
      setError(apiErr.body?.message || apiErr.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const currentRoleConfig: RoleConfig = ROLES.find((r) => r.id === selectedRole) || ROLES[0]!;

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Brand & Introduction Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <RecursiveCodersLogo size="lg" showText={true} showTagline={true} />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Placement &amp; Training Platform
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
            Choose your assigned role to access your dedicated workspace. All sessions are authenticated with enterprise token security.
          </p>
        </div>

        {/* 3 Distinct Role-Selection Tiles (Restrained Claymorphic Cards) */}
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
                className={`text-left p-5 rounded-2xl transition-all relative overflow-hidden group border ${
                  isSelected
                    ? `clay-card ${role.borderColor} bg-gradient-to-b ${role.activeBg} ring-2 ring-violet-500/30`
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/[0.04] border-white/[0.08]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${role.accentColor}`} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      isSelected
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-white/[0.04] text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    {role.badge}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-black text-white group-hover:text-violet-300 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {role.tagline}
                  </p>
                </div>

                {/* Micro Features list */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1">
                  {role.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <CheckCircle2 className={`w-3 h-3 ${isSelected ? role.accentColor : 'text-zinc-500'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Login Form Container */}
        <div className="clay-card p-6 sm:p-8 max-w-md mx-auto space-y-6 relative overflow-hidden">
          {/* Active Role Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-bold text-white">
                Sign In to {currentRoleConfig.title}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Role: {selectedRole}
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentRoleConfig.defaultEmailPlaceholder}
                className="w-full px-3.5 py-2.5 clay-input text-xs placeholder:text-zinc-600 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
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
                  className="w-full px-3.5 py-2.5 pr-10 clay-input text-xs placeholder:text-zinc-600 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 clay-button-primary text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 shadow-lg"
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

          {/* Security and compliance note */}
          <div className="pt-2 text-center text-[11px] text-zinc-500">
            Protected by Argon2/BCrypt hashing and JWT session authorization.
          </div>
        </div>
      </div>
    </div>
  );
};

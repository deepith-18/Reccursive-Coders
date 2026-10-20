import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Command } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('student@company.com');
  const [password, setPassword] = useState('Welcome@2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
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
      setError(apiErr.body?.message || apiErr.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-white/15 mx-auto flex items-center justify-center text-white shadow-xl">
            <Command className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Welcome to Recursive Coders</h1>
          <p className="text-xs text-zinc-400">
            Sign in to access your designated portal
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="p-3.5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Select Demo Account</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('student@company.com', 'Welcome@2026!')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold cursor-pointer transition-all border ${
                email === 'student@company.com'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 border-white/[0.08]'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('trainer@company.com', 'Welcome@2026!')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold cursor-pointer transition-all border ${
                email === 'trainer@company.com'
                  ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-sm'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 border-white/[0.08]'
              }`}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@company.com', 'AdminPassword123!')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold cursor-pointer transition-all border ${
                email === 'admin@company.com'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 border-white/[0.08]'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-7 rounded-3xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-lg shadow-white/5 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

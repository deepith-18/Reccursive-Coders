import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserManagementService, UserResponse } from '@/api/generated';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Eye,
  Search,
  ShieldAlert,
  UserCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  History,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const AdminImpersonationPage: React.FC = () => {
  const [students, setStudents] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [auditLog, setAuditLog] = useState<{ id: string; name: string; time: string }[]>(() => {
    const saved = localStorage.getItem('impersonationAuditLog');
    return saved ? JSON.parse(saved) : [];
  });

  const { startImpersonation } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const res = await UserManagementService.getUsers('STUDENT', undefined, undefined, 0, 50);
      if (res.data?.content) {
        setStudents(res.data.content);
      }
    } catch (e) {
      console.error('Failed to load students for impersonation', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchImpersonation = (student: UserResponse) => {
    // Record audit event
    const newEntry = {
      id: student.id || '',
      name: student.fullName || 'Unknown Student',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedLog = [newEntry, ...auditLog.slice(0, 4)];
    setAuditLog(updatedLog);
    localStorage.setItem('impersonationAuditLog', JSON.stringify(updatedLog));

    // Start impersonation & navigate to student portal
    startImpersonation(student);
    navigate('/student');
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin Security Feature &bull; Phase 6 / 7</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
          Student Impersonation &amp; Preview
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Safely view the student portal through any enrolled learner's exact perspective with read-only safeguards and security logging.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-300">Read-Only Safety Guarantee</h2>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              When impersonating a student, destructive write operations (submitting code, applying to drives, or modifying profile settings) are safely gated. You can exit anytime via the persistent top banner.
            </p>
          </div>
        </div>

        {auditLog.length > 0 && (
          <div className="shrink-0 text-right hidden md:block">
            <div className="text-[11px] text-zinc-500 flex items-center justify-end gap-1">
              <History className="w-3 h-3 text-amber-400" />
              <span>Last Impersonated</span>
            </div>
            <div className="text-xs font-bold text-white">{auditLog[0]?.name}</div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students by name, email, or registration..."
          className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-amber-500/50 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Student Impersonation Directory */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Students ({filteredStudents.length})</span>
          <span className="text-[11px] text-zinc-500">1-Click Launch</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center glass-card rounded-3xl">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Loading student directory...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl space-y-2">
            <UserCheck className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No students match your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-2xl glass-card border border-white/[0.06] hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white text-sm group-hover:text-amber-300 transition">
                      {student.fullName}
                    </div>
                    <StatusBadge status={student.status || 'ACTIVE'} />
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">{student.email}</div>
                  <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Role: Student Learner</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchImpersonation(student)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm group-hover:border-amber-400"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Launch Student View</span>
                  <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Audit Trail History */}
      {auditLog.length > 0 && (
        <div className="p-6 rounded-3xl glass-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <History className="w-4 h-4 text-amber-400" />
            <span>Recent Impersonation Audit Log</span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {auditLog.map((log, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-white font-medium">{log.name}</span>
                </div>
                <span className="text-zinc-500 font-mono text-[11px]">Logged at {log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

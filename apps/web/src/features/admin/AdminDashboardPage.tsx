import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserManagementService,
  BatchManagementService,
  UserResponse,
  BatchResponse,
} from '@/api/generated';
import {
  ShieldCheck,
  UserCheck,
  School,
  Layers,
  ArrowRight,
  UserPlus,
  Loader2,
  Sparkles,
  Eye,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTrainers, setTotalTrainers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAdminMetrics = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, trainersRes, batchesRes, recentUsersRes] = await Promise.allSettled([
          UserManagementService.getUsers('STUDENT', undefined, undefined, 0, 1),
          UserManagementService.getUsers('TRAINER', undefined, undefined, 0, 1),
          BatchManagementService.getBatches(undefined, undefined, undefined, 0, 10),
          UserManagementService.getUsers(undefined, undefined, undefined, 0, 6),
        ]);

        if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.totalElements !== undefined) {
          setTotalStudents(studentsRes.value.data.totalElements);
        }
        if (trainersRes.status === 'fulfilled' && trainersRes.value.data?.totalElements !== undefined) {
          setTotalTrainers(trainersRes.value.data.totalElements);
        }
        if (batchesRes.status === 'fulfilled' && batchesRes.value.data?.content) {
          setBatches(batchesRes.value.data.content);
        }
        if (recentUsersRes.status === 'fulfilled' && recentUsersRes.value.data?.content) {
          setUsers(recentUsersRes.value.data.content);
        }
      } catch (err) {
        console.error('Failed to load admin metrics', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminMetrics();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Administrator Hub
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Enterprise system overview, user provisioning, cohort orchestration, and access controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md shadow-white/5 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </Link>
          <Link
            to="/admin/batches"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-semibold text-xs border border-white/[0.08] transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span>Batch Setup</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <UserCheck className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalStudents}</div>
          <p className="text-xs text-zinc-400">Registered platform learners</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lead Trainers</span>
            <School className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalTrainers}</div>
          <p className="text-xs text-zinc-400">Active technical instructors</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Batches</span>
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{batches.length}</div>
          <p className="text-xs text-zinc-400">Configured placement cohorts</p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Security State</span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">Active</div>
          <p className="text-xs text-zinc-400">Role-based token authentication</p>
        </div>
      </div>

      {/* Recent Users Overview Table */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-violet-400" />
              Recent Accounts Directory
            </h2>
            <p className="text-xs text-zinc-400">
              Latest provisioned platform users across all access roles
            </p>
          </div>
          <Link
            to="/admin/users"
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1"
          >
            <span>Full User Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-400 mb-2" />
            <p className="text-xs text-zinc-400">Loading directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No user accounts found.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-white">
                    {u.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{u.fullName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={u.role || 'USER'} />
                  {u.status && (
                    <span className="text-[11px] text-zinc-500 font-medium hidden sm:inline">
                      {u.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="p-5 rounded-2xl glass-card hover:border-violet-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors flex items-center gap-1">
              Bulk CSV Provisioning <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Upload class rosters via CSV with temporary password generation.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/batches"
          className="p-5 rounded-2xl glass-card hover:border-emerald-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              Batch Orchestration <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Create training cohorts, assign instructors, and set schedules.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/impersonate"
          className="p-5 rounded-2xl glass-card hover:border-amber-500/40 transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
              Student Impersonation <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Securely test views as any enrolled student with one click.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

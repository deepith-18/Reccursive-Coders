import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserManagementService, UserResponse, BulkUploadResult, CreateUserRequest } from '@/api/generated';

type Role = 'STUDENT' | 'TRAINER' | 'ADMIN';
import { StatusBadge } from '@/shared/components/StatusBadge';
import {
  Users,
  UserPlus,
  Upload,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
  KeyRound,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filters & Pagination
  const [roleFilter, setRoleFilter] = useState<Role | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pass = '';
    const array = new Uint8Array(12);
    crypto.getRandomValues(array);
    for (let i = 0; i < 12; i++) {
      const byte = array[i] ?? 0;
      pass += chars.charAt(byte % chars.length);
    }
    return pass;
  };

  // Create User Form State
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'STUDENT' as Role,
    temporaryPassword: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);

  // Bulk Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Fetch Users Query
  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ['admin-users', roleFilter, searchQuery, page],
    queryFn: async () => {
      const response = await UserManagementService.getUsers(
        roleFilter,
        undefined,
        searchQuery || undefined,
        page,
        15
      );
      return response.data;
    },
  });

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: async () => {
      return await UserManagementService.createUser({
        fullName: createForm.fullName,
        email: createForm.email,
        phone: createForm.phone || undefined,
        role: createForm.role as CreateUserRequest.role,
        temporaryPassword: createForm.temporaryPassword,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsCreateModalOpen(false);
      setCreateForm({
        fullName: '',
        email: '',
        phone: '',
        role: 'STUDENT' as Role,
        temporaryPassword: '',
      });
      setCreateError(null);
    },
    onError: (err: unknown) => {
      const apiErr = err as { body?: { message?: string }; message?: string };
      setCreateError(apiErr.body?.message || apiErr.message || 'Failed to create user');
    },
  });

  // Bulk Upload Mutation
  const bulkUploadMutation = useMutation({
    mutationFn: async () => {
      if (!csvFile) throw new Error('Please select a CSV file');
      const response = await UserManagementService.bulkUploadStudents({
        file: csvFile,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setBulkResult(data || null);
      setBulkError(null);
    },
    onError: (err: unknown) => {
      const apiErr = err as { body?: { message?: string }; message?: string };
      setBulkError(apiErr.body?.message || apiErr.message || 'Bulk upload failed');
    },
  });

  const handleDownloadSampleCsv = () => {
    const csvContent = 'fullName,email,phone\nRahul Sharma,rahul@student.com,+919876543210\nPriya Patel,priya@student.com,+919876543211\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const usersList: UserResponse[] = (usersResponse as { content?: UserResponse[] })?.content || [];
  const totalPages = (usersResponse as { totalPages?: number })?.totalPages || 0;
  const totalElements = (usersResponse as { totalElements?: number })?.totalElements || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-rose-500" />
            User Management &amp; Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Provision trainers and students, manage role privileges, and upload bulk student rosters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Bulk CSV Upload</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search & Role Filters Bar */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/80 border border-white/10 text-white placeholder:text-muted-foreground/60 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Role:
          </span>
          {(['ALL', 'STUDENT', 'TRAINER', 'ADMIN'] as const).map((r) => {
            const isSelected = (r === 'ALL' && roleFilter === undefined) || roleFilter === r;
            return (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r === 'ALL' ? undefined : r);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-secondary/60 text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-secondary/60 text-white font-semibold uppercase tracking-wider text-[11px] border-b border-white/5">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Security Status</th>
                <th className="px-6 py-3.5">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading directory...</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-rose-400">
                    Failed to load users. Ensure backend is running.
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    No users matching criteria. Click &quot;Add User&quot; to provision an account.
                  </td>
                </tr>
              ) : (
                usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{u.fullName}</div>
                      <div className="text-muted-foreground font-mono text-[11px]">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={u.role || 'USER'} />
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {u.phone || <span className="text-muted-foreground/40">--</span>}
                    </td>
                    <td className="px-6 py-4">
                      {u.forcePasswordChange ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <KeyRound className="w-3 h-3" />
                          Pending Password Change
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground bg-secondary/20">
          <div>
            Showing <strong className="text-white">{usersList.length}</strong> of{' '}
            <strong className="text-white">{totalElements}</strong> accounts
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-secondary text-white font-medium disabled:opacity-30 border border-white/10 cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-white">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-secondary text-white font-medium disabled:opacity-30 border border-white/10 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-white/10 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Create New Platform User
              </h2>
              <p className="text-xs text-muted-foreground">
                Assign roles and provision temporary login credentials.
              </p>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createUserMutation.mutate();
              }}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="e.g. Jane Smith"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-white/10 text-white text-xs focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="TRAINER">TRAINER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-muted-foreground" /> Temp Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, temporaryPassword: generateSecurePassword() })}
                      className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
                    >
                      Generate Secure
                    </button>
                  </div>
                  <input
                    type="text"
                    value={createForm.temporaryPassword}
                    onChange={(e) => setCreateForm({ ...createForm, temporaryPassword: e.target.value })}
                    placeholder="Enter or generate temporary password"
                    className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK CSV UPLOAD MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-white/10 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setIsBulkModalOpen(false);
                setBulkResult(null);
                setBulkError(null);
                setCsvFile(null);
              }}
              className="absolute top-5 right-5 text-muted-foreground hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                Bulk Import Students via CSV
              </h2>
              <p className="text-xs text-muted-foreground">
                Upload a CSV spreadsheet with candidate headers: <code className="text-blue-400 font-mono">fullName, email, phone</code>.
              </p>
            </div>

            {bulkError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bulkError}</span>
              </div>
            )}

            {bulkResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/60 border border-white/10 grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs font-semibold text-emerald-400 block">Imported</span>
                    <span className="text-2xl font-bold text-white font-mono">{bulkResult.totalSuccess}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-xs font-semibold text-rose-400 block">Failed / Skipped</span>
                    <span className="text-2xl font-bold text-white font-mono">{bulkResult.totalFailed}</span>
                  </div>
                </div>

                {bulkResult.errors && bulkResult.errors.length > 0 && (
                  <div className="max-h-36 overflow-y-auto p-3 rounded-xl bg-card border border-rose-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-rose-400 block mb-1">Row Details:</span>
                    {bulkResult.errors.map((err, i) => (
                      <div key={i} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                        {err}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsBulkModalOpen(false);
                    setBulkResult(null);
                    setCsvFile(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-white/5">
                  <span className="text-xs text-muted-foreground">Need sample formatting?</span>
                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CSV Template
                  </button>
                </div>

                <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-2 hover:border-primary/40 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <div className="text-xs text-white font-semibold">
                    {csvFile ? csvFile.name : 'Choose a .csv file'}
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="text-xs text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-primary file:text-white cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold border border-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!csvFile || bulkUploadMutation.isPending}
                    onClick={() => bulkUploadMutation.mutate()}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {bulkUploadMutation.isPending ? 'Processing...' : 'Upload & Process'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

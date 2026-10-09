import React, { useState, useEffect, useCallback } from 'react';
import {
  BatchManagementService,
  UserManagementService,
  BatchResponse,
  BatchStudentResponse,
  UserResponse,
  CreateBatchRequest,
} from '@/api/generated';
import {
  Layers,
  Plus,
  Search,
  Users,
  GraduationCap,
  Calendar,
  UserPlus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

type BatchStatusFilter = 'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED';

export const AdminBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [trainers, setTrainers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<BatchStatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isAssignTrainerOpen, setIsAssignTrainerOpen] = useState<boolean>(false);
  const [selectedBatchForTrainer, setSelectedBatchForTrainer] = useState<BatchResponse | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');

  // Student Roster & Enrollment Modal
  const [isRosterOpen, setIsRosterOpen] = useState<boolean>(false);
  const [activeBatchForRoster, setActiveBatchForRoster] = useState<BatchResponse | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<BatchStudentResponse[]>([]);
  const [availableStudents, setAvailableStudents] = useState<UserResponse[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [rosterTab, setRosterTab] = useState<'ROSTER' | 'ENROLL'>('ROSTER');
  const [isLoadingRoster, setIsLoadingRoster] = useState<boolean>(false);

  // Form states for Create Batch
  const [createCode, setCreateCode] = useState<string>('');
  const [createName, setCreateName] = useState<string>('');
  const [createDesc, setCreateDesc] = useState<string>('');
  const [createStartDate, setCreateStartDate] = useState<string>('');
  const [createEndDate, setCreateEndDate] = useState<string>('');
  const [createTrainerId, setCreateTrainerId] = useState<string>('');

  // Global alert messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await BatchManagementService.getBatches(
        statusFilter === 'ALL' ? undefined : (statusFilter as 'UPCOMING' | 'ACTIVE' | 'COMPLETED'),
        undefined,
        searchQuery.trim() || undefined,
        0,
        50
      );
      if (res.data?.content) {
        setBatches(res.data.content);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to load cohorts.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchTrainers = async () => {
    try {
      const res = await UserManagementService.getUsers('TRAINER', undefined, undefined, 0, 100);
      if (res.data?.content) {
        setTrainers(res.data.content);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload: CreateBatchRequest = {
      code: createCode.trim().toUpperCase(),
      name: createName.trim(),
      description: createDesc.trim() || undefined,
      startDate: createStartDate ? `${createStartDate}T00:00:00` : undefined,
      endDate: createEndDate ? `${createEndDate}T23:59:59` : undefined,
      trainerId: createTrainerId || undefined,
      status: CreateBatchRequest.status.ACTIVE,
    };

    try {
      const res = await BatchManagementService.createBatch(payload);
      if (res.data) {
        setSuccessMessage(`Cohort "${res.data.name}" created successfully.`);
        setIsCreateOpen(false);
        // Reset form
        setCreateCode('');
        setCreateName('');
        setCreateDesc('');
        setCreateStartDate('');
        setCreateEndDate('');
        setCreateTrainerId('');
        fetchBatches();
      }
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setErrorMessage(error.body?.message || error.message || 'Failed to create cohort.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForTrainer?.id) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await BatchManagementService.assignTrainer(selectedBatchForTrainer.id, {
        trainerId: selectedTrainerId,
      });
      setSuccessMessage('Lead trainer assigned successfully.');
      setIsAssignTrainerOpen(false);
      fetchBatches();
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setErrorMessage(error.body?.message || error.message || 'Failed to assign trainer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRosterModal = async (batch: BatchResponse) => {
    setActiveBatchForRoster(batch);
    setIsRosterOpen(true);
    setRosterTab('ROSTER');
    setSelectedStudentIds([]);
    await loadRosterData(batch.id!);
  };

  const loadRosterData = async (batchId: string) => {
    setIsLoadingRoster(true);
    try {
      const [rosterRes, studentsRes] = await Promise.allSettled([
        BatchManagementService.getEnrolledStudents(batchId, 0, 100),
        UserManagementService.getUsers('STUDENT', undefined, undefined, 0, 100),
      ]);

      if (rosterRes.status === 'fulfilled' && rosterRes.value.data?.content) {
        setEnrolledStudents(rosterRes.value.data.content);
      }
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.content) {
        setAvailableStudents(studentsRes.value.data.content);
      }
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleEnrollSelected = async () => {
    if (!activeBatchForRoster?.id || selectedStudentIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await BatchManagementService.enrollStudents(activeBatchForRoster.id, {
        studentIds: selectedStudentIds,
      });
      setSuccessMessage(`Enrolled ${selectedStudentIds.length} students into ${activeBatchForRoster.name}.`);
      setSelectedStudentIds([]);
      await loadRosterData(activeBatchForRoster.id);
      fetchBatches();
      setRosterTab('ROSTER');
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setErrorMessage(error.body?.message || error.message || 'Failed to enroll students.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!activeBatchForRoster?.id) return;
    if (!confirm('Are you sure you want to remove this student from the cohort?')) return;

    try {
      await BatchManagementService.removeStudent(activeBatchForRoster.id, studentId);
      setSuccessMessage('Student removed from batch.');
      await loadRosterData(activeBatchForRoster.id);
      fetchBatches();
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setErrorMessage(error.body?.message || error.message || 'Failed to remove student.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Batch Management &amp; Cohorts
            <Layers className="w-6 h-6 text-primary-400" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize training batches, assign lead trainers, set schedules, and manage student enrollments.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Cohort
        </button>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'] as BatchStatusFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cohort name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Batches Grid */}
      {isLoading ? (
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : batches.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center space-y-3">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-white">No Batches Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No training cohorts match your filter. Click &quot;Create Cohort&quot; to initialize a new training batch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-primary-500/30 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-primary-500/10 text-primary-300 font-bold border border-primary-500/20">
                    {batch.code}
                  </span>
                  <StatusBadge status={batch.status || 'ACTIVE'} />
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg">{batch.name}</h3>
                  {batch.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{batch.description}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-primary-400" /> Trainer
                    </span>
                    <span className="font-medium">
                      {batch.trainer?.fullName ? (
                        <span className="text-white">{batch.trainer.fullName}</span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBatchForTrainer(batch);
                            setSelectedTrainerId('');
                            setIsAssignTrainerOpen(true);
                          }}
                          className="text-amber-400 hover:underline text-[11px]"
                        >
                          + Assign Trainer
                        </button>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" /> Enrolled Students
                    </span>
                    <span className="font-semibold text-white">
                      {batch.studentCount ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" /> Dates
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'TBD'} &mdash;{' '}
                      {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => openRosterModal(batch)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                >
                  <Users className="w-3.5 h-3.5" /> Enrolled Roster ({batch.studentCount ?? 0})
                </button>
                <button
                  onClick={() => {
                    setSelectedBatchForTrainer(batch);
                    setSelectedTrainerId(batch.trainer?.id || '');
                    setIsAssignTrainerOpen(true);
                  }}
                  title="Assign / Change Trainer"
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-white/5"
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-5 bg-slate-950">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-400" />
                Create New Training Batch
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Code *</label>
                <input
                  type="text"
                  required
                  placeholder="FS-2025-A"
                  value={createCode}
                  onChange={(e) => setCreateCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs uppercase placeholder-slate-500 focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Stack Java & Spring 2025"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Core curriculum covering algorithms, Spring Boot microservices, and React..."
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={createStartDate}
                    onChange={(e) => setCreateStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={createEndDate}
                    onChange={(e) => setCreateEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Lead Trainer (Optional)</label>
                <select
                  value={createTrainerId}
                  onChange={(e) => setCreateTrainerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- No Trainer Assigned --</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TRAINER MODAL */}
      {isAssignTrainerOpen && selectedBatchForTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4 bg-slate-950">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-400" />
                Assign Lead Trainer
              </h2>
              <button onClick={() => setIsAssignTrainerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select a trainer to oversee cohort{' '}
              <strong className="text-white">{selectedBatchForTrainer.name}</strong> ({selectedBatchForTrainer.code}).
            </p>

            <form onSubmit={handleAssignTrainer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Trainer</label>
                <select
                  required
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-primary-500"
                >
                  <option value="">-- Choose a Trainer --</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignTrainerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedTrainerId}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROSTER & STUDENT ENROLLMENT MODAL */}
      {isRosterOpen && activeBatchForRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] rounded-2xl border border-white/10 p-6 flex flex-col bg-slate-950 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-400" />
                  {activeBatchForRoster.name}
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20">
                    {activeBatchForRoster.code}
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage student roster and enroll candidate accounts into this cohort.
                </p>
              </div>
              <button onClick={() => setIsRosterOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-2">
              <button
                onClick={() => setRosterTab('ROSTER')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  rosterTab === 'ROSTER'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Enrolled Students ({enrolledStudents.length})
              </button>
              <button
                onClick={() => setRosterTab('ENROLL')}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  rosterTab === 'ENROLL'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Enroll Candidates
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] pr-1">
              {isLoadingRoster ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                </div>
              ) : rosterTab === 'ROSTER' ? (
                enrolledStudents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                    <p>No students enrolled in this batch yet.</p>
                    <button
                      onClick={() => setRosterTab('ENROLL')}
                      className="px-3 py-1.5 rounded-lg bg-primary-600/20 text-primary-300 font-semibold text-xs hover:bg-primary-600/30 transition-colors"
                    >
                      + Enroll Students Now
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {enrolledStudents.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded-xl transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{enrollment.student?.fullName || 'Student'}</div>
                          <div className="text-xs text-muted-foreground">{enrollment.student?.email}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Enrolled on: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>

                        <button
                          onClick={() => enrollment.student?.id && handleRemoveStudent(enrollment.student.id)}
                          title="Remove from batch"
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* ENROLL CANDIDATES TAB */
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Select students to enroll into <strong className="text-white">{activeBatchForRoster.name}</strong>.
                  </p>

                  <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto pr-1">
                    {availableStudents
                      .filter((s) => !enrolledStudents.some((e) => e.student?.id === s.id))
                      .map((student) => {
                        const isSelected = selectedStudentIds.includes(student.id!);
                        return (
                          <div
                            key={student.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedStudentIds(selectedStudentIds.filter((id) => id !== student.id));
                              } else {
                                setSelectedStudentIds([...selectedStudentIds, student.id!]);
                              }
                            }}
                            className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary-500/15 border border-primary-500/30' : 'hover:bg-slate-900/50'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold text-white">{student.fullName}</div>
                              <div className="text-[11px] text-muted-foreground">{student.email}</div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'bg-primary-600 border-primary-500 text-white'
                                  : 'border-slate-700 bg-slate-900'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {rosterTab === 'ENROLL' && (
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedStudentIds.length} candidate(s) selected
                </span>

                <button
                  onClick={handleEnrollSelected}
                  disabled={isSubmitting || selectedStudentIds.length === 0}
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 transition-all"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Enroll Selected Candidates
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  placementApi,
  PlacementDriveResponse,
  PlacementApplicationResponse,
  CreatePlacementDriveRequest,
  ApplicationStatus,
  DriveStatus,
} from '@/api/placements';
import {
  Briefcase,
  Plus,
  Users,
  X,
  Loader2,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const TrainerDrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDriveResponse[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDriveResponse | null>(null);
  const [applications, setApplications] = useState<PlacementApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [editingDriveId, setEditingDriveId] = useState<string | null>(null);
  const [statusUpdateAppId, setStatusUpdateAppId] = useState<string | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [driveToDelete, setDriveToDelete] = useState<PlacementDriveResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Admin Verified Placements state (synced with public landing page)
  interface PlacedSpotlight {
    id: string;
    name: string;
    college: string;
    company: string;
    package: string;
    role: string;
    type: string;
  }

  const [isPlacedModalOpen, setIsPlacedModalOpen] = useState(false);
  const [placedSpotlights, setPlacedSpotlights] = useState<PlacedSpotlight[]>(() => {
    try {
      const stored = localStorage.getItem('rc_placed_students');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newPlacedForm, setNewPlacedForm] = useState<Omit<PlacedSpotlight, 'id'>>({
    name: '',
    college: '',
    company: '',
    package: '',
    role: '',
    type: 'Product Company',
  });

  const savePlacedSpotlights = (updated: PlacedSpotlight[]) => {
    setPlacedSpotlights(updated);
    localStorage.setItem('rc_placed_students', JSON.stringify(updated));
  };

  const handleAddPlacedStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlacedForm.name || !newPlacedForm.company) return;
    const newStudent: PlacedSpotlight = {
      id: `placed-${Date.now()}`,
      ...newPlacedForm,
    };
    savePlacedSpotlights([...placedSpotlights, newStudent]);
    setNewPlacedForm({
      name: '',
      college: '',
      company: '',
      package: '',
      role: '',
      type: 'Product Company',
    });
  };

  const handleRemovePlacedStudent = (id: string) => {
    savePlacedSpotlights(placedSpotlights.filter((p) => p.id !== id));
  };

  const handlePublishApplicationToHallOfFame = (app: PlacementApplicationResponse) => {
    const newStudent: PlacedSpotlight = {
      id: `placed-${Date.now()}`,
      name: app.studentName,
      college: app.collegeName || 'Bengaluru Institute of Tech',
      company: selectedDrive?.companyName || 'Corporate Partner',
      package: selectedDrive ? `${selectedDrive.packageCtcLpa} LPA` : 'Competitive',
      role: selectedDrive?.jobRole || 'Software Development Engineer',
      type: 'Verified Selection',
    };
    savePlacedSpotlights([...placedSpotlights, newStudent]);
    alert(`Successfully verified & published ${app.studentName} to the Public Placement Hall of Fame!`);
  };

  // Form state for Create & Edit
  const defaultFormData: CreatePlacementDriveRequest = {
    title: '',
    companyName: '',
    companyLogoUrl: '',
    jobRole: '',
    description: '',
    packageCtcLpa: 8.5,
    location: 'Bengaluru, India',
    minCgpa: 7.0,
    eligibleBranches: 'CSE, ISE, ECE, MCA',
    minCodingScore: 50,
    applicationDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] ?? '',
    status: 'OPEN',
    openingsCount: 10,
  };

  const [formData, setFormData] = useState<CreatePlacementDriveRequest>(defaultFormData);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    setIsLoading(true);
    try {
      const res = await placementApi.getAllDrives({ size: 50 });
      if (res?.content) {
        setDrives(res.content);
        if (res.content.length > 0) {
          // If previously selected drive is still present, refresh it; otherwise select first
          const current = selectedDrive ? res.content.find((d) => d.id === selectedDrive.id) : null;
          const target = current || res.content[0];
          if (target) {
            viewDriveApplicants(target);
          }
        } else {
          setSelectedDrive(null);
          setApplications([]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDriveApplicants = async (drive: PlacementDriveResponse) => {
    setSelectedDrive(drive);
    setIsLoadingApps(true);
    try {
      const res = await placementApi.getDriveApplications(drive.id, { size: 100 });
      if (res?.content) {
        setApplications(res.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingDriveId(null);
    setFormData(defaultFormData);
    setIsDriveModalOpen(true);
  };

  const handleOpenEditModal = (drive: PlacementDriveResponse, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDriveId(drive.id);
    setFormData({
      title: drive.title,
      companyName: drive.companyName,
      companyLogoUrl: drive.companyLogoUrl || '',
      jobRole: drive.jobRole,
      description: drive.description,
      packageCtcLpa: drive.packageCtcLpa,
      location: drive.location || 'Bengaluru, India',
      minCgpa: drive.minCgpa || 7.0,
      eligibleBranches: drive.eligibleBranches || 'CSE, ISE, ECE, MCA',
      minCodingScore: drive.minCodingScore || 50,
      applicationDeadline: drive.applicationDeadline ? (drive.applicationDeadline.split('T')[0] ?? '') : '',
      status: drive.status || 'OPEN',
      openingsCount: drive.openingsCount || 10,
    });
    setIsDriveModalOpen(true);
  };

  const handleSaveDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: CreatePlacementDriveRequest = {
        ...formData,
        packageCtcLpa: Number(formData.packageCtcLpa),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      };

      if (editingDriveId) {
        await placementApi.updateDrive(editingDriveId, payload);
      } else {
        await placementApi.createDrive(payload);
      }

      setIsDriveModalOpen(false);
      setEditingDriveId(null);
      await loadDrives();
    } catch (err: any) {
      alert(err.response?.data?.message || (editingDriveId ? 'Failed to update drive' : 'Failed to create drive'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDrive = async () => {
    if (!driveToDelete) return;
    setIsDeleting(true);
    try {
      await placementApi.deleteDrive(driveToDelete.id);
      setDriveToDelete(null);
      if (selectedDrive?.id === driveToDelete.id) {
        setSelectedDrive(null);
        setApplications([]);
      }
      await loadDrives();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete placement drive');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (appId: string) => {
    try {
      await placementApi.updateApplicationStatus(appId, {
        status: selectedNewStatus,
        recruiterNotes: recruiterNotes || undefined,
      });
      setStatusUpdateAppId(null);
      if (selectedDrive) {
        await viewDriveApplicants(selectedDrive);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'OFFERED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'SHORTLISTED':
      case 'OA_SCHEDULED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'INTERVIEW_ROUND_1':
      case 'INTERVIEW_ROUND_2':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
    }
  };

  const getDriveStatusBadge = (status: DriveStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'UPCOMING':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'COMPLETED':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Placement Recruitment Drives
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Author and manage company placement drives, edit requirements, review candidate rosters, and track student hiring progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlacedModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-emerald-300 border border-emerald-500/30 font-bold text-xs cursor-pointer transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Manage Placed Hall of Fame</span>
            {placedSpotlights.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                {placedSpotlights.length}
              </span>
            )}
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 cursor-pointer transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Placement Drive</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drives List Column */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Corporate Drives ({drives.length})</span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center glass-card rounded-2xl">
                <Loader2 className="w-5 h-5 animate-spin text-violet-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Loading drives...</p>
              </div>
            ) : drives.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-2xl">
                <Briefcase className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">No active placement drives found.</p>
              </div>
            ) : (
              drives.map((d) => (
                <div
                  key={d.id}
                  onClick={() => viewDriveApplicants(d)}
                  className={`p-4 rounded-2xl glass-card cursor-pointer transition-all border group relative ${
                    selectedDrive?.id === d.id
                      ? 'border-violet-500/60 bg-violet-950/20 shadow-lg'
                      : 'border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm truncate">{d.companyName}</div>
                      <div className="text-xs text-zinc-300 truncate mt-0.5">{d.jobRole}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400">{d.packageCtcLpa} LPA</span>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getDriveStatusBadge(d.status)}`}>
                          {d.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{d.applicantCount} Applicants</span>
                    </span>
                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                      <button
                        title="Edit Drive"
                        onClick={(e) => handleOpenEditModal(d, e)}
                        className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Drive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDriveToDelete(d);
                        }}
                        className="p-1 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Drive Applicants Table */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDrive ? (
            <div className="p-6 rounded-3xl glass-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-white truncate">{selectedDrive.title}</h2>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getDriveStatusBadge(selectedDrive.status)}`}>
                      {selectedDrive.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-white font-semibold">{selectedDrive.companyName}</span>
                    <span>&bull;</span>
                    <span>{selectedDrive.jobRole}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 font-bold">{selectedDrive.packageCtcLpa} LPA</span>
                    <span>&bull;</span>
                    <span>Min CGPA: {selectedDrive.minCgpa || 'N/A'}</span>
                    <span>&bull;</span>
                    <span>Deadline: {new Date(selectedDrive.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(selectedDrive)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDriveToDelete(selectedDrive)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {applications.length} Candidates
                  </span>
                </div>
              </div>

              {isLoadingApps ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto" />
                </div>
              ) : applications.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <Users className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">No student has applied to this drive yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px] uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Student Name</th>
                        <th className="pb-3 font-semibold">College / Branch</th>
                        <th className="pb-3 font-semibold">CGPA</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 pr-2">
                            <div className="font-bold text-white">{app.studentName}</div>
                            <div className="text-[11px] text-zinc-500">{app.studentEmail}</div>
                          </td>
                          <td className="py-3.5 pr-2 text-zinc-300">
                            <div>{app.collegeName || 'Bengaluru Institute'}</div>
                            <div className="text-[10px] text-zinc-500">{app.branch || 'CSE'}</div>
                          </td>
                          <td className="py-3.5 pr-2 font-mono font-bold text-zinc-200">
                            {app.cgpa || '8.2'}
                          </td>
                          <td className="py-3.5 pr-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(
                                app.status
                              )}`}
                            >
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {app.status === 'OFFERED' && (
                                <button
                                  onClick={() => handlePublishApplicationToHallOfFame(app)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold cursor-pointer transition border border-emerald-500/30 flex items-center gap-1"
                                  title="Publish to Verified Public Placements"
                                >
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  <span>Feature</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setStatusUpdateAppId(app.id);
                                  setSelectedNewStatus(app.status);
                                }}
                                className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold cursor-pointer transition border border-white/[0.08]"
                              >
                                Update Status
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center glass-card rounded-3xl">
              <p className="text-xs text-zinc-400">Select a placement drive on the left to view candidates or manage details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {driveToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#12131a] border border-rose-500/20 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Placement Drive?</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white">{driveToDelete.title}</span> ({driveToDelete.companyName})? All associated student applications and interview stages will be permanently removed.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDriveToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteDrive}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Drive</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusUpdateAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#12131a] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Update Candidate Pipeline Status</h3>
              <button
                onClick={() => setStatusUpdateAppId(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Hiring Stage Status</label>
                <select
                  value={selectedNewStatus}
                  onChange={(e) => setSelectedNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                >
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="OA_SCHEDULED">ONLINE ASSESSMENT SCHEDULED</option>
                  <option value="INTERVIEW_ROUND_1">TECHNICAL INTERVIEW (ROUND 1)</option>
                  <option value="INTERVIEW_ROUND_2">HR / MANAGEMENT INTERVIEW</option>
                  <option value="OFFERED">OFFERED (FINAL SELECTION)</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Recruiter Feedback / Notes</label>
                <textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  placeholder="e.g. Cleared coding round with 100% score. Interview scheduled for Friday 2 PM."
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusUpdateAppId(null)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(statusUpdateAppId)}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Placement Drive Modal */}
      {isDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleSaveDrive}
            className="w-full max-w-xl bg-[#12131a] border border-white/10 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-400" />
                <span>{editingDriveId ? 'Edit Placement Recruitment Drive' : 'Create Placement Recruitment Drive'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDriveModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Drive Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Amazon Software Development Engineer Recruitment Drive"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Amazon"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    placeholder="e.g. SDE-1"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Package (CTC LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.packageCtcLpa}
                    onChange={(e) => setFormData({ ...formData, packageCtcLpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Min Coding Score</label>
                  <input
                    type="number"
                    value={formData.minCodingScore}
                    onChange={(e) => setFormData({ ...formData, minCodingScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Drive Status</label>
                  <select
                    value={formData.status || 'OPEN'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DriveStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  >
                    <option value="OPEN">OPEN (Accepting Applications)</option>
                    <option value="UPCOMING">UPCOMING (Announced)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Shortlisting / OAs)</option>
                    <option value="COMPLETED">COMPLETED (Drive Concluded)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Openings Count</label>
                  <input
                    type="number"
                    value={formData.openingsCount || 10}
                    onChange={(e) => setFormData({ ...formData, openingsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Job Description &amp; Responsibilities</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail job requirements, core competencies in Java/Python, and interview stages..."
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Eligible Branches</label>
                  <input
                    type="text"
                    value={formData.eligibleBranches}
                    onChange={(e) => setFormData({ ...formData, eligibleBranches: e.target.value })}
                    placeholder="e.g. CSE, ISE, ECE, MCA"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsDriveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-1.5"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{editingDriveId ? 'Save Changes' : 'Create Recruitment Drive'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Admin Verified Placed Students Governance Modal */}
      {isPlacedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">Public Placement Hall of Fame Manager</h3>
              </div>
              <button
                onClick={() => setIsPlacedModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Decide which students are spotlighted in the public Placed Students section. Only students published here by the Administrator will be displayed.
            </p>

            {/* Currently Published Students */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Currently Published Students ({placedSpotlights.length})</span>
                {placedSpotlights.length > 0 && (
                  <button
                    onClick={() => savePlacedSpotlights([])}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline font-normal"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {placedSpotlights.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-300">No students are currently spotlighted.</p>
                  <p className="text-[11px] text-zinc-500">The public page is currently displaying the verified corporate partner hiring network instead of random fake names.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {placedSpotlights.map((student) => (
                    <div
                      key={student.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{student.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {student.company} &bull; {student.package}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {student.role} &bull; {student.college}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemovePlacedStudent(student.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold shrink-0 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Placed Student Form */}
            <form onSubmit={handleAddPlacedStudent} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Publish New Placed Student</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newPlacedForm.name}
                    onChange={(e) => setNewPlacedForm({ ...newPlacedForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">College / University</label>
                  <input
                    type="text"
                    value={newPlacedForm.college}
                    onChange={(e) => setNewPlacedForm({ ...newPlacedForm, college: e.target.value })}
                    placeholder="e.g. PES University, Bengaluru"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Hiring Company *</label>
                  <input
                    type="text"
                    required
                    value={newPlacedForm.company}
                    onChange={(e) => setNewPlacedForm({ ...newPlacedForm, company: e.target.value })}
                    placeholder="e.g. Amazon, Microsoft, Infosys"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Package (CTC)</label>
                  <input
                    type="text"
                    value={newPlacedForm.package}
                    onChange={(e) => setNewPlacedForm({ ...newPlacedForm, package: e.target.value })}
                    placeholder="e.g. 14.5 LPA"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={newPlacedForm.role}
                    onChange={(e) => setNewPlacedForm({ ...newPlacedForm, role: e.target.value })}
                    placeholder="e.g. SDE-1 / Full Stack Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Tier / Company Type</label>
                  <select
                    value={newPlacedForm.type}
                    onChange={(e) => setNewPlacedForm({ ...newPlacedForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tier-1 FAANG">Tier-1 FAANG</option>
                    <option value="Tier-1 Product">Tier-1 Product</option>
                    <option value="Product Company">Product Company</option>
                    <option value="Enterprise MNC">Enterprise MNC</option>
                    <option value="FinTech Unicorn">FinTech Unicorn</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Publish to Hall of Fame</span>
                </button>
              </div>
            </form>

            <div className="flex justify-end pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsPlacedModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

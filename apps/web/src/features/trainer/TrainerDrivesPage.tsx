import React, { useState, useEffect } from 'react';
import {
  placementApi,
  PlacementDriveResponse,
  PlacementApplicationResponse,
  CreatePlacementDriveRequest,
  ApplicationStatus,
} from '@/api/placements';
import {
  Briefcase,
  Plus,
  Users,
  X,
  Loader2,
} from 'lucide-react';

export const TrainerDrivesPage: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDriveResponse[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDriveResponse | null>(null);
  const [applications, setApplications] = useState<PlacementApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusUpdateAppId, setStatusUpdateAppId] = useState<string | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [recruiterNotes, setRecruiterNotes] = useState('');

  // Form state
  const [formData, setFormData] = useState<CreatePlacementDriveRequest>({
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
    openingsCount: 10,
  });

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    setIsLoading(true);
    try {
      const res = await placementApi.getAllDrives({ size: 50 });
      if (res?.content) {
        setDrives(res.content);
        const first = res.content[0];
        if (first && !selectedDrive) {
          viewDriveApplicants(first);
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

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await placementApi.createDrive({
        ...formData,
        packageCtcLpa: Number(formData.packageCtcLpa),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      });
      setIsCreateModalOpen(false);
      await loadDrives();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create drive');
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Placement Recruitment Drives
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Author company placement drives, review candidate rosters, and track student hiring progress.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 cursor-pointer transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Placement Drive</span>
        </button>
      </div>

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
                className={`p-4 rounded-2xl glass-card cursor-pointer transition-all border ${
                  selectedDrive?.id === d.id
                    ? 'border-violet-500/60 bg-violet-950/20 shadow-lg'
                    : 'border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-white text-sm">{d.companyName}</div>
                  <span className="text-xs font-black text-emerald-400">{d.packageCtcLpa} LPA</span>
                </div>
                <div className="text-xs text-zinc-300 mt-1">{d.jobRole}</div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{d.applicantCount} Applicants</span>
                  </span>
                  <span>Due {new Date(d.applicationDeadline).toLocaleDateString()}</span>
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
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedDrive.title}</h2>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {selectedDrive.companyName} &bull; {selectedDrive.jobRole} &bull; Package: {selectedDrive.packageCtcLpa} LPA
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
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
                              {app.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => {
                                setStatusUpdateAppId(app.id);
                                setSelectedNewStatus(app.status);
                              }}
                              className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold cursor-pointer transition border border-white/[0.08]"
                            >
                              Update Status
                            </button>
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
              <p className="text-xs text-zinc-400">Select a placement drive on the left to view candidates.</p>
            </div>
          )}
        </div>
      </div>

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

      {/* Create Placement Drive Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateDrive}
            className="w-full max-w-xl bg-[#12131a] border border-white/10 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-400" />
                <span>Create Placement Recruitment Drive</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
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
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30"
              >
                Create Recruitment Drive
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

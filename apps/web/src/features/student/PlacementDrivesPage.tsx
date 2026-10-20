import React, { useState, useEffect } from 'react';
import {
  placementApi,
  PlacementDriveResponse,
  PlacementApplicationResponse,
} from '@/api/placements';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Search,
  ArrowRight,
  FileCheck,
  Loader2,
  TrendingUp,
  MapPin,
  X,
  Send,
} from 'lucide-react';

export const PlacementDrivesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drives' | 'pipeline'>('drives');
  const [filterCategory, setFilterCategory] = useState<'all' | 'eligible' | 'high_ctc'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [drives, setDrives] = useState<PlacementDriveResponse[]>([]);
  const [applications, setApplications] = useState<PlacementApplicationResponse[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDriveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [drivesRes, appsRes] = await Promise.allSettled([
        placementApi.getAllDrives({ size: 50 }),
        placementApi.getMyApplications(),
      ]);

      if (drivesRes.status === 'fulfilled' && drivesRes.value?.content) {
        setDrives(drivesRes.value.content);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value) {
        setApplications(appsRes.value);
      }
    } catch (e) {
      console.error('Failed to load placement data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (driveId: string) => {
    setIsApplying(true);
    setApplySuccessMsg(null);
    try {
      await placementApi.applyToDrive(driveId);
      setApplySuccessMsg('Application submitted successfully! Your resume and profile snapshot were forwarded to the recruiting team.');
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.jobRole.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'eligible') {
      return d.eligible && !d.applied;
    }
    if (filterCategory === 'high_ctc') {
      return Number(d.packageCtcLpa) >= 10.0;
    }
    return true;
  });

  const highestPackage = drives.reduce(
    (max, d) => Math.max(max, Number(d.packageCtcLpa) || 0),
    0
  );

  const appliedDriveIds = new Set(applications.map((a) => a.driveId));

  // Kanban pipeline buckets
  const appliedApps = applications.filter((a) => a.status === 'APPLIED');
  const shortlistedApps = applications.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'OA_SCHEDULED'
  );
  const interviewApps = applications.filter(
    (a) => a.status === 'INTERVIEW_ROUND_1' || a.status === 'INTERVIEW_ROUND_2'
  );
  const offeredApps = applications.filter((a) => a.status === 'OFFERED');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Phase 6 Recruitment Portal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            Campus &amp; Partner Placement Drives
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Exclusive technology recruitment drives, verified compensation packages, and live application tracking.
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
              activeTab === 'drives'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Explore Drives ({drives.length})
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>My Pipeline</span>
            {applications.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-zinc-950 text-[10px] font-black flex items-center justify-center">
                {applications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Application Success Banner */}
      {applySuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{applySuccessMsg}</span>
          </div>
          <button
            onClick={() => setApplySuccessMsg(null)}
            className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-400 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top 4 Metric Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Active Drives</span>
            <Briefcase className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">{drives.length}</div>
          <div className="text-[11px] text-zinc-500 font-medium">Verified corporate recruiters</div>
        </div>

        <div className="p-4 rounded-2xl glass-card space-y-1">
          <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Highest Package</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{highestPackage.toFixed(1)} LPA</div>
          <div className="text-[11px] text-zinc-500 font-medium">Top tier engineering roles</div>
        </div>

        <div className="p-4 rounded-2xl glass-card space-y-1">
          <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Applications Filed</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{applications.length}</div>
          <div className="text-[11px] text-zinc-500 font-medium">In active interview stages</div>
        </div>

        <div className="p-4 rounded-2xl glass-card space-y-1">
          <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Offers Extended</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{offeredApps.length}</div>
          <div className="text-[11px] text-zinc-500 font-medium">Selected candidates</div>
        </div>
      </div>

      {/* EXPLORE DRIVES TAB */}
      {activeTab === 'drives' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company, job role, title..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['all', 'eligible', 'high_ctc'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    filterCategory === cat
                      ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-sm'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {cat === 'all'
                    ? 'All Drives'
                    : cat === 'eligible'
                    ? 'Eligible For Me'
                    : '10+ LPA Packages'}
                </button>
              ))}
            </div>
          </div>

          {/* Drives Cards Grid */}
          {isLoading ? (
            <div className="p-12 text-center glass-card rounded-3xl">
              <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto" />
            </div>
          ) : filteredDrives.length === 0 ? (
            <div className="p-12 text-center glass-card rounded-3xl space-y-2">
              <Building2 className="w-8 h-8 text-zinc-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No placement drives found</h3>
              <p className="text-xs text-zinc-500">Try adjusting your search or eligibility filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDrives.map((drive) => {
                const isAlreadyApplied = appliedDriveIds.has(drive.id) || drive.applied;
                return (
                  <div
                    key={drive.id}
                    className="p-6 rounded-3xl glass-card space-y-4 hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Company & CTC Package */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 p-1 flex items-center justify-center shrink-0">
                            {drive.companyLogoUrl ? (
                              <img
                                src={drive.companyLogoUrl}
                                alt={drive.companyName}
                                className="w-full h-full object-contain rounded-xl"
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-violet-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                              {drive.companyName}
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-500" />
                              <span>{drive.location || 'Bengaluru, India'}</span>
                            </div>
                          </div>
                        </div>

                        {/* CTC Package Badge */}
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          {Number(drive.packageCtcLpa).toFixed(1)} LPA
                        </span>
                      </div>

                      {/* Job Title & Role */}
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white leading-snug">
                          {drive.jobRole}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {drive.description}
                        </p>
                      </div>

                      {/* Eligibility Criteria Tags */}
                      <div className="pt-2 flex flex-wrap gap-1.5 text-[10px]">
                        {drive.minCgpa && (
                          <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                            Min CGPA: {drive.minCgpa}
                          </span>
                        )}
                        {drive.minCodingScore && (
                          <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                            Min Score: {drive.minCodingScore} pts
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                          {drive.openingsCount || 5} Openings
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDrive(drive)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold border border-white/[0.08] cursor-pointer transition"
                        >
                          Details
                        </button>

                        {isAlreadyApplied ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(drive.id)}
                            className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 cursor-pointer transition flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* KANBAN APPLICATION PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Column 1: Applied */}
            <div className="p-4 rounded-2xl glass-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-white/[0.06] pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <span>Applied</span>
                </span>
                <span className="font-mono text-zinc-400">{appliedApps.length}</span>
              </div>
              <div className="space-y-3">
                {appliedApps.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500 italic">No applications in this stage</div>
                ) : (
                  appliedApps.map((app) => (
                    <div key={app.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-white text-xs">{app.companyName}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{app.packageCtcLpa} LPA</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{app.jobRole}</div>
                      <div className="text-[10px] text-zinc-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: Shortlisted & OA */}
            <div className="p-4 rounded-2xl glass-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-white/[0.06] pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Shortlisted / OA</span>
                </span>
                <span className="font-mono text-zinc-400">{shortlistedApps.length}</span>
              </div>
              <div className="space-y-3">
                {shortlistedApps.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500 italic">No candidates shortlisted yet</div>
                ) : (
                  shortlistedApps.map((app) => (
                    <div key={app.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-cyan-500/30 space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-white text-xs">{app.companyName}</span>
                        <span className="text-[10px] text-cyan-300 font-bold">{app.packageCtcLpa} LPA</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{app.jobRole}</div>
                      {app.recruiterNotes && (
                        <div className="p-2 rounded-lg bg-cyan-950/40 text-[10px] text-cyan-200 border border-cyan-500/20">
                          {app.recruiterNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Technical Interviews */}
            <div className="p-4 rounded-2xl glass-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-white/[0.06] pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Technical Interviews</span>
                </span>
                <span className="font-mono text-zinc-400">{interviewApps.length}</span>
              </div>
              <div className="space-y-3">
                {interviewApps.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500 italic">No active interviews</div>
                ) : (
                  interviewApps.map((app) => (
                    <div key={app.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-amber-500/30 space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-white text-xs">{app.companyName}</span>
                        <span className="text-[10px] text-amber-300 font-bold">{app.packageCtcLpa} LPA</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{app.jobRole}</div>
                      {app.interviewDate && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                          <Calendar className="w-3 h-3" />
                          <span>Slot: {new Date(app.interviewDate).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 4: Offers Extended */}
            <div className="p-4 rounded-2xl glass-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 border-b border-white/[0.06] pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Offered 🎉</span>
                </span>
                <span className="font-mono text-zinc-400">{offeredApps.length}</span>
              </div>
              <div className="space-y-3">
                {offeredApps.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500 italic">Offers will display here</div>
                ) : (
                  offeredApps.map((app) => (
                    <div key={app.id} className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-in zoom-in">
                      <div className="flex items-center justify-between">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-emerald-300">
                          {app.offeredCtcLpa || app.packageCtcLpa} LPA
                        </span>
                      </div>
                      <div className="font-bold text-white text-xs">{app.companyName}</div>
                      <div className="text-[10px] text-zinc-300 font-medium">{app.jobRole}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">Offer Accepted &amp; Verified!</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drive Details Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#12131a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 p-1 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDrive.title}</h3>
                  <div className="text-xs text-zinc-400">{selectedDrive.companyName} &bull; {selectedDrive.location}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrive(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Job Description</div>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {selectedDrive.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-zinc-500 text-[10px] uppercase font-bold">Package Offered</div>
                <div className="text-emerald-400 font-black text-sm">{selectedDrive.packageCtcLpa} LPA</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-zinc-500 text-[10px] uppercase font-bold">Eligibility Status</div>
                <div className={`font-bold text-xs ${selectedDrive.eligible ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedDrive.eligibilityReason || (selectedDrive.eligible ? 'Eligible' : 'Check Requirements')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDrive(null)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer transition"
              >
                Close
              </button>
              {!appliedDriveIds.has(selectedDrive.id) && (
                <button
                  onClick={() => {
                    handleApply(selectedDrive.id);
                    setSelectedDrive(null);
                  }}
                  disabled={isApplying}
                  className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 cursor-pointer transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

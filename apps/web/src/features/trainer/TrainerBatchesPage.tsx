import React, { useState, useEffect } from 'react';
import {
  BatchManagementService,
  StudentProfilesService,
  BatchResponse,
  BatchStudentResponse,
  StudentProfileResponse,
} from '@/api/generated';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Users2,
  Calendar,
  Users,
  FileText,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  X,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const TrainerBatchesPage: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBatch, setSelectedBatch] = useState<BatchResponse | null>(null);
  const [roster, setRoster] = useState<BatchStudentResponse[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState<boolean>(false);

  // Student Profile Preview Modal
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<StudentProfileResponse | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrainerBatches = async () => {
      setIsLoading(true);
      try {
        // Fetch cohorts assigned to this trainer (or all cohorts if none explicitly filtered)
        const res = await BatchManagementService.getBatches(
          undefined,
          user?.id || undefined,
          undefined,
          0,
          50
        );
        if (res.data?.content && res.data.content.length > 0) {
          setBatches(res.data.content);
          const first = res.data.content[0];
          if (first) {
            handleSelectBatch(first);
          }
        } else {
          // If no batch is directly assigned, fetch all active cohorts
          const allRes = await BatchManagementService.getBatches(undefined, undefined, undefined, 0, 50);
          if (allRes.data?.content) {
            setBatches(allRes.data.content);
            const first = allRes.data.content[0];
            if (first) {
              handleSelectBatch(first);
            }
          }
        }
      } catch {
        // Handled silently
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerBatches();
  }, [user]);

  const handleSelectBatch = async (batch: BatchResponse) => {
    setSelectedBatch(batch);
    if (!batch.id) return;
    setIsLoadingRoster(true);
    try {
      const res = await BatchManagementService.getEnrolledStudents(batch.id, 0, 100);
      if (res.data?.content) {
        setRoster(res.data.content);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleInspectStudentProfile = async (studentId: string, studentName: string) => {
    setSelectedStudentName(studentName);
    setIsLoadingProfile(true);
    try {
      const res = await StudentProfilesService.getStudentProfile(studentId);
      if (res.data) {
        setSelectedStudentProfile(res.data);
      }
    } catch {
      setSelectedStudentProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          Trainer Cohorts &amp; Student Rosters
          <Users2 className="w-6 h-6 text-primary-400" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your assigned training batches, student rosters, academic profiles, and skills readiness.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        </div>
      ) : batches.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card border border-white/10 text-center space-y-3">
          <Users2 className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-white">No Assigned Cohorts</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You are not currently assigned as lead trainer for any cohorts. Your training administrator will assign batches to you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Batches Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Your Assigned Cohorts ({batches.length})
            </h2>

            <div className="space-y-3">
              {batches.map((batch) => {
                const isSelected = selectedBatch?.id === batch.id;
                return (
                  <div
                    key={batch.id}
                    onClick={() => handleSelectBatch(batch)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'glass-card border-primary-500/50 bg-primary-950/20 shadow-lg'
                        : 'glass-card border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-primary-500/10 text-primary-300 font-bold border border-primary-500/20">
                        {batch.code}
                      </span>
                      <StatusBadge status={batch.status || 'ACTIVE'} />
                    </div>

                    <h3 className="font-bold text-white text-sm">{batch.name}</h3>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        {batch.studentCount ?? 0} Students
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-primary-400' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Enrolled Student Roster */}
          <div className="lg:col-span-2 space-y-4">
            {selectedBatch ? (
              <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-6">
                {/* Cohort Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-primary-500/10 text-primary-300 font-bold border border-primary-500/20">
                        {selectedBatch.code}
                      </span>
                      <h2 className="text-xl font-bold text-white">{selectedBatch.name}</h2>
                    </div>
                    {selectedBatch.description && (
                      <p className="text-xs text-muted-foreground mt-1">{selectedBatch.description}</p>
                    )}
                  </div>

                  <div className="text-right text-xs text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {selectedBatch.startDate ? new Date(selectedBatch.startDate).toLocaleDateString() : 'TBD'} &mdash;{' '}
                      {selectedBatch.endDate ? new Date(selectedBatch.endDate).toLocaleDateString() : 'TBD'}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Enrolled: {selectedBatch.studentCount ?? 0} Students
                    </div>
                  </div>
                </div>

                {/* Roster Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-400" />
                      Enrolled Student Roster
                    </h3>
                    <span className="text-xs text-muted-foreground">{roster.length} candidate(s) enrolled</span>
                  </div>

                  {isLoadingRoster ? (
                    <div className="p-8 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                    </div>
                  ) : roster.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-white/10 rounded-xl">
                      No students currently enrolled in this cohort.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-slate-900/40">
                      {roster.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="p-3.5 flex items-center justify-between hover:bg-slate-900/80 transition-colors"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{enrollment.student?.fullName || 'Student'}</div>
                            <div className="text-[11px] text-muted-foreground">{enrollment.student?.email}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Enrolled: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              enrollment.student?.id &&
                              handleInspectStudentProfile(enrollment.student.id, enrollment.student.fullName || 'Student')
                            }
                            className="px-3 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-primary-500/20"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Profile
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">Select a cohort to view roster.</div>
            )}
          </div>
        </div>
      )}

      {/* STUDENT PROFILE PREVIEW MODAL */}
      {(selectedStudentProfile !== null || isLoadingProfile) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-card w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-5 bg-slate-950">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-400" />
                  {selectedStudentName}&apos;s Profile
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Academic details and placement readiness overview
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingProfile ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
              </div>
            ) : selectedStudentProfile ? (
              <div className="space-y-4 text-xs">
                {/* Completeness & Resume */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Readiness Score
                    </span>
                    <span className="text-sm font-bold text-white">
                      {selectedStudentProfile.completionPercentage ?? 0}% Complete
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Resume Status
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        selectedStudentProfile.hasResume ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {selectedStudentProfile.hasResume ? '✓ Uploaded' : 'Not Uploaded'}
                    </span>
                  </div>
                </div>

                {/* Academic credentials */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-muted-foreground">
                    Education Credentials
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Degree &amp; Branch:</span>
                      {selectedStudentProfile.degree || 'N/A'}{' '}
                      {selectedStudentProfile.branch ? `(${selectedStudentProfile.branch})` : ''}
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">CGPA:</span>
                      {selectedStudentProfile.cgpa !== undefined && selectedStudentProfile.cgpa !== null
                        ? selectedStudentProfile.cgpa.toFixed(2)
                        : 'N/A'}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-[10px]">College:</span>
                      {selectedStudentProfile.college || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Graduation Year:</span>
                      {selectedStudentProfile.graduationYear || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-muted-foreground">
                    Technical Skills ({selectedStudentProfile.skills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudentProfile.skills && selectedStudentProfile.skills.length > 0 ? (
                      selectedStudentProfile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 text-primary-300 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No skills specified</span>
                    )}
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-muted-foreground">
                    External Portfolios
                  </h3>
                  <div className="flex gap-4">
                    {selectedStudentProfile.githubUrl && (
                      <a
                        href={selectedStudentProfile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                    )}
                    {selectedStudentProfile.linkedinUrl && (
                      <a
                        href={selectedStudentProfile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                    {selectedStudentProfile.portfolioUrl && (
                      <a
                        href={selectedStudentProfile.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" /> Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No profile details recorded for this student yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

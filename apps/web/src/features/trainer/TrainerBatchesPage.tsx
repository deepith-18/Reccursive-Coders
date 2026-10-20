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
  Plus,
  Award,
  Trash2,
} from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { assignmentApi, AssignmentSummaryResponse } from '@/api/assignments';
import { questionApi, QuestionSummaryResponse } from '@/api/questions';

export const TrainerBatchesPage: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBatch, setSelectedBatch] = useState<BatchResponse | null>(null);
  const [roster, setRoster] = useState<BatchStudentResponse[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState<boolean>(false);

  // Batch Assignments State
  const [activeTab, setActiveTab] = useState<'roster' | 'assignments'>('roster');
  const [assignments, setAssignments] = useState<AssignmentSummaryResponse[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState<boolean>(false);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState<boolean>(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionSummaryResponse[]>([]);
  const [selectedQuestionMap, setSelectedQuestionMap] = useState<Record<string, { selected: boolean; points: number }>>({});
  const [assignTitle, setAssignTitle] = useState<string>('');
  const [assignDesc, setAssignDesc] = useState<string>('');
  const [assignDueDate, setAssignDueDate] = useState<string>('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState<boolean>(false);

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

  const fetchAssignments = async (batchId: string) => {
    setIsLoadingAssignments(true);
    try {
      const data = await assignmentApi.getAssignmentsByBatch(batchId);
      setAssignments(data || []);
    } catch {
      setAssignments([]);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  const handleSelectBatch = async (batch: BatchResponse) => {
    setSelectedBatch(batch);
    if (!batch.id) return;
    setIsLoadingRoster(true);
    fetchAssignments(batch.id);
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

  const handleOpenCreateAssignment = async () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setMinutes(nextWeek.getMinutes() - nextWeek.getTimezoneOffset());
    setAssignDueDate(nextWeek.toISOString().slice(0, 16));
    setAssignTitle('');
    setAssignDesc('');
    setSelectedQuestionMap({});
    setIsCreateAssignmentModalOpen(true);

    try {
      const res = await questionApi.listQuestions({ status: 'PUBLISHED', size: 100 });
      setAvailableQuestions(res.content || []);
    } catch {
      // Ignored
    }
  };

  const handleToggleQuestionSelection = (qId: string) => {
    setSelectedQuestionMap((prev) => {
      const current = prev[qId];
      if (current?.selected) {
        return { ...prev, [qId]: { selected: false, points: current.points } };
      } else {
        return { ...prev, [qId]: { selected: true, points: current?.points || 10 } };
      }
    });
  };

  const handleUpdateQuestionPoints = (qId: string, points: number) => {
    setSelectedQuestionMap((prev) => ({
      ...prev,
      [qId]: { selected: true, points },
    }));
  };

  const handleCreateAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch?.id) return;
    if (!assignTitle.trim()) {
      alert('Please enter an assignment title');
      return;
    }
    if (!assignDueDate) {
      alert('Please set a due date');
      return;
    }

    const questionItems = Object.entries(selectedQuestionMap)
      .filter(([_, val]) => val.selected)
      .map(([qId, val], idx) => ({
        questionId: qId,
        points: val.points || 10,
        orderIndex: idx,
      }));

    if (questionItems.length === 0) {
      alert('Please select at least one question for this assignment');
      return;
    }

    setIsSubmittingAssignment(true);
    try {
      await assignmentApi.createAssignment({
        batchId: selectedBatch.id,
        title: assignTitle.trim(),
        description: assignDesc.trim() || undefined,
        dueDate: new Date(assignDueDate).toISOString(),
        questions: questionItems,
      });
      setIsCreateAssignmentModalOpen(false);
      fetchAssignments(selectedBatch.id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleDeleteAssignment = async (id: string, title: string) => {
    if (!window.confirm(`Delete assignment "${title}"?`)) return;
    try {
      await assignmentApi.deleteAssignment(id);
      if (selectedBatch?.id) {
        fetchAssignments(selectedBatch.id);
      }
    } catch {
      alert('Failed to delete assignment');
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

                {/* Tabs: Roster vs Assignments */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <button
                    onClick={() => setActiveTab('roster')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'roster'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Student Roster ({roster.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeTab === 'assignments'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    Assignments ({assignments.length})
                  </button>
                </div>

                {/* Tab Content: Roster */}
                {activeTab === 'roster' && (
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
                )}

                {/* Tab Content: Assignments */}
                {activeTab === 'assignments' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary-400" />
                          Cohort Assignments
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Assigned problem sets with deadlines and automatic scoring
                        </p>
                      </div>
                      <button
                        onClick={handleOpenCreateAssignment}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90 transition shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Assignment
                      </button>
                    </div>

                    {isLoadingAssignments ? (
                      <div className="p-8 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                      </div>
                    ) : assignments.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-white/10 rounded-xl space-y-2">
                        <p>No assignments created for this batch yet.</p>
                        <button
                          onClick={handleOpenCreateAssignment}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition"
                        >
                          + Create First Assignment
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-4 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-900/80 transition flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{assignment.title}</h4>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    assignment.isPastDue
                                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  }`}
                                >
                                  {assignment.isPastDue ? 'Past Due' : 'Active'}
                                </span>
                              </div>
                              {assignment.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {assignment.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                                <span className="text-slate-300 font-medium">
                                  {assignment.totalPoints} Total Pts
                                </span>
                                <span>&bull;</span>
                                <span className="text-slate-300 font-medium">
                                  {assignment.questionCount} Problems
                                </span>
                                <span>&bull;</span>
                                <span>
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                                  {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                              title="Delete Assignment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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

      {/* CREATE BATCH ASSIGNMENT MODAL */}
      {isCreateAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-bold text-white">Create Batch Assignment</h2>
              </div>
              <button
                onClick={() => setIsCreateAssignmentModalOpen(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Week 1: Array Manipulation & Search"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Instructions / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Complete all questions before the deadline to earn batch streak points."
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-background border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Submission Deadline (Date &amp; Time) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Problem Selection Bank */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Select Questions from Problem Bank
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {Object.values(selectedQuestionMap).filter((v) => v.selected).length} selected
                  </span>
                </div>

                {availableQuestions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-4 text-center border border-dashed border-white/10 rounded-lg">
                    No published questions available. Please author questions first in Question Builder.
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto divide-y divide-white/5 border border-white/10 rounded-xl bg-slate-900/40 p-1">
                    {availableQuestions.map((q) => {
                      const isSelected = selectedQuestionMap[q.id]?.selected || false;
                      const points = selectedQuestionMap[q.id]?.points || 10;
                      return (
                        <div
                          key={q.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/80 transition rounded-lg"
                        >
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleQuestionSelection(q.id)}
                              className="rounded border-white/20 bg-background text-primary"
                            />
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                {q.title}
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                                    q.difficulty === 'EASY'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : q.difficulty === 'MEDIUM'
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  }`}
                                >
                                  {q.difficulty}
                                </span>
                              </div>
                              {q.tags && (
                                <div className="text-[10px] text-muted-foreground">{q.tags}</div>
                              )}
                            </div>
                          </label>

                          {isSelected && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[11px] text-muted-foreground">Pts:</span>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={points}
                                onChange={(e) =>
                                  handleUpdateQuestionPoints(q.id, Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 rounded bg-background border border-white/10 text-white text-xs font-mono text-center focus:outline-none focus:border-primary"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateAssignmentModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAssignment}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAssignment && <Loader2 className="w-4 h-4 animate-spin" />}
                  Assign to Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

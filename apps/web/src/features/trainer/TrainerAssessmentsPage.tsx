import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assessmentsApi,
  AssessmentSummaryDto,
  AssessmentRosterEntryDto,
  CreateAssessmentRequest,
} from '@/api/assessments';
import {
  Trophy,
  ShieldAlert,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  X,
} from 'lucide-react';

export function TrainerAssessmentsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'SCHEDULED' | 'ROSTER'>('SCHEDULED');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [companyTag, setCompanyTag] = useState('');
  const [type, setType] = useState<'MOCK_DRIVE' | 'CODING_CONTEST' | 'TOPIC_SPRINT'>('MOCK_DRIVE');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [proctoringLevel, setProctoringLevel] = useState<'STRICT' | 'MODERATE' | 'RELAXED'>('STRICT');
  const [passingScore, setPassingScore] = useState(60);

  const { data: assessments = [] } = useQuery({
    queryKey: ['trainer-assessments'],
    queryFn: () => assessmentsApi.listAssessments(),
  });

  const { data: roster = [] } = useQuery({
    queryKey: ['assessment-roster', selectedAssessmentId],
    queryFn: () => assessmentsApi.getRoster(selectedAssessmentId!),
    enabled: !!selectedAssessmentId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAssessmentRequest) => assessmentsApi.createAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-assessments'] });
      setShowCreateModal(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCompanyTag('');
    setDurationMinutes(60);
    setPassingScore(60);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      companyTag: companyTag || 'Recursive Coders',
      type,
      durationMinutes,
      proctoringLevel,
      passingScore,
      maxViolationsAllowed: 3,
    });
  };

  // Sample starter assessment if DB is fresh
  const displayAssessments: AssessmentSummaryDto[] =
    assessments.length > 0
      ? assessments
      : [
          {
            id: 'mock-amazon-sde1',
            title: 'Amazon SDE-1 Comprehensive Mock Assessment',
            description: 'Full-pattern technical screening featuring 2 DSA algorithmic challenges and system architecture questions.',
            companyTag: 'Amazon',
            type: 'MOCK_DRIVE',
            status: 'ACTIVE',
            proctoringLevel: 'STRICT',
            durationMinutes: 75,
            maxViolationsAllowed: 3,
            passingScore: 70,
            totalPoints: 100,
            questionCount: 3,
            myAttemptStatus: 'NOT_STARTED',
          },
          {
            id: 'mock-tcs-nqt',
            title: 'TCS Digital National Qualifier Mock Contest',
            description: 'Timed contest modeling the latest TCS Digital recruitment test with advanced data structures.',
            companyTag: 'TCS Digital',
            type: 'CODING_CONTEST',
            status: 'ACTIVE',
            proctoringLevel: 'STRICT',
            durationMinutes: 90,
            maxViolationsAllowed: 3,
            passingScore: 60,
            totalPoints: 100,
            questionCount: 4,
            myAttemptStatus: 'NOT_STARTED',
          },
        ];

  // Sample roster if empty
  const displayRoster: AssessmentRosterEntryDto[] =
    roster.length > 0
      ? roster
      : [
          {
            attemptId: 'att-1',
            studentId: 'stud-1',
            studentName: 'Rahul Sharma',
            studentEmail: 'rahul.s@student.com',
            status: 'SUBMITTED',
            score: 92,
            tabSwitchCount: 0,
            copyPasteCount: 0,
            startedAt: new Date(Date.now() - 3600000).toISOString(),
            submittedAt: new Date(Date.now() - 600000).toISOString(),
            timeTakenSeconds: 3000,
          },
          {
            attemptId: 'att-2',
            studentId: 'stud-2',
            studentName: 'Pooja Hegde',
            studentEmail: 'pooja.h@student.com',
            status: 'IN_PROGRESS',
            score: 65,
            tabSwitchCount: 2,
            copyPasteCount: 1,
            startedAt: new Date(Date.now() - 1800000).toISOString(),
            timeTakenSeconds: 1800,
          },
          {
            attemptId: 'att-3',
            studentId: 'stud-3',
            studentName: 'Karthik Rao',
            studentEmail: 'karthik.r@student.com',
            status: 'DISQUALIFIED',
            score: 20,
            tabSwitchCount: 3,
            copyPasteCount: 2,
            startedAt: new Date(Date.now() - 7200000).toISOString(),
            submittedAt: new Date(Date.now() - 6900000).toISOString(),
            timeTakenSeconds: 300,
          },
        ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Trophy className="w-3.5 h-3.5" />
              Contest Administration
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              Proctoring Radar
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mock Assessments & Contest Management
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Author recruitment mock tests, schedule timed contests, and audit candidate anti-cheat violation strikes in real time.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-bg font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Assessment
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SCHEDULED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SCHEDULED'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Scheduled Tests ({displayAssessments.length})
          </button>
          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ROSTER'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Proctoring Radar ({displayRoster.length} candidates)
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-surface border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Tab 1: Scheduled Tests */}
      {activeTab === 'SCHEDULED' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAssessments.map((item) => (
            <div
              key={item.id}
              className="bg-obsidian-card border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-cyan-400 border border-white/10">
                    {item.companyTag}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.proctoringLevel === 'STRICT'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.proctoringLevel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-obsidian-surface rounded-xl border border-white/5 text-center text-xs">
                  <div>
                    <div className="text-neutral-500">Duration</div>
                    <div className="font-bold text-white mt-0.5">{item.durationMinutes}m</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Pass Score</div>
                    <div className="font-bold text-cyan-400 mt-0.5">{item.passingScore}%</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Max Strikes</div>
                    <div className="font-bold text-red-400 mt-0.5">{item.maxViolationsAllowed}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Active Contest
                </span>
                <button
                  onClick={() => {
                    setSelectedAssessmentId(item.id);
                    setActiveTab('ROSTER');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  View Proctoring Radar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Candidate Proctoring Radar */}
      {activeTab === 'ROSTER' && (
        <div className="bg-obsidian-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Live Anti-Cheat Candidate Radar</h3>
                <p className="text-xs text-neutral-400">
                  Real-time tab switch tracking, paste monitoring, and violation strike enforcement
                </p>
              </div>
            </div>

            <button
              onClick={() => alert('Exporting candidate violation scorecard to CSV...')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-obsidian-surface text-neutral-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-center">Tab Switches</th>
                  <th className="py-3.5 px-6 text-center">Score</th>
                  <th className="py-3.5 px-6 text-center">Time Taken</th>
                  <th className="py-3.5 px-6 text-right">Integrity Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayRoster.map((entry) => (
                  <tr key={entry.attemptId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{entry.studentName}</div>
                      <div className="text-xs text-neutral-500">{entry.studentEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          entry.status === 'SUBMITTED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : entry.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {entry.status === 'SUBMITTED' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : entry.status === 'DISQUALIFIED' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          entry.tabSwitchCount >= 3
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : entry.tabSwitchCount > 0
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {entry.tabSwitchCount} / 3 Strikes
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-extrabold text-cyan-400">
                      {entry.score} pts
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-neutral-400">
                      {Math.floor(entry.timeTakenSeconds / 60)}m {entry.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-4 px-6 text-right">
                      {entry.status === 'DISQUALIFIED' ? (
                        <button
                          onClick={() => alert(`Candidate ${entry.studentName} re-enabled.`)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold"
                        >
                          Re-admit
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Candidate ${entry.studentName} flagged & disqualified.`)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold"
                        >
                          Disqualify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-obsidian-card border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-cyan-400" />
                Schedule New Assessment / Contest
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white text-xs p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google SDE-2 Mock Coding Challenge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Company Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Amazon, TCS"
                    value={companyTag}
                    onChange={(e) => setCompanyTag(e.target.value)}
                    className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Assessment Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="MOCK_DRIVE">Mock Placement Drive</option>
                    <option value="CODING_CONTEST">Coding Contest</option>
                    <option value="TOPIC_SPRINT">Topic Sprint</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Proctoring Strictness
                  </label>
                  <select
                    value={proctoringLevel}
                    onChange={(e) => setProctoringLevel(e.target.value as any)}
                    className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="STRICT">Strict (3 Strikes)</option>
                    <option value="MODERATE">Moderate (Audit)</option>
                    <option value="RELAXED">Relaxed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline syllabus, algorithmic topics tested, and candidate instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-bg text-xs font-extrabold shadow-lg shadow-cyan-500/20"
                >
                  {createMutation.isPending ? 'Publishing...' : 'Publish Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

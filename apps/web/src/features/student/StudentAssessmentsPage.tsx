import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  assessmentsApi,
  AssessmentSummaryDto,
} from '@/api/assessments';
import {
  Trophy,
  Timer,
  ShieldAlert,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export function StudentAssessmentsPage() {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'HISTORY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<string | null>(null);

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['student-assessments'],
    queryFn: () => assessmentsApi.listAssessments(),
  });

  const { data: leaderboard = [], isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ['assessment-leaderboard', selectedLeaderboardId],
    queryFn: () => assessmentsApi.getLeaderboard(selectedLeaderboardId!),
    enabled: !!selectedLeaderboardId,
  });

  // Sample starter assessment if DB is fresh
  const displayAssessments: AssessmentSummaryDto[] = assessments.length > 0
    ? assessments
    : [
        {
          id: 'mock-amazon-sde1',
          title: 'Amazon SDE-1 Comprehensive Mock Assessment',
          description: 'Full-pattern technical screening featuring 2 DSA algorithmic challenges and system architecture questions under timed conditions.',
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
          description: 'Timed contest modeling the latest TCS Digital recruitment test with advanced data structures, sliding window, and graph traversal.',
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
        {
          id: 'mock-dp-sprint',
          title: 'Dynamic Programming Master Sprint',
          description: 'Intense topic assessment on Knapsack patterns, Longest Common Subsequence, and Multi-dimensional Memoization.',
          companyTag: 'Recursive Coders',
          type: 'TOPIC_SPRINT',
          status: 'ACTIVE',
          proctoringLevel: 'MODERATE',
          durationMinutes: 60,
          maxViolationsAllowed: 5,
          passingScore: 65,
          totalPoints: 100,
          questionCount: 3,
          myAttemptStatus: 'NOT_STARTED',
        },
      ];

  const filteredAssessments = displayAssessments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.companyTag && a.companyTag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'ACTIVE') return a.status === 'ACTIVE';
    if (filterTab === 'UPCOMING') return a.status === 'UPCOMING';
    if (filterTab === 'HISTORY') return a.myAttemptStatus === 'SUBMITTED' || a.myAttemptStatus === 'DISQUALIFIED';
    return true;
  });

  const activeCount = displayAssessments.filter((a) => a.status === 'ACTIVE').length;
  const completedCount = displayAssessments.filter((a) => a.myAttemptStatus === 'SUBMITTED').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-obsidian-card via-obsidian-surface to-obsidian-card border border-white/10 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Phase 9: Proctored Assessment Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldAlert className="w-3.5 h-3.5" />
                Anti-Cheat Active
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Mock Assessments & Coding Contests
            </h1>
            <p className="text-neutral-400 mt-2 max-w-2xl text-sm leading-relaxed">
              Experience authentic recruitment evaluations with timed test durations, automated code validation, and full-screen proctoring with tab-switch limits.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="bg-obsidian-bg/80 border border-white/5 rounded-xl p-4 text-center min-w-[110px]">
              <div className="text-2xl font-bold text-cyan-400">{activeCount}</div>
              <div className="text-xs text-neutral-400 mt-1">Live Contests</div>
            </div>
            <div className="bg-obsidian-bg/80 border border-white/5 rounded-xl p-4 text-center min-w-[110px]">
              <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
              <div className="text-xs text-neutral-400 mt-1">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-obsidian-surface border border-white/5 rounded-xl w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'All Contests' },
            { key: 'ACTIVE', label: 'Live Now' },
            { key: 'UPCOMING', label: 'Upcoming' },
            { key: 'HISTORY', label: 'My Scorecards' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterTab === tab.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-surface border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-neutral-500">
            Loading scheduled assessments...
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-obsidian-card border border-white/5 rounded-2xl p-8">
            <Trophy className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No assessments match your filter</h3>
            <p className="text-sm text-neutral-400 mt-1">Try switching tabs or searching with different keywords.</p>
          </div>
        ) : (
          filteredAssessments.map((item) => {
            const isCompleted = item.myAttemptStatus === 'SUBMITTED';
            const isDisqualified = item.myAttemptStatus === 'DISQUALIFIED';
            const isInProgress = item.myAttemptStatus === 'IN_PROGRESS';

            return (
              <div
                key={item.id}
                className="group relative bg-obsidian-card border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-cyan-300 border border-white/10">
                      {item.companyTag || 'Recursive Coders'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.proctoringLevel === 'STRICT'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      {item.proctoringLevel}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-obsidian-surface border border-white/5 text-center">
                    <div>
                      <div className="text-xs text-neutral-400">Duration</div>
                      <div className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {item.durationMinutes}m
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Problems</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {item.questionCount || 3}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Total</div>
                      <div className="text-sm font-bold text-cyan-400 mt-0.5">
                        {item.totalPoints} pts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedLeaderboardId(item.id)}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Standings
                  </button>

                  {isCompleted ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Score: {item.myScore}/{item.totalPoints}
                    </div>
                  ) : isDisqualified ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      Disqualified
                    </div>
                  ) : isInProgress ? (
                    <button
                      onClick={() => navigate(`/student/assessments/${item.id}/arena`)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-obsidian-bg hover:bg-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 animate-pulse"
                    >
                      <Timer className="w-3.5 h-3.5" />
                      Resume Test
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/student/assessments/${item.id}/arena`)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-bg font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Enter Arena
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Live Standings Modal */}
      {selectedLeaderboardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-obsidian-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Contest Live Standings</h3>
                  <p className="text-xs text-neutral-400">Rankings updated in real-time by score and duration</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeaderboardId(null)}
                className="text-neutral-400 hover:text-white text-sm px-3 py-1.5 rounded-lg bg-white/5"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto">
              {isLoadingLeaderboard ? (
                <div className="text-center py-8 text-neutral-500 text-sm">Loading standings...</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  No submissions yet. Be the first to enter the arena and submit!
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-neutral-400 text-xs border-b border-white/10 pb-2">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Candidate</th>
                      <th className="pb-3 text-center">Score</th>
                      <th className="pb-3 text-center">Time</th>
                      <th className="pb-3 text-right">Violations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboard.map((entry) => (
                      <tr key={entry.studentId} className="hover:bg-white/[0.02]">
                        <td className="py-3">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                              entry.rank === 1
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : entry.rank === 2
                                ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30'
                                : entry.rank === 3
                                ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30'
                                : 'text-neutral-400'
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-white">{entry.studentName}</div>
                          <div className="text-xs text-neutral-500">{entry.studentEmail}</div>
                        </td>
                        <td className="py-3 text-center font-bold text-cyan-400">
                          {entry.score} pts
                        </td>
                        <td className="py-3 text-center text-xs text-neutral-400">
                          {Math.floor(entry.timeTakenSeconds / 60)}m {entry.timeTakenSeconds % 60}s
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              entry.tabSwitchCount === 0
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {entry.tabSwitchCount} strikes
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

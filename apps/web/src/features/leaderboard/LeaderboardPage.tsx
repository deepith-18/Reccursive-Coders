import React, { useState, useEffect } from 'react';
import { leaderboardApi, LeaderboardEntryDto } from '@/api/leaderboards';
import { BatchManagementService } from '@/api/generated';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Trophy,
  Flame,
  Users,
  Search,
  Sparkles,
  Loader2,
  Medal,
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'BATCH'>('GLOBAL');
  const [globalEntries, setGlobalEntries] = useState<LeaderboardEntryDto[]>([]);
  const [batchEntries, setBatchEntries] = useState<LeaderboardEntryDto[]>([]);
  const [myBatchId, setMyBatchId] = useState<string | null>(null);
  const [myBatchName, setMyBatchName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load global & batch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [globalRes, myBatchRes] = await Promise.allSettled([
          leaderboardApi.getGlobalLeaderboard(0, 50),
          BatchManagementService.getMyActiveBatch(),
        ]);

        if (globalRes.status === 'fulfilled' && globalRes.value?.content) {
          setGlobalEntries(globalRes.value.content);
        }

        if (myBatchRes.status === 'fulfilled' && myBatchRes.value?.data?.id) {
          const b = myBatchRes.value.data;
          const bId = b.id as string;
          setMyBatchId(bId);
          setMyBatchName(b.name || '');
          const batchRes = await leaderboardApi.getBatchLeaderboard(bId);
          setBatchEntries(batchRes || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentList = activeTab === 'GLOBAL' ? globalEntries : batchEntries;

  const filteredEntries = currentList.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.college && e.college.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const topThree = filteredEntries.slice(0, 3);
  const remainingEntries = filteredEntries.slice(3);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Competitive Leaderboards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time rankings based on algorithmic problem score, total solves, and consistency streaks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-white/10 text-xs self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('GLOBAL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'GLOBAL'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Global Rankings
          </button>
          <button
            onClick={() => setActiveTab('BATCH')}
            disabled={!myBatchId}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === 'BATCH'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-primary-300" />
            {myBatchName ? `Cohort: ${myBatchName}` : 'My Cohort Batch'}
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card/40 border border-white/10 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student name, college, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/80 border border-white/10 text-white text-xs focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong className="text-white">{filteredEntries.length}</strong> ranked students
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-400 mb-3" />
          <p className="text-sm text-muted-foreground">Computing real-time leaderboard standings...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-card/30">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Standings Available</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {activeTab === 'BATCH' && !myBatchId
              ? 'You are not enrolled in an active cohort batch yet.'
              : 'Submit solutions to coding practice problems or assignments to appear on the leaderboard!'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 3 Podium Cards */}
          {topThree.length > 0 && (() => {
            const first = topThree[0];
            const second = topThree[1];
            const third = topThree[2];

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {/* 2nd Place (Silver) */}
                {second && (
                  <div className="relative order-2 md:order-1 rounded-2xl border border-slate-400/30 bg-gradient-to-b from-slate-500/10 to-card/60 p-6 flex flex-col items-center text-center shadow-xl backdrop-blur-md">
                    <div className="absolute -top-5 w-10 h-10 rounded-full bg-slate-400 text-slate-950 font-black flex items-center justify-center text-base shadow-lg border-2 border-white/20">
                      2
                    </div>
                    <div className="w-16 h-16 rounded-full bg-slate-700/60 border-2 border-slate-300 flex items-center justify-center text-xl font-bold text-slate-200 mt-2 mb-3">
                      {second.fullName.charAt(0)}
                    </div>
                    <h3 className="text-base font-bold text-white">{second.fullName}</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-full">
                      {second.college || second.email}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-around text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Score</span>
                        <strong className="text-slate-100 text-sm font-extrabold">{second.totalScore} pts</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Solved</span>
                        <strong className="text-emerald-400 text-sm">{second.problemsSolved}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Streak</span>
                        <strong className="text-amber-400 text-sm flex items-center justify-center gap-0.5">
                          <Flame className="w-3.5 h-3.5 fill-amber-400/40" />
                          {second.currentStreak}d
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place (Gold Champion) */}
                {first && (
                  <div className="relative order-1 md:order-2 rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-500/20 via-amber-950/10 to-card/80 p-7 flex flex-col items-center text-center shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-md -translate-y-3">
                    <div className="absolute -top-6 w-12 h-12 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.6)] border-2 border-white/40">
                      <Trophy className="w-6 h-6 fill-amber-950" />
                    </div>
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl font-black text-amber-300 mt-2 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      {first.fullName.charAt(0)}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[11px] font-extrabold text-amber-300 mb-1">
                      CHAMPION &bull; RANK 1
                    </div>
                    <h3 className="text-lg font-extrabold text-white">{first.fullName}</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-full">
                      {first.college || first.email}
                    </p>

                    <div className="mt-5 pt-4 border-t border-amber-400/20 w-full flex items-center justify-around text-xs">
                      <div>
                        <span className="text-amber-300/80 block text-[10px] uppercase font-bold">Total Score</span>
                        <strong className="text-white text-base font-black">{first.totalScore} pts</strong>
                      </div>
                      <div>
                        <span className="text-amber-300/80 block text-[10px] uppercase font-bold">Solved</span>
                        <strong className="text-emerald-400 text-base font-bold">{first.problemsSolved}</strong>
                      </div>
                      <div>
                        <span className="text-amber-300/80 block text-[10px] uppercase font-bold">Streak</span>
                        <strong className="text-amber-400 text-base font-bold flex items-center justify-center gap-0.5">
                          <Flame className="w-4 h-4 fill-amber-400" />
                          {first.currentStreak}d
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Bronze) */}
                {third && (
                  <div className="relative order-3 md:order-3 rounded-2xl border border-amber-700/40 bg-gradient-to-b from-amber-800/15 to-card/60 p-6 flex flex-col items-center text-center shadow-xl backdrop-blur-md">
                    <div className="absolute -top-5 w-10 h-10 rounded-full bg-amber-700 text-amber-100 font-black flex items-center justify-center text-base shadow-lg border-2 border-white/20">
                      3
                    </div>
                    <div className="w-16 h-16 rounded-full bg-amber-900/60 border-2 border-amber-600 flex items-center justify-center text-xl font-bold text-amber-200 mt-2 mb-3">
                      {third.fullName.charAt(0)}
                    </div>
                    <h3 className="text-base font-bold text-white">{third.fullName}</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-full">
                      {third.college || third.email}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-around text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Score</span>
                        <strong className="text-slate-100 text-sm font-extrabold">{third.totalScore} pts</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Solved</span>
                        <strong className="text-emerald-400 text-sm">{third.problemsSolved}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Streak</span>
                        <strong className="text-amber-400 text-sm flex items-center justify-center gap-0.5">
                          <Flame className="w-3.5 h-3.5 fill-amber-400/40" />
                          {third.currentStreak}d
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Table for Ranks 4+ */}
          {remainingEntries.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary-400" />
                  Remaining Contenders (Ranks 4 - {filteredEntries.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-6">Rank</th>
                      <th className="py-3 px-6">Student</th>
                      <th className="py-3 px-6">College / Batch</th>
                      <th className="py-3 px-6 text-right">Problems Solved</th>
                      <th className="py-3 px-6 text-right">Streak</th>
                      <th className="py-3 px-6 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {remainingEntries.map((e) => {
                      const isMe = user?.id === e.userId;
                      return (
                        <tr
                          key={e.userId}
                          className={`hover:bg-white/[0.03] transition-colors ${
                            isMe ? 'bg-primary/10 border-l-4 border-primary font-bold' : ''
                          }`}
                        >
                          <td className="py-4 px-6 font-mono text-slate-300 font-bold">
                            #{e.rank}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                {e.fullName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-semibold text-white flex items-center gap-1.5">
                                  {e.fullName}
                                  {isMe && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary text-primary-foreground font-bold">
                                      YOU
                                    </span>
                                  )}
                                </span>
                                <span className="text-[11px] text-muted-foreground block">{e.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-300">
                            {e.college ? (
                              <span>
                                {e.college} {e.graduationYear ? `(${e.graduationYear})` : ''}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">Not specified</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-emerald-400">
                            {e.problemsSolved}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                              <Flame className="w-3.5 h-3.5 fill-amber-400/30" />
                              {e.currentStreak}d
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-extrabold text-white text-sm">
                            {e.totalScore} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Swords,
  X,
  Trophy,
  Zap,
  Timer,
  CheckCircle2,
  Users,
  Code2,
} from 'lucide-react';

interface CodeBattlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchBattle?: (battleId: string) => void;
}

export const CodeBattlesModal: React.FC<CodeBattlesModalProps> = ({
  isOpen,
  onClose,
  onLaunchBattle,
}) => {
  const [matchingState, setMatchingState] = useState<'idle' | 'matching' | 'matched' | 'battling'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [myProgress, setMyProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [battleTimer, setBattleTimer] = useState(120);
  const [battleWinner, setBattleWinner] = useState<'me' | 'opponent' | null>(null);

  const opponent = {
    name: 'Devika Sharma',
    college: 'RV College of Engineering, Bengaluru',
    rating: 1680,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    streak: 14,
  };

  const handleStartMatch = () => {
    setMatchingState('matching');
    setTimeout(() => {
      setMatchingState('matched');
      let c = 3;
      const countInt = setInterval(() => {
        c--;
        setCountdown(c);
        if (c <= 0) {
          clearInterval(countInt);
          setMatchingState('battling');
          startBattleSim();
        }
      }, 1000);
    }, 2200);
  };

  const startBattleSim = () => {
    setMyProgress(0);
    setOpponentProgress(0);
    setBattleTimer(120);
    setBattleWinner(null);

    // Simulate progress
    const battleInt = setInterval(() => {
      setBattleTimer((t) => {
        if (t <= 1) {
          clearInterval(battleInt);
          setBattleWinner('me');
          return 0;
        }
        return t - 1;
      });

      setOpponentProgress((prev) => {
        if (prev >= 100) return 100;
        const add = Math.random() > 0.4 ? Math.floor(Math.random() * 25) : 0;
        return Math.min(100, prev + add);
      });
    }, 1500);
  };

  const submitTest = () => {
    setMyProgress((prev) => {
      const next = prev + 34;
      if (next >= 100) {
        setBattleWinner('me');
        return 100;
      }
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#12131a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-violet-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <Swords className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">Code Battles Arena</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Live 1v1
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Real-time algorithmic duels with peers across Bengaluru tech colleges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {matchingState === 'idle' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-violet-500/20 animate-pulse">
                <div className="w-full h-full bg-[#12131a] rounded-[22px] flex items-center justify-center">
                  <Swords className="w-9 h-9 text-violet-400" />
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white">Find a Competitive Match</h3>
                <p className="text-xs text-zinc-400">
                  Compete head-to-head on LeetCode-style algorithmic challenges. First coder to pass all hidden test cases takes the trophy, rating boost, and XP!
                </p>
              </div>

              {/* Arena Stats */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-sm font-black text-amber-400">1,540</div>
                  <div className="text-[10px] text-zinc-400">Your Rating</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-sm font-black text-emerald-400">84%</div>
                  <div className="text-[10px] text-zinc-400">Win Rate</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-sm font-black text-violet-400">18 Online</div>
                  <div className="text-[10px] text-zinc-400">In Queue</div>
                </div>
              </div>

              <button
                onClick={handleStartMatch}
                className="w-full max-w-sm mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-violet-600/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Enter Matchmaking Queue</span>
              </button>
            </div>
          )}

          {matchingState === 'matching' && (
            <div className="space-y-6 text-center py-10">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-cyan-500/20 border-b-cyan-400 animate-spin [animation-duration:1.5s]" />
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-violet-300" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Searching for an opponent...</h4>
                <p className="text-xs text-zinc-400">Matching with candidate in rating bracket ±100</p>
              </div>
            </div>
          )}

          {matchingState === 'matched' && (
            <div className="space-y-6 text-center py-6">
              <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 animate-pulse">
                Opponent Found!
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-violet-600/30 border-2 border-violet-400 flex items-center justify-center font-bold text-lg text-white mx-auto">
                    YOU
                  </div>
                  <div className="text-xs font-bold text-white">Alex Chen</div>
                  <div className="text-[10px] text-zinc-400">Rating 1540</div>
                </div>

                <div className="text-2xl font-black text-zinc-500 italic">VS</div>

                <div className="text-center space-y-2">
                  <img
                    src={opponent.avatar}
                    alt={opponent.name}
                    className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover mx-auto"
                  />
                  <div className="text-xs font-bold text-white">{opponent.name}</div>
                  <div className="text-[10px] text-zinc-400">Rating {opponent.rating}</div>
                </div>
              </div>

              <div className="text-3xl font-black text-amber-400 animate-bounce">
                Starting in {countdown}...
              </div>
            </div>
          )}

          {matchingState === 'battling' && (
            <div className="space-y-5">
              {/* Problem info */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400 font-semibold">DUEL CHALLENGE</div>
                  <div className="text-sm font-bold text-white">Optimal Valid Palindrome II</div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <Timer className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(battleTimer / 60)}:{(battleTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Live Race Bars */}
              <div className="space-y-4">
                {/* User bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-violet-300">You (Alex Chen)</span>
                    <span className="font-mono text-zinc-400">{Math.min(100, myProgress)}% Testcases Passed</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, myProgress)}%` }}
                    />
                  </div>
                </div>

                {/* Opponent bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-cyan-300">{opponent.name}</span>
                    <span className="font-mono text-zinc-400">{Math.min(100, opponentProgress)}% Testcases Passed</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, opponentProgress)}%` }}
                    />
                  </div>
                </div>
              </div>

              {battleWinner ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2 animate-in zoom-in">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-300">
                    {battleWinner === 'me' ? 'VICTORY! All Testcases Passed' : 'Match Concluded'}
                  </h4>
                  <div className="text-xs text-zinc-300">
                    +150 XP &bull; +28 Arena Rating &bull; Current Rank: Grandmaster Candidate
                  </div>
                  <button
                    onClick={() => setMatchingState('idle')}
                    className="mt-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={submitTest}
                    className="flex-1 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pass Next Test Case Batch</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      if (onLaunchBattle) onLaunchBattle('duel-1');
                    }}
                    className="py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 font-semibold text-xs border border-white/10 cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Open Editor</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

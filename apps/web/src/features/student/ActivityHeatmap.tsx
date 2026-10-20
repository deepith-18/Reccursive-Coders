import React, { useState } from 'react';
import { DailyHeatmapDto } from '@/api/scoring';
import { Flame, Trophy, Calendar, Zap } from 'lucide-react';

interface ActivityHeatmapProps {
  heatmapData: DailyHeatmapDto[];
  currentStreak: number;
  longestStreak: number;
  totalScore?: number;
  problemsSolved?: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  heatmapData,
  currentStreak,
  longestStreak,
  totalScore,
  problemsSolved,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DailyHeatmapDto | null>(null);

  // Group the days into 7-day columns (weeks)
  // Ensure we display in chronological order
  const totalSubmissions = heatmapData.reduce((acc, curr) => acc + curr.count, 0);

  // Calculate weeks
  const weeks: DailyHeatmapDto[][] = [];
  let currentWeek: DailyHeatmapDto[] = [];

  heatmapData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === heatmapData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-950/70 border-emerald-800/60 hover:bg-emerald-800';
      case 2:
        return 'bg-emerald-700/80 border-emerald-600/70 hover:bg-emerald-600';
      case 3:
        return 'bg-emerald-500 border-emerald-400 hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 4:
        return 'bg-emerald-400 border-emerald-300 hover:bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]';
      default:
        return 'bg-white/[0.04] border-white/[0.06] hover:border-white/20';
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md shadow-xl space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Coding Activity &amp; Consistency
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            IST Calendar streak tracking (Asia/Kolkata boundary at midnight)
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Current Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold shadow-inner">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
            <span>Current Streak:</span>
            <span className="text-sm font-extrabold text-amber-300">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
          </div>

          {/* Longest Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold shadow-inner">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>Longest Streak:</span>
            <span className="text-sm font-extrabold text-purple-300">{longestStreak} {longestStreak === 1 ? 'day' : 'days'}</span>
          </div>

          {/* Total Points if provided */}
          {totalScore !== undefined && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-300 font-semibold">
              <Zap className="w-4 h-4 text-primary-400" />
              <span>Score:</span>
              <span className="text-sm font-extrabold text-white">{totalScore} pts</span>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex gap-[3px] min-w-max">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3.5 h-3.5 rounded-[3px] border transition-all cursor-pointer ${getCellColor(
                      day.level
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hover Tooltip display */}
        <div className="min-h-[28px] mt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-3">
          {hoveredDay ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">
                {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="text-emerald-400 font-bold">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'submission' : 'submissions'}
              </span>
              {hoveredDay.problemsSolved > 0 && (
                <span className="text-primary-300">
                  &bull; {hoveredDay.problemsSolved} solved
                </span>
              )}
              {hoveredDay.pointsEarned > 0 && (
                <span className="text-amber-300">
                  &bull; +{hoveredDay.pointsEarned} pts
                </span>
              )}
            </div>
          ) : (
            <span>
              <strong className="text-white">{totalSubmissions}</strong> submissions across the past 365 days
              {problemsSolved !== undefined && (
                <span className="ml-2 text-primary-400 font-semibold">
                  ({problemsSolved} problems solved)
                </span>
              )}
            </span>
          )}

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Less</span>
            <div className="w-3 h-3 rounded-[2px] bg-white/[0.04] border border-white/[0.06]" />
            <div className="w-3 h-3 rounded-[2px] bg-emerald-950/70 border border-emerald-800/60" />
            <div className="w-3 h-3 rounded-[2px] bg-emerald-700/80 border border-emerald-600/70" />
            <div className="w-3 h-3 rounded-[2px] bg-emerald-500 border border-emerald-400" />
            <div className="w-3 h-3 rounded-[2px] bg-emerald-400 border border-emerald-300" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

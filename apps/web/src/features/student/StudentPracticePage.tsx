import React, { useState, useEffect } from 'react';
import {
  questionApi,
  QuestionDifficulty,
  QuestionSummaryResponse,
  QuestionResponse,
} from '@/api/questions';
import {
  Code,
  Search,
  Clock,
  Cpu,
  BookOpen,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { CodingWorkspace } from './CodingWorkspace';

export const StudentPracticePage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Selected Problem Workspace
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await questionApi.listQuestions({
        difficulty: selectedDifficulty !== 'ALL' ? (selectedDifficulty as QuestionDifficulty) : undefined,
        search: searchQuery.trim() || undefined,
        status: 'PUBLISHED',
        size: 50,
      });
      setQuestions(res.content || []);
    } catch (err) {
      console.error('Failed to load practice questions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleOpenProblem = async (id: string) => {
    try {
      const res = await questionApi.getQuestionById(id);
      setSelectedQuestion(res);
    } catch (err) {
      console.error('Failed to load problem details', err);
    }
  };

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <Code className="w-6 h-6 text-emerald-400" />
          Coding Practice
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Curated algorithmic problem bank with in-browser compilation &amp; test verification.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3.5 rounded-2xl glass-card">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search problem title, algorithms, data structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] text-xs self-start md:self-auto">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-400 mb-3" />
          <p className="text-xs text-zinc-400">Loading practice problem bank...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card">
          <BookOpen className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Practice Problems Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try adjusting your search keywords or difficulty filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => handleOpenProblem(q.id)}
              className="p-5 rounded-2xl glass-card cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getDifficultyBadge(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                  <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {q.timeLimitMs}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-zinc-500" />
                      {q.memoryLimitMb}MB
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  {q.title}
                </h3>

                {q.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-zinc-400 border border-white/[0.06] font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {q.sampleCasesCount} sample test cases
                </span>
                <span className="text-violet-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-xs">
                  <span>Solve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL SCREEN / IMMERSIVE CODING WORKSPACE */}
      {selectedQuestion && (
        <CodingWorkspace
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
};

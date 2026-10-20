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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Code className="w-7 h-7 text-primary-400" />
          Coding Practice
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sharpen your algorithmic problem solving skills with curated placement coding questions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-xl border border-white/10 bg-card/40 backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problem title, algorithms, data structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition"
          />
        </form>

        <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-white/10 text-xs self-start md:self-auto">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-white'
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
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-400 mb-3" />
          <p className="text-sm text-muted-foreground">Loading practice problem bank...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-card/30">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Practice Problems Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try adjusting your search keywords or difficulty filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => handleOpenProblem(q.id)}
              className="p-5 rounded-xl border border-white/10 bg-card/40 hover:bg-card/80 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {q.timeLimitMs}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      {q.memoryLimitMb}MB
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition">
                  {q.title}
                </h3>

                {q.tags && (
                  <div className="flex flex-wrap gap-1">
                    {q.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-300 border border-white/5"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {q.sampleCasesCount} sample test cases
                </span>
                <span className="text-primary-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Solve &rarr;
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

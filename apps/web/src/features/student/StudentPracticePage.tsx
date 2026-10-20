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
  X,
  Loader2,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';

export const StudentPracticePage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Selected Problem Drawer / Modal
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedLang, setSelectedLang] = useState<'java' | 'python' | 'cpp'>('python');

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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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

      {/* PROBLEM DETAILS DRAWER / MODAL */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                    selectedQuestion.difficulty
                  )}`}
                >
                  {selectedQuestion.difficulty}
                </span>
                <h2 className="text-lg font-bold text-white">{selectedQuestion.title}</h2>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-muted-foreground hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Resource Limits info */}
              <div className="flex flex-wrap items-center gap-4 text-xs bg-muted/20 p-3 rounded-lg border border-white/10">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-primary-400" />
                  Time Limit: {selectedQuestion.timeLimitMs}ms
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-primary-400" />
                  Memory Limit: {selectedQuestion.memoryLimitMb}MB
                </span>
                {selectedQuestion.tags && (
                  <span className="text-slate-400">
                    Topics: <strong className="text-slate-200">{selectedQuestion.tags}</strong>
                  </span>
                )}
              </div>

              {/* Rendered Description */}
              <div className="prose-invert">
                <MarkdownRenderer content={selectedQuestion.description} />
              </div>

              {/* Sample Test Cases (Hidden cases are masked by backend) */}
              {selectedQuestion.testCases && selectedQuestion.testCases.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary-400" />
                    Sample Test Cases
                  </h3>
                  {selectedQuestion.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-background/80 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">Example {idx + 1}</span>
                        <button
                          onClick={() => copyToClipboard(tc.inputData, idx)}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-white transition"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Input
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground font-semibold block mb-1">Input:</span>
                          <pre className="p-2.5 rounded bg-black/60 font-mono text-slate-200 whitespace-pre-wrap border border-white/5">
                            {tc.inputData}
                          </pre>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold block mb-1">Expected Output:</span>
                          <pre className="p-2.5 rounded bg-black/60 font-mono text-slate-200 whitespace-pre-wrap border border-white/5">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>

                      {tc.explanation && (
                        <p className="text-xs text-muted-foreground italic border-t border-white/5 pt-2">
                          <strong className="text-slate-300 not-italic">Explanation:</strong> {tc.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Starter Code Templates Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary-400" />
                    Starter Code
                  </h3>
                  <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-white/10 text-xs">
                    {(['python', 'java', 'cpp'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-2.5 py-1 rounded font-medium transition uppercase cursor-pointer ${
                          selectedLang === lang
                            ? 'bg-primary text-primary-foreground font-bold'
                            : 'text-muted-foreground hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-xs overflow-x-auto text-slate-200">
                  <pre>
                    <code>
                      {selectedLang === 'python'
                        ? selectedQuestion.starterCodePython || '# No Python starter code'
                        : selectedLang === 'java'
                        ? selectedQuestion.starterCodeJava || '// No Java starter code'
                        : selectedQuestion.starterCodeCpp || '// No C++ starter code'}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

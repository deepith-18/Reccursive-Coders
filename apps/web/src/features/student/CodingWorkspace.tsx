import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { QuestionResponse, QuestionDifficulty } from '@/api/questions';
import {
  submissionApi,
  ProgrammingLanguage,
  SubmissionVerdict,
  TestCaseRunResultDto,
  SubmissionSummaryResponse,
} from '@/api/submissions';
import {
  Play,
  Send,
  RotateCcw,
  Clock,
  Cpu,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Terminal,
  History,
  FileCode,
  XCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';

interface CodingWorkspaceProps {
  question: QuestionResponse;
  assignmentId?: string;
  onClose: () => void;
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  question,
  assignmentId,
  onClose,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('PYTHON');
  const [sourceCode, setSourceCode] = useState<string>('');
  const [leftTab, setLeftTab] = useState<'statement' | 'submissions'>('statement');

  // Bottom Console Tabs
  const [bottomTab, setBottomTab] = useState<'testcases' | 'custom' | 'result'>('testcases');
  const [isConsoleExpanded, setIsConsoleExpanded] = useState<boolean>(true);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');

  // Execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    verdict: SubmissionVerdict;
    passedCount: number;
    totalCount: number;
    score?: number;
    timeMs?: number;
    memoryKb?: number;
    compileOutput?: string;
    testCases: TestCaseRunResultDto[];
    isSubmit: boolean;
  } | null>(null);

  // Submissions history
  const [submissionsHistory, setSubmissionsHistory] = useState<SubmissionSummaryResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  const getStarterCode = (lang: ProgrammingLanguage) => {
    switch (lang) {
      case 'PYTHON':
        return (
          question.starterCodePython ||
          'import sys\n\ndef main():\n    # Read input from stdin\n    lines = sys.stdin.read().split()\n    if lines:\n        print(" ".join(lines))\n    else:\n        print("Hello from Python!")\n\nif __name__ == "__main__":\n    main()\n'
        );
      case 'JAVA':
        return (
          question.starterCodeJava ||
          'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            System.out.println(sc.nextLine());\n        } else {\n            System.out.println("Hello from Java!");\n        }\n    }\n}\n'
        );
      case 'CPP':
        return (
          question.starterCodeCpp ||
          '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        cout << line << endl;\n    } else {\n        cout << "Hello from C++!" << endl;\n    }\n    return 0;\n}\n'
        );
    }
  };

  useEffect(() => {
    setSourceCode(getStarterCode(selectedLanguage));
  }, [selectedLanguage, question]);

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    if (sourceCode !== getStarterCode(selectedLanguage)) {
      if (!window.confirm('Switching language will replace your current editor content with the starter template. Continue?')) {
        return;
      }
    }
    setSelectedLanguage(newLang);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to default template?')) {
      setSourceCode(getStarterCode(selectedLanguage));
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await submissionApi.getMySubmissions(question.id);
      setSubmissionsHistory(history || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (leftTab === 'submissions') {
      fetchHistory();
    }
  }, [leftTab]);

  const handleRunCode = async (overrideCustom?: string) => {
    setIsRunning(true);
    setIsConsoleExpanded(true);

    const isCustomActive = bottomTab === 'custom' && customInput.trim().length > 0;
    const inputToSend =
      overrideCustom !== undefined
        ? overrideCustom
        : isCustomActive
        ? customInput.trim()
        : undefined;

    setBottomTab('result');

    try {
      const res = await submissionApi.runCode({
        questionId: question.id,
        sourceCode,
        language: selectedLanguage,
        customInput: inputToSend,
      });

      setExecutionResult({
        verdict: res.overallVerdict,
        passedCount: res.passedSampleCases,
        totalCount: res.totalSampleCases,
        compileOutput: res.compileOutput,
        testCases: res.testCaseResults,
        isSubmit: false,
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setIsConsoleExpanded(true);
    setBottomTab('result');

    try {
      const res = await submissionApi.submitCode({
        questionId: question.id,
        assignmentId,
        sourceCode,
        language: selectedLanguage,
      });

      setExecutionResult({
        verdict: res.verdict,
        passedCount: res.passedTestCases,
        totalCount: res.totalTestCases,
        score: res.score,
        timeMs: res.executionTimeMs,
        memoryKb: res.memoryKb,
        compileOutput: res.compileOutput,
        testCases: res.testCaseResults,
        isSubmit: true,
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
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

  const getVerdictStyle = (v: SubmissionVerdict) => {
    switch (v) {
      case 'ACCEPTED':
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'Accepted',
        };
      case 'WRONG_ANSWER':
        return {
          bg: 'bg-rose-950/60 border-rose-500/30 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          icon: XCircle,
          label: 'Wrong Answer',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          bg: 'bg-amber-950/60 border-amber-500/30 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Clock,
          label: 'Time Limit Exceeded',
        };
      case 'COMPILATION_ERROR':
        return {
          bg: 'bg-rose-950/60 border-rose-500/30 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          icon: AlertCircle,
          label: 'Compilation Error',
        };
      default:
        return {
          bg: 'bg-orange-950/60 border-orange-500/30 text-orange-300',
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          icon: AlertCircle,
          label: 'Runtime Error',
        };
    }
  };

  const sampleCases = question.testCases ? question.testCases.filter((tc) => tc.isSample) : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f1014] text-zinc-100 animate-in fade-in">
      {/* TOP WORKSPACE NAVIGATION BAR */}
      <header className="h-14 border-b border-white/[0.08] px-4 flex items-center justify-between bg-[#15161c]/90 backdrop-blur-md shrink-0">
        {/* Left Problem Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
            title="Exit Workspace"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-violet-400" />
              {question.title}
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyBadge(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Center: Language & Reset Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
            className="px-3 py-1.5 rounded-lg bg-background border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="PYTHON">Python (3.8.1)</option>
            <option value="JAVA">Java (OpenJDK 13)</option>
            <option value="CPP">C++ (GCC 9.2)</option>
          </select>

          <button
            onClick={handleResetCode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Run & Submit Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleRunCode()}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Run Code
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Submit Solution
          </button>
        </div>
      </header>

      {/* MAIN SPLIT WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: PROBLEM STATEMENT & SUBMISSIONS HISTORY */}
        <div className="w-1/2 border-r border-white/[0.08] flex flex-col bg-[#121318]/50">
          {/* Left Tabs */}
          <div className="h-10 border-b border-white/10 px-4 flex items-center gap-4 text-xs font-semibold bg-muted/20">
            <button
              onClick={() => setLeftTab('statement')}
              className={`py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                leftTab === 'statement'
                  ? 'border-primary text-white font-bold'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Description
            </button>
            <button
              onClick={() => setLeftTab('submissions')}
              className={`py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                leftTab === 'submissions'
                  ? 'border-primary text-white font-bold'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Submissions History
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {leftTab === 'statement' ? (
              <>
                {/* Meta Constraints */}
                <div className="flex flex-wrap items-center gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-primary-400" />
                    Time Limit: {question.timeLimitMs}ms
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Cpu className="w-3.5 h-3.5 text-primary-400" />
                    Memory: {question.memoryLimitMb}MB
                  </span>
                  {question.tags && (
                    <span className="text-slate-400">
                      Tags: <strong className="text-slate-200">{question.tags}</strong>
                    </span>
                  )}
                </div>

                {/* Markdown Description */}
                <div>
                  <MarkdownRenderer content={question.description} />
                </div>

                {/* Examples */}
                {sampleCases.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Examples
                    </h3>
                    {sampleCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs"
                      >
                        <span className="font-bold text-emerald-400">Example {idx + 1}</span>
                        <div>
                          <span className="text-muted-foreground block font-semibold">Input:</span>
                          <pre className="p-2 rounded bg-black/50 font-mono text-slate-200 mt-0.5 whitespace-pre-wrap">
                            {tc.inputData}
                          </pre>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-semibold">Output:</span>
                          <pre className="p-2 rounded bg-black/50 font-mono text-slate-200 mt-0.5 whitespace-pre-wrap">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                        {tc.explanation && (
                          <p className="text-muted-foreground italic text-[11px] pt-1">
                            Explanation: {tc.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Submissions History */
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Past Submissions
                </h3>
                {isLoadingHistory ? (
                  <div className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-400 mb-2" />
                    <p className="text-xs text-muted-foreground">Loading submissions...</p>
                  </div>
                ) : submissionsHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-6 text-center border border-dashed border-white/10 rounded-xl">
                    No submissions recorded for this problem yet. Submit your solution to earn scores!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {submissionsHistory.map((sub) => {
                      const vStyle = getVerdictStyle(sub.verdict);
                      return (
                        <div
                          key={sub.id}
                          className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 flex items-center justify-between text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${vStyle.badge}`}
                              >
                                {vStyle.label}
                              </span>
                              <span className="font-mono text-[11px] text-slate-300">
                                {sub.language}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {new Date(sub.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-white block">
                              {sub.passedTestCases}/{sub.totalTestCases} Passed
                            </span>
                            <span className="text-[11px] text-primary-300 font-semibold">
                              {sub.score} Points
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: MONACO EDITOR & BOTTOM TEST CONSOLE */}
        <div className="w-1/2 flex flex-col bg-[#0f1014]">
          {/* Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase() === 'cpp' ? 'cpp' : selectedLanguage.toLowerCase()}
              theme="vs-dark"
              value={sourceCode}
              onChange={(value) => setSourceCode(value || '')}
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Menlo, Monaco, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* BOTTOM TEST CONSOLE & VERDICTS DRAWER */}
          <div
            className={`border-t border-white/[0.08] bg-[#15161c]/95 backdrop-blur-md flex flex-col transition-all duration-200 ${
              isConsoleExpanded ? 'h-72' : 'h-10'
            }`}
          >
            {/* Console Header Bar */}
            <div className="h-10 border-b border-white/10 px-4 flex items-center justify-between shrink-0 bg-muted/30">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  onClick={() => {
                    setBottomTab('testcases');
                    setIsConsoleExpanded(true);
                  }}
                  className={`py-1.5 px-2.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    bottomTab === 'testcases'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Sample Cases ({sampleCases.length})
                </button>

                <button
                  onClick={() => {
                    setBottomTab('custom');
                    setIsConsoleExpanded(true);
                  }}
                  className={`py-1.5 px-2.5 rounded transition cursor-pointer ${
                    bottomTab === 'custom'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  Custom Input
                </button>

                <button
                  onClick={() => {
                    setBottomTab('result');
                    setIsConsoleExpanded(true);
                  }}
                  className={`py-1.5 px-2.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    bottomTab === 'result'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {executionResult ? (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        executionResult.verdict === 'ACCEPTED' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                  ) : null}
                  Execution Result
                </button>
              </div>

              {/* Collapse/Expand Toggle */}
              <button
                onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                className="p-1 rounded text-muted-foreground hover:text-white transition"
              >
                {isConsoleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {/* Console Body Content */}
            {isConsoleExpanded && (
              <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
                {/* TAB 1: SAMPLE CASES */}
                {bottomTab === 'testcases' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {sampleCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSampleIndex(idx)}
                          className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                            selectedSampleIndex === idx
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'bg-white/5 text-muted-foreground hover:text-white'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {sampleCases[selectedSampleIndex] && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] text-muted-foreground block mb-1">
                            Input (STDIN):
                          </span>
                          <pre className="p-2.5 rounded bg-black/60 border border-white/5 text-slate-200 whitespace-pre-wrap">
                            {sampleCases[selectedSampleIndex].inputData}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[11px] text-muted-foreground block mb-1">
                            Expected Output:
                          </span>
                          <pre className="p-2.5 rounded bg-black/60 border border-white/5 text-slate-200 whitespace-pre-wrap">
                            {sampleCases[selectedSampleIndex].expectedOutput}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: CUSTOM INPUT */}
                {bottomTab === 'custom' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-muted-foreground block font-sans">
                        Custom STDIN (Fed to your solution via standard input):
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRunCode(customInput.trim())}
                        disabled={isRunning || isSubmitting}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Run with Custom STDIN
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Type custom test input here..."
                      className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* TAB 3: EXECUTION RESULTS & VERDICTS */}
                {bottomTab === 'result' && (
                  <div className="space-y-3">
                    {isRunning || isSubmitting ? (
                      <div className="py-8 flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-400 mb-2" />
                        <span className="text-xs text-muted-foreground">
                          {isSubmitting
                            ? 'Evaluating solution in Judge0 sandbox...'
                            : 'Running code on sample test cases...'}
                        </span>
                      </div>
                    ) : executionResult ? (
                      <div className="space-y-3">
                        {/* Overall Verdict Banner */}
                        {(() => {
                          const vStyle = getVerdictStyle(executionResult.verdict);
                          const Icon = vStyle.icon;
                          return (
                            <div
                              className={`p-3.5 rounded-xl border flex items-center justify-between ${vStyle.bg}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="w-5 h-5 shrink-0" />
                                <div>
                                  <h4 className="font-bold text-sm">{vStyle.label}</h4>
                                  <p className="text-[11px] opacity-80">
                                    Passed {executionResult.passedCount} /{' '}
                                    {executionResult.totalCount} Test Cases
                                    {executionResult.score !== undefined && (
                                      <span> &bull; Score: {executionResult.score} pts</span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-[11px] opacity-90">
                                {executionResult.timeMs !== undefined && (
                                  <span>Runtime: {executionResult.timeMs}ms</span>
                                )}
                                {executionResult.memoryKb !== undefined && (
                                  <span>Memory: {executionResult.memoryKb}KB</span>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Compiler Output if any */}
                        {executionResult.compileOutput && (
                          <div className="p-3 rounded-lg bg-black/80 border border-rose-500/30 text-rose-300 font-mono text-xs whitespace-pre-wrap">
                            <strong className="block text-[11px] text-rose-400 mb-1">
                              Compiler Diagnostics:
                            </strong>
                            {executionResult.compileOutput}
                          </div>
                        )}

                        {/* Per-Test-Case Run Results */}
                        <div className="space-y-2">
                          {executionResult.testCases.map((tc, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">Case #{idx + 1}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      tc.status === 'ACCEPTED'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-rose-500/20 text-rose-400'
                                    }`}
                                  >
                                    {tc.status}
                                  </span>
                                  {tc.isSample && (
                                    <span className="text-[10px] text-muted-foreground">(Sample)</span>
                                  )}
                                </div>
                                {tc.executionTimeMs !== undefined && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {tc.executionTimeMs}ms
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-muted-foreground">Input:</span>
                                  <pre className="p-1.5 rounded bg-black/60 font-mono text-slate-300 mt-0.5">
                                    {tc.input}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Expected:</span>
                                  <pre className="p-1.5 rounded bg-black/60 font-mono text-slate-300 mt-0.5">
                                    {tc.expectedOutput}
                                  </pre>
                                </div>
                              </div>

                              <div>
                                <span className="text-muted-foreground text-[11px]">
                                  Your Output:
                                </span>
                                <pre className="p-1.5 rounded bg-black/60 font-mono text-slate-200 mt-0.5">
                                  {tc.actualOutput || '(No output)'}
                                </pre>
                              </div>

                              {tc.stderr && (
                                <pre className="p-1.5 rounded bg-rose-950/30 text-rose-300 font-mono text-[10px] mt-1">
                                  Stderr: {tc.stderr}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center py-6">
                        Click &quot;Run Code&quot; to test your solution or &quot;Submit Solution&quot; to evaluate against the full test suite.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

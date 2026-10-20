import React, { useState, useEffect } from 'react';
import {
  questionApi,
  QuestionDifficulty,
  QuestionStatus,
  QuestionSummaryResponse,
  QuestionResponse,
  TestCaseDto,
} from '@/api/questions';
import {
  FilePlus,
  Search,
  Code2,
  Trash2,
  Edit,
  Eye,
  Plus,
  X,
  Loader2,
  Clock,
  Cpu,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';

export const TrainerQuestionBuilderPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSlug, setFormSlug] = useState<string>('');
  const [formDifficulty, setFormDifficulty] = useState<QuestionDifficulty>('EASY');
  const [formTags, setFormTags] = useState<string>('');
  const [formTimeLimit, setFormTimeLimit] = useState<number>(1000);
  const [formMemoryLimit, setFormMemoryLimit] = useState<number>(256);
  const [formStatus, setFormStatus] = useState<QuestionStatus>('PUBLISHED');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formJavaCode, setFormJavaCode] = useState<string>('class Solution {\n    public int[] solve() {\n        // Your code here\n        return new int[]{};\n    }\n}');
  const [formPythonCode, setFormPythonCode] = useState<string>('class Solution:\n    def solve(self):\n        # Your code here\n        pass');
  const [formCppCode, setFormCppCode] = useState<string>('#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}');
  
  // Test Cases in form
  const [formTestCases, setFormTestCases] = useState<TestCaseDto[]>([]);
  const [activeTab, setActiveTab] = useState<'statement' | 'starter' | 'testcases'>('statement');
  const [descViewMode, setDescViewMode] = useState<'write' | 'preview'>('write');

  // New Test Case input state
  const [newTcInput, setNewTcInput] = useState<string>('');
  const [newTcOutput, setNewTcOutput] = useState<string>('');
  const [newTcIsSample, setNewTcIsSample] = useState<boolean>(true);
  const [newTcExplanation, setNewTcExplanation] = useState<string>('');

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await questionApi.listQuestions({
        difficulty: difficultyFilter !== 'ALL' ? (difficultyFilter as QuestionDifficulty) : undefined,
        status: statusFilter !== 'ALL' ? (statusFilter as QuestionStatus) : undefined,
        search: searchQuery.trim() || undefined,
        size: 50,
      });
      setQuestions(res.content || []);
    } catch (err: any) {
      console.error('Failed to load questions', err);
      setStatusMessage({ type: 'error', text: 'Failed to fetch question bank' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [difficultyFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSlug('');
    setFormDifficulty('EASY');
    setFormTags('Arrays, Algorithms');
    setFormTimeLimit(1000);
    setFormMemoryLimit(256);
    setFormStatus('PUBLISHED');
    setFormDescription(
      '# Problem Statement\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n## Constraints\n- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- Only one valid answer exists.\n\n## Input Format\nFirst line contains array elements separated by spaces.\nSecond line contains integer `target`.\n\n## Output Format\nPrint two space-separated indices.'
    );
    setFormJavaCode('class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}');
    setFormPythonCode('class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Your code here\n        pass');
    setFormCppCode('#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};');
    setFormTestCases([
      {
        inputData: '2 7 11 15\n9',
        expectedOutput: '0 1',
        isSample: true,
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
        orderIndex: 0,
      },
      {
        inputData: '3 2 4\n6',
        expectedOutput: '1 2',
        isSample: false,
        explanation: '',
        orderIndex: 1,
      },
    ]);
    setActiveTab('statement');
    setDescViewMode('write');
    setEditingQuestionId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = async (qSummary: QuestionSummaryResponse) => {
    setIsLoading(true);
    try {
      const q = await questionApi.getQuestionById(qSummary.id);
      setEditingQuestionId(q.id);
      setFormTitle(q.title);
      setFormSlug(q.slug);
      setFormDifficulty(q.difficulty);
      setFormTags(q.tags || '');
      setFormTimeLimit(q.timeLimitMs);
      setFormMemoryLimit(q.memoryLimitMb);
      setFormStatus(q.status);
      setFormDescription(q.description);
      setFormJavaCode(q.starterCodeJava || '');
      setFormPythonCode(q.starterCodePython || '');
      setFormCppCode(q.starterCodeCpp || '');
      setFormTestCases(q.testCases || []);
      setActiveTab('statement');
      setIsFormModalOpen(true);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to load question details' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPreview = async (id: string) => {
    try {
      const q = await questionApi.getQuestionById(id);
      setPreviewQuestion(q);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to preview question' });
    }
  };

  const handleDeleteQuestion = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await questionApi.deleteQuestion(id);
      setStatusMessage({ type: 'success', text: `Question "${title}" deleted successfully.` });
      fetchQuestions();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete question' });
    }
  };

  const handleAddTestCase = () => {
    if (!newTcInput.trim() || !newTcOutput.trim()) {
      alert('Input and expected output are required for a test case.');
      return;
    }
    const newCase: TestCaseDto = {
      inputData: newTcInput.trim(),
      expectedOutput: newTcOutput.trim(),
      isSample: newTcIsSample,
      explanation: newTcExplanation.trim() || undefined,
      orderIndex: formTestCases.length,
    };
    setFormTestCases([...formTestCases, newCase]);
    setNewTcInput('');
    setNewTcOutput('');
    setNewTcIsSample(false);
    setNewTcExplanation('');
  };

  const handleRemoveTestCase = (index: number) => {
    setFormTestCases(formTestCases.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a question title');
      return;
    }
    if (!formDescription.trim()) {
      alert('Please write a problem description');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingQuestionId) {
        await questionApi.updateQuestion(editingQuestionId, {
          title: formTitle,
          slug: formSlug.trim() || undefined,
          description: formDescription,
          difficulty: formDifficulty,
          tags: formTags,
          timeLimitMs: formTimeLimit,
          memoryLimitMb: formMemoryLimit,
          status: formStatus,
          starterCodeJava: formJavaCode,
          starterCodePython: formPythonCode,
          starterCodeCpp: formCppCode,
        });
        setStatusMessage({ type: 'success', text: 'Question updated successfully!' });
      } else {
        await questionApi.createQuestion({
          title: formTitle,
          slug: formSlug.trim() || undefined,
          description: formDescription,
          difficulty: formDifficulty,
          tags: formTags,
          timeLimitMs: formTimeLimit,
          memoryLimitMb: formMemoryLimit,
          status: formStatus,
          starterCodeJava: formJavaCode,
          starterCodePython: formPythonCode,
          starterCodeCpp: formCppCode,
          testCases: formTestCases,
        });
        setStatusMessage({ type: 'success', text: 'Question created successfully with test cases!' });
      }
      setIsFormModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save question' });
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

  const easyCount = questions.filter((q) => q.difficulty === 'EASY').length;
  const medCount = questions.filter((q) => q.difficulty === 'MEDIUM').length;
  const hardCount = questions.filter((q) => q.difficulty === 'HARD').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-primary-400" />
            Coding Question Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Author Markdown problem statements, enforce resource limits, and configure sample vs. hidden test suites.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Question
        </button>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-muted-foreground hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-card/60 backdrop-blur-md">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Problems</p>
          <p className="text-2xl font-black text-white mt-1">{questions.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Easy Problems</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{easyCount}</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Medium Problems</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{medCount}</p>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-wider">Hard Problems</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{hardCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-xl border border-white/10 bg-card/40 backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems by title, keywords or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/80 border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition"
          />
        </form>

        <div className="flex items-center gap-2">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-white/10 text-xs">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-background/80 border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-400 mb-3" />
          <p className="text-sm text-muted-foreground">Loading coding question repository...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-card/30">
          <FilePlus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Questions Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            No problems match your current filter criteria. Create your first coding question to start building test suites.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition cursor-pointer"
          >
            Create Question
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-xl border border-white/10 bg-card/40 hover:bg-card/70 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      q.status === 'PUBLISHED'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {q.status}
                  </span>
                  <h3 className="text-base font-bold text-white hover:text-primary-300 transition">
                    {q.title}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">/q/{q.slug}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {q.timeLimitMs}ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    {q.memoryLimitMb}MB
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {q.sampleCasesCount} sample / {q.totalCasesCount} total test cases
                  </span>
                  {q.authorName && <span>By {q.authorName}</span>}
                </div>

                {q.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenPreview(q.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                  title="Preview Question"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => handleOpenEditModal(q)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                  title="Edit Question"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q.id, q.title)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT QUESTION MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-bold text-white">
                  {editingQuestionId ? 'Edit Coding Question' : 'Author New Problem'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-muted-foreground hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center px-6 border-b border-white/10 bg-card/60 gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('statement')}
                className={`py-3 border-b-2 transition cursor-pointer ${
                  activeTab === 'statement'
                    ? 'border-primary text-white'
                    : 'border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                1. Problem Statement &amp; Metadata
              </button>
              <button
                onClick={() => setActiveTab('testcases')}
                className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'testcases'
                    ? 'border-primary text-white'
                    : 'border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                2. Test Suite ({formTestCases.length})
              </button>
              <button
                onClick={() => setActiveTab('starter')}
                className={`py-3 border-b-2 transition cursor-pointer ${
                  activeTab === 'starter'
                    ? 'border-primary text-white'
                    : 'border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                3. Starter Code Templates
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 'statement' && (
                <div className="space-y-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Problem Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Two Sum"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        URL Slug (Optional, auto-generated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. two-sum"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Difficulty, Status, Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Difficulty
                      </label>
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value as QuestionDifficulty)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as QuestionStatus)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Topics / Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Arrays, Hash Table"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Resource Limits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Time Limit (ms)
                      </label>
                      <input
                        type="number"
                        min="200"
                        max="10000"
                        step="100"
                        value={formTimeLimit}
                        onChange={(e) => setFormTimeLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5" />
                        Memory Limit (MB)
                      </label>
                      <input
                        type="number"
                        min="64"
                        max="1024"
                        step="64"
                        value={formMemoryLimit}
                        onChange={(e) => setFormMemoryLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Markdown Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Problem Description (Markdown Format) *
                      </label>
                      <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded border border-white/10 text-xs">
                        <button
                          type="button"
                          onClick={() => setDescViewMode('write')}
                          className={`px-2 py-0.5 rounded ${
                            descViewMode === 'write' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
                          }`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setDescViewMode('preview')}
                          className={`px-2 py-0.5 rounded ${
                            descViewMode === 'preview' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
                          }`}
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    {descViewMode === 'write' ? (
                      <textarea
                        rows={10}
                        required
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Write problem statement in Markdown..."
                        className="w-full p-3 rounded-lg bg-background border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <div className="p-4 rounded-lg bg-background/50 border border-white/10 min-h-[220px]">
                        <MarkdownRenderer content={formDescription} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TEST CASES */}
              {activeTab === 'testcases' && (
                <div className="space-y-6">
                  {/* Current Test Cases */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                      <span>Configured Test Cases ({formTestCases.length})</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {formTestCases.filter((tc) => tc.isSample).length} sample (visible to students) /{' '}
                        {formTestCases.filter((tc) => !tc.isSample).length} hidden
                      </span>
                    </h3>

                    {formTestCases.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic p-4 rounded-lg border border-dashed border-white/10 text-center">
                        No test cases added yet. Add at least 1 sample case and 1 hidden evaluation case below.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {formTestCases.map((tc, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-white/10 bg-background/60 space-y-2 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  tc.isSample
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                }`}
                              >
                                {tc.isSample ? 'Sample Case (Public)' : 'Hidden Evaluation Case'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTestCase(idx)}
                                className="text-muted-foreground hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground font-semibold">Input:</span>
                                <pre className="p-2 rounded bg-black/40 font-mono text-slate-200 mt-1 whitespace-pre-wrap">
                                  {tc.inputData}
                                </pre>
                              </div>
                              <div>
                                <span className="text-muted-foreground font-semibold">Expected Output:</span>
                                <pre className="p-2 rounded bg-black/40 font-mono text-slate-200 mt-1 whitespace-pre-wrap">
                                  {tc.expectedOutput}
                                </pre>
                              </div>
                            </div>
                            {tc.explanation && (
                              <p className="text-xs text-muted-foreground italic">
                                Note: {tc.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Test Case Box */}
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-primary-400" />
                      Add New Test Case
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Test Case Input (STDIN) *
                        </label>
                        <textarea
                          rows={3}
                          value={newTcInput}
                          onChange={(e) => setNewTcInput(e.target.value)}
                          placeholder="e.g. 2 7 11 15\n9"
                          className="w-full p-2.5 rounded-lg bg-background border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Expected Output (STDOUT) *
                        </label>
                        <textarea
                          rows={3}
                          value={newTcOutput}
                          onChange={(e) => setNewTcOutput(e.target.value)}
                          placeholder="e.g. 0 1"
                          className="w-full p-2.5 rounded-lg bg-background border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={newTcIsSample}
                            onChange={(e) => setNewTcIsSample(e.target.checked)}
                            className="rounded border-white/20 bg-background text-primary"
                          />
                          <span>Visible Sample Case for Students</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTestCase}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition cursor-pointer self-end"
                      >
                        + Add To Test Suite
                      </button>
                    </div>

                    {newTcIsSample && (
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Explanation (Optional, shown under sample test case)
                        </label>
                        <input
                          type="text"
                          value={newTcExplanation}
                          onChange={(e) => setNewTcExplanation(e.target.value)}
                          placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                          className="w-full px-3 py-1.5 rounded-lg bg-background border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: STARTER CODE */}
              {activeTab === 'starter' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Java Starter Template
                    </label>
                    <textarea
                      rows={5}
                      value={formJavaCode}
                      onChange={(e) => setFormJavaCode(e.target.value)}
                      className="w-full p-3 rounded-lg bg-background border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Python 3 Starter Template
                    </label>
                    <textarea
                      rows={5}
                      value={formPythonCode}
                      onChange={(e) => setFormPythonCode(e.target.value)}
                      className="w-full p-3 rounded-lg bg-background border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      C++ Starter Template
                    </label>
                    <textarea
                      rows={5}
                      value={formCppCode}
                      onChange={(e) => setFormCppCode(e.target.value)}
                      className="w-full p-3 rounded-lg bg-background border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingQuestionId ? 'Update Question' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION PREVIEW MODAL */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">{previewQuestion.title}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyBadge(
                    previewQuestion.difficulty
                  )}`}
                >
                  {previewQuestion.difficulty}
                </span>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Constraints and Limits */}
              <div className="flex flex-wrap items-center gap-3 text-xs bg-muted/30 p-3 rounded-lg border border-white/10">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-primary-400" />
                  Time Limit: {previewQuestion.timeLimitMs}ms
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-primary-400" />
                  Memory Limit: {previewQuestion.memoryLimitMb}MB
                </span>
                <span className="text-slate-300">
                  {previewQuestion.totalTestCasesCount} Total Cases ({previewQuestion.hiddenTestCasesCount} hidden)
                </span>
              </div>

              {/* Rendered Markdown Problem Statement */}
              <div>
                <MarkdownRenderer content={previewQuestion.description} />
              </div>

              {/* Sample Test Cases */}
              {previewQuestion.testCases && previewQuestion.testCases.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white">Sample Test Cases</h4>
                  {previewQuestion.testCases
                    .filter((tc) => tc.isSample)
                    .map((tc, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-background/80 border border-white/10 space-y-2">
                        <span className="text-xs font-bold text-emerald-400">Example {idx + 1}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground font-semibold">Input:</span>
                            <pre className="p-2 rounded bg-black/40 font-mono text-slate-200 mt-1 whitespace-pre-wrap">
                              {tc.inputData}
                            </pre>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-semibold">Output:</span>
                            <pre className="p-2 rounded bg-black/40 font-mono text-slate-200 mt-1 whitespace-pre-wrap">
                              {tc.expectedOutput}
                            </pre>
                          </div>
                        </div>
                        {tc.explanation && (
                          <p className="text-xs text-muted-foreground italic">
                            Explanation: {tc.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

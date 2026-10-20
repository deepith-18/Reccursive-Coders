import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  Search,
  Code2,
  Sparkles,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { CodingWorkspace } from './CodingWorkspace';
import { QuestionResponse } from '@/api/questions';

export interface CompanyQuestion {
  id: string;
  title: string;
  slug: string;
  company: string;
  round: 'Online Assessment (OA)' | 'Technical Round 1' | 'Technical Round 2' | 'System & Design';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  frequency: 'High Frequency' | 'Very High' | 'Repeated 8+ Times' | 'Core Pattern';
  year: string;
  tags: string[];
  description: string;
  sampleInput: string;
  sampleOutput: string;
  interviewTip: string;
}

export const COMPANY_QUESTIONS: CompanyQuestion[] = [
  {
    id: 'cq-1',
    title: 'Two Sum & Target Pair Combinations',
    slug: 'two-sum',
    company: 'Amazon',
    round: 'Online Assessment (OA)',
    difficulty: 'EASY',
    frequency: 'Very High',
    year: '2025 - 2026',
    tags: ['Hash Table', 'Arrays', 'Two Pointers'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    interviewTip: 'Amazon OA frequently checks for single-pass O(N) hash map solution. Be prepared to explain why brute force O(N^2) causes Time Limit Exceeded.',
  },
  {
    id: 'cq-2',
    title: 'Trapping Rain Water Elevation Grid',
    slug: 'trapping-rain-water',
    company: 'Amazon',
    round: 'Technical Round 1',
    difficulty: 'HARD',
    frequency: 'Repeated 8+ Times',
    year: '2025',
    tags: ['Two Pointers', 'Dynamic Programming', 'Monotonic Stack'],
    description:
      'Given n non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.',
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    interviewTip: 'Interviewers look for the optimal two-pointer approach achieving O(N) time and O(1) space after you demonstrate the DP prefix/suffix max arrays.',
  },
  {
    id: 'cq-3',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    company: 'Google',
    round: 'Technical Round 1',
    difficulty: 'MEDIUM',
    frequency: 'High Frequency',
    year: '2025 - 2026',
    tags: ['Sliding Window', 'Hash Table', 'String'],
    description:
      'Given a string s, find the length of the longest substring without duplicate characters.',
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3 (substring "abc")',
    interviewTip: 'Google interviewers focus on edge cases with empty strings, single character strings, and Unicode/special characters. Use sliding window with index map.',
  },
  {
    id: 'cq-4',
    title: 'Course Schedule & Dependency Cycle Resolution',
    slug: 'course-schedule',
    company: 'Google',
    round: 'Technical Round 2',
    difficulty: 'MEDIUM',
    frequency: 'High Frequency',
    year: '2025',
    tags: ['Graph', 'Topological Sort', 'BFS/DFS'],
    description:
      'There are total numCourses you have to take, labeled 0 to numCourses - 1. You are given prerequisites array where prerequisites[i] = [a, b] indicates you must take course b before a. Return true if you can finish all courses.',
    sampleInput: 'numCourses = 2, prerequisites = [[1, 0]]',
    sampleOutput: 'true',
    interviewTip: 'Clearly distinguish Kahns algorithm (in-degree BFS) from DFS cycle detection using 3-color node state tracking (UNVISITED, VISITING, VISITED).',
  },
  {
    id: 'cq-5',
    title: 'Maximum Subarray Sum (Kadane Algorithm)',
    slug: 'maximum-subarray',
    company: 'TCS Digital',
    round: 'Online Assessment (OA)',
    difficulty: 'MEDIUM',
    frequency: 'Very High',
    year: '2025 - 2026',
    tags: ['Arrays', 'Dynamic Programming', 'Divide and Conquer'],
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    sampleOutput: '6 (subarray [4,-1,2,1])',
    interviewTip: 'TCS Digital OA enforces tight 1.0 second execution limits with inputs up to 10^5 elements. Implement Kadanes algorithm in O(N) time with O(1) space.',
  },
  {
    id: 'cq-6',
    title: 'Valid Anagram & Frequency Character Array',
    slug: 'valid-anagram',
    company: 'TCS Digital',
    round: 'Online Assessment (OA)',
    difficulty: 'EASY',
    frequency: 'High Frequency',
    year: '2024 - 2025',
    tags: ['Hash Table', 'Strings', 'Sorting'],
    description:
      'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    sampleInput: 's = "anagram", t = "nagaram"',
    sampleOutput: 'true',
    interviewTip: 'Avoid sorting which takes O(N log N). Demonstrate O(N) constant memory lookup using a fixed 26-element integer frequency array.',
  },
  {
    id: 'cq-7',
    title: 'Coin Change Minimum Count (Unbounded Knapsack)',
    slug: 'coin-change',
    company: 'Infosys SP',
    round: 'Online Assessment (OA)',
    difficulty: 'MEDIUM',
    frequency: 'Repeated 8+ Times',
    year: '2025 - 2026',
    tags: ['Dynamic Programming', 'Breadth-First Search'],
    description:
      'You are given an integer array coins representing coins of different denominations and an integer amount representing total money. Return fewest number of coins needed to make up that amount.',
    sampleInput: 'coins = [1, 2, 5], amount = 11',
    sampleOutput: '3 (11 = 5 + 5 + 1)',
    interviewTip: 'Infosys Specialist Programmer role tests bottom-up 1D DP tabulation. Initialize dp array with amount + 1 rather than Integer.MAX_VALUE to prevent overflow.',
  },
  {
    id: 'cq-8',
    title: 'Lowest Common Ancestor in Binary Tree',
    slug: 'lowest-common-ancestor-binary-tree',
    company: 'Infosys SP',
    round: 'Technical Round 1',
    difficulty: 'MEDIUM',
    frequency: 'High Frequency',
    year: '2025',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    description:
      'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
    sampleInput: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1',
    sampleOutput: '3',
    interviewTip: 'Show recursive post-order traversal: if root matches p or q, return root. Recurse on left and right subtrees. If both return non-null, root is the LCA.',
  },
  {
    id: 'cq-9',
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    company: 'Microsoft',
    round: 'Online Assessment (OA)',
    difficulty: 'MEDIUM',
    frequency: 'Very High',
    year: '2025 - 2026',
    tags: ['Binary Search', 'Arrays'],
    description:
      'Given integer array nums sorted in ascending order (with distinct values) and rotated at an unknown pivot index, return the index of target if it is in nums, or -1.',
    sampleInput: 'nums = [4,5,6,7,0,1,2], target = 0',
    sampleOutput: '4',
    interviewTip: 'The key insight is that at any midpoint, at least one half of the array is guaranteed to be strictly sorted. Determine which half is sorted to adjust pointers.',
  },
  {
    id: 'cq-10',
    title: 'LRU Cache Architecture & Implementation',
    slug: 'lru-cache',
    company: 'Microsoft',
    round: 'Technical Round 2',
    difficulty: 'MEDIUM',
    frequency: 'High Frequency',
    year: '2025',
    tags: ['Design', 'Hash Table', 'Linked List', 'Doubly-Linked List'],
    description:
      'Design a data structure that follows constraints of a Least Recently Used (LRU) cache. Implement LRUCache class with get(key) and put(key, value) in O(1) average time complexity.',
    sampleInput: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)',
    sampleOutput: '[null, null, null, 1, null, -1]',
    interviewTip: 'Microsoft technical interviewers assess Clean OOP principles. Combine a Doubly-Linked List (for O(1) removals and node head insertions) with HashMap.',
  },
];

export function CompanyQuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCompany = searchParams.get('company') || 'ALL';

  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany);
  const [selectedRound, setSelectedRound] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalQuestion, setActiveModalQuestion] = useState<CompanyQuestion | null>(null);

  // Active sandbox problem
  const [activeWorkspaceQuestion, setActiveWorkspaceQuestion] = useState<QuestionResponse | null>(null);

  const companies = ['ALL', 'Amazon', 'Google', 'Microsoft', 'TCS Digital', 'Infosys SP'];

  const filteredQuestions = COMPANY_QUESTIONS.filter((q) => {
    if (selectedCompany !== 'ALL' && q.company.toLowerCase() !== selectedCompany.toLowerCase()) {
      return false;
    }
    if (selectedRound !== 'ALL' && q.round !== selectedRound) {
      return false;
    }
    if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) {
      return false;
    }
    if (searchQuery.trim()) {
      const qText = searchQuery.toLowerCase();
      const match =
        q.title.toLowerCase().includes(qText) ||
        q.description.toLowerCase().includes(qText) ||
        q.tags.some((t) => t.toLowerCase().includes(qText));
      if (!match) return false;
    }
    return true;
  });

  const handleLaunchPractice = (q: CompanyQuestion) => {
    setActiveModalQuestion(null);
    setActiveWorkspaceQuestion({
      id: q.id,
      title: q.title,
      slug: q.slug,
      description: q.description,
      difficulty: q.difficulty,
      tags: q.tags.join(', '),
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      status: 'PUBLISHED',
      totalTestCasesCount: 1,
      hiddenTestCasesCount: 0,
      testCases: [
        {
          id: 'tc-sample-1',
          inputData: q.sampleInput,
          expectedOutput: q.sampleOutput,
          isSample: true,
          explanation: 'Standard sample test case from recruitment drive.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-obsidian-card via-obsidian-surface to-obsidian-card border border-white/10 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Building2 className="w-3.5 h-3.5" />
                Company Interview Archives
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Drive Questions (2024 - 2026)
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Previously Asked Company Questions
            </h1>
            <p className="text-neutral-400 mt-2 max-w-2xl text-sm leading-relaxed">
              Targeted preparation for campus and partner hiring drives. Review actual problem statements, recurrence frequencies, and interviewer expectations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-obsidian-bg/80 border border-white/5 rounded-xl p-4 text-center min-w-[110px]">
              <div className="text-2xl font-bold text-cyan-400">{COMPANY_QUESTIONS.length}</div>
              <div className="text-xs text-neutral-400 mt-1">Archived Problems</div>
            </div>
            <div className="bg-obsidian-bg/80 border border-white/5 rounded-xl p-4 text-center min-w-[110px]">
              <div className="text-2xl font-bold text-emerald-400">5</div>
              <div className="text-xs text-neutral-400 mt-1">Tier-1 Corporates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {companies.map((comp) => {
          const isActive = selectedCompany.toLowerCase() === comp.toLowerCase();
          return (
            <button
              key={comp}
              onClick={() => {
                setSelectedCompany(comp);
                if (comp === 'ALL') {
                  searchParams.delete('company');
                } else {
                  searchParams.set('company', comp);
                }
                setSearchParams(searchParams);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-obsidian-bg shadow-md shadow-cyan-500/20'
                  : 'bg-obsidian-card border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
              }`}
            >
              {comp === 'ALL' ? 'All Companies' : comp}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 bg-obsidian-card border border-white/10 rounded-2xl">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search problems, topics, or algorithms (e.g. Dynamic Programming, Two Pointers)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Interview Rounds</option>
            <option value="Online Assessment (OA)">Online Assessment (OA)</option>
            <option value="Technical Round 1">Technical Round 1</option>
            <option value="Technical Round 2">Technical Round 2</option>
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-obsidian-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuestions.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-obsidian-card border border-white/5 rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No archived questions match your filter</h3>
            <p className="text-xs text-neutral-400 mt-1">Try switching company tags or broadening your search criteria.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="group bg-obsidian-card border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-cyan-400 border border-white/10">
                      {q.company}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {q.round}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      q.difficulty === 'HARD'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : q.difficulty === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {q.title}
                </h3>

                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                  {q.description}
                </p>

                {/* Interview Tip Preview */}
                <div className="mt-4 p-3 rounded-xl bg-obsidian-surface border border-white/5 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                    <span className="font-bold text-amber-400">Interview Tip:</span> {q.interviewTip}
                  </p>
                </div>

                {/* Tags and Recurrence */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {q.frequency}
                  </span>
                  <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {q.year}
                  </span>
                  {q.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveModalQuestion(q)}
                  className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  View Full Question Details
                </button>

                <button
                  onClick={() => handleLaunchPractice(q)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-bg font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Practice in IDE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Question Details Modal */}
      {activeModalQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-obsidian-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-5 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-cyan-400 border border-white/10">
                  {activeModalQuestion.company}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {activeModalQuestion.round}
                </span>
              </div>
              <button
                onClick={() => setActiveModalQuestion(null)}
                className="text-neutral-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              <h2 className="text-xl font-bold text-white">{activeModalQuestion.title}</h2>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <div className="font-bold text-amber-400 mb-1">Company Interviewer Focus:</div>
                  {activeModalQuestion.interviewTip}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1">
                  Problem Statement
                </h4>
                <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                  {activeModalQuestion.description}
                </p>
              </div>

              {/* Sample Cases */}
              <div className="bg-obsidian-surface border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2">
                <div>
                  <span className="text-neutral-500">Sample Input:</span>{' '}
                  <span className="text-white">{activeModalQuestion.sampleInput}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Sample Output:</span>{' '}
                  <span className="text-cyan-400">{activeModalQuestion.sampleOutput}</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-obsidian-surface p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-neutral-500 block">Recurrence:</span>
                  <span className="font-bold text-emerald-400">{activeModalQuestion.frequency}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Drives Observed:</span>
                  <span className="font-bold text-white">{activeModalQuestion.year}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalQuestion(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLaunchPractice(activeModalQuestion)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-bg text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Code2 className="w-4 h-4" />
                Launch in IDE Sandbox
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Coding Workspace Modal */}
      {activeWorkspaceQuestion && (
        <CodingWorkspace
          question={activeWorkspaceQuestion}
          onClose={() => setActiveWorkspaceQuestion(null)}
        />
      )}
    </div>
  );
}

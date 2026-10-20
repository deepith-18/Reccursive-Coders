import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HealthService, ApiResponseHealthResponse } from '@/api/generated';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { useAuth } from '@/features/auth/AuthContext';
import { RecursiveCodersLogo } from '@/shared/components/RecursiveCodersLogo';
import { CodeBattlesModal } from '@/features/student/CodeBattlesModal';
import {
  CheckCircle2,
  Server,
  ArrowRight,
  Terminal,
  Sparkles,
  Trophy,
  Swords,
  Play,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState<'all' | 'fullstack' | 'aiml' | 'dsa'>('all');
  const [demoCodeLanguage, setDemoCodeLanguage] = useState<'python' | 'java'>('python');
  const [demoCodeOutput, setDemoCodeOutput] = useState<string | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const { data: healthResponse, isLoading, isError, refetch } = useQuery<ApiResponseHealthResponse>({
    queryKey: ['system-health'],
    queryFn: async () => {
      return await HealthService.checkHealth();
    },
    retry: 1,
  });

  const healthData = healthResponse?.data;

  // Auto-redirect authenticated users directly into their specific portal
  if (isAuthenticated && user?.role) {
    const role = user.role.startsWith('ROLE_') ? user.role.substring(5) : user.role;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'TRAINER') return <Navigate to="/trainer" replace />;
    return <Navigate to="/student" replace />;
  }

  const samplePythonCode = `# Recursive Coders: Palindrome Check
def is_palindrome(s: str) -> bool:
    clean = "".join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]

print("Is 'racecar' palindrome?", is_palindrome("racecar"))
print("Think Recursive, Code Progressive!")`;

  const sampleJavaCode = `// Recursive Coders: Palindrome Check
public class Solution {
    public static void main(String[] args) {
        String s = "racecar";
        String rev = new StringBuilder(s).reverse().toString();
        System.out.println("Is 'racecar' palindrome? " + s.equals(rev));
        System.out.println("Think Recursive, Code Progressive!");
    }
}`;

  const runDemoCode = () => {
    setIsDemoRunning(true);
    setDemoCodeOutput(null);
    setTimeout(() => {
      setIsDemoRunning(false);
      setDemoCodeOutput(
        "Is 'racecar' palindrome? True\nThink Recursive, Code Progressive!\n[Execution completed in 18ms | Memory: 14.2 MB]"
      );
    }, 600);
  };

  const stories = [
    { title: 'New batch', icon: '🚀', tag: 'Admissions Open' },
    { title: 'AI ML', icon: '🧠', tag: 'Deep Learning' },
    { title: 'Full stack Dev', icon: '💻', tag: 'React & Spring' },
    { title: 'Inauguration', icon: '🎉', tag: 'Bengaluru Campus' },
    { title: 'C Programming', icon: '⚡', tag: 'Core Systems' },
  ];

  const placements = [
    {
      name: 'Akash G V',
      college: 'Bapuji Institute of Engineering and Technology',
      package: '9.0 LPA',
      role: 'Full Stack Engineer',
      type: 'Product Company',
      badgeColor: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Sham Sundar M',
      college: 'C V Gurukula College',
      company: 'Amazon',
      package: '18.5 LPA',
      role: 'Software Development Engineer',
      type: 'Tier-1 FAANG',
      badgeColor: 'from-yellow-400 to-amber-600',
    },
    {
      name: 'Priyanka K',
      college: 'PES University, Bengaluru',
      company: 'Microsoft',
      package: '14.0 LPA',
      role: 'Cloud Systems Engineer',
      type: 'Tier-1 Product',
      badgeColor: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Chethan Kumar',
      college: 'Bangalore Institute of Tech',
      company: 'FastTrack Tech',
      package: '7.5 LPA',
      role: 'React Native Specialist',
      type: 'Mobile Engineering',
      badgeColor: 'from-violet-500 to-indigo-600',
    },
  ];

  const courses = [
    {
      id: 'fullstack',
      category: 'fullstack',
      title: 'Full Stack Java & Cloud Engineering',
      tag: 'Industry Benchmark',
      description: 'Spring Boot 3, Hibernate JPA, PostgreSQL, React 19, Docker, Microservices, and REST APIs.',
      duration: '16 Weeks',
      rating: '4.9/5 (420+ Reviews)',
      topics: ['Java 21 Core & OOP', 'Spring Boot 3 REST', 'PostgreSQL & Flyway', 'React 19 & Tailwind', 'Docker & AWS'],
    },
    {
      id: 'aiml',
      category: 'aiml',
      title: 'AI, LLMs & Machine Learning Track',
      tag: 'Cutting-Edge',
      description: 'Python for Data Science, PyTorch, Deep Learning, Prompt Engineering, Agentic Workflows, and Vector DBs.',
      duration: '14 Weeks',
      rating: '4.95/5 (310+ Reviews)',
      topics: ['Python & NumPy', 'Deep Learning & PyTorch', 'Transformers & LLMs', 'RAG & Vector Embeddings', 'AI Agents'],
    },
    {
      id: 'dsa',
      category: 'dsa',
      title: 'Core DSA & Coding Interview Mastery',
      tag: 'Placement Essential',
      description: 'Master 250+ LeetCode Medium/Hard patterns: Dynamic Programming, Graphs, Sliding Window, and System Design.',
      duration: '12 Weeks',
      rating: '5.0/5 (680+ Reviews)',
      topics: ['Arrays & HashMaps', 'Trees & BSTs', 'Graph Traversals (BFS/DFS)', 'Dynamic Programming', 'System Design'],
    },
  ];

  const filteredCourses = activeCourseTab === 'all'
    ? courses
    : courses.filter((c) => c.category === activeCourseTab);

  return (
    <div className="space-y-20 pb-20">
      {/* Code Battles Modal */}
      <CodeBattlesModal
        isOpen={isBattleModalOpen}
        onClose={() => setIsBattleModalOpen(false)}
      />

      {/* Hero Section matching Screenshot 3 */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 mt-4 border border-white/10 shadow-2xl">
        {/* Ambient Darkened Hero Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.25] saturate-125"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/80 to-transparent -z-10" />

        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center space-y-8">
          {/* Subtitle pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-lg animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bengaluru&apos;s Premier Tech Career Launchpad</span>
          </div>

          {/* Headline matching Screenshot 3 */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.15]">
            Choose the Right Path <br />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Technology</span>
          </h1>

          {/* Subtext matching Screenshot 3 */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
            We bridge the gap between academic learning and industry requirements with our expert-led, AI-driven curriculum.
          </p>

          {/* 3 Call-To-Action Buttons matching Screenshot 3 */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {/* 1. Get Started (Purple Pill) */}
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>

            {/* 2. Explore Courses (White Button) */}
            <a
              href="#courses"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Explore Courses
            </a>

            {/* 3. CODE BATTLES (White / Outline Pill) */}
            <button
              onClick={() => setIsBattleModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-black tracking-wider text-sm shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Swords className="w-4 h-4 text-violet-600" />
              <span>CODE BATTLES</span>
            </button>
          </div>

          {/* Brand Tagline Banner */}
          <div className="pt-8 flex items-center justify-center gap-3 text-zinc-400 text-xs sm:text-sm italic font-serif">
            <RecursiveCodersLogo size="sm" showText={false} />
            <span className="text-cyan-400 font-sans not-italic font-bold tracking-wider uppercase text-[11px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              Motto
            </span>
            &ldquo;Think Recursive, Code Progressive&rdquo; &bull; Vijayanagara, Bengaluru 560040
          </div>
        </div>
      </section>

      {/* Instagram Story Highlights Bar (From Screenshot 2) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto py-2 no-scrollbar">
          {stories.map((story, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 shadow-md group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xl sm:text-2xl border-2 border-black">
                  {story.icon}
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Placement Hall of Fame (From Screenshot 2) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Student to Professional</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Recursive Coders Placement Hall of Fame
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              From college classrooms to top tier tech organizations. Real offers achieved by our Bengaluru cohorts.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300"
          >
            <span>View all 490+ placement stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {placements.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl glass-card space-y-4 hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${p.badgeColor} shadow-md`}>
                  {p.company || p.package}
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">{p.type}</span>
              </div>

              {/* Student avatar & name */}
              <div className="space-y-1 pt-2">
                <div className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  {p.name}
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  {p.college}
                </div>
              </div>

              {/* Role & Package */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-zinc-400">{p.role}</span>
                <span className="font-black text-emerald-400">{p.package}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Code Execution Demo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-widest">
                <Terminal className="w-4 h-4" />
                <span>Instant In-Browser Sandbox</span>
              </div>
              <h3 className="text-2xl font-black text-white">Experience Zero-Latency Code Execution</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Write algorithms in Python or Java. Test them live with immediate testcase feedback.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDemoCodeLanguage('python')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  demoCodeLanguage === 'python'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => setDemoCodeLanguage('java')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  demoCodeLanguage === 'java'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Java 21
              </button>
              <button
                onClick={runDemoCode}
                disabled={isDemoRunning}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isDemoRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor preview */}
            <div className="rounded-2xl bg-[#090a0f] border border-white/10 p-4 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto">
              <pre>{demoCodeLanguage === 'python' ? samplePythonCode : sampleJavaCode}</pre>
            </div>

            {/* Output terminal */}
            <div className="rounded-2xl bg-[#090a0f] border border-white/10 p-4 font-mono text-xs space-y-2">
              <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-white/[0.06] pb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Console Output</span>
              </div>
              {demoCodeOutput ? (
                <div className="text-emerald-400 whitespace-pre-wrap animate-in fade-in">
                  {demoCodeOutput}
                </div>
              ) : (
                <div className="text-zinc-400 italic">
                  Click &ldquo;Run Code&rdquo; above to execute in real-time sandbox.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses & Career Paths */}
      <section id="courses" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <Compass className="w-3.5 h-3.5 text-violet-400" />
            <span>Curriculum Designed for Bangalore Tech Industry</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Comprehensive Career Paths
          </h2>
          <p className="text-sm text-zinc-400">
            Tailored roadmaps crafted by senior industry engineering leads to turn engineering students into top-performing software professionals.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2">
          {(['all', 'fullstack', 'aiml', 'dsa'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCourseTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                activeCourseTab === tab
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {tab === 'all' ? 'All Programs' : tab === 'fullstack' ? 'Full Stack Java' : tab === 'aiml' ? 'AI & Machine Learning' : 'Core DSA & LeetCode'}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-3xl glass-card space-y-5 flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {course.tag}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">{course.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{course.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{course.description}</p>
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Core Modules Covered:
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {course.topics.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-amber-400 font-semibold">{course.rating}</span>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Infrastructure Health Probe (Bottom Bar) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/[0.05] text-zinc-300 border border-white/[0.1]">
                <Server className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  System Health &amp; Runtime Status
                </h4>
                <p className="text-xs text-zinc-400">
                  Spring Boot 3 API &amp; Database Probe (<code className="text-zinc-300">GET /api/v1/health</code>)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoading && (
                <span className="text-xs text-zinc-400 animate-pulse">Probing system...</span>
              )}
              {healthData && (
                <StatusBadge status={healthData.status === 'UP' ? 'HEALTHY' : 'DOWN'} />
              )}
              {isError && (
                <button
                  onClick={() => refetch()}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Retry connection
                </button>
              )}
            </div>
          </div>

          {healthData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-[11px] text-zinc-400 block font-medium">Service</span>
                <span className="text-xs font-mono font-bold text-white">{healthData.service}</span>
              </div>
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-[11px] text-zinc-400 block font-medium">Profile</span>
                <span className="text-xs font-mono font-bold text-violet-400">
                  {healthData.activeProfile || 'development'}
                </span>
              </div>
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-[11px] text-zinc-400 block font-medium">Storage Engine</span>
                <span className="text-xs font-mono font-bold text-emerald-400">PostgreSQL / H2 Embedded</span>
              </div>
              <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-[11px] text-zinc-400 block font-medium">Sandbox Compilers</span>
                <span className="text-xs font-mono font-bold text-amber-300">Python 3 / Java 21 / Judge0</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

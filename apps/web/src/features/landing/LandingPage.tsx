import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Rocket,
  Brain,
  Code2,
  Building2,
  Zap,
  ShieldCheck,
  Briefcase,
  Award,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Layers,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Shield,
  ChevronRight,
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

  // Portal destination for authenticated users
  const getPortalDestination = () => {
    if (!user?.role) return '/student';
    const role = user.role.startsWith('ROLE_') ? user.role.substring(5) : user.role;
    if (role === 'ADMIN') return '/admin';
    if (role === 'TRAINER') return '/trainer';
    return '/student';
  };

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

  // 12-Step Career Roadmap matching reference structure
  const journeySteps = [
    { title: 'Confused', desc: 'Unsure about tech career', icon: HelpCircle, color: 'text-amber-500' },
    { title: 'Discover RC', desc: 'Find Bengaluru campus', icon: Compass, color: 'text-cyan-500' },
    { title: 'Counselling', desc: '1v1 personalized roadmap', icon: Brain, color: 'text-violet-500' },
    { title: 'Learn Skills', desc: 'Java 21, Spring 3, React', icon: BookOpen, color: 'text-emerald-500' },
    { title: 'Practice Coding', desc: 'Live sandbox & Monaco', icon: Code2, color: 'text-orange-500', isHighlight: true },
    { title: 'Build Projects', desc: 'Enterprise SaaS apps', icon: Layers, color: 'text-blue-500' },
    { title: 'Clarify Doubts', desc: 'Daily mentor sessions', icon: Lightbulb, color: 'text-yellow-500' },
    { title: 'Communication', desc: 'Behavioral & tech pitching', icon: Users, color: 'text-teal-500' },
    { title: 'Apply for Jobs', desc: 'Campus & off-campus', icon: Briefcase, color: 'text-purple-500' },
    { title: 'Interviews', desc: 'DSA & System Design rounds', icon: Building2, color: 'text-indigo-500' },
    { title: 'Placed', desc: 'Verified offer extended', icon: Trophy, color: 'text-emerald-500', isGoal: true },
    { title: 'Career Growth', desc: 'Senior SDE progression', icon: TrendingUp, color: 'text-rose-500' },
  ];

  const stories = [
    { title: 'New batch', icon: Rocket, tag: 'Admissions Open' },
    { title: 'AI ML', icon: Brain, tag: 'Deep Learning' },
    { title: 'Full stack Dev', icon: Code2, tag: 'React & Spring' },
    { title: 'Inauguration', icon: Building2, tag: 'Bengaluru Campus' },
    { title: 'C Programming', icon: Zap, tag: 'Core Systems' },
  ];

  // Verified placements configured and published exclusively by Admin
  const [adminPlacements] = useState<Array<{
    id: string;
    name: string;
    college: string;
    company: string;
    package: string;
    role: string;
    type: string;
    badgeColor?: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem('rc_placed_students');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const partnerNetwork = [
    {
      company: 'Amazon AWS',
      tier: 'Tier-1 FAANG',
      packageRange: '14.0 - 28.0 LPA',
      roles: 'Cloud Systems, SDE-1',
      badgeColor: 'from-amber-500 to-orange-500',
    },
    {
      company: 'Microsoft',
      tier: 'Tier-1 Product',
      packageRange: '12.0 - 24.0 LPA',
      roles: 'Full Stack & Distributed APIs',
      badgeColor: 'from-cyan-500 to-blue-600',
    },
    {
      company: 'Cisco Systems',
      tier: 'Enterprise Networking',
      packageRange: '10.0 - 18.0 LPA',
      roles: 'Core Systems & Reliability',
      badgeColor: 'from-emerald-500 to-teal-600',
    },
    {
      company: 'Razorpay',
      tier: 'FinTech Unicorn',
      packageRange: '9.0 - 16.0 LPA',
      roles: 'Backend Platform Engineer',
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

  const upcomingBatches = [
    {
      id: 'b-fs-1',
      title: 'Full Stack Java & Cloud Microservices',
      tag: 'Fast Filling',
      startDate: '1st of Upcoming Month',
      timing: 'Morning Cohort (9:30 AM - 1:30 PM)',
      mode: 'Hybrid (Bengaluru Campus & Live Online)',
      seats: '6 Seats Left',
      desc: 'Hands-on project engineering with Spring Boot 3, React 19, PostgreSQL, Docker, and CI/CD pipelines.',
    },
    {
      id: 'b-ai-1',
      title: 'Generative AI & Deep Learning Masterclass',
      tag: 'Admissions Open',
      startDate: '15th of Upcoming Month',
      timing: 'Weekend Intensive (10:00 AM - 5:00 PM)',
      mode: 'In-Campus Hands-on Lab',
      seats: '10 Seats Left',
      desc: 'PyTorch deep neural networks, transformer architectures, LLM fine-tuning, RAG, and autonomous agent loops.',
    },
    {
      id: 'b-dsa-1',
      title: 'Competitive DSA & FAANG Coding Arena',
      tag: 'Evening Track',
      startDate: '5th of Upcoming Month',
      timing: 'Evening (6:30 PM - 9:30 PM)',
      mode: 'Interactive Virtual Classroom',
      seats: '12 Seats Left',
      desc: '300+ LeetCode problem patterns, time-space complexity optimization, dynamic programming, and mock coding rounds.',
    },
  ];

  const filteredCourses = activeCourseTab === 'all'
    ? courses
    : courses.filter((c) => c.category === activeCourseTab);

  return (
    <div id="home" className="space-y-20 pb-20">
      {/* Code Battles Modal */}
      <CodeBattlesModal
        isOpen={isBattleModalOpen}
        onClose={() => setIsBattleModalOpen(false)}
      />

      {/* Logged in Quick Return Banner */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Signed in as <strong>{user?.fullName}</strong> ({user?.role})</span>
            </div>
            <Link
              to={getPortalDestination()}
              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 shadow-sm"
            >
              <span>Go to My Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section matching Dhee Coding Lab Reference Layout */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 mt-4 border border-zinc-200/80 dark:border-emerald-500/20 bg-gradient-to-b from-emerald-50/50 via-white to-zinc-50 dark:from-[#0b1411] dark:via-[#080d0b] dark:to-[#050807] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Overline Tagline matching reference */}
              <div className="flex items-center gap-2 text-xs font-black tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                <span>LEARN</span>
                <span>&bull;</span>
                <span>PRACTICE</span>
                <span>&bull;</span>
                <span>BUILD</span>
                <span>&bull;</span>
                <span>GROW</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.12]">
                With Recursive Coders <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300">
                  Own Your Journey.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed font-normal">
                A guided journey that turns your potential into a thriving career in technology. Real-time zero-latency coding, personalized SelfStudy streak trackers, and verified placement pathways.
              </p>

              {/* Action Buttons matching reference */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#programs"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#sandbox"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Practice Coding</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsBattleModalOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-zinc-800 dark:text-zinc-200 font-bold text-sm border border-zinc-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Swords className="w-4 h-4 text-amber-500" />
                  <span>Code Battles</span>
                </button>
              </div>

              {/* Campus Credential Motto */}
              <div className="pt-4 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <RecursiveCodersLogo size="sm" showText={false} />
                <span>&ldquo;Think Recursive, Code Progressive&rdquo; &bull; Vijayanagara, Bengaluru 560040</span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-emerald-500/30 shadow-2xl bg-zinc-900 group">
                <img
                  src="/hero-coding-journey.jpg"
                  alt="Student coding at Recursive Coders Bengaluru tech workstation"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                />

                {/* Floating pill: Practice Coding */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-amber-500 text-zinc-950 text-xs font-black shadow-xl flex items-center gap-1.5 animate-bounce">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Practice Coding</span>
                </div>

                {/* Floating pill: Progress Checklist */}
                <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs space-y-1 shadow-2xl">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Small Steps, Big Progress</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Daily assignments &bull; 100% verified testcases</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Step Journey Roadmap Bar along the bottom (Direct reference from Dhee Coding Lab) */}
        <div id="journey" className="border-t border-zinc-200/80 dark:border-emerald-500/20 bg-white/80 dark:bg-black/40 backdrop-blur-md py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl shrink-0 transition-all ${
                    step.isHighlight
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20 scale-105'
                      : step.isGoal
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05] text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/30'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${step.isHighlight ? 'bg-zinc-950 text-amber-400' : 'bg-white/60 dark:bg-white/10'}`}>
                    <Icon className={`w-3.5 h-3.5 ${step.isHighlight ? 'text-amber-400' : step.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold whitespace-nowrap">{step.title}</div>
                    <div className="text-[10px] opacity-75 whitespace-nowrap hidden sm:block">{step.desc}</div>
                  </div>
                  {idx < journeySteps.length - 1 && (
                    <ChevronRight className="w-3 h-3 opacity-40 shrink-0 ml-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cohort Story Highlights Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto py-2 no-scrollbar">
          {stories.map((story, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center border-2 border-zinc-900">
                  <story.icon className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses & Career Paths (#programs) */}
      <section id="programs" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Curriculum Designed for Bangalore Tech Industry</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Comprehensive Career Programs
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tailored roadmaps crafted by senior industry engineering leads to turn engineering students into top-performing software professionals.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {(['all', 'fullstack', 'aiml', 'dsa'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCourseTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
                activeCourseTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
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
              className="p-6 rounded-3xl glass-card space-y-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 border border-zinc-200/80 dark:border-white/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    {course.tag}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{course.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{course.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{course.description}</p>
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Core Modules Covered:
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {course.topics.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200/80 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-amber-500 font-semibold">{course.rating}</span>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Code Execution Demo (#sandbox) */}
      <section id="sandbox" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                <Terminal className="w-4 h-4" />
                <span>Instant In-Browser Sandbox</span>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Experience Zero-Latency Code Execution</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Write algorithms in Python or Java. Test them live with immediate testcase feedback.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDemoCodeLanguage('python')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  demoCodeLanguage === 'python'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => setDemoCodeLanguage('java')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  demoCodeLanguage === 'java'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Java 21
              </button>
              <button
                onClick={runDemoCode}
                disabled={isDemoRunning}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition"
              >
                <Play className="w-3.5 h-3.5 fill-zinc-950" />
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

      {/* Success Stories & Placement Network (#placements) */}
      <section id="placements" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Admin Verified Placements &amp; Corporate Network</span>
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Recursive Coders Placement Network
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Authentic career pathways. Student placement records are verified and published exclusively by the Placement Administration and corporate recruiters.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Explore active campus drives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Placement Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-card space-y-1 border border-zinc-200/80 dark:border-white/10">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center justify-between">
              <span>Placement Rate</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">98.4%</div>
            <div className="text-[11px] text-zinc-500">Verified cohort record</div>
          </div>
          <div className="p-4 rounded-2xl glass-card space-y-1 border border-zinc-200/80 dark:border-white/10">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center justify-between">
              <span>Peak Package</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500">18.5 LPA</div>
            <div className="text-[11px] text-zinc-500">Highest CTC offered</div>
          </div>
          <div className="p-4 rounded-2xl glass-card space-y-1 border border-zinc-200/80 dark:border-white/10">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center justify-between">
              <span>Median Tech CTC</span>
              <Briefcase className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">7.2 LPA</div>
            <div className="text-[11px] text-zinc-500">Software &amp; cloud roles</div>
          </div>
          <div className="p-4 rounded-2xl glass-card space-y-1 border border-zinc-200/80 dark:border-white/10">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center justify-between">
              <span>Hiring Partners</span>
              <Building2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">45+ Companies</div>
            <div className="text-[11px] text-zinc-500">Active campus recruiters</div>
          </div>
        </div>

        {/* If Admin has published placed students, show them */}
        {adminPlacements.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Verified Placed Students</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {adminPlacements.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group border border-emerald-500/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md">
                      {p.company || p.package}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {p.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                      {p.college}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">{p.role}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{p.package}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Corporate Hiring Network Cards with Admin Verified Notice */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {partnerNetwork.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl glass-card space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group border border-zinc-200/80 dark:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${p.badgeColor} shadow-md`}>
                      {p.company}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">{p.tier}</span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {p.roles}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                      Active Recruitment Partner
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Package Band</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{p.packageRange}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Verification Governance Notice */}
            <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start sm:items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white">Admin-Managed Placement Registry:</span>{' '}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Student placement names and verified offer letters are published exclusively by the Platform Admin &amp; Corporate Placement Cell.
                  </span>
                </div>
              </div>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center shrink-0 transition"
              >
                Access Placement Portal
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Upcoming Batches & Admissions Schedule (#batches) */}
      <section id="batches" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Admissions &amp; Cohort Schedules</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Upcoming Cohort Batches
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Small cohort batches of max 25 students ensure high-touch personalized mentorship, code reviews, and placement focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-6 rounded-3xl glass-card border border-zinc-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between hover:border-emerald-500/30 transition shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    {batch.tag}
                  </span>
                  <span className="text-[11px] font-bold text-amber-500">{batch.seats}</span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{batch.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{batch.desc}</p>

                <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 pt-2 border-t border-zinc-200/80 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Starts: <strong>{batch.startDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Timing: {batch.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Mode: {batch.mode}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition text-center block"
              >
                Reserve Your Seat &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Us & Creators Section (Explicitly requested: Deepith and Akshay K A) */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Founding Team &amp; Engineering Ethos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            About Recursive Coders &amp; The Creators
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Recursive Coders was established in Vijayanagara, Bengaluru to bridge academia and Tier-1 product organizations. We combine the rigor of Silicon Valley engineering standards with localized Bengaluru mentorship.
          </p>
        </div>

        {/* Creators Spotlight Cards for Deepith & Akshay K A */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Creator 1: Deepith */}
          <div className="p-8 rounded-3xl glass-card space-y-6 border border-emerald-500/20 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Lead Software Architect
                </span>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Deepith</h3>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Co-Founder &amp; Platform Architect</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-300 font-black text-xl">
                  D
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Architect of the Recursive Coders distributed architecture, including the zero-latency Judge0 multi-language compiler pipeline, SelfStudy productivity tracker, dark/light design system, and real-time coding arenas.
            </p>

            <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">Spring Boot 3</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">React 19 &amp; Vite</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">Judge0 Sandbox</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">PostgreSQL</span>
            </div>
          </div>

          {/* Creator 2: Akshay K A */}
          <div className="p-8 rounded-3xl glass-card space-y-6 border border-cyan-500/20 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                  Lead Systems Engineer
                </span>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Akshay K A</h3>
                <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Co-Founder &amp; Systems Operations</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center text-cyan-300 font-black text-xl">
                  A
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Designer of the institutional placement governance registry, cohort scoring algorithms, automated assessment evaluation pipelines, and student skill radar systems powering placements across top technology companies.
            </p>

            <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">Placement Registry</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">Assessment Engines</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">Docker &amp; Cloud</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04]">Telemetry</span>
            </div>
          </div>
        </div>

        {/* Founding Ethos Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 text-center space-y-2">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 italic">
            &ldquo;We built Recursive Coders to eliminate the gap between university grades and real product engineering careers. Every student deserves access to world-class compilers, personalized mentorship, and verified placement pathways.&rdquo;
          </p>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            &mdash; Deepith &amp; Akshay K A, Bengaluru
          </div>
        </div>
      </section>

      {/* Institutional Role Gateways / Portals Hub (#portals) */}
      <section id="portals" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
            <Shield className="w-3.5 h-3.5 text-violet-500" />
            <span>Dedicated Platform Portals</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Institutional Role Gateways
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Secure, role-tailored workspaces for students, faculty trainers, and platform administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Portal Card */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-emerald-500/20 hover:border-emerald-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Student Portal</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Track your SelfStudy productivity streak, solve Monaco IDE assignments, participate in 1v1 code battles, and apply to campus placement drives.
              </p>
            </div>
            <Link
              to="/login?portal=student"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition text-center block"
            >
              Access Student Portal &rarr;
            </Link>
          </div>

          {/* Trainer Studio Card */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-teal-500/20 hover:border-teal-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Trainer Studio</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Author test questions, monitor batch cohort progress, evaluate code testcase submissions, and review candidate placement readiness radars.
              </p>
            </div>
            <Link
              to="/login?portal=trainer"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition text-center block"
            >
              Access Trainer Studio &rarr;
            </Link>
          </div>

          {/* Admin Control Center */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-cyan-500/20 hover:border-cyan-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Admin Center</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Manage user directories, author corporate placement drives, curate public hall of fame spotlights, and inspect live compiler infrastructure.
              </p>
            </div>
            <Link
              to="/login?portal=admin"
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition text-center block"
            >
              Access Admin Center &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* System Infrastructure Health Probe (Bottom Bar) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-zinc-200/80 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200/80 dark:border-white/[0.06] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.1]">
                <Server className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  System Health &amp; Runtime Status
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Spring Boot 3 API &amp; Database Probe (<code className="text-zinc-700 dark:text-zinc-300">GET /api/v1/health</code>)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoading && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 animate-pulse">Probing system...</span>
              )}
              {healthData && (
                <StatusBadge status={healthData.status === 'UP' ? 'HEALTHY' : 'DOWN'} />
              )}
              {isError && (
                <button
                  onClick={() => refetch()}
                  className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                >
                  Retry connection
                </button>
              )}
            </div>
          </div>

          {healthData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-50 dark:bg-white/[0.02] p-3 rounded-xl border border-zinc-200 dark:border-white/[0.04]">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Service</span>
                <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">{healthData.service}</span>
              </div>
              <div className="bg-zinc-50 dark:bg-white/[0.02] p-3 rounded-xl border border-zinc-200 dark:border-white/[0.04]">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Profile</span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {healthData.activeProfile || 'development'}
                </span>
              </div>
              <div className="bg-zinc-50 dark:bg-white/[0.02] p-3 rounded-xl border border-zinc-200 dark:border-white/[0.04]">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Storage Engine</span>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">PostgreSQL / H2 Embedded</span>
              </div>
              <div className="bg-zinc-50 dark:bg-white/[0.02] p-3 rounded-xl border border-zinc-200 dark:border-white/[0.04]">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Sandbox Compilers</span>
                <span className="text-xs font-mono font-bold text-amber-500">Python 3 / Java 21 / Judge0</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

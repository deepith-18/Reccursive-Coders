import React from 'react';
import { Link } from 'react-router-dom';
import { RecursiveCodersLogo } from './RecursiveCodersLogo';
import {
  MapPin,
  Mail,
  Phone,
  Code2,
  Terminal,
  Trophy,
  Users,
  Shield,
  Heart,
  ExternalLink,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-emerald-500/20 bg-white/70 dark:bg-[#070e0c]/90 backdrop-blur-xl text-zinc-600 dark:text-zinc-400">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Bengaluru Campus Column (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <RecursiveCodersLogo size="md" showText={true} showTagline={true} />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              Bengaluru&apos;s premier career launchpad bridging academic curriculum with modern production software engineering. From campus to FAANG, Tier-1 product organizations, and fast-growth tech startups.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Vijayanagara, Bengaluru 560040, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>admissions@recursivecoders.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>+91 80 2345 6789 &bull; Campus Helpdesk</span>
              </div>
            </div>

            {/* Creators Highlight Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Platform Architects &amp; Developers</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Conceptualized, architected, and built with passion by <strong className="text-zinc-950 dark:text-white font-bold">Deepith</strong> and <strong className="text-zinc-950 dark:text-white font-bold">Akshay K A</strong> for next-generation tech talent.
              </p>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Programs &amp; Tracks
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/#programs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Full Stack Java &amp; Cloud
                </a>
              </li>
              <li>
                <a href="/#programs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  AI &amp; Machine Learning
                </a>
              </li>
              <li>
                <a href="/#programs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Core DSA &amp; LeetCode 300+
                </a>
              </li>
              <li>
                <a href="/#programs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Distributed Systems &amp; Docker
                </a>
              </li>
              <li>
                <a href="/#batches" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Upcoming Batches</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </a>
              </li>
            </ul>
          </div>

          {/* Learning Platform */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Learning Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/#sandbox" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Online Coding Sandbox</span>
                </a>
              </li>
              <li>
                <a href="/#journey" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Career Roadmap</span>
                </a>
              </li>
              <li>
                <a href="/#placements" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Placement Hall of Fame</span>
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                  <span>Assessment Arena</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Dedicated Institutional Portals */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Institutional Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/login?portal=student"
                  className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition group font-medium"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Student Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  to="/login?portal=trainer"
                  className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition group font-medium"
                >
                  <Users className="w-3.5 h-3.5 text-teal-500" />
                  <span>Trainer Studio</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  to="/login?portal=admin"
                  className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition group font-medium"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Admin Control Center</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <a
                  href="/#about"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                >
                  About the Founders
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Deepith & Akshay K A Credit */}
      <div className="border-t border-zinc-200/80 dark:border-emerald-500/20 bg-zinc-100/60 dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Recursive Coders Bengaluru &bull; &ldquo;Think Recursive, Code Progressive&rdquo;
          </p>

          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-semibold bg-white/60 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-zinc-200 dark:border-emerald-500/30 shadow-sm">
            <span>Engineered &amp; Developed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <strong className="text-zinc-950 dark:text-white">Deepith</strong>
            <span>&amp;</span>
            <strong className="text-zinc-950 dark:text-white">Akshay K A</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};

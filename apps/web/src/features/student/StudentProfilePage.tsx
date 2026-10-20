import React, { useState, useEffect } from 'react';
import {
  StudentProfilesService,
  StudentProfileResponse,
  UpdateProfileRequest,
} from '@/api/generated';
import {
  GraduationCap,
  Building2,
  Calendar,
  Award,
  Globe,
  Github,
  Linkedin,
  FileText,
  UploadCloud,
  Download,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [degree, setDegree] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [graduationYear, setGraduationYear] = useState<string>('');
  const [cgpa, setCgpa] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [portfolioUrl, setPortfolioUrl] = useState<string>('');

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await StudentProfilesService.getMyProfile();
      if (res.data) {
        setProfile(res.data);
        setDegree(res.data.degree || '');
        setBranch(res.data.branch || '');
        setCollege(res.data.college || '');
        setGraduationYear(res.data.graduationYear ? String(res.data.graduationYear) : '');
        setCgpa(res.data.cgpa !== undefined && res.data.cgpa !== null ? String(res.data.cgpa) : '');
        setSkills(res.data.skills || []);
        setGithubUrl(res.data.githubUrl || '');
        setLinkedinUrl(res.data.linkedinUrl || '');
        setPortfolioUrl(res.data.portfolioUrl || '');
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload: UpdateProfileRequest = {
      degree: degree.trim() || undefined,
      branch: branch.trim() || undefined,
      college: college.trim() || undefined,
      graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
      cgpa: cgpa ? parseFloat(cgpa) : undefined,
      skills: skills,
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
    };

    try {
      const res = await StudentProfilesService.updateMyProfile(payload);
      if (res.data) {
        setProfile(res.data);
        setSuccessMessage('Profile credentials updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setErrorMessage(error.body?.message || error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await StudentProfilesService.uploadResume({ file });
      if (res.data) {
        setProfile(res.data);
        setSuccessMessage(`Resume "${file.name}" uploaded successfully!`);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: unknown) {
      const error = err as { body?: { message?: string }; message?: string };
      setErrorMessage(error.body?.message || error.message || 'Resume upload failed.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDownloadResume = async () => {
    try {
      const blob = await StudentProfilesService.getMyResume();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile?.resumeFileName || 'student_resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to download resume.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const completion = profile?.completionPercentage ?? 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Placement Profile &amp; Readiness
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Build your academic credentials, technical skills, and resume for placement drives.
          </p>
        </div>
      </div>

      {/* Completion Meter Card */}
      <div className="glass-card p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-white/[0.03] via-card to-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-black text-lg">
              {completion}%
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Profile Completeness Score</h3>
              <p className="text-xs text-zinc-400">
                {completion === 100
                  ? 'Your profile is 100% verified and drive-ready!'
                  : 'Complete all sections including resume upload to achieve maximum placement visibility.'}
              </p>
            </div>
          </div>
          {completion === 100 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Placement Ready
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.05] rounded-full h-2.5 overflow-hidden border border-white/[0.06]">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              completion >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : completion >= 50
                ? 'bg-gradient-to-r from-blue-500 to-primary-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Feedback Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form + Resume Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Academic Details & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Academic Information */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <GraduationCap className="w-5 h-5 text-primary-400" />
                Academic Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Degree Program
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / B.E / MCA"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Branch / Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science & Eng."
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    College / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. National Institute of Technology"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    placeholder="2025"
                    min={2020}
                    max={2035}
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-muted-foreground" />
                    Cumulative GPA (CGPA)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="e.g. 8.75"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Technical Skills Tag Editor */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-5 h-5 text-primary-400" />
                Technical Skills &amp; Stack
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type skill & press Enter (e.g. Java, React, Docker)..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
                {skills.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No skills added yet. Add languages, frameworks, or databases you are proficient in.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/25 text-primary-300 text-xs font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400 text-primary-400/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Globe className="w-5 h-5 text-primary-400" />
                Social Profiles &amp; Portfolio
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-muted-foreground" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    Personal Portfolio / Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourportfolio.dev"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-md shadow-white/5 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-900" /> Saving Changes...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Resume Upload Card */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <FileText className="w-5 h-5 text-violet-400" />
              Resume Document
            </h2>

            {profile?.hasResume ? (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {profile.resumeFileName || 'resume.pdf'}
                    </div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Attached to Profile
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/[0.08]"
                >
                  <Download className="w-3.5 h-3.5" /> Download Resume
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
                No resume uploaded yet. Recruiter shortlisting requires an active PDF resume.
              </div>
            )}

            {/* Upload Dropzone */}
            <label className="relative border-2 border-dashed border-white/[0.12] hover:border-violet-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] block">
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeUpload}
                disabled={isUploading}
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                  <span className="text-xs text-zinc-400">Uploading resume...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {profile?.hasResume ? 'Replace Resume' : 'Upload Resume'}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    PDF or DOCX (Max 5MB)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Quick Placement Tips */}
          <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Placement Readiness Tips
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Keep CGPA accurate to match college transcripts.</li>
              <li>Add key skills you can defend in technical interviews.</li>
              <li>Provide public GitHub links with readable commit histories.</li>
              <li>Keep resumes to 1-2 pages in clean PDF format.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

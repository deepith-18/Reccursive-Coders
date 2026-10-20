import { apiClient } from './client';

export type AssessmentType = 'MOCK_DRIVE' | 'CODING_CONTEST' | 'TOPIC_SPRINT' | 'MOCK_INTERVIEW';
export type AssessmentStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
export type ProctoringLevel = 'STRICT' | 'MODERATE' | 'RELAXED';
export type AttemptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED' | 'DISQUALIFIED';

export interface AssessmentSummaryDto {
  id: string;
  title: string;
  description?: string;
  companyTag?: string;
  type: AssessmentType;
  status: AssessmentStatus;
  proctoringLevel: ProctoringLevel;
  durationMinutes: number;
  maxViolationsAllowed: number;
  passingScore: number;
  totalPoints: number;
  questionCount: number;
  startsAt?: string;
  endsAt?: string;
  batchId?: string;
  createdByName?: string;
  myAttemptStatus: AttemptStatus;
  myScore?: number;
  myStartedAt?: string;
  mySubmittedAt?: string;
}

export interface AssessmentQuestionDto {
  id: string;
  questionId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sectionName?: string;
  points: number;
  sortOrder: number;
}

export interface AssessmentDetailDto {
  id: string;
  title: string;
  description?: string;
  companyTag?: string;
  type: AssessmentType;
  status: AssessmentStatus;
  proctoringLevel: ProctoringLevel;
  durationMinutes: number;
  maxViolationsAllowed: number;
  passingScore: number;
  totalPoints: number;
  startsAt?: string;
  endsAt?: string;
  batchId?: string;
  questions: AssessmentQuestionDto[];
  myAttemptStatus: AttemptStatus;
  myScore?: number;
  tabSwitchCount: number;
  copyPasteCount: number;
  remainingSeconds?: number;
  feedbackNotes?: string;
}

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  companyTag?: string;
  type: AssessmentType;
  status?: AssessmentStatus;
  proctoringLevel?: ProctoringLevel;
  durationMinutes: number;
  maxViolationsAllowed?: number;
  passingScore?: number;
  startsAt?: string;
  endsAt?: string;
  batchId?: string;
  questions?: Array<{
    questionId: string;
    sectionName?: string;
    points?: number;
    sortOrder?: number;
  }>;
}

export interface StartAssessmentResponse {
  attemptId: string;
  assessmentId: string;
  startedAt: string;
  remainingSeconds: number;
  maxViolationsAllowed: number;
  status: AttemptStatus;
}

export interface RecordViolationResponse {
  tabSwitchCount: number;
  copyPasteCount: number;
  maxViolationsAllowed: number;
  isDisqualified: boolean;
  status: AttemptStatus;
  warningMessage: string;
}

export interface AssessmentLeaderboardEntryDto {
  rank: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  timeTakenSeconds: number;
  tabSwitchCount: number;
  status: AttemptStatus;
  submittedAt?: string;
}

export interface AssessmentRosterEntryDto {
  attemptId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: AttemptStatus;
  score: number;
  tabSwitchCount: number;
  copyPasteCount: number;
  startedAt: string;
  submittedAt?: string;
  timeTakenSeconds: number;
}

export const assessmentsApi = {
  listAssessments: async (status?: AssessmentStatus): Promise<AssessmentSummaryDto[]> => {
    const res = await apiClient.get<{ success: boolean; data: AssessmentSummaryDto[] }>('/assessments', {
      params: status ? { status } : {},
    });
    return res.data.data;
  },

  getAssessmentDetails: async (id: string): Promise<AssessmentDetailDto> => {
    const res = await apiClient.get<{ success: boolean; data: AssessmentDetailDto }>(`/assessments/${id}`);
    return res.data.data;
  },

  createAssessment: async (data: CreateAssessmentRequest): Promise<AssessmentSummaryDto> => {
    const res = await apiClient.post<{ success: boolean; data: AssessmentSummaryDto }>('/assessments', data);
    return res.data.data;
  },

  startAssessment: async (id: string): Promise<StartAssessmentResponse> => {
    const res = await apiClient.post<{ success: boolean; data: StartAssessmentResponse }>(`/assessments/${id}/start`);
    return res.data.data;
  },

  recordViolation: async (id: string, violationType: 'TAB_SWITCH' | 'COPY_PASTE' | 'FULLSCREEN_EXIT', details?: string): Promise<RecordViolationResponse> => {
    const res = await apiClient.post<{ success: boolean; data: RecordViolationResponse }>(`/assessments/${id}/violations`, {
      violationType,
      details,
    });
    return res.data.data;
  },

  submitAssessment: async (id: string, earnedScore: number, feedbackNotes?: string): Promise<AssessmentDetailDto> => {
    const res = await apiClient.post<{ success: boolean; data: AssessmentDetailDto }>(`/assessments/${id}/submit`, {
      earnedScore,
      feedbackNotes,
    });
    return res.data.data;
  },

  getLeaderboard: async (id: string): Promise<AssessmentLeaderboardEntryDto[]> => {
    const res = await apiClient.get<{ success: boolean; data: AssessmentLeaderboardEntryDto[] }>(`/assessments/${id}/leaderboard`);
    return res.data.data;
  },

  getRoster: async (id: string): Promise<AssessmentRosterEntryDto[]> => {
    const res = await apiClient.get<{ success: boolean; data: AssessmentRosterEntryDto[] }>(`/assessments/${id}/roster`);
    return res.data.data;
  },

  getMyAttempts: async (): Promise<AssessmentSummaryDto[]> => {
    const res = await apiClient.get<{ success: boolean; data: AssessmentSummaryDto[] }>('/assessments/my-attempts');
    return res.data.data;
  },
};

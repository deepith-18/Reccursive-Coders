import { apiClient } from './client';

export interface AnalyticsOverview {
  totalStudents: number;
  totalTrainers: number;
  totalBatches: number;
  totalQuestions: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  globalAcceptanceRate: number;
  activeStudentsToday: number;
  totalPlacementDrives: number;
  languageBreakdown: Record<string, number>;
}

export interface TopicMastery {
  category: string;
  totalAttempts: number;
  acceptedCount: number;
  accuracyRate: number;
  status: 'STRONG' | 'MODERATE' | 'NEEDS_ATTENTION';
}

export interface BatchAnalytics {
  batchId: string;
  batchName: string;
  batchCode: string;
  enrolledStudents: number;
  totalSubmissions: number;
  averageScore: number;
  averageStreak: number;
  assignmentCompletionRate: number;
}

export const analyticsApi = {
  getOverview: async () => {
    const res = await apiClient.get<{ success: boolean; data: AnalyticsOverview }>(
      '/api/v1/analytics/overview'
    );
    return res.data.data;
  },

  getWeakTopicsRadar: async () => {
    const res = await apiClient.get<{ success: boolean; data: TopicMastery[] }>(
      '/api/v1/analytics/weak-topics'
    );
    return res.data.data;
  },

  getAllBatchesAnalytics: async () => {
    const res = await apiClient.get<{ success: boolean; data: BatchAnalytics[] }>(
      '/api/v1/analytics/batches'
    );
    return res.data.data;
  },

  getBatchAnalytics: async (batchId: string) => {
    const res = await apiClient.get<{ success: boolean; data: BatchAnalytics }>(
      `/api/v1/analytics/batches/${batchId}`
    );
    return res.data.data;
  },
};

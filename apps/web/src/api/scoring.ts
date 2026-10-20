import { apiClient } from './client';

export interface DailyHeatmapDto {
  date: string;
  count: number;
  problemsSolved: number;
  pointsEarned: number;
  level: number; // 0, 1, 2, 3, 4
}

export interface StudentScoringOverviewDto {
  globalRank: number;
  totalScore: number;
  problemsSolved: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

export const scoringApi = {
  getMyHeatmap: async (days = 365): Promise<DailyHeatmapDto[]> => {
    const response = await apiClient.get('/api/v1/scoring/heatmap', {
      params: { days },
    });
    return response.data?.data || [];
  },

  getStudentHeatmap: async (studentId: string, days = 365): Promise<DailyHeatmapDto[]> => {
    const response = await apiClient.get(`/api/v1/scoring/heatmap/${studentId}`, {
      params: { days },
    });
    return response.data?.data || [];
  },

  getMyScoringOverview: async (): Promise<StudentScoringOverviewDto> => {
    const response = await apiClient.get('/api/v1/scoring/overview');
    return response.data?.data;
  },

  getStudentScoringOverview: async (studentId: string): Promise<StudentScoringOverviewDto> => {
    const response = await apiClient.get(`/api/v1/scoring/overview/${studentId}`);
    return response.data?.data;
  },
};

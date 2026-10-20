import { apiClient } from './client';

export interface LeaderboardEntryDto {
  rank: number;
  userId: string;
  fullName: string;
  email: string;
  college?: string;
  graduationYear?: number;
  totalScore: number;
  problemsSolved: number;
  currentStreak: number;
  longestStreak: number;
}

export interface PageLeaderboardResponse {
  content: LeaderboardEntryDto[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const leaderboardApi = {
  getGlobalLeaderboard: async (page = 0, size = 50): Promise<PageLeaderboardResponse> => {
    const response = await apiClient.get('/api/v1/leaderboards/global', {
      params: { page, size },
    });
    return response.data?.data;
  },

  getBatchLeaderboard: async (batchId: string): Promise<LeaderboardEntryDto[]> => {
    const response = await apiClient.get(`/api/v1/leaderboards/batch/${batchId}`);
    return response.data?.data;
  },
};

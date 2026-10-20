import { apiClient } from './client';
import { QuestionDifficulty } from './questions';

export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface AssignmentQuestionDto {
  questionId: string;
  title: string;
  slug: string;
  difficulty: QuestionDifficulty;
  tags?: string;
  points: number;
  orderIndex: number;
}

export interface AssignmentQuestionItemRequest {
  questionId: string;
  points?: number;
  orderIndex?: number;
}

export interface CreateAssignmentRequest {
  batchId: string;
  title: string;
  description?: string;
  dueDate: string;
  startDate?: string;
  status?: AssignmentStatus;
  questions?: AssignmentQuestionItemRequest[];
}

export interface UpdateAssignmentRequest {
  title: string;
  description?: string;
  dueDate: string;
  startDate?: string;
  status: AssignmentStatus;
  questions?: AssignmentQuestionItemRequest[];
}

export interface AssignmentResponse {
  id: string;
  batchId: string;
  batchName: string;
  batchCode: string;
  title: string;
  description?: string;
  dueDate: string;
  startDate: string;
  status: AssignmentStatus;
  totalPoints: number;
  questionCount: number;
  isPastDue: boolean;
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  questions: AssignmentQuestionDto[];
}

export interface AssignmentSummaryResponse {
  id: string;
  batchId: string;
  batchName: string;
  batchCode: string;
  title: string;
  description?: string;
  dueDate: string;
  startDate: string;
  status: AssignmentStatus;
  totalPoints: number;
  questionCount: number;
  isPastDue: boolean;
  authorId?: string;
  authorName?: string;
  createdAt: string;
}

export const assignmentApi = {
  createAssignment: async (data: CreateAssignmentRequest) => {
    const response = await apiClient.post<{ success: boolean; data: AssignmentResponse }>(
      '/api/v1/assignments',
      data
    );
    return response.data.data;
  },

  getAssignmentsByBatch: async (batchId: string) => {
    const response = await apiClient.get<{ success: boolean; data: AssignmentSummaryResponse[] }>(
      `/api/v1/assignments/batch/${batchId}`
    );
    return response.data.data;
  },

  getMyAssignments: async () => {
    const response = await apiClient.get<{ success: boolean; data: AssignmentSummaryResponse[] }>(
      '/api/v1/assignments/my-assignments'
    );
    return response.data.data;
  },

  getAssignmentById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: AssignmentResponse }>(
      `/api/v1/assignments/${id}`
    );
    return response.data.data;
  },

  updateAssignment: async (id: string, data: UpdateAssignmentRequest) => {
    const response = await apiClient.put<{ success: boolean; data: AssignmentResponse }>(
      `/api/v1/assignments/${id}`,
      data
    );
    return response.data.data;
  },

  deleteAssignment: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(
      `/api/v1/assignments/${id}`
    );
    return response.data;
  },
};

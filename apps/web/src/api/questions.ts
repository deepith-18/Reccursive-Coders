import { apiClient } from './client';

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TestCaseDto {
  id?: string;
  inputData: string;
  expectedOutput: string;
  isSample?: boolean;
  explanation?: string;
  orderIndex?: number;
}

export interface CreateQuestionRequest {
  title: string;
  slug?: string;
  description: string;
  difficulty: QuestionDifficulty;
  tags?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  status?: QuestionStatus;
  starterCodeJava?: string;
  starterCodePython?: string;
  starterCodeCpp?: string;
  testCases?: TestCaseDto[];
}

export interface UpdateQuestionRequest {
  title: string;
  slug?: string;
  description: string;
  difficulty: QuestionDifficulty;
  tags?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  status: QuestionStatus;
  starterCodeJava?: string;
  starterCodePython?: string;
  starterCodeCpp?: string;
}

export interface QuestionResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: QuestionDifficulty;
  tags?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  status: QuestionStatus;
  starterCodeJava?: string;
  starterCodePython?: string;
  starterCodeCpp?: string;
  authorId?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  testCases: TestCaseDto[];
  totalTestCasesCount: number;
  hiddenTestCasesCount: number;
}

export interface QuestionSummaryResponse {
  id: string;
  title: string;
  slug: string;
  difficulty: QuestionDifficulty;
  tags?: string;
  status: QuestionStatus;
  timeLimitMs: number;
  memoryLimitMb: number;
  authorId?: string;
  authorName?: string;
  sampleCasesCount: number;
  totalCasesCount: number;
  createdAt: string;
}

export interface PaginatedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const questionApi = {
  listQuestions: async (params?: {
    status?: QuestionStatus;
    difficulty?: QuestionDifficulty;
    tag?: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await apiClient.get<{ success: boolean; data: PaginatedResult<QuestionSummaryResponse> }>(
      '/api/v1/questions',
      { params }
    );
    return response.data.data;
  },

  getQuestionById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: QuestionResponse }>(`/api/v1/questions/${id}`);
    return response.data.data;
  },

  getQuestionBySlug: async (slug: string) => {
    const response = await apiClient.get<{ success: boolean; data: QuestionResponse }>(`/api/v1/questions/slug/${slug}`);
    return response.data.data;
  },

  createQuestion: async (data: CreateQuestionRequest) => {
    const response = await apiClient.post<{ success: boolean; data: QuestionResponse }>('/api/v1/questions', data);
    return response.data.data;
  },

  updateQuestion: async (id: string, data: UpdateQuestionRequest) => {
    const response = await apiClient.put<{ success: boolean; data: QuestionResponse }>(`/api/v1/questions/${id}`, data);
    return response.data.data;
  },

  deleteQuestion: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(`/api/v1/questions/${id}`);
    return response.data;
  },

  addTestCase: async (questionId: string, data: TestCaseDto) => {
    const response = await apiClient.post<{ success: boolean; data: TestCaseDto }>(
      `/api/v1/questions/${questionId}/test-cases`,
      data
    );
    return response.data.data;
  },

  deleteTestCase: async (questionId: string, testCaseId: string) => {
    const response = await apiClient.delete<{ success: boolean; data: null }>(
      `/api/v1/questions/${questionId}/test-cases/${testCaseId}`
    );
    return response.data;
  },
};

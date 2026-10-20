import { apiClient } from './client';

export type ProgrammingLanguage = 'PYTHON' | 'JAVA' | 'CPP';

export type SubmissionVerdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'PENDING'
  | 'INTERNAL_ERROR';

export interface TestCaseRunResultDto {
  testCaseNumber: number;
  isSample: boolean;
  status: SubmissionVerdict;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr?: string;
  executionTimeMs?: number;
  memoryKb?: number;
}

export interface RunCodeRequest {
  questionId: string;
  sourceCode: string;
  language: ProgrammingLanguage;
  customInput?: string;
}

export interface RunCodeResponse {
  overallVerdict: SubmissionVerdict;
  compileSuccess: boolean;
  compileOutput?: string;
  totalSampleCases: number;
  passedSampleCases: number;
  testCaseResults: TestCaseRunResultDto[];
}

export interface SubmitCodeRequest {
  questionId: string;
  assignmentId?: string;
  sourceCode: string;
  language: ProgrammingLanguage;
}

export interface SubmitCodeResponse {
  submissionId: string;
  verdict: SubmissionVerdict;
  passedTestCases: number;
  totalTestCases: number;
  score: number;
  executionTimeMs?: number;
  memoryKb?: number;
  compileOutput?: string;
  submittedAt: string;
  testCaseResults: TestCaseRunResultDto[];
}

export interface SubmissionSummaryResponse {
  id: string;
  questionId: string;
  questionTitle: string;
  questionSlug: string;
  assignmentId?: string;
  language: ProgrammingLanguage;
  verdict: SubmissionVerdict;
  passedTestCases: number;
  totalTestCases: number;
  score: number;
  executionTimeMs?: number;
  createdAt: string;
}

export interface SubmissionDetailResponse {
  id: string;
  userId: string;
  userName: string;
  questionId: string;
  questionTitle: string;
  questionSlug: string;
  assignmentId?: string;
  sourceCode: string;
  language: ProgrammingLanguage;
  type: string;
  verdict: SubmissionVerdict;
  passedTestCases: number;
  totalTestCases: number;
  score: number;
  executionTimeMs?: number;
  memoryKb?: number;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  createdAt: string;
  testCaseResults: TestCaseRunResultDto[];
}

export const submissionApi = {
  runCode: async (data: RunCodeRequest) => {
    const response = await apiClient.post<{ success: boolean; data: RunCodeResponse }>(
      '/api/v1/submissions/run',
      data
    );
    return response.data.data;
  },

  submitCode: async (data: SubmitCodeRequest) => {
    const response = await apiClient.post<{ success: boolean; data: SubmitCodeResponse }>(
      '/api/v1/submissions/submit',
      data
    );
    return response.data.data;
  },

  getMySubmissions: async (questionId?: string) => {
    const response = await apiClient.get<{ success: boolean; data: { content: SubmissionSummaryResponse[] } }>(
      '/api/v1/submissions/my-submissions',
      { params: { questionId, size: 50 } }
    );
    return response.data.data.content;
  },

  getSubmissionById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: SubmissionDetailResponse }>(
      `/api/v1/submissions/${id}`
    );
    return response.data.data;
  },
};

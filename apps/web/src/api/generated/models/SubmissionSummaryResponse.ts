/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload data
 */
export type SubmissionSummaryResponse = {
    id?: string;
    questionId?: string;
    questionTitle?: string;
    questionSlug?: string;
    assignmentId?: string;
    language?: SubmissionSummaryResponse.language;
    verdict?: SubmissionSummaryResponse.verdict;
    passedTestCases?: number;
    totalTestCases?: number;
    score?: number;
    executionTimeMs?: number;
    createdAt?: string;
};
export namespace SubmissionSummaryResponse {
    export enum language {
        PYTHON = 'PYTHON',
        JAVA = 'JAVA',
        CPP = 'CPP',
    }
    export enum verdict {
        ACCEPTED = 'ACCEPTED',
        WRONG_ANSWER = 'WRONG_ANSWER',
        TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
        MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
        COMPILATION_ERROR = 'COMPILATION_ERROR',
        RUNTIME_ERROR = 'RUNTIME_ERROR',
        PENDING = 'PENDING',
        INTERNAL_ERROR = 'INTERNAL_ERROR',
    }
}


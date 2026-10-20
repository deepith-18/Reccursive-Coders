/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCaseRunResultDto } from './TestCaseRunResultDto';
/**
 * Payload data
 */
export type SubmitCodeResponse = {
    submissionId?: string;
    verdict?: SubmitCodeResponse.verdict;
    passedTestCases?: number;
    totalTestCases?: number;
    score?: number;
    executionTimeMs?: number;
    memoryKb?: number;
    compileOutput?: string;
    submittedAt?: string;
    testCaseResults?: Array<TestCaseRunResultDto>;
};
export namespace SubmitCodeResponse {
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


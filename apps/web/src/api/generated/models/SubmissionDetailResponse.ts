/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCaseRunResultDto } from './TestCaseRunResultDto';
/**
 * Payload data
 */
export type SubmissionDetailResponse = {
    id?: string;
    userId?: string;
    userName?: string;
    questionId?: string;
    questionTitle?: string;
    questionSlug?: string;
    assignmentId?: string;
    sourceCode?: string;
    language?: SubmissionDetailResponse.language;
    type?: SubmissionDetailResponse.type;
    verdict?: SubmissionDetailResponse.verdict;
    passedTestCases?: number;
    totalTestCases?: number;
    score?: number;
    executionTimeMs?: number;
    memoryKb?: number;
    stdout?: string;
    stderr?: string;
    compileOutput?: string;
    createdAt?: string;
    testCaseResults?: Array<TestCaseRunResultDto>;
};
export namespace SubmissionDetailResponse {
    export enum language {
        PYTHON = 'PYTHON',
        JAVA = 'JAVA',
        CPP = 'CPP',
    }
    export enum type {
        RUN = 'RUN',
        SUBMIT = 'SUBMIT',
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


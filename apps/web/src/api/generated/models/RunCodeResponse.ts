/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCaseRunResultDto } from './TestCaseRunResultDto';
/**
 * Payload data
 */
export type RunCodeResponse = {
    overallVerdict?: RunCodeResponse.overallVerdict;
    compileSuccess?: boolean;
    compileOutput?: string;
    totalSampleCases?: number;
    passedSampleCases?: number;
    testCaseResults?: Array<TestCaseRunResultDto>;
};
export namespace RunCodeResponse {
    export enum overallVerdict {
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


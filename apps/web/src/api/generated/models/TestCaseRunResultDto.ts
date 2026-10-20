/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TestCaseRunResultDto = {
    testCaseNumber?: number;
    status?: TestCaseRunResultDto.status;
    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
    stderr?: string;
    executionTimeMs?: number;
    memoryKb?: number;
    sample?: boolean;
};
export namespace TestCaseRunResultDto {
    export enum status {
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


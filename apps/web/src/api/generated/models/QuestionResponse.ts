/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCaseDto } from './TestCaseDto';
/**
 * Payload data
 */
export type QuestionResponse = {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    difficulty?: QuestionResponse.difficulty;
    tags?: string;
    timeLimitMs?: number;
    memoryLimitMb?: number;
    status?: QuestionResponse.status;
    starterCodeJava?: string;
    starterCodePython?: string;
    starterCodeCpp?: string;
    authorId?: string;
    authorName?: string;
    createdAt?: string;
    updatedAt?: string;
    testCases?: Array<TestCaseDto>;
    totalTestCasesCount?: number;
    hiddenTestCasesCount?: number;
};
export namespace QuestionResponse {
    export enum difficulty {
        EASY = 'EASY',
        MEDIUM = 'MEDIUM',
        HARD = 'HARD',
    }
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        ARCHIVED = 'ARCHIVED',
    }
}


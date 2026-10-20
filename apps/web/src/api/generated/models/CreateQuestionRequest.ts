/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTestCaseRequest } from './CreateTestCaseRequest';
export type CreateQuestionRequest = {
    title: string;
    slug?: string;
    description: string;
    difficulty: CreateQuestionRequest.difficulty;
    tags?: string;
    timeLimitMs?: number;
    memoryLimitMb?: number;
    status?: CreateQuestionRequest.status;
    starterCodeJava?: string;
    starterCodePython?: string;
    starterCodeCpp?: string;
    testCases?: Array<CreateTestCaseRequest>;
};
export namespace CreateQuestionRequest {
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


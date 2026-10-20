/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type QuestionSummaryResponse = {
    id?: string;
    title?: string;
    slug?: string;
    difficulty?: QuestionSummaryResponse.difficulty;
    tags?: string;
    status?: QuestionSummaryResponse.status;
    timeLimitMs?: number;
    memoryLimitMb?: number;
    authorId?: string;
    authorName?: string;
    sampleCasesCount?: number;
    totalCasesCount?: number;
    createdAt?: string;
};
export namespace QuestionSummaryResponse {
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


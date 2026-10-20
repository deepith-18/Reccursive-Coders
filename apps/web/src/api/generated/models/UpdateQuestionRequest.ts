/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateQuestionRequest = {
    title: string;
    slug?: string;
    description: string;
    difficulty: UpdateQuestionRequest.difficulty;
    tags?: string;
    timeLimitMs: number;
    memoryLimitMb: number;
    status: UpdateQuestionRequest.status;
    starterCodeJava?: string;
    starterCodePython?: string;
    starterCodeCpp?: string;
};
export namespace UpdateQuestionRequest {
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


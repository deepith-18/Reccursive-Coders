/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssignmentQuestionDto = {
    questionId?: string;
    title?: string;
    slug?: string;
    difficulty?: AssignmentQuestionDto.difficulty;
    tags?: string;
    points?: number;
    orderIndex?: number;
};
export namespace AssignmentQuestionDto {
    export enum difficulty {
        EASY = 'EASY',
        MEDIUM = 'MEDIUM',
        HARD = 'HARD',
    }
}


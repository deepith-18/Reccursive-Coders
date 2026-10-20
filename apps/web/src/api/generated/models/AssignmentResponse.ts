/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignmentQuestionDto } from './AssignmentQuestionDto';
/**
 * Payload data
 */
export type AssignmentResponse = {
    id?: string;
    batchId?: string;
    batchName?: string;
    batchCode?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    startDate?: string;
    status?: AssignmentResponse.status;
    totalPoints?: number;
    questionCount?: number;
    authorId?: string;
    authorName?: string;
    createdAt?: string;
    updatedAt?: string;
    questions?: Array<AssignmentQuestionDto>;
    pastDue?: boolean;
};
export namespace AssignmentResponse {
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        CLOSED = 'CLOSED',
    }
}


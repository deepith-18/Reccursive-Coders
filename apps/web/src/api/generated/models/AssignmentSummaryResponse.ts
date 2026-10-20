/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload data
 */
export type AssignmentSummaryResponse = {
    id?: string;
    batchId?: string;
    batchName?: string;
    batchCode?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    startDate?: string;
    status?: AssignmentSummaryResponse.status;
    totalPoints?: number;
    questionCount?: number;
    authorId?: string;
    authorName?: string;
    createdAt?: string;
    pastDue?: boolean;
};
export namespace AssignmentSummaryResponse {
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        CLOSED = 'CLOSED',
    }
}


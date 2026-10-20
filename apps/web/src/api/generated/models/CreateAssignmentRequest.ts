/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignmentQuestionItemRequest } from './AssignmentQuestionItemRequest';
export type CreateAssignmentRequest = {
    batchId: string;
    title: string;
    description?: string;
    dueDate: string;
    startDate?: string;
    status?: CreateAssignmentRequest.status;
    questions?: Array<AssignmentQuestionItemRequest>;
};
export namespace CreateAssignmentRequest {
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        CLOSED = 'CLOSED',
    }
}


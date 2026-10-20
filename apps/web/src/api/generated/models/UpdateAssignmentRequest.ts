/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignmentQuestionItemRequest } from './AssignmentQuestionItemRequest';
export type UpdateAssignmentRequest = {
    title: string;
    description?: string;
    dueDate: string;
    startDate?: string;
    status: UpdateAssignmentRequest.status;
    questions?: Array<AssignmentQuestionItemRequest>;
};
export namespace UpdateAssignmentRequest {
    export enum status {
        DRAFT = 'DRAFT',
        PUBLISHED = 'PUBLISHED',
        CLOSED = 'CLOSED',
    }
}


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request payload to update an existing batch
 */
export type UpdateBatchRequest = {
    name?: string;
    description?: string;
    trainerId?: string;
    startDate?: string;
    endDate?: string;
    status?: UpdateBatchRequest.status;
};
export namespace UpdateBatchRequest {
    export enum status {
        UPCOMING = 'UPCOMING',
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
    }
}


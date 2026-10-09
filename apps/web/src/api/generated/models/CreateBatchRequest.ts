/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request payload to create a new batch
 */
export type CreateBatchRequest = {
    /**
     * Batch title
     */
    name: string;
    /**
     * Unique batch code
     */
    code: string;
    /**
     * Description or syllabus overview
     */
    description?: string;
    /**
     * Optional Trainer user ID assigned to this batch
     */
    trainerId?: string;
    /**
     * Start date
     */
    startDate?: string;
    /**
     * End date
     */
    endDate?: string;
    /**
     * Initial status (defaults to ACTIVE)
     */
    status?: CreateBatchRequest.status;
};
export namespace CreateBatchRequest {
    /**
     * Initial status (defaults to ACTIVE)
     */
    export enum status {
        UPCOMING = 'UPCOMING',
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
    }
}


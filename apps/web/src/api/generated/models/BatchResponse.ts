/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
/**
 * Batch details response
 */
export type BatchResponse = {
    /**
     * Batch unique identifier
     */
    id?: string;
    /**
     * Batch title/name
     */
    name?: string;
    /**
     * Batch unique reference code
     */
    code?: string;
    /**
     * Curriculum or batch description
     */
    description?: string;
    trainer?: UserResponse;
    /**
     * Cohort start date
     */
    startDate?: string;
    /**
     * Cohort expected end date
     */
    endDate?: string;
    /**
     * Batch operational status
     */
    status?: BatchResponse.status;
    /**
     * Total number of enrolled students
     */
    studentCount?: number;
    /**
     * Creation timestamp
     */
    createdAt?: string;
};
export namespace BatchResponse {
    /**
     * Batch operational status
     */
    export enum status {
        UPCOMING = 'UPCOMING',
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
    }
}


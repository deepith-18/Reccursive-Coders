/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignmentSummaryResponse } from './AssignmentSummaryResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseListAssignmentSummaryResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    /**
     * Payload data
     */
    data?: Array<AssignmentSummaryResponse>;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


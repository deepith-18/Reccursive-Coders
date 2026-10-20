/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmissionSummaryResponse } from './SubmissionSummaryResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseListSubmissionSummaryResponse = {
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
    data?: Array<SubmissionSummaryResponse>;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


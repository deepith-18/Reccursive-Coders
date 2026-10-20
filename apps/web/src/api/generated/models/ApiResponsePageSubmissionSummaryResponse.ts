/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageSubmissionSummaryResponse } from './PageSubmissionSummaryResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponsePageSubmissionSummaryResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: PageSubmissionSummaryResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmissionDetailResponse } from './SubmissionDetailResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseSubmissionDetailResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: SubmissionDetailResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


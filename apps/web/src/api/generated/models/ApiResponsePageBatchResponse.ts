/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageBatchResponse } from './PageBatchResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponsePageBatchResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: PageBatchResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchResponse } from './BatchResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseBatchResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: BatchResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


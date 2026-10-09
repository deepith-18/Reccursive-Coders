/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkUploadResult } from './BulkUploadResult';
/**
 * Standard API response wrapper
 */
export type ApiResponseBulkUploadResult = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: BulkUploadResult;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


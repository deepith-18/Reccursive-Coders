/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageAuditLogResponse } from './PageAuditLogResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponsePageAuditLogResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: PageAuditLogResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


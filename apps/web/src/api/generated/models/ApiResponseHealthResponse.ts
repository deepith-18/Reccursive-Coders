/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthResponse } from './HealthResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseHealthResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: HealthResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


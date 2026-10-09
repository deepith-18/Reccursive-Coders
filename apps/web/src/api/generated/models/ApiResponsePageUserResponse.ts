/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageUserResponse } from './PageUserResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponsePageUserResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: PageUserResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RunCodeResponse } from './RunCodeResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseRunCodeResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: RunCodeResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


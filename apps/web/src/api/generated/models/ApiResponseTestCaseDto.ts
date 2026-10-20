/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestCaseDto } from './TestCaseDto';
/**
 * Standard API response wrapper
 */
export type ApiResponseTestCaseDto = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: TestCaseDto;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


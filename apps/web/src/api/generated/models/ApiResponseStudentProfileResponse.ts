/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentProfileResponse } from './StudentProfileResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseStudentProfileResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: StudentProfileResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


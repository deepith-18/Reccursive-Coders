/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignmentResponse } from './AssignmentResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseAssignmentResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: AssignmentResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


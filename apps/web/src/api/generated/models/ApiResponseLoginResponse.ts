/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginResponse } from './LoginResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseLoginResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: LoginResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


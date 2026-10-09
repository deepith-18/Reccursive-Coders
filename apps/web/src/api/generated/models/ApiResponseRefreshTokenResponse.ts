/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefreshTokenResponse } from './RefreshTokenResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseRefreshTokenResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: RefreshTokenResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


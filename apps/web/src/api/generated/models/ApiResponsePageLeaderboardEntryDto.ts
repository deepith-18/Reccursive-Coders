/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageLeaderboardEntryDto } from './PageLeaderboardEntryDto';
/**
 * Standard API response wrapper
 */
export type ApiResponsePageLeaderboardEntryDto = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: PageLeaderboardEntryDto;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


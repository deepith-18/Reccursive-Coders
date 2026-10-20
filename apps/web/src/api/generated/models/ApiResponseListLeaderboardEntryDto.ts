/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardEntryDto } from './LeaderboardEntryDto';
/**
 * Standard API response wrapper
 */
export type ApiResponseListLeaderboardEntryDto = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    /**
     * Payload data
     */
    data?: Array<LeaderboardEntryDto>;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


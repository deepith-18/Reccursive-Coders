/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyHeatmapDto } from './DailyHeatmapDto';
/**
 * Standard API response wrapper
 */
export type ApiResponseListDailyHeatmapDto = {
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
    data?: Array<DailyHeatmapDto>;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


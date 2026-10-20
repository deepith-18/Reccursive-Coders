/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentScoringOverviewDto } from './StudentScoringOverviewDto';
/**
 * Standard API response wrapper
 */
export type ApiResponseStudentScoringOverviewDto = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: StudentScoringOverviewDto;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


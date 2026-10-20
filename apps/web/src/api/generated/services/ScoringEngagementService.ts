/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListDailyHeatmapDto } from '../models/ApiResponseListDailyHeatmapDto';
import type { ApiResponseStudentScoringOverviewDto } from '../models/ApiResponseStudentScoringOverviewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScoringEngagementService {
    /**
     * Get current user's scoring rank, solved count, and streak status
     * @returns ApiResponseStudentScoringOverviewDto OK
     * @throws ApiError
     */
    public static getMyScoringOverview(): CancelablePromise<ApiResponseStudentScoringOverviewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/scoring/overview',
        });
    }
    /**
     * Get candidate student's scoring rank, solved count, and streak status
     * @param studentId
     * @returns ApiResponseStudentScoringOverviewDto OK
     * @throws ApiError
     */
    public static getStudentScoringOverview(
        studentId: string,
    ): CancelablePromise<ApiResponseStudentScoringOverviewDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/scoring/overview/{studentId}',
            path: {
                'studentId': studentId,
            },
        });
    }
    /**
     * Get current user's daily activity heatmap for past N days (defaults to 365 days)
     * @param days
     * @returns ApiResponseListDailyHeatmapDto OK
     * @throws ApiError
     */
    public static getMyHeatmap(
        days: number = 365,
    ): CancelablePromise<ApiResponseListDailyHeatmapDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/scoring/heatmap',
            query: {
                'days': days,
            },
        });
    }
    /**
     * Get candidate student's activity heatmap for past N days (trainers and admins)
     * @param studentId
     * @param days
     * @returns ApiResponseListDailyHeatmapDto OK
     * @throws ApiError
     */
    public static getStudentHeatmap(
        studentId: string,
        days: number = 365,
    ): CancelablePromise<ApiResponseListDailyHeatmapDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/scoring/heatmap/{studentId}',
            path: {
                'studentId': studentId,
            },
            query: {
                'days': days,
            },
        });
    }
}

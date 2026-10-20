/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListLeaderboardEntryDto } from '../models/ApiResponseListLeaderboardEntryDto';
import type { ApiResponsePageLeaderboardEntryDto } from '../models/ApiResponsePageLeaderboardEntryDto';
import type { Pageable } from '../models/Pageable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeaderboardsService {
    /**
     * Get global leaderboard ranked by score, problems solved, and streaks
     * @param pageable
     * @returns ApiResponsePageLeaderboardEntryDto OK
     * @throws ApiError
     */
    public static getGlobalLeaderboard(
        pageable: Pageable,
    ): CancelablePromise<ApiResponsePageLeaderboardEntryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leaderboards/global',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Get cohort batch leaderboard ranked by score, problems solved, and streaks
     * @param batchId
     * @returns ApiResponseListLeaderboardEntryDto OK
     * @throws ApiError
     */
    public static getBatchLeaderboard(
        batchId: string,
    ): CancelablePromise<ApiResponseListLeaderboardEntryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leaderboards/batch/{batchId}',
            path: {
                'batchId': batchId,
            },
        });
    }
}

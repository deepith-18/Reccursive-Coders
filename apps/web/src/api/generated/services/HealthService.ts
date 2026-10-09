/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseHealthResponse } from '../models/ApiResponseHealthResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Get platform health status
     * Checks service uptime and database connectivity
     * @returns ApiResponseHealthResponse OK
     * @throws ApiError
     */
    public static checkHealth(): CancelablePromise<ApiResponseHealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/health',
        });
    }
}

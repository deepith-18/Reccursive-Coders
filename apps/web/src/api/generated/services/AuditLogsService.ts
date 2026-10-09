/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePageAuditLogResponse } from '../models/ApiResponsePageAuditLogResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditLogsService {
    /**
     * Get paginated audit logs (ADMIN only)
     * @param page
     * @param size
     * @returns ApiResponsePageAuditLogResponse OK
     * @throws ApiError
     */
    public static getAuditLogs(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageAuditLogResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audit-logs',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
}

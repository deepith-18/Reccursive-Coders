/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseBulkUploadResult } from '../models/ApiResponseBulkUploadResult';
import type { ApiResponsePageUserResponse } from '../models/ApiResponsePageUserResponse';
import type { ApiResponseUserResponse } from '../models/ApiResponseUserResponse';
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserManagementService {
    /**
     * Search & list users with filtering (ADMIN only)
     * @param role
     * @param status
     * @param search
     * @param page
     * @param size
     * @param sortBy
     * @param direction
     * @returns ApiResponsePageUserResponse OK
     * @throws ApiError
     */
    public static getUsers(
        role?: 'STUDENT' | 'TRAINER' | 'ADMIN',
        status?: 'ACTIVE' | 'PENDING_PASSWORD_CHANGE' | 'INACTIVE',
        search?: string,
        page?: number,
        size: number = 20,
        sortBy: string = 'createdAt',
        direction: string = 'desc',
    ): CancelablePromise<ApiResponsePageUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'role': role,
                'status': status,
                'search': search,
                'page': page,
                'size': size,
                'sortBy': sortBy,
                'direction': direction,
            },
        });
    }
    /**
     * Create a single user (ADMIN only)
     * @param requestBody
     * @returns ApiResponseUserResponse OK
     * @throws ApiError
     */
    public static createUser(
        requestBody: CreateUserRequest,
    ): CancelablePromise<ApiResponseUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Bulk import student accounts via CSV (ADMIN only)
     * @param formData
     * @returns ApiResponseBulkUploadResult OK
     * @throws ApiError
     */
    public static bulkUploadStudents(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ApiResponseBulkUploadResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/bulk-upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Get user details by ID
     * @param id
     * @returns ApiResponseUserResponse OK
     * @throws ApiError
     */
    public static getUserById(
        id: string,
    ): CancelablePromise<ApiResponseUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{id}',
            path: {
                'id': id,
            },
        });
    }
}

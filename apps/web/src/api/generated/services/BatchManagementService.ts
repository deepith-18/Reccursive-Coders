/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseBatchResponse } from '../models/ApiResponseBatchResponse';
import type { ApiResponsePageBatchResponse } from '../models/ApiResponsePageBatchResponse';
import type { ApiResponsePageBatchStudentResponse } from '../models/ApiResponsePageBatchStudentResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { AssignTrainerRequest } from '../models/AssignTrainerRequest';
import type { CreateBatchRequest } from '../models/CreateBatchRequest';
import type { EnrollStudentsRequest } from '../models/EnrollStudentsRequest';
import type { UpdateBatchRequest } from '../models/UpdateBatchRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BatchManagementService {
    /**
     * Get batch overview and metrics by ID
     * @param id
     * @returns ApiResponseBatchResponse OK
     * @throws ApiError
     */
    public static getBatchById(
        id: string,
    ): CancelablePromise<ApiResponseBatchResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batches/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update batch details (ADMIN only)
     * @param id
     * @param requestBody
     * @returns ApiResponseBatchResponse OK
     * @throws ApiError
     */
    public static updateBatch(
        id: string,
        requestBody: UpdateBatchRequest,
    ): CancelablePromise<ApiResponseBatchResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batches/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List batches with status and trainer filters
     * @param status
     * @param trainerId
     * @param search
     * @param page
     * @param size
     * @param sortBy
     * @param direction
     * @returns ApiResponsePageBatchResponse OK
     * @throws ApiError
     */
    public static getBatches(
        status?: 'UPCOMING' | 'ACTIVE' | 'COMPLETED',
        trainerId?: string,
        search?: string,
        page?: number,
        size: number = 15,
        sortBy: string = 'createdAt',
        direction: string = 'desc',
    ): CancelablePromise<ApiResponsePageBatchResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batches',
            query: {
                'status': status,
                'trainerId': trainerId,
                'search': search,
                'page': page,
                'size': size,
                'sortBy': sortBy,
                'direction': direction,
            },
        });
    }
    /**
     * Create a new training batch (ADMIN only)
     * @param requestBody
     * @returns ApiResponseBatchResponse OK
     * @throws ApiError
     */
    public static createBatch(
        requestBody: CreateBatchRequest,
    ): CancelablePromise<ApiResponseBatchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batches',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Assign or reassign trainer to cohort (ADMIN only)
     * @param id
     * @param requestBody
     * @returns ApiResponseBatchResponse OK
     * @throws ApiError
     */
    public static assignTrainer(
        id: string,
        requestBody: AssignTrainerRequest,
    ): CancelablePromise<ApiResponseBatchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batches/{id}/trainer',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get list of enrolled students in batch
     * @param id
     * @param page
     * @param size
     * @returns ApiResponsePageBatchStudentResponse OK
     * @throws ApiError
     */
    public static getEnrolledStudents(
        id: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageBatchStudentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batches/{id}/students',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Enroll students into cohort
     * @param id
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static enrollStudents(
        id: string,
        requestBody: EnrollStudentsRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batches/{id}/students',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get current student's active enrolled batch
     * @returns ApiResponseBatchResponse OK
     * @throws ApiError
     */
    public static getMyActiveBatch(): CancelablePromise<ApiResponseBatchResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batches/my-batch',
        });
    }
    /**
     * Remove student enrollment from cohort
     * @param id
     * @param studentId
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static removeStudent(
        id: string,
        studentId: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batches/{id}/students/{studentId}',
            path: {
                'id': id,
                'studentId': studentId,
            },
        });
    }
}

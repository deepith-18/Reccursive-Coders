/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAssignmentResponse } from '../models/ApiResponseAssignmentResponse';
import type { ApiResponseListAssignmentSummaryResponse } from '../models/ApiResponseListAssignmentSummaryResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateAssignmentRequest } from '../models/CreateAssignmentRequest';
import type { UpdateAssignmentRequest } from '../models/UpdateAssignmentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssignmentManagementService {
    /**
     * Get assignment details with attached questions (Trainer/Admin or enrolled Student)
     * @param id
     * @returns ApiResponseAssignmentResponse OK
     * @throws ApiError
     */
    public static getAssignmentById(
        id: string,
    ): CancelablePromise<ApiResponseAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/assignments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update assignment information and questions (ADMIN or TRAINER)
     * @param id
     * @param requestBody
     * @returns ApiResponseAssignmentResponse OK
     * @throws ApiError
     */
    public static updateAssignment(
        id: string,
        requestBody: UpdateAssignmentRequest,
    ): CancelablePromise<ApiResponseAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/assignments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an assignment (ADMIN or TRAINER)
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteAssignment(
        id: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/assignments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Create an assignment for a cohort batch (ADMIN or TRAINER)
     * @param requestBody
     * @returns ApiResponseAssignmentResponse OK
     * @throws ApiError
     */
    public static createAssignment(
        requestBody: CreateAssignmentRequest,
    ): CancelablePromise<ApiResponseAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/assignments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get assignments for the authenticated student's enrolled cohorts
     * @returns ApiResponseListAssignmentSummaryResponse OK
     * @throws ApiError
     */
    public static getMyAssignments(): CancelablePromise<ApiResponseListAssignmentSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/assignments/my-assignments',
        });
    }
    /**
     * Get all assignments for a batch (Trainer/Admin or enrolled Student)
     * @param batchId
     * @returns ApiResponseListAssignmentSummaryResponse OK
     * @throws ApiError
     */
    public static getAssignmentsByBatch(
        batchId: string,
    ): CancelablePromise<ApiResponseListAssignmentSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/assignments/batch/{batchId}',
            path: {
                'batchId': batchId,
            },
        });
    }
}

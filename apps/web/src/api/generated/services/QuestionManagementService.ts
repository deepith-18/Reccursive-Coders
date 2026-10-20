/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePageQuestionSummaryResponse } from '../models/ApiResponsePageQuestionSummaryResponse';
import type { ApiResponseQuestionResponse } from '../models/ApiResponseQuestionResponse';
import type { ApiResponseTestCaseDto } from '../models/ApiResponseTestCaseDto';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateQuestionRequest } from '../models/CreateQuestionRequest';
import type { CreateTestCaseRequest } from '../models/CreateTestCaseRequest';
import type { UpdateQuestionRequest } from '../models/UpdateQuestionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionManagementService {
    /**
     * Get question by ID (Hidden test cases masked for students)
     * @param id
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static getQuestionById(
        id: string,
    ): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/questions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update question metadata and description (ADMIN or author TRAINER)
     * @param id
     * @param requestBody
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static updateQuestion(
        id: string,
        requestBody: UpdateQuestionRequest,
    ): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/questions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete question (ADMIN or author TRAINER)
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteQuestion(
        id: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/questions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Search and list questions with filters (Authenticated)
     * @param status
     * @param difficulty
     * @param tag
     * @param search
     * @param page
     * @param size
     * @param sort
     * @returns ApiResponsePageQuestionSummaryResponse OK
     * @throws ApiError
     */
    public static listQuestions(
        status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        difficulty?: 'EASY' | 'MEDIUM' | 'HARD',
        tag?: string,
        search?: string,
        page?: number,
        size: number = 15,
        sort: string = 'createdAt,desc',
    ): CancelablePromise<ApiResponsePageQuestionSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/questions',
            query: {
                'status': status,
                'difficulty': difficulty,
                'tag': tag,
                'search': search,
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * Create a new coding question (ADMIN or TRAINER)
     * @param requestBody
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static createQuestion(
        requestBody: CreateQuestionRequest,
    ): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/questions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add a test case to a question (ADMIN or TRAINER)
     * @param id
     * @param requestBody
     * @returns ApiResponseTestCaseDto OK
     * @throws ApiError
     */
    public static addTestCase(
        id: string,
        requestBody: CreateTestCaseRequest,
    ): CancelablePromise<ApiResponseTestCaseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/questions/{id}/test-cases',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get question by slug (Hidden test cases masked for students)
     * @param slug
     * @returns ApiResponseQuestionResponse OK
     * @throws ApiError
     */
    public static getQuestionBySlug(
        slug: string,
    ): CancelablePromise<ApiResponseQuestionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/questions/slug/{slug}',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * Delete a test case from a question (ADMIN or TRAINER)
     * @param id
     * @param testCaseId
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteTestCase(
        id: string,
        testCaseId: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/questions/{id}/test-cases/{testCaseId}',
            path: {
                'id': id,
                'testCaseId': testCaseId,
            },
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListSubmissionSummaryResponse } from '../models/ApiResponseListSubmissionSummaryResponse';
import type { ApiResponsePageSubmissionSummaryResponse } from '../models/ApiResponsePageSubmissionSummaryResponse';
import type { ApiResponseRunCodeResponse } from '../models/ApiResponseRunCodeResponse';
import type { ApiResponseSubmissionDetailResponse } from '../models/ApiResponseSubmissionDetailResponse';
import type { ApiResponseSubmitCodeResponse } from '../models/ApiResponseSubmitCodeResponse';
import type { RunCodeRequest } from '../models/RunCodeRequest';
import type { SubmitCodeRequest } from '../models/SubmitCodeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CodeExecutionSubmissionsService {
    /**
     * Submit code evaluation against full test suite (Computes final verdict & score)
     * @param requestBody
     * @returns ApiResponseSubmitCodeResponse OK
     * @throws ApiError
     */
    public static submitCode(
        requestBody: SubmitCodeRequest,
    ): CancelablePromise<ApiResponseSubmitCodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/submissions/submit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Run code against sample test cases or custom input (Instant feedback without score)
     * @param requestBody
     * @returns ApiResponseRunCodeResponse OK
     * @throws ApiError
     */
    public static runCode(
        requestBody: RunCodeRequest,
    ): CancelablePromise<ApiResponseRunCodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/submissions/run',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get detailed submission report with per-test-case verdicts
     * @param id
     * @returns ApiResponseSubmissionDetailResponse OK
     * @throws ApiError
     */
    public static getSubmissionById(
        id: string,
    ): CancelablePromise<ApiResponseSubmissionDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/submissions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get recent submissions for a specific question
     * @param questionId
     * @returns ApiResponseListSubmissionSummaryResponse OK
     * @throws ApiError
     */
    public static getSubmissionsByQuestion(
        questionId: string,
    ): CancelablePromise<ApiResponseListSubmissionSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/submissions/question/{questionId}',
            path: {
                'questionId': questionId,
            },
        });
    }
    /**
     * Get user's personal submission history (Authenticated)
     * @param questionId
     * @param page
     * @param size
     * @returns ApiResponsePageSubmissionSummaryResponse OK
     * @throws ApiError
     */
    public static getMySubmissions(
        questionId?: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageSubmissionSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/submissions/my-submissions',
            query: {
                'questionId': questionId,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Get submissions for a specific assignment
     * @param assignmentId
     * @returns ApiResponseListSubmissionSummaryResponse OK
     * @throws ApiError
     */
    public static getSubmissionsByAssignment(
        assignmentId: string,
    ): CancelablePromise<ApiResponseListSubmissionSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/submissions/assignment/{assignmentId}',
            path: {
                'assignmentId': assignmentId,
            },
        });
    }
}

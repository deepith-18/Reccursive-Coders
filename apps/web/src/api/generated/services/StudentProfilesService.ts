/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseStudentProfileResponse } from '../models/ApiResponseStudentProfileResponse';
import type { UpdateProfileRequest } from '../models/UpdateProfileRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentProfilesService {
    /**
     * Get current student profile and completion progress
     * @returns ApiResponseStudentProfileResponse OK
     * @throws ApiError
     */
    public static getMyProfile(): CancelablePromise<ApiResponseStudentProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/students/profile',
        });
    }
    /**
     * Update current student academic credentials and skills
     * @param requestBody
     * @returns ApiResponseStudentProfileResponse OK
     * @throws ApiError
     */
    public static updateMyProfile(
        requestBody: UpdateProfileRequest,
    ): CancelablePromise<ApiResponseStudentProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/students/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Download current student resume file
     * @returns binary OK
     * @throws ApiError
     */
    public static getMyResume(): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/students/profile/resume',
        });
    }
    /**
     * Upload student resume document (PDF or DOCX max 5MB)
     * @param formData
     * @returns ApiResponseStudentProfileResponse OK
     * @throws ApiError
     */
    public static uploadResume(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ApiResponseStudentProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/students/profile/resume',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * View candidate student profile (ADMIN or TRAINER)
     * @param studentId
     * @returns ApiResponseStudentProfileResponse OK
     * @throws ApiError
     */
    public static getStudentProfile(
        studentId: string,
    ): CancelablePromise<ApiResponseStudentProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/students/{studentId}/profile',
            path: {
                'studentId': studentId,
            },
        });
    }
}

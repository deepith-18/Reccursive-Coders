/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseLoginResponse } from '../models/ApiResponseLoginResponse';
import type { ApiResponseRefreshTokenResponse } from '../models/ApiResponseRefreshTokenResponse';
import type { ApiResponseUserResponse } from '../models/ApiResponseUserResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Rotate refresh token and issue new access token
     * @param requestBody
     * @returns ApiResponseRefreshTokenResponse OK
     * @throws ApiError
     */
    public static refresh(
        requestBody: RefreshTokenRequest,
    ): CancelablePromise<ApiResponseRefreshTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Revoke active refresh token and logout
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static logout(
        requestBody: RefreshTokenRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Authenticate user and issue JWT credentials
     * @param requestBody
     * @returns ApiResponseLoginResponse OK
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequest,
    ): CancelablePromise<ApiResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Change password (required on first login if forcePasswordChange is true)
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static changePassword(
        requestBody: ChangePasswordRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get currently authenticated user details derived from token
     * @returns ApiResponseUserResponse OK
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<ApiResponseUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me',
        });
    }
}

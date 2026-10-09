/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
/**
 * Authentication successful response
 */
export type LoginResponse = {
    /**
     * JWT Access Token for Bearer authentication
     */
    accessToken?: string;
    /**
     * Refresh token for rotating access tokens
     */
    refreshToken?: string;
    /**
     * Token type
     */
    tokenType?: string;
    /**
     * Access token duration in seconds
     */
    expiresIn?: number;
    user?: UserResponse;
};


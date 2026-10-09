/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Refresh token response with rotated credentials
 */
export type RefreshTokenResponse = {
    /**
     * New JWT Access Token
     */
    accessToken?: string;
    /**
     * Rotated refresh token
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
};


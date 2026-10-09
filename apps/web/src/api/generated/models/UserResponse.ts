/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * User profile response
 */
export type UserResponse = {
    /**
     * Unique user identifier
     */
    id?: string;
    /**
     * User email address
     */
    email?: string;
    /**
     * User's full name
     */
    fullName?: string;
    /**
     * Optional phone number
     */
    phone?: string;
    /**
     * Platform role
     */
    role?: UserResponse.role;
    /**
     * Account status
     */
    status?: UserResponse.status;
    /**
     * Whether the user must change password upon next login
     */
    forcePasswordChange?: boolean;
    /**
     * Account creation timestamp
     */
    createdAt?: string;
};
export namespace UserResponse {
    /**
     * Platform role
     */
    export enum role {
        STUDENT = 'STUDENT',
        TRAINER = 'TRAINER',
        ADMIN = 'ADMIN',
    }
    /**
     * Account status
     */
    export enum status {
        ACTIVE = 'ACTIVE',
        PENDING_PASSWORD_CHANGE = 'PENDING_PASSWORD_CHANGE',
        INACTIVE = 'INACTIVE',
    }
}


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request payload for creating a user
 */
export type CreateUserRequest = {
    /**
     * User email address
     */
    email: string;
    /**
     * User's full name
     */
    fullName: string;
    /**
     * Phone number
     */
    phone?: string;
    /**
     * Role to assign
     */
    role: CreateUserRequest.role;
    /**
     * Optional initial password. Defaults to Welcome@2026! if omitted
     */
    temporaryPassword?: string;
};
export namespace CreateUserRequest {
    /**
     * Role to assign
     */
    export enum role {
        STUDENT = 'STUDENT',
        TRAINER = 'TRAINER',
        ADMIN = 'ADMIN',
    }
}


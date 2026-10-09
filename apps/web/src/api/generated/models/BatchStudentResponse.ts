/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentProfileResponse } from './StudentProfileResponse';
import type { UserResponse } from './UserResponse';
/**
 * Enrolled student detail in a cohort
 */
export type BatchStudentResponse = {
    /**
     * Enrollment ID
     */
    id?: string;
    student?: UserResponse;
    profile?: StudentProfileResponse;
    /**
     * Enrollment timestamp
     */
    enrolledAt?: string;
};


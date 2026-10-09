/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
/**
 * Bulk user upload summary result
 */
export type BulkUploadResult = {
    /**
     * Total records processed
     */
    totalProcessed?: number;
    /**
     * Successfully imported accounts count
     */
    totalSuccess?: number;
    /**
     * Failed accounts count
     */
    totalFailed?: number;
    /**
     * List of row failure details
     */
    errors?: Array<string>;
    /**
     * List of created user profiles
     */
    createdUsers?: Array<UserResponse>;
};


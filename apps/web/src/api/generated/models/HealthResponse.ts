/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * System health check response
 */
export type HealthResponse = {
    /**
     * Overall health status
     */
    status?: string;
    /**
     * Application name
     */
    service?: string;
    /**
     * Current server timestamp
     */
    timestamp?: string;
    /**
     * Active environment profile
     */
    activeProfile?: string;
    /**
     * Subsystem health statuses
     */
    details?: Record<string, Record<string, any>>;
};


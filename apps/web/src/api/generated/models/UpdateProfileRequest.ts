/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request payload to update student academic and profile credentials
 */
export type UpdateProfileRequest = {
    /**
     * Degree
     */
    degree?: string;
    /**
     * Academic branch
     */
    branch?: string;
    /**
     * College or university
     */
    college?: string;
    /**
     * Graduation Year
     */
    graduationYear?: number;
    /**
     * CGPA out of 10
     */
    cgpa?: number;
    /**
     * Technical skills array
     */
    skills?: Array<string>;
    /**
     * GitHub URL
     */
    githubUrl?: string;
    /**
     * LinkedIn URL
     */
    linkedinUrl?: string;
    /**
     * Portfolio / Personal site
     */
    portfolioUrl?: string;
};


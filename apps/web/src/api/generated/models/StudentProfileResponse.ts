/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Student academic and placement profile response
 */
export type StudentProfileResponse = {
    /**
     * Profile ID
     */
    id?: string;
    /**
     * User ID
     */
    userId?: string;
    /**
     * Degree
     */
    degree?: string;
    /**
     * Academic branch
     */
    branch?: string;
    /**
     * College name
     */
    college?: string;
    /**
     * Graduation Year
     */
    graduationYear?: number;
    /**
     * Cumulative GPA
     */
    cgpa?: number;
    /**
     * List of technical skills
     */
    skills?: Array<string>;
    /**
     * GitHub profile link
     */
    githubUrl?: string;
    /**
     * LinkedIn profile link
     */
    linkedinUrl?: string;
    /**
     * Portfolio / personal website
     */
    portfolioUrl?: string;
    /**
     * Uploaded resume file name
     */
    resumeFileName?: string;
    /**
     * Indicates if a resume document is on file
     */
    hasResume?: boolean;
    /**
     * Calculated profile completion score (0-100)
     */
    completionPercentage?: number;
    /**
     * Last profile update timestamp
     */
    updatedAt?: string;
};


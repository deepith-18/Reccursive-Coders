/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionResponse } from './QuestionResponse';
/**
 * Standard API response wrapper
 */
export type ApiResponseQuestionResponse = {
    /**
     * Success indicator
     */
    success?: boolean;
    /**
     * Response message
     */
    message?: string;
    data?: QuestionResponse;
    /**
     * Response timestamp
     */
    timestamp?: string;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchStudentResponse } from './BatchStudentResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
/**
 * Payload data
 */
export type PageBatchStudentResponse = {
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<BatchStudentResponse>;
    number?: number;
    sort?: Array<SortObject>;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    pageable?: PageableObject;
    empty?: boolean;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
import type { SubmissionSummaryResponse } from './SubmissionSummaryResponse';
/**
 * Payload data
 */
export type PageSubmissionSummaryResponse = {
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<SubmissionSummaryResponse>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
};


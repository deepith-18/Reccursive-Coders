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
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<SubmissionSummaryResponse>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    numberOfElements?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
};


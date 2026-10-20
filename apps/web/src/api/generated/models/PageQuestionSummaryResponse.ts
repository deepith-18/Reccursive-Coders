/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { QuestionSummaryResponse } from './QuestionSummaryResponse';
import type { SortObject } from './SortObject';
/**
 * Payload data
 */
export type PageQuestionSummaryResponse = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<QuestionSummaryResponse>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    numberOfElements?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
};


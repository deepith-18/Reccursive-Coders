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
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<QuestionSummaryResponse>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
};


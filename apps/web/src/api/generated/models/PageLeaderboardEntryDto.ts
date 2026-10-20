/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardEntryDto } from './LeaderboardEntryDto';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
/**
 * Payload data
 */
export type PageLeaderboardEntryDto = {
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<LeaderboardEntryDto>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
};


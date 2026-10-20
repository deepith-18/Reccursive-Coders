/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
import type { UserResponse } from './UserResponse';
/**
 * Payload data
 */
export type PageUserResponse = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<UserResponse>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    numberOfElements?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
};


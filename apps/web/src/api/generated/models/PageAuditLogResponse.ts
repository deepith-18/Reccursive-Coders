/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuditLogResponse } from './AuditLogResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
/**
 * Payload data
 */
export type PageAuditLogResponse = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<AuditLogResponse>;
    number?: number;
    sort?: Array<SortObject>;
    pageable?: PageableObject;
    numberOfElements?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
};


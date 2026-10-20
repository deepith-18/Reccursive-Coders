/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SubmitCodeRequest = {
    questionId: string;
    assignmentId?: string;
    sourceCode: string;
    language: SubmitCodeRequest.language;
};
export namespace SubmitCodeRequest {
    export enum language {
        PYTHON = 'PYTHON',
        JAVA = 'JAVA',
        CPP = 'CPP',
    }
}


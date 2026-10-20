/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RunCodeRequest = {
    questionId: string;
    sourceCode: string;
    language: RunCodeRequest.language;
    customInput?: string;
};
export namespace RunCodeRequest {
    export enum language {
        PYTHON = 'PYTHON',
        JAVA = 'JAVA',
        CPP = 'CPP',
    }
}


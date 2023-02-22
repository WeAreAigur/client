/**
 * Fetch HTTP Response Error
 */
export declare class HTTPResponseError extends Error {
    readonly status: number;
    readonly statusText: string;
    readonly body: any | undefined;
    constructor(status: number, statusText: string, body: any | undefined);
    /**
     * Get Error Info as JSON
     */
    toJSON(): {
        status: number;
        statusText: string;
        message: any;
        body: any;
    };
}

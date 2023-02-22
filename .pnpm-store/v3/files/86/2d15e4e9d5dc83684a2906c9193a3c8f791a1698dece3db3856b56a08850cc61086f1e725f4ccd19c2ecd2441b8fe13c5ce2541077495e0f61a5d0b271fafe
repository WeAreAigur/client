import { Fetch, FunctionsResponse, FunctionInvokeOptions } from './types';
export declare class FunctionsClient {
    protected url: string;
    protected headers: Record<string, string>;
    protected fetch: Fetch;
    constructor(url: string, { headers, customFetch, }?: {
        headers?: Record<string, string>;
        customFetch?: Fetch;
    });
    /**
     * Updates the authorization header
     * @param token - the new jwt token sent in the authorisation header
     */
    setAuth(token: string): void;
    /**
     * Invokes a function
     * @param functionName - the name of the function to invoke
     */
    invoke<T = any>(functionName: string, invokeOptions?: FunctionInvokeOptions): Promise<FunctionsResponse<T>>;
}
//# sourceMappingURL=FunctionsClient.d.ts.map
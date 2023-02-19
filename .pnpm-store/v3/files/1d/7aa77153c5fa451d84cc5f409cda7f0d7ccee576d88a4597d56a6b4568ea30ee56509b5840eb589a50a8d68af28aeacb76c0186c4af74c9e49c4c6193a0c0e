import { PublishOptions } from '../types';
import { InsightOptions } from '../types/insight';
/**
 * LogSnag Client
 */
export default class LogSnag {
    private readonly token;
    private readonly project;
    /**
     * Construct a new LogSnag instance
     * @param token LogSnag API token
     * @param project LogSnag project name
     * for more information, see: docs.logsnag.com
     */
    constructor({ token, project }: {
        token: string;
        project: string;
    });
    /**
     * Get project name
     * @returns project name
     */
    getProject(): string;
    /**
     * Creates authorization header
     * @returns Authorization header value
     */
    private createAuthorizationHeader;
    /**
     * Publish a new event to LogSnag
     * @param options
     * @returns true when successfully published
     */
    publish(options: PublishOptions): Promise<boolean>;
    /**
     * Publish a new insight to LogSnag
     * @param options
     * @returns true when successfully published
     */
    insight(options: InsightOptions): Promise<boolean>;
}

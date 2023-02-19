"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPResponseError = void 0;
/**
 * Fetch HTTP Response Error
 */
class HTTPResponseError extends Error {
    constructor(status, statusText, body) {
        super(`HTTP Error Response: ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.body = body;
    }
    /**
     * Get Error Info as JSON
     */
    toJSON() {
        return {
            status: this.status,
            statusText: this.statusText,
            message: this.body && this.body.message ? this.body.message : undefined,
            body: this.body
        };
    }
}
exports.HTTPResponseError = HTTPResponseError;
//# sourceMappingURL=error.js.map
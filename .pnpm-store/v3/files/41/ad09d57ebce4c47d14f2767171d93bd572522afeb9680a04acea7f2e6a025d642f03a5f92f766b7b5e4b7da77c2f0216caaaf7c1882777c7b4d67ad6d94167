"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const error_1 = require("./error");
/**
 * LogSnag Client
 */
class LogSnag {
    /**
     * Construct a new LogSnag instance
     * @param token LogSnag API token
     * @param project LogSnag project name
     * for more information, see: docs.logsnag.com
     */
    constructor({ token, project }) {
        this.token = token;
        this.project = project;
    }
    /**
     * Get project name
     * @returns project name
     */
    getProject() {
        return this.project;
    }
    /**
     * Creates authorization header
     * @returns Authorization header value
     */
    createAuthorizationHeader() {
        return `Bearer ${this.token}`;
    }
    /**
     * Publish a new event to LogSnag
     * @param options
     * @returns true when successfully published
     */
    publish(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: this.createAuthorizationHeader()
            };
            const method = 'POST';
            const body = JSON.stringify(Object.assign(Object.assign({}, options), { project: this.getProject() }));
            const response = yield fetch(constants_1.ENDPOINTS.LOG, { method, body, headers });
            if (!response.ok) {
                throw new error_1.HTTPResponseError(response.status, response.statusText, yield response.json());
            }
            return true;
        });
    }
    /**
     * Publish a new insight to LogSnag
     * @param options
     * @returns true when successfully published
     */
    insight(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: this.createAuthorizationHeader()
            };
            const method = 'POST';
            const body = JSON.stringify(Object.assign(Object.assign({}, options), { project: this.getProject() }));
            const response = yield fetch(constants_1.ENDPOINTS.INSIGHT, { method, body, headers });
            if (!response.ok) {
                throw new error_1.HTTPResponseError(response.status, response.statusText, yield response.json());
            }
            return true;
        });
    }
}
exports.default = LogSnag;
//# sourceMappingURL=logsnag.js.map
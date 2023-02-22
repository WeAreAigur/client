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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./lib/fetch");
const helpers_1 = require("./lib/helpers");
const errors_1 = require("./lib/errors");
class GoTrueAdminApi {
    constructor({ url = '', headers = {}, fetch, }) {
        this.url = url;
        this.headers = headers;
        this.fetch = (0, helpers_1.resolveFetch)(fetch);
        this.mfa = {
            listFactors: this._listFactors.bind(this),
            deleteFactor: this._deleteFactor.bind(this),
        };
    }
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     */
    signOut(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, fetch_1._request)(this.fetch, 'POST', `${this.url}/logout`, {
                    headers: this.headers,
                    jwt,
                    noResolveJson: true,
                });
                return { data: null, error: null };
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param options.redirectTo A URL or mobile deeplink to send the user to after they are confirmed.
     * @param options.data Optional user metadata
     */
    inviteUserByEmail(email, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, fetch_1._request)(this.fetch, 'POST', `${this.url}/invite`, {
                    body: { email, data: options.data },
                    headers: this.headers,
                    redirectTo: options.redirectTo,
                    xform: fetch_1._userResponse,
                });
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: { user: null }, error };
                }
                throw error;
            }
        });
    }
    /**
     * Generates email links and OTPs to be sent via a custom email provider.
     * @param email The user's email.
     * @param options.password User password. For signup only.
     * @param options.data Optional user metadata. For signup only.
     * @param options.redirectTo The redirect url which should be appended to the generated link
     */
    generateLink(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { options } = params, rest = __rest(params, ["options"]);
                const body = Object.assign(Object.assign({}, rest), options);
                if ('newEmail' in rest) {
                    // replace newEmail with new_email in request body
                    body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
                    delete body['newEmail'];
                }
                return yield (0, fetch_1._request)(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
                    body: body,
                    headers: this.headers,
                    xform: fetch_1._generateLinkResponse,
                    redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo,
                });
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return {
                        data: {
                            properties: null,
                            user: null,
                        },
                        error,
                    };
                }
                throw error;
            }
        });
    }
    // User Admin API
    /**
     * Creates a new user.
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    createUser(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, fetch_1._request)(this.fetch, 'POST', `${this.url}/admin/users`, {
                    body: attributes,
                    headers: this.headers,
                    xform: fetch_1._userResponse,
                });
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: { user: null }, error };
                }
                throw error;
            }
        });
    }
    /**
     * Get a list of users.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
     */
    listUsers(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pagination = { nextPage: null, lastPage: 0, total: 0 };
                const response = yield (0, fetch_1._request)(this.fetch, 'GET', `${this.url}/admin/users`, {
                    headers: this.headers,
                    noResolveJson: true,
                    query: {
                        page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                        per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '',
                    },
                    xform: fetch_1._noResolveJsonResponse,
                });
                if (response.error)
                    throw response.error;
                const users = yield response.json();
                const total = (_e = response.headers.get('x-total-count')) !== null && _e !== void 0 ? _e : 0;
                const links = (_g = (_f = response.headers.get('link')) === null || _f === void 0 ? void 0 : _f.split(',')) !== null && _g !== void 0 ? _g : [];
                if (links.length > 0) {
                    links.forEach((link) => {
                        const page = parseInt(link.split(';')[0].split('=')[1].substring(0, 1));
                        const rel = JSON.parse(link.split(';')[1].split('=')[1]);
                        pagination[`${rel}Page`] = page;
                    });
                    pagination.total = parseInt(total);
                }
                return { data: Object.assign(Object.assign({}, users), pagination), error: null };
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: { users: [] }, error };
                }
                throw error;
            }
        });
    }
    /**
     * Get user by id.
     *
     * @param uid The user's unique identifier
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    getUserById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, fetch_1._request)(this.fetch, 'GET', `${this.url}/admin/users/${uid}`, {
                    headers: this.headers,
                    xform: fetch_1._userResponse,
                });
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: { user: null }, error };
                }
                throw error;
            }
        });
    }
    /**
     * Updates the user data.
     *
     * @param attributes The data you want to update.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    updateUserById(uid, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, fetch_1._request)(this.fetch, 'PUT', `${this.url}/admin/users/${uid}`, {
                    body: attributes,
                    headers: this.headers,
                    xform: fetch_1._userResponse,
                });
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: { user: null }, error };
                }
                throw error;
            }
        });
    }
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * @param id The user id you want to remove.
     * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema.
     * Defaults to false for backward compatibility.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    deleteUser(id, shouldSoftDelete = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, fetch_1._request)(this.fetch, 'DELETE', `${this.url}/admin/users/${id}`, {
                    headers: this.headers,
                    body: {
                        should_soft_delete: shouldSoftDelete,
                    },
                    xform: fetch_1._userResponse,
                });
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: { user: null }, error };
                }
                throw error;
            }
        });
    }
    _listFactors(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield (0, fetch_1._request)(this.fetch, 'GET', `${this.url}/admin/users/${params.userId}/factors`, {
                    headers: this.headers,
                    xform: (factors) => {
                        return { data: { factors }, error: null };
                    },
                });
                return { data, error };
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
    _deleteFactor(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, fetch_1._request)(this.fetch, 'DELETE', `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
                    headers: this.headers,
                });
                return { data, error: null };
            }
            catch (error) {
                if ((0, errors_1.isAuthError)(error)) {
                    return { data: null, error };
                }
                throw error;
            }
        });
    }
}
exports.default = GoTrueAdminApi;
//# sourceMappingURL=GoTrueAdminApi.js.map
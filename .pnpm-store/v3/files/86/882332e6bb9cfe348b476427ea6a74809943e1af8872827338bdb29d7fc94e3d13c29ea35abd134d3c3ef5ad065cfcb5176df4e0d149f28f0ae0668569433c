import GoTrueAdminApi from './GoTrueAdminApi';
import { AuthError } from './lib/errors';
import { Fetch } from './lib/fetch';
import { Deferred } from './lib/helpers';
import type { AuthChangeEvent, AuthResponse, CallRefreshTokenResult, GoTrueClientOptions, InitializeResult, OAuthResponse, SSOResponse, Session, SignInWithOAuthCredentials, SignInWithPasswordCredentials, SignInWithPasswordlessCredentials, SignInWithSSO, SignUpWithPasswordCredentials, Subscription, SupportedStorage, UserAttributes, UserResponse, VerifyOtpParams, GoTrueMFAApi } from './lib/types';
export default class GoTrueClient {
    /**
     * Namespace for the GoTrue admin methods.
     * These methods should only be used in a trusted server-side environment.
     */
    admin: GoTrueAdminApi;
    /**
     * Namespace for the MFA methods.
     */
    mfa: GoTrueMFAApi;
    /**
     * The storage key used to identify the values saved in localStorage
     */
    protected storageKey: string;
    /**
     * The session object for the currently logged in user. If null, it means there isn't a logged-in user.
     * Only used if persistSession is false.
     */
    protected inMemorySession: Session | null;
    protected autoRefreshToken: boolean;
    protected persistSession: boolean;
    protected storage: SupportedStorage;
    protected stateChangeEmitters: Map<string, Subscription>;
    protected autoRefreshTicker: ReturnType<typeof setInterval> | null;
    protected visibilityChangedCallback: (() => Promise<any>) | null;
    protected refreshingDeferred: Deferred<CallRefreshTokenResult> | null;
    /**
     * Keeps track of the async client initialization.
     * When null or not yet resolved the auth state is `unknown`
     * Once resolved the the auth state is known and it's save to call any further client methods.
     * Keep extra care to never reject or throw uncaught errors
     */
    protected initializePromise: Promise<InitializeResult> | null;
    protected detectSessionInUrl: boolean;
    protected url: string;
    protected headers: {
        [key: string]: string;
    };
    protected fetch: Fetch;
    /**
     * Used to broadcast state change events to other tabs listening.
     */
    protected broadcastChannel: BroadcastChannel | null;
    /**
     * Create a new client for use in the browser.
     */
    constructor(options: GoTrueClientOptions);
    /**
     * Initializes the client session either from the url or from storage.
     * This method is automatically called when instantiating the client, but should also be called
     * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
     */
    initialize(): Promise<InitializeResult>;
    /**
     * IMPORTANT:
     * 1. Never throw in this method, as it is called from the constructor
     * 2. Never return a session from this method as it would be cached over
     *    the whole lifetime of the client
     */
    private _initialize;
    /**
     * Creates a new user.
     *
     * Be aware that if a user account exists in the system you may get back an
     * error message that attempts to hide this information from the user.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    signUp(credentials: SignUpWithPasswordCredentials): Promise<AuthResponse>;
    /**
     * Log in an existing user with an email and password or phone and password.
     *
     * Be aware that you may get back an error message that will not distingish
     * between the cases where the account does not exist or that the
     * email/phone and password combination is wrong or that the account can only
     * be accessed via social login.
     */
    signInWithPassword(credentials: SignInWithPasswordCredentials): Promise<AuthResponse>;
    /**
     * Log in an existing user via a third-party provider.
     */
    signInWithOAuth(credentials: SignInWithOAuthCredentials): Promise<OAuthResponse>;
    /**
     * Log in a user using magiclink or a one-time password (OTP).
     *
     * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
     * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
     * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
     *
     * Be aware that you may get back an error message that will not distinguish
     * between the cases where the account does not exist or, that the account
     * can only be accessed via social login.
     */
    signInWithOtp(credentials: SignInWithPasswordlessCredentials): Promise<AuthResponse>;
    /**
     * Log in a user given a User supplied OTP received via mobile.
     */
    verifyOtp(params: VerifyOtpParams): Promise<AuthResponse>;
    /**
     * Attempts a single-sign on using an enterprise Identity Provider. A
     * successful SSO attempt will redirect the current page to the identity
     * provider authorization page. The redirect URL is implementation and SSO
     * protocol specific.
     *
     * You can use it by providing a SSO domain. Typically you can extract this
     * domain by asking users for their email address. If this domain is
     * registered on the Auth instance the redirect will use that organization's
     * currently active SSO Identity Provider for the login.
     *
     * If you have built an organization-specific login page, you can use the
     * organization's SSO Identity Provider UUID directly instead.
     *
     * This API is experimental and availability is conditional on correct
     * settings on the Auth service.
     *
     * @experimental
     */
    signInWithSSO(params: SignInWithSSO): Promise<SSOResponse>;
    /**
     * Returns the session, refreshing it if necessary.
     * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
     */
    getSession(): Promise<{
        data: {
            session: Session;
        };
        error: null;
    } | {
        data: {
            session: null;
        };
        error: AuthError;
    } | {
        data: {
            session: null;
        };
        error: null;
    }>;
    /**
     * Gets the current user details if there is an existing session.
     * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
     */
    getUser(jwt?: string): Promise<UserResponse>;
    /**
     * Updates user data, if there is a logged in user.
     */
    updateUser(attributes: UserAttributes): Promise<UserResponse>;
    /**
     * Decodes a JWT (without performing any validation).
     */
    private _decodeJWT;
    /**
     * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
     * If the refresh token or access token in the current session is invalid, an error will be thrown.
     * @param currentSession The current session that minimally contains an access token and refresh token.
     */
    setSession(currentSession: {
        access_token: string;
        refresh_token: string;
    }): Promise<AuthResponse>;
    /**
     * Returns a new session, regardless of expiry status.
     * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
     * If the current session's refresh token is invalid, an error will be thrown.
     * @param currentSession The current session. If passed in, it must contain a refresh token.
     */
    refreshSession(currentSession?: {
        refresh_token: string;
    }): Promise<AuthResponse>;
    /**
     * Gets the session data from a URL string
     */
    private _getSessionFromUrl;
    /**
     * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
     */
    private _isImplicitGrantFlow;
    /**
     * Inside a browser context, `signOut()` will remove the logged in user from the browser session
     * and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
     *
     * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
     * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
     */
    signOut(): Promise<{
        error: AuthError | null;
    }>;
    /**
     * Receive a notification every time an auth event happens.
     * @param callback A callback function to be invoked when an auth event happens.
     */
    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): {
        data: {
            subscription: Subscription;
        };
    };
    /**
     * Sends a password reset request to an email address.
     * @param email The email address of the user.
     * @param options.redirectTo The URL to send the user to after they click the password reset link.
     * @param options.captchaToken Verification token received when the user completes the captcha on the site.
     */
    resetPasswordForEmail(email: string, options?: {
        redirectTo?: string;
        captchaToken?: string;
    }): Promise<{
        data: {};
        error: null;
    } | {
        data: null;
        error: AuthError;
    }>;
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    private _refreshAccessToken;
    private _isValidSession;
    private _handleProviderSignIn;
    /**
     * Recovers the session from LocalStorage and refreshes
     * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
     */
    private _recoverAndRefresh;
    private _callRefreshToken;
    private _notifyAllSubscribers;
    /**
     * set currentSession and currentUser
     * process to _startAutoRefreshToken if possible
     */
    private _saveSession;
    private _persistSession;
    private _removeSession;
    /**
     * Removes any registered visibilitychange callback.
     *
     * {@see #startAutoRefresh}
     * {@see #stopAutoRefresh}
     */
    private _removeVisibilityChangedCallback;
    /**
     * This is the private implementation of {@link #startAutoRefresh}. Use this
     * within the library.
     */
    private _startAutoRefresh;
    /**
     * This is the private implementation of {@link #stopAutoRefresh}. Use this
     * within the library.
     */
    private _stopAutoRefresh;
    /**
     * Starts an auto-refresh process in the background. The session is checked
     * every few seconds. Close to the time of expiration a process is started to
     * refresh the session. If refreshing fails it will be retried for as long as
     * necessary.
     *
     * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
     * to call this function, it will be called for you.
     *
     * On browsers the refresh process works only when the tab/window is in the
     * foreground to conserve resources as well as prevent race conditions and
     * flooding auth with requests. If you call this method any managed
     * visibility change callback will be removed and you must manage visibility
     * changes on your own.
     *
     * On non-browser platforms the refresh process works *continuously* in the
     * background, which may not be desireable. You should hook into your
     * platform's foreground indication mechanism and call these methods
     * appropriately to conserve resources.
     *
     * {@see #stopAutoRefresh}
     */
    startAutoRefresh(): Promise<void>;
    /**
     * Stops an active auto refresh process running in the background (if any).
     *
     * If you call this method any managed visibility change callback will be
     * removed and you must manage visibility changes on your own.
     *
     * See {@link #startAutoRefresh} for more details.
     */
    stopAutoRefresh(): Promise<void>;
    /**
     * Runs the auto refresh token tick.
     */
    private _autoRefreshTokenTick;
    /**
     * Registers callbacks on the browser / platform, which in-turn run
     * algorithms when the browser window/tab are in foreground. On non-browser
     * platforms it assumes always foreground.
     */
    private _handleVisibilityChange;
    /**
     * Callback registered with `window.addEventListener('visibilitychange')`.
     */
    private _onVisibilityChanged;
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param options.scopes A space-separated list of scopes granted to the OAuth application.
     * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
     */
    private _getUrlForProvider;
    private _unenroll;
    /**
     * {@see GoTrueMFAApi#enroll}
     */
    private _enroll;
    /**
     * {@see GoTrueMFAApi#verify}
     */
    private _verify;
    /**
     * {@see GoTrueMFAApi#challenge}
     */
    private _challenge;
    /**
     * {@see GoTrueMFAApi#challengeAndVerify}
     */
    private _challengeAndVerify;
    /**
     * {@see GoTrueMFAApi#listFactors}
     */
    private _listFactors;
    /**
     * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
     */
    private _getAuthenticatorAssuranceLevel;
}
//# sourceMappingURL=GoTrueClient.d.ts.map
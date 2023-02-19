import { CONNECTION_STATE } from './lib/constants';
import Timer from './lib/timer';
import Serializer from './lib/serializer';
import RealtimeChannel, { RealtimeChannelOptions } from './RealtimeChannel';
export declare type RealtimeClientOptions = {
    transport?: WebSocket;
    timeout?: number;
    heartbeatIntervalMs?: number;
    logger?: Function;
    encode?: Function;
    decode?: Function;
    reconnectAfterMs?: Function;
    headers?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: any;
    };
};
export declare type RealtimeMessage = {
    topic: string;
    event: string;
    payload: any;
    ref: string;
    join_ref?: string;
};
export declare type RealtimeRemoveChannelResponse = 'ok' | 'timed out' | 'error';
export default class RealtimeClient {
    accessToken: string | null;
    channels: RealtimeChannel[];
    endPoint: string;
    headers?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: string;
    };
    timeout: number;
    transport: any;
    heartbeatIntervalMs: number;
    heartbeatTimer: ReturnType<typeof setInterval> | undefined;
    pendingHeartbeatRef: string | null;
    ref: number;
    reconnectTimer: Timer;
    logger: Function;
    encode: Function;
    decode: Function;
    reconnectAfterMs: Function;
    conn: WebSocket | null;
    sendBuffer: Function[];
    serializer: Serializer;
    stateChangeCallbacks: {
        open: Function[];
        close: Function[];
        error: Function[];
        message: Function[];
    };
    eventsPerSecondLimitMs: number;
    inThrottle: boolean;
    /**
     * Initializes the Socket.
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket.
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers The optional headers to pass when connecting.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     */
    constructor(endPoint: string, options?: RealtimeClientOptions);
    /**
     * Connects the socket, unless already connected.
     */
    connect(): void;
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     */
    disconnect(code?: number, reason?: string): void;
    /**
     * Returns all created channels
     */
    getChannels(): RealtimeChannel[];
    /**
     * Unsubscribes and removes a single channel
     * @param channel A RealtimeChannel instance
     */
    removeChannel(channel: RealtimeChannel): Promise<RealtimeRemoveChannelResponse>;
    /**
     * Unsubscribes and removes all channels
     */
    removeAllChannels(): Promise<RealtimeRemoveChannelResponse[]>;
    /**
     * Logs the message.
     *
     * For customized logging, `this.logger` can be overridden.
     */
    log(kind: string, msg: string, data?: any): void;
    /**
     * Returns the current state of the socket.
     */
    connectionState(): CONNECTION_STATE;
    /**
     * Returns `true` is the connection is open.
     */
    isConnected(): boolean;
    channel(topic: string, params?: RealtimeChannelOptions): RealtimeChannel;
    /**
     * Push out a message if the socket is connected.
     *
     * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
     */
    push(data: RealtimeMessage): 'rate limited' | void;
    /**
     * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
     *
     * @param token A JWT string.
     */
    setAuth(token: string | null): void;
}
//# sourceMappingURL=RealtimeClient.d.ts.map
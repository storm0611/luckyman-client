import WebSocket from 'ws';
declare enum SnipeEvent {
    addToken = "addToken",
    tokenAddress = "tokenAddress",
    routerAddress = "routerAddress",
    liquidity = "liquidity",
    buyTax = "buyTax",
    simulateSubscribe = "simulateSubscribe",
    tokenInfo = "tokenInfo",
    unsubscribe = "unsubscribe",
    pairInfo = "pairInfo"
}
declare class LuckyManClient {
    ws: WebSocket;
    eventHandlers: Map<SnipeEvent, Function>;
    errorHandlers: Map<SnipeEvent, Function>;
    private httpURL;
    private wsURL;
    readyState: 0 | 1 | 2 | 3;
    /** The connection is not yet open. */
    static readonly CONNECTING: 0;
    /** The connection is open and ready to communicate. */
    static readonly OPEN: 1;
    /** The connection is in the process of closing. */
    static readonly CLOSING: 2;
    /** The connection is closed. */
    static readonly CLOSED: 3;
    onError: ((event: WebSocket.ErrorEvent) => void) | null;
    onConnect: ((event: WebSocket.Event) => void) | null;
    onClose: ((event: WebSocket.CloseEvent) => void) | null;
    constructor(httpURL: string | URL, wsURL: string | URL, onError?: ((event: WebSocket.ErrorEvent) => void) | null, onConnect?: ((event: WebSocket.Event) => void) | null, onClose?: ((event: WebSocket.CloseEvent) => void) | null);
    private initializeWebSocket;
    addTokens: (tokens: string[]) => Promise<{
        status: string;
        code: number;
    } | {
        error: string;
        code: number;
    }>;
    removeTokens: (tokens: string[]) => Promise<{
        status: string;
        code: number;
    } | {
        error: string;
        code: number;
    }>;
    fetchAllTokens: () => Promise<{
        status: string;
        code: number;
        data: any[];
    } | {
        error: string;
        code: number;
    }>;
    fetchTokensWithInfo: (tokens: string[]) => Promise<{
        status: string;
        code: number;
        data: any[];
    } | {
        error: string;
        code: number;
    }>;
    simulateTokens: (tokens: string[]) => Promise<{
        status: string;
        code: number;
        data: any[];
    } | {
        error: string;
        code: number;
    }>;
    fetchPairsWithInfo: (pairs: string[]) => Promise<{
        status: string;
        code: number;
        data: any[];
    } | {
        error: string;
        code: number;
    }>;
    fetchPairsWithInfoByTokens: (tokenPairs: {
        token0: string;
        token1: string;
    }[]) => Promise<{
        status: string;
        code: number;
        data: any[];
    } | {
        error: string;
        code: number;
    }>;
    listenToToken: (callback: (data: any) => void, onError?: (event: ErrorEvent) => void) => Promise<void>;
    unsubscribe: (event: SnipeEvent) => Promise<void>;
    /**
     * on
     */
    on(event: SnipeEvent, callback: Function, params?: any): Promise<void>;
}
export { LuckyManClient, SnipeEvent };
//# sourceMappingURL=index.d.ts.map
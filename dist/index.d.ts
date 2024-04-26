import WebSocket from 'ws';
export declare enum SnipeEvent {
    addToken = "addToken",
    tokenAddress = "tokenAddress",
    routerAddress = "routerAddress",
    liquidity = "liquidity",
    buyTax = "buyTax"
}
export declare class LuckyManClient {
    ws: WebSocket;
    eventHandlers: Map<SnipeEvent, Function>;
    private url;
    readyState: 0 | 1 | 2 | 3;
    /** The connection is not yet open. */
    static readonly CONNECTING: 0;
    /** The connection is open and ready to communicate. */
    static readonly OPEN: 1;
    /** The connection is in the process of closing. */
    static readonly CLOSING: 2;
    /** The connection is closed. */
    static readonly CLOSED: 3;
    constructor(url: string | URL);
    private initializeWebSocket;
    /**
     * on
     */
    on(event: SnipeEvent, callback: Function, params?: any): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map
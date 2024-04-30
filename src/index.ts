import WebSocket, { CLOSED, CLOSING, CONNECTING, OPEN } from 'ws';

enum SnipeEvent {
    addToken = "addToken",
    tokenAddress = "tokenAddress",
    routerAddress = "routerAddress",
    liquidity = "liquidity",
    buyTax = "buyTax",
    simulateSubscribe = "simulateSubscribe",
    tokenInfo = "tokenInfo",
    unsubscribe = "unsubscribe",
    pairInfo = "pairInfo",
}

class LuckyManClient {
    //@ts-ignore
    public ws: WebSocket;
    public eventHandlers;
    public errorHandlers;
    private httpURL: string | URL;
    private wsURL: string | URL;
    public readyState: 0 | 1 | 2 | 3; // Connecting: 0, Open: 1, 2: Closing, 3: Closed

    /** The connection is not yet open. */
    static readonly CONNECTING: 0;
    /** The connection is open and ready to communicate. */
    static readonly OPEN: 1;
    /** The connection is in the process of closing. */
    static readonly CLOSING: 2;
    /** The connection is closed. */
    static readonly CLOSED: 3;

    // Callback Methods
    onError: ((event: WebSocket.ErrorEvent) => void) | null;
    onConnect: ((event: WebSocket.Event) => void) | null;
    onClose: ((event: WebSocket.CloseEvent) => void) | null;

    constructor(httpURL: string | URL, wsURL: string | URL, onError: ((event: WebSocket.ErrorEvent) => void) | null = null, onConnect: ((event: WebSocket.Event) => void) | null = null, onClose: ((event: WebSocket.CloseEvent) => void) | null = null) {
        this.eventHandlers = new Map<SnipeEvent, Function>();
        this.errorHandlers = new Map<SnipeEvent, Function>();
        this.httpURL = httpURL;
        this.wsURL = wsURL;
        this.readyState = CONNECTING;
        this.onError = onError;
        this.onConnect = onConnect;
        this.onClose = onClose;
        this.initializeWebSocket();
    }

    private initializeWebSocket = () => {
        this.ws = new WebSocket(this.wsURL);
        this.ws.onopen = (event: WebSocket.Event) => {
            this.readyState = OPEN;
            this.onConnect && this.onConnect(event);
        }
        this.ws.onerror = (event: WebSocket.ErrorEvent) => {
            this.readyState = CLOSING;
            this.onError && this.onError(event);
        }
        this.ws.onclose = (event: WebSocket.CloseEvent) => {
            this.readyState = CLOSED;
            this.onClose && this.onClose(event);
        }
        this.ws.onmessage = (event: WebSocket.MessageEvent) => {
            const data = JSON.parse(event.data.toString());
            const func = this.eventHandlers.get(data.snipeEvent);
            if (func) {
                func(data.data);
            } else {
                console.error(`Received ${data.snipeEvent} Event, but No Handler defined yet.`);
            }
        }
    }

    // Http Methods
    public addTokens = async (tokens: string[]): Promise<{ status: string, code: number } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/token/add`, {
            method: "POST",
            body: JSON.stringify({
                tokens: tokens
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 201) {
            console.info(`${resData.count} Tokens Added.`)
            return { status: "ok", code: res.status }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }

    public removeTokens  = async (tokens: string[]): Promise<{ status: string, code: number } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/token/remove`, {
            method: "POST",
            body: JSON.stringify({
                tokens: tokens
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 200) {
            console.info(`${resData.count} Tokens Removed.`)
            return { status: "ok", code: res.status }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }

    public fetchAllTokens = async (): Promise<{ status: string, code: number, data: any[] } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/token/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 200) {
            console.info(`${resData.length} Tokens Fetched.`)
            return { status: "ok", code: res.status, data: resData }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }

    public fetchTokensWithInfo  = async (tokens: string[]): Promise<{ status: string, code: number, data: any[] } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/token/info`, {
            method: "POST",
            body: JSON.stringify({
                tokens: tokens
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 200) {
            console.info(`${resData.length} Tokens Fetched.`)
            return { status: "ok", code: res.status, data: resData }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }

    public simulateTokens  = async (tokens: string[]): Promise<{ status: string, code: number, data: any[] } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/token/simulate`, {
            method: "POST",
            body: JSON.stringify({
                tokens: tokens
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 200) {
            console.info(`${resData.length} Pairs Fetched.`)
            return { status: "ok", code: res.status, data: resData }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }

    public fetchPairsWithInfo  = async (pairs: string[]): Promise<{ status: string, code: number, data: any[] } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/pair/info`, {
            method: "POST",
            body: JSON.stringify({
                pairs: pairs
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 200) {
            console.info(`${resData.length} Pairs Fetched.`)
            return { status: "ok", code: res.status, data: resData }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }
    
    public fetchPairsWithInfoByTokens  = async (tokenPairs: {token0: string, token1: string}[]): Promise<{ status: string, code: number, data: any[] } | { error: string, code: number }> => {
        const res = await fetch(`${this.httpURL}/api/pair/info2`, {
            method: "POST",
            body: JSON.stringify({
                tokenPairs: tokenPairs
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await res.json();
        if (res.status == 200) {
            console.info(`${resData.length} Pairs Fetched.`)
            return { status: "ok", code: res.status, data: resData }
        } else {
            return { error: resData.toString(), code: res.status }
        }
    }

    // Websocket Methods
    public listenToToken = async ( callback: (data: any) => void, onError: (event: ErrorEvent) => void = (error) => {}) => {
        if (this.readyState == OPEN || this.readyState == CONNECTING) {
            while (this.readyState == CONNECTING) { await new Promise(resolve => setTimeout(resolve, 1000)); }
            if (this.readyState == OPEN) {
                this.eventHandlers.set(SnipeEvent.simulateSubscribe, callback);
                this.errorHandlers.set(SnipeEvent.simulateSubscribe, onError);
                this.ws.send(JSON.stringify({ msgType: SnipeEvent.simulateSubscribe}));
            } else {
                throw (`WebSocket is not Opened yet.`)
            }
        } else {
            throw (`WebSocket is not Connected yet.`)
        }
    }

    public unsubscribe = async ( event: SnipeEvent) => {
        if (this.readyState == OPEN || this.readyState == CONNECTING) {
            while (this.readyState == CONNECTING) { await new Promise(resolve => setTimeout(resolve, 1000)); }
            if (this.readyState == OPEN) {
                this.eventHandlers.delete(event);
                this.errorHandlers.delete(event);
                this.ws.send(JSON.stringify({ msgType: SnipeEvent.unsubscribe, data: {snipeEvent: event}}));
            } else {
                throw (`WebSocket is not Opened yet.`)
            }
        } else {
            throw (`WebSocket is not Connected yet.`)
        }
    }

    /**
     * on
     */
    public async on(event: SnipeEvent, callback: Function, params?: any) {
        if (this.readyState == OPEN || this.readyState == CONNECTING) {
            while (this.readyState == CONNECTING) { await new Promise(resolve => setTimeout(resolve, 1000)); }
            if (this.readyState == OPEN) {
                this.eventHandlers.set(event, callback);
                this.ws.send(JSON.stringify({ msgType: event, data: params }));
            } else {
                throw (`WebSocket is not Opened yet.`)
            }
        } else {
            throw (`WebSocket is not Connected yet.`)
        }
    }
}

export {
    LuckyManClient,
    SnipeEvent
}
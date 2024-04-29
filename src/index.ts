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
    private url: string | URL;
    public readyState: 0 | 1 | 2 | 3; // Connecting: 0, Open: 1, 2: Closing, 3: Closed
    private retryTimeout: number;

    /** The connection is not yet open. */
    static readonly CONNECTING: 0;
    /** The connection is open and ready to communicate. */
    static readonly OPEN: 1;
    /** The connection is in the process of closing. */
    static readonly CLOSING: 2;
    /** The connection is closed. */
    static readonly CLOSED: 3;

    constructor(url: string | URL, retryTimeout: number = 0) {
        this.eventHandlers = new Map<SnipeEvent, Function>();
        this.url = url;
        this.readyState = CONNECTING;
        this.retryTimeout = retryTimeout;
        this.initializeWebSocket();
    }

    private initializeWebSocket = async () => {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            this.readyState = OPEN;
            console.info("Socket is opened.");
        }
        this.ws.onerror = async (error) => {
            this.readyState = CONNECTING;
            if (this.retryTimeout && error.error.code == "ECONNREFUSED") {
                console.error(error.error);
            } else {
                throw (error.error)
            }
        }
        this.ws.onclose = async () => {
            this.readyState = CLOSED
            if (this.retryTimeout) {
                console.info(`Socket is closed. Trying to reconnect after ${this.retryTimeout} ms.`);
                setTimeout(this.initializeWebSocket, this.retryTimeout)
            } else {
                console.info("Socket is closed.");
            }
        };
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

    /**
     * on
     */
    public async on(event: SnipeEvent, callback: Function, params?: any) {
        if (this.readyState == OPEN || this.readyState == CONNECTING) {
            while (this.readyState == CONNECTING) { await await new Promise(resolve => setTimeout(resolve, 1000)); }
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
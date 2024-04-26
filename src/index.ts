import WebSocket, { CLOSED, CLOSING, CONNECTING, OPEN } from 'ws';

export enum SnipeEvent {
    addToken = "addToken",
    tokenAddress = "tokenAddress",
    routerAddress = "routerAddress",
    liquidity = "liquidity",
    buyTax = "buyTax",
}

export class LuckyManClient {
    //@ts-ignore
    public ws: WebSocket;
    public eventHandlers;
    private url: string | URL;
    public readyState: 0 | 1 | 2 | 3; // Connecting: 0, Open: 1, 2: Closing, 3: Closed

    /** The connection is not yet open. */
    static readonly CONNECTING: 0;
    /** The connection is open and ready to communicate. */
    static readonly OPEN: 1;
    /** The connection is in the process of closing. */
    static readonly CLOSING: 2;
    /** The connection is closed. */
    static readonly CLOSED: 3;

    constructor(url: string | URL) {
        this.eventHandlers = new Map<SnipeEvent, Function>();
        this.url = url;
        this.readyState = CONNECTING;
        this.initializeWebSocket();
    }

    private initializeWebSocket = async () => {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            console.info("Socket is opened.");
            this.readyState = OPEN;
        }
        this.ws.onerror = (error) => {
            console.error(error.error);
            this.readyState = CLOSING;
        }
        this.ws.onclose = async () => {
            console.info("Socket is closed. Trying to reconnect after 1 second.");
            this.readyState = CLOSED
            // await new Promise(resolve => setTimeout(resolve, 1000));
            setTimeout(this.initializeWebSocket, 1000)
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
                if (event != SnipeEvent.addToken) {
                    this.eventHandlers.set(event, callback);
                }
                this.ws.send(JSON.stringify({ msgType: event, data: params }));
            } else {
                throw (`WebSocket is not Opened yet.`)
            }
        } else {
            throw (`WebSocket is not Connected yet.`)
        }
    }
}
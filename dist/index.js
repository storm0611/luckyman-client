"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.SnipeEvent = exports.LuckyManClient = void 0;
const ws_1 = __importStar(require("ws"));
var SnipeEvent;
(function (SnipeEvent) {
    SnipeEvent["addToken"] = "addToken";
    SnipeEvent["tokenAddress"] = "tokenAddress";
    SnipeEvent["routerAddress"] = "routerAddress";
    SnipeEvent["liquidity"] = "liquidity";
    SnipeEvent["buyTax"] = "buyTax";
    SnipeEvent["simulateSubscribe"] = "simulateSubscribe";
    SnipeEvent["tokenInfo"] = "tokenInfo";
    SnipeEvent["unsubscribe"] = "unsubscribe";
    SnipeEvent["pairInfo"] = "pairInfo";
})(SnipeEvent || (exports.SnipeEvent = SnipeEvent = {}));
class LuckyManClient {
    constructor(httpURL, wsURL, onError = null, onConnect = null, onClose = null) {
        this.initializeWebSocket = () => {
            this.ws = new ws_1.default(this.wsURL);
            this.ws.onopen = (event) => {
                this.readyState = ws_1.OPEN;
                this.onConnect && this.onConnect(event);
            };
            this.ws.onerror = (event) => {
                this.readyState = ws_1.CLOSING;
                this.onError && this.onError(event);
            };
            this.ws.onclose = (event) => {
                this.readyState = ws_1.CLOSED;
                this.onClose && this.onClose(event);
            };
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data.toString());
                const func = this.eventHandlers.get(data.snipeEvent);
                if (func) {
                    func(data.data);
                }
                else {
                    console.error(`Received ${data.snipeEvent} Event, but No Handler defined yet.`);
                }
            };
        };
        // Http Methods
        this.addTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/token/add`, {
                method: "POST",
                body: JSON.stringify({
                    tokens: tokens
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 201) {
                console.info(`${resData.count} Tokens Added.`);
                return { status: "ok", code: res.status };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        this.removeTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/token/remove`, {
                method: "POST",
                body: JSON.stringify({
                    tokens: tokens
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 200) {
                console.info(`${resData.count} Tokens Removed.`);
                return { status: "ok", code: res.status };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        this.fetchAllTokens = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/token/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 200) {
                console.info(`${resData.length} Tokens Fetched.`);
                return { status: "ok", code: res.status, data: resData };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        this.fetchTokensWithInfo = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/token/info`, {
                method: "POST",
                body: JSON.stringify({
                    tokens: tokens
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 200) {
                console.info(`${resData.length} Tokens Fetched.`);
                return { status: "ok", code: res.status, data: resData };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        this.simulateTokens = (tokens) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/token/simulate`, {
                method: "POST",
                body: JSON.stringify({
                    tokens: tokens
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 200) {
                console.info(`${resData.length} Pairs Fetched.`);
                return { status: "ok", code: res.status, data: resData };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        this.fetchPairsWithInfo = (pairs) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/pair/info`, {
                method: "POST",
                body: JSON.stringify({
                    pairs: pairs
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 200) {
                console.info(`${resData.length} Pairs Fetched.`);
                return { status: "ok", code: res.status, data: resData };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        this.fetchPairsWithInfoByTokens = (tokenPairs) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.httpURL}/api/pair/info2`, {
                method: "POST",
                body: JSON.stringify({
                    tokenPairs: tokenPairs
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = yield res.json();
            if (res.status == 200) {
                console.info(`${resData.length} Pairs Fetched.`);
                return { status: "ok", code: res.status, data: resData };
            }
            else {
                return { error: resData.toString(), code: res.status };
            }
        });
        // Websocket Methods
        this.listenToToken = (callback_1, ...args_1) => __awaiter(this, [callback_1, ...args_1], void 0, function* (callback, onError = (error) => { }) {
            if (this.readyState == ws_1.OPEN || this.readyState == ws_1.CONNECTING) {
                while (this.readyState == ws_1.CONNECTING) {
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                }
                if (this.readyState == ws_1.OPEN) {
                    this.eventHandlers.set(SnipeEvent.simulateSubscribe, callback);
                    this.errorHandlers.set(SnipeEvent.simulateSubscribe, onError);
                    this.ws.send(JSON.stringify({ msgType: SnipeEvent.simulateSubscribe }));
                }
                else {
                    throw (`WebSocket is not Opened yet.`);
                }
            }
            else {
                throw (`WebSocket is not Connected yet.`);
            }
        });
        this.unsubscribe = (event) => __awaiter(this, void 0, void 0, function* () {
            if (this.readyState == ws_1.OPEN || this.readyState == ws_1.CONNECTING) {
                while (this.readyState == ws_1.CONNECTING) {
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                }
                if (this.readyState == ws_1.OPEN) {
                    this.eventHandlers.delete(event);
                    this.errorHandlers.delete(event);
                    this.ws.send(JSON.stringify({ msgType: SnipeEvent.unsubscribe, data: { snipeEvent: event } }));
                }
                else {
                    throw (`WebSocket is not Opened yet.`);
                }
            }
            else {
                throw (`WebSocket is not Connected yet.`);
            }
        });
        this.eventHandlers = new Map();
        this.errorHandlers = new Map();
        this.httpURL = httpURL;
        this.wsURL = wsURL;
        this.readyState = ws_1.CONNECTING;
        this.onError = onError;
        this.onConnect = onConnect;
        this.onClose = onClose;
        this.initializeWebSocket();
    }
    /**
     * on
     */
    on(event, callback, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.readyState == ws_1.OPEN || this.readyState == ws_1.CONNECTING) {
                while (this.readyState == ws_1.CONNECTING) {
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                }
                if (this.readyState == ws_1.OPEN) {
                    this.eventHandlers.set(event, callback);
                    this.ws.send(JSON.stringify({ msgType: event, data: params }));
                }
                else {
                    throw (`WebSocket is not Opened yet.`);
                }
            }
            else {
                throw (`WebSocket is not Connected yet.`);
            }
        });
    }
}
exports.LuckyManClient = LuckyManClient;

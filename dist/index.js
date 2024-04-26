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
exports.LuckyManClient = exports.SnipeEvent = void 0;
const ws_1 = __importStar(require("ws"));
var SnipeEvent;
(function (SnipeEvent) {
    SnipeEvent["addToken"] = "addToken";
    SnipeEvent["tokenAddress"] = "tokenAddress";
    SnipeEvent["routerAddress"] = "routerAddress";
    SnipeEvent["liquidity"] = "liquidity";
    SnipeEvent["buyTax"] = "buyTax";
})(SnipeEvent || (exports.SnipeEvent = SnipeEvent = {}));
class LuckyManClient {
    constructor(url) {
        this.initializeWebSocket = () => __awaiter(this, void 0, void 0, function* () {
            this.ws = new ws_1.default(this.url);
            this.ws.onopen = () => {
                console.info("Socket is opened.");
                this.readyState = ws_1.OPEN;
            };
            this.ws.onerror = (error) => {
                console.error(error.error);
                this.readyState = ws_1.CLOSING;
            };
            this.ws.onclose = () => __awaiter(this, void 0, void 0, function* () {
                console.info("Socket is closed. Trying to reconnect after 1 second.");
                this.readyState = ws_1.CLOSED;
                // await new Promise(resolve => setTimeout(resolve, 1000));
                setTimeout(this.initializeWebSocket, 1000);
            });
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
        });
        this.eventHandlers = new Map();
        this.url = url;
        this.readyState = ws_1.CONNECTING;
        this.initializeWebSocket();
    }
    /**
     * on
     */
    on(event, callback, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.readyState == ws_1.OPEN || this.readyState == ws_1.CONNECTING) {
                while (this.readyState == ws_1.CONNECTING) {
                    yield yield new Promise(resolve => setTimeout(resolve, 1000));
                }
                if (this.readyState == ws_1.OPEN) {
                    if (event != SnipeEvent.addToken) {
                        this.eventHandlers.set(event, callback);
                    }
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

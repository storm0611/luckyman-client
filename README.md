# Installation
```cli
npm install luckyman-client
```
Or upgrade
```cli
npm install --upgrade luckyman-client
```
# Usage
## Create instance of LuckyManClient
```typescript
import { LuckyManClient, SnipeEvent } from "luckyman-client/dist"

const luckyManClient = new LuckyManClient(
    'http://',
    'ws://',
    (error) => console.log(error.error),
    () => console.log("Socket is Opened."),
    () => console.log("Socket is Closed.")
);
```
## Http Methods
### Add Tokens to snipe.
Add several tokens to the list in server to detect the point when it can be tradable.
```typescript
const response = await luckyManClient.addTokens(["0x..", "0x.."]);
```
### Remove Tokens from snipe token list
```typescript
const response = await luckyManClient.removeTokens(["0x..", "0x.."]);
```
### Fetch all tokens which is being detected the tradable point
```typescript
const response = await luckyManClient.fetchAllTokens();
```
### Fetch details of tokens
```typescript
const response = await luckyManClient.fetchTokensWithInfo(["0x..", "0x..]);
```
### Fetch details of pairs
With pair Addresses
```typescript
const response = await luckyManClient.fetchPairsWithInfo(["0x..", "0x.."]);
```
With token addresses
```typescript
const response = await luckyManClient.fetchPairsWithInfoByTokens([
    { token0: "0x..", token1: "0x.." },
    { token0: "0x..", token1: "0x.." }
])
```
### Simulate Tokens
```typescript
const response = await luckyManClient.simulateTokens(["0x..", "0x.."]);
```
## WebSocket Subscription Methods
### Receive notification when the token which is added into the list is tradable.
``` typescript
luckyManClient.listenToToken(
    (data: {
        tokenAddress: string,
        simulateResult: {
            router: string,
            pairFee: number,
            buyFee: number,
            sellFee: number,
            txLimit: number
        }[],
        simulateResultV3: {
            router: string,
            pairFee: number,
            buyFee: number,
            sellFee: number,
            txLimit: number
        }
    }) => {
        console.log(data)
    });
```
## Unsubscription
```typescript
luckyManClient.unsubscribe(SnipeEvent.simulateSubscribe)
```

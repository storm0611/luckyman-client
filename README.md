# Installation
```cli
npm install luckyman-client
```
# Usage
## Create instance of LuckyManClient
```typescript
import { LuckyManClient, SnipeEvent } from "luckyman-client/dist"

const luckyManClient = new LuckyManClient("ws://localhost:3002");
```
## One-time SnipeEvent Subscription
### Add Token to snipe.
Add the token to the list in server to detect the point when it can be tradable.
```typescript
luckyManClient.on(SnipeEvent.addToken, (data: { availableToSnipe: any; err: any; }) => {
    const { availableToSnipe, err } = data;
    if (err == null) {
        console.info(`Available to Snipe? ${availableToSnipe ? "Yes" : "No, it's already in trading situation."}`)
    } else {
        console.error(err);
    }
}, { tokenAddress: "0xd582879453337bd149ae53ec2092b0af5281d1d7" });
```
### Fetch details of token
```typescript
luckyManClient.on(SnipeEvent.tokenInfo, (data: any) => {
    console.log(data);
}, { tokenAddress: "0xd582879453337bd149ae53ec2092b0af5281d1d7" });
```
### Fetch details of pair
With pair Address
```typescript
luckyManClient.on(SnipeEvent.pairInfo, (data: any) => {
    console.log(data);
}, { pairAddress: "0xE6e718b302264bCd6d068355645a722b8911434a" });

```
With token addresses
```typescript
luckyManClient.on(SnipeEvent.pairInfo, (data: any) => {
    console.log(data);
}, { pairAddress: "", token0Address: "0x4300000000000000000000000000000000000004", token1Address: "0x473DFAda6870ba95f4e635dA48946905Eeb236A1" });
```
## Real-time subscription
### Receive notification when the token which is added into the list is tradable.
``` typescript
luckyManClient.on(SnipeEvent.simulateSubscribe, (data: { tokenAddress: string, simulateResult: any[] }) => {
    const { tokenAddress, simulateResult } = data;
    console.info(`Token Address is available to trading`);
    console.log({ tokenAddress, simulateResult });
})
```
## Unsubscription
```
luckyManClient.on(SnipeEvent.unsubscribe, () => {
    console.info(`Unsubscribed`);
})
```

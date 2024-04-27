# Installation
```cli
npm install luckyman-client
```
# Usage
```cli
import { LuckyManClient, SnipeEvent } from "luckyman-client/dist"

const luckyManClient = new LuckyManClient("ws://localhost:3002");
luckyManClient.on(SnipeEvent.addToken, (data: { availableToSnipe: any; err: any; }) => {
    const {availableToSnipe, err} = data;
    if (err == null) {
        console.info(`Available to Snipe? ${availableToSnipe ? "Yes": "No, it's already in trading situation."}`)
    } else {
        console.error(err);
    }
}, { tokenAddress: "0xd582879453337bd149ae53ec2092b0af5281d1d7" });
luckyManClient.on(SnipeEvent.simulateSubscribe, (data: {tokenAddress: string, simulateResult: any[] }) => {
    const {tokenAddress, simulateResult} = data;
    console.info(`Token Address is available to trading`)
    console.log({tokenAddress, simulateResult});
})
```

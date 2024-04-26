"use strict";
const luckyManClient = new LuckyManClient('ws://localhost:3002');
luckyManClient.on(SnipeEvent.addToken, () => { }, { tokenAddress: "0xd582879453337bd149ae53ec2092b0af5281d1d7" });
luckyManClient.on(SnipeEvent.liquidity, (data) => {
    console.log(data.updatedLiquidty);
});

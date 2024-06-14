// import { LuckyManClient, SnipeEvent } from "./luckyman-client"
import { LuckyManClient, SnipeEvent } from "../src";

const main = async () => {
    const luckyManClient = new LuckyManClient(
        'http://localhost:3001',
        'ws://localhost:3002',
        (error) => console.log(error.error),
        () => console.log("Socket is Opened."),
        () => console.log("Socket is Closed.")
    );
    // console.log(await luckyManClient.removeTokens(["0x473DFAda6870ba95f4e635dA48946905Eeb236A1"]));
    // console.log(await luckyManClient.addTokens(["0x473DFAda6870ba95f4e635dA48946905Eeb236A1", "0x9bd75c164daf830733ac2ea71a0258f95aac7c57", "0x7217124c626f0b7077be91df939195c9a8184ecc"]));
    console.log(await luckyManClient.addTokens(["0x7217124c626f0b7077be91df939195c9a8184ecc"]));
    // console.log(await luckyManClient.fetchAllTokens());
    // console.log(await luckyManClient.simulateTokens(["0x473DFAda6870ba95f4e635dA48946905Eeb236A1", "0x9bd75c164daf830733ac2ea71a0258f95aac7c57"]))
    // console.log(await luckyManClient.fetchTokensWithInfo(["0xd582879453337bd149ae53ec2092b0af5281d1d7"]));
    // console.log(await luckyManClient.fetchPairsWithInfo(["0xE6e718b302264bCd6d068355645a722b8911434a"]));
    // console.log(await luckyManClient.fetchPairsWithInfoByTokens([{ token0: "0x4300000000000000000000000000000000000004", token1: "0x473DFAda6870ba95f4e635dA48946905Eeb236A1" }]));
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
            }[]
        }) => {
            console.log(data)
        });
    // luckyManClient.unsubscribe(SnipeEvent.simulateSubscribe)
}

main();
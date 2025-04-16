// @ts-ignore
import { SPOTAPI, PERPAPI, Singer } from "lnexchange-api-test";

export function createSpotApi(spotApiEnv: any) {
    const singer = spotApiEnv?.privateKey ? new Singer({
        privateKey: spotApiEnv?.privateKey,
    }) : undefined;

    const spotApi = new SPOTAPI({
        ...spotApiEnv,
        singer: spotApiEnv?.privateKey ? singer : spotApiEnv?.singer,
    });

    return spotApi;
}

export async function getAllMarketsData(spotApi: any) {
    const markets = await spotApi.getAllMarkets();
    return markets;
}

export async function getUserInfoData(spotApi: any) {
    return await spotApi.getUserInfo();
}

export async function createOrder(spotApi: any, params: any) {
    return await spotApi.createOrderApi(params);
}

export async function cancelOrder(spotApi: any, params: any) {
    return await spotApi.cancelOrder(params);
}

export async function cancelAllOrders(spotApi: any, params: any) {
    return await spotApi.cancelAllOrder(params);
}

export async function enableTrade(spotApi: any, symbolName: string) {
    return await spotApi.enableTrade(symbolName);
}

export async function createUser(spotApi: any, referrals: string) {
    return await spotApi.createUser(referrals);
}

export async function approveToken(spotApi: any, tokenName: string, amount: string) {
    return await spotApi.approve(tokenName, amount);
}

export async function depositAsset(spotApi: any, assetId: string, amount: string) {
    return await spotApi.deposit(assetId, amount);
}

export async function withdrawAsset(spotApi: any, assetId: string, amount: string) {
    return await spotApi.withdraw(assetId, amount);
}
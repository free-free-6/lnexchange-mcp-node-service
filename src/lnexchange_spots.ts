// @ts-ignore
import { SPOTAPI, PERPAPI, Singer } from "lnexchange-api-test";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";


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

export function registerSpotTools(server: McpServer, spotApi: any) {

    server.tool(
        "SpotGetPublicInfo",
        "LnExchange spot Get market public information (e.g. currencies, trading pairs, asset id)",
        {},
        async ({ }) => {
            const publicInfo = await spotApi.fetchPublicInfo();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(publicInfo),
                    },
                ],
            };
        },
    );

    server.tool(
        "SpotGetAllMarkets",
        "LnExchange spot Get market information",
        {},
        async ({ }) => {
            const markets = await spotApi.getAllMarkets();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(markets),
                    },
                ],
            };
        },
    );



    server.tool(
        "SpotGetUserInfo",
        "LnExchange spot Get user account",
        {},
        async ({ }) => {
            const userInfo = await spotApi.getUserInfo();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(userInfo),
                    },
                ],
            };
        },
    );

    server.tool(
        "SpotCreateUser",
        "LnExchange spot Register user",
        {
            referrals: z.string().optional().describe("Referral code")
        },
        async ({ referrals }) => {
            const result = await spotApi.createUser(referrals || "");
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotApproveToken",
        "LnExchange spot Approve token (Required before SpotDepositAsset)",
        {
            tokenName: z.string().describe("Token name"),
            amount: z.string().describe("Approved amount")
        },
        async ({ tokenName, amount }) => {
            const result = await spotApi.approve(tokenName, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotDepositAsset",
        "LnExchange spot Deposit assets (Requires calling SpotApproveToken first)",
        {
            assetId: z.string().describe("Asset ID (can be obtained from SpotGetPublicInfo)"),
            amount: z.string().describe("Deposit amount")
        },
        async ({ assetId, amount }) => {
            const result = await spotApi.deposit(assetId, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotWithdrawAsset",
        "LnExchange spot Withdraw assets",
        {
            assetId: z.string().describe("Asset ID (can be obtained from SpotGetPublicInfo)"),
            amount: z.string().describe("Deposit amount")
        },
        async ({ assetId, amount }) => {
            const result = await spotApi.withdraw(assetId, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotCreateOrder",
        "LnExchange spot Create spot trading order",
        {
            symbol: z.string().describe("Trading pair symbol, e.g. BTC-USDT"),
            side: z.string().describe("Trade direction: BUY/SELL"),
            type: z.string().describe("Order type: e.g. 1(1 limit, 2 market, 3 IOC, 4 FOK, 5 POST_ONLY)"),
            volume: z.string().describe("Trade quantity"),
            price: z.string().optional().describe("Limit order price")
        },
        async ({ symbol, side, type, volume, price }) => {
            const result = await spotApi.createOrderApi({
                symbol,
                side,
                type,
                volume,
                price
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotCancelOrder",
        "LnExchange spot Cancel spot trading order",
        {
            orderId: z.string().describe("Order ID"),
            symbolName: z.string().describe("Trading pair symbol")
        },
        async ({ orderId, symbolName }) => {
            const result = await spotApi.cancelOrder({
                orderId,
                symbolName
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotCancelAllOrders",
        "LnExchange spot Cancel all spot trading orders",
        {
            symbol: z.string().optional().describe("Optional, specify trading pair symbol")
        },
        async ({ symbol }) => {
            const result = await spotApi.cancelAllOrder({
                symbol
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotEnableTrade",
        "LnExchange spot Enable spot trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol")
        },
        async ({ symbolName }) => {
            const result = await spotApi.enableTrade(symbolName);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );


    server.tool(
        "SpotGetCurrentOrders",
        "LnExchange spot Get current orders for a trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter")
        },
        async ({ symbolName, page, limit, type }) => {
            const result = await spotApi.currentOrderList({
                symbolName,
                page,
                limit,
                type
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotGetTriggerOrders",
        "LnExchange spot Get trigger orders for a trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter")
        },
        async ({ symbolName, page, limit, type }) => {
            const result = await spotApi.triggerOrderList({
                symbolName,
                page,
                limit,
                type
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotGetHistoryOrders",
        "LnExchange spot Get historical orders for a trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter"),
            beginTime: z.string().optional().describe("Start time filter"),
            endTime: z.string().optional().describe("End time filter")
        },
        async ({ symbolName, page, limit, type, beginTime, endTime }) => {
            const result = await spotApi.historyOrderList({
                symbolName,
                page,
                limit,
                type,
                beginTime,
                endTime
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotGetHistoryTriggerOrders",
        "LnExchange spot Get historical trigger orders for a trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter"),
            beginTime: z.string().optional().describe("Start time filter"),
            endTime: z.string().optional().describe("End time filter")
        },
        async ({ symbolName, page, limit, type, beginTime, endTime }) => {
            const result = await spotApi.historyTriggerOrderList({
                symbolName,
                page,
                limit,
                type,
                beginTime,
                endTime
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "SpotGetTradeHistory",
        "LnExchange spot Get trade history for a trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter"),
            beginTime: z.string().optional().describe("Start time filter"),
            endTime: z.string().optional().describe("End time filter")
        },
        async ({ symbolName, page, limit, type, beginTime, endTime }) => {
            const result = await spotApi.hisTradeList({
                symbolName,
                page,
                limit,
                type,
                beginTime,
                endTime
            });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

}
// @ts-ignore
import { PERPAPI, Singer } from "lnexchange-api-test";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";


export function createPerpetualApi(perpetualApiEnv: any) {
    const singer = perpetualApiEnv?.privateKey ? new Singer({
        privateKey: perpetualApiEnv?.privateKey,
    }) : undefined;

    const perpetualApi = new PERPAPI({
        ...perpetualApiEnv,
        singer: perpetualApiEnv?.privateKey ? singer : perpetualApiEnv?.singer,
    });

    return perpetualApi;
}

export function registerPerpetualTools(server: McpServer, perpetualApi: any) {
    server.tool(
        "PerpetualGetPublicInfo",
        "LnExchange perpetual Get market public information (e.g. currencies, trading pairs, contract name, asset id)",
        {},
        async ({ }) => {
            const publicInfo = await perpetualApi.fetchPublicInfo();
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
        "PerpetualGetUserInfo",
        "LnExchange perpetual Get user account information",
        {},
        async ({ }) => {
            const userInfo = await perpetualApi.getUserInfo();
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(userInfo)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetAllMarkets",
        "LnExchange perpetual Get all markets information",
        {},
        async ({ }) => {
            const markets = await perpetualApi.getAllMarkets();
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(markets)
                }]
            };
        }
    );

    server.tool(
        "PerpetualCreateUser",
        "LnExchange perpetual Register user",
        {
            referrals: z.string().optional().describe("Referral code")
        },
        async ({ referrals }) => {
            const result = await perpetualApi.createUser(referrals || "");
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualEnableTrade",
        "LnExchange perpetual Enable trading for contract",
        {
            contractName: z.string().describe("Contract name")
        },
        async ({ contractName }) => {
            const result = await perpetualApi.enableTrade(contractName);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualApproveToken",
        "LnExchange perpetual Approve token (Required before PerpetualDepositAsset)",
        {
            tokenName: z.string().describe("Token name"),
            amount: z.string().describe("Approved amount")
        },
        async ({ tokenName, amount }) => {
            const result = await perpetualApi.approve(tokenName, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualDepositAsset",
        "LnExchange perpetual Deposit assets (Requires calling PerpetualApproveToken first)",
        {
            assetId: z.string().describe("Asset ID  (can be obtained from PerpetualGetPublicInfo)"),
            amount: z.string().describe("Deposit amount")
        },
        async ({ assetId, amount }) => {
            const result = await perpetualApi.deposit(assetId, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualWithdrawAsset",
        "LnExchange perpetual Withdraw assets",
        {
            assetId: z.string().describe("Asset ID  (can be obtained from PerpetualGetPublicInfo)"),
            amount: z.string().describe("Withdraw amount")
        },
        async ({ assetId, amount }) => {
            const result = await perpetualApi.withdraw(assetId, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualCreateOrder",
        "LnExchange perpetual Create trading order",
        {
            contractName: z.string().describe("Contract name"),
            side: z.string().describe("Trade direction: BUY/SELL"),
            type: z.string().describe("Order type"),
            volume: z.string().describe("Trade quantity"),
            price: z.string().optional().describe("Limit order price"),
            positionType: z.string().optional().describe("Position type"),
            leverageLevel: z.string().optional().describe("Leverage level")
        },
        async (params) => {
            const result = await perpetualApi.createOrderApi(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualCancelOrder",
        "LnExchange perpetual Cancel trading order",
        {
            contractName: z.string().describe("Contract name"),
            orderId: z.string().describe("Order ID")
        },
        async ({ contractName, orderId }) => {
            const result = await perpetualApi.cancelOrder({ contractName, orderId });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualCancelAllOrders",
        "LnExchange perpetual Cancel all trading orders",
        {
            contractName: z.string().optional().describe("Contract name")
        },
        async ({ contractName }) => {
            const result = await perpetualApi.cancelAllOrder({ contractName });
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetCurrentOrders",
        "LnExchange perpetual Get current orders",
        {
            contractName: z.string().describe("Contract name"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter")
        },
        async (params) => {
            const result = await perpetualApi.currentOrderList(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetTriggerOrders",
        "LnExchange perpetual Get trigger orders",
        {
            contractName: z.string().describe("Contract name"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter")
        },
        async (params) => {
            const result = await perpetualApi.triggerOrderList(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetHistoryOrders",
        "LnExchange perpetual Get history orders",
        {
            contractName: z.string().describe("Contract name"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter"),
            beginTime: z.string().optional().describe("Start time filter"),
            endTime: z.string().optional().describe("End time filter")
        },
        async (params) => {
            const result = await perpetualApi.historyOrderList(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetHistoryTriggerOrders",
        "LnExchange perpetual Get history trigger orders",
        {
            contractName: z.string().describe("Contract name"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter"),
            beginTime: z.string().optional().describe("Start time filter"),
            endTime: z.string().optional().describe("End time filter")
        },
        async (params) => {
            const result = await perpetualApi.historyTriggerOrderList(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetTradeHistory",
        "LnExchange perpetual Get trade history",
        {
            contractName: z.string().describe("Contract name"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)"),
            type: z.string().optional().describe("Order type filter"),
            beginTime: z.string().optional().describe("Start time filter"),
            endTime: z.string().optional().describe("End time filter")
        },
        async (params) => {
            const result = await perpetualApi.hisTradeList(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetAllPositions",
        "LnExchange perpetual Get all positions",
        {

        },
        async () => {
            const result = await perpetualApi.getAllPosition();
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "PerpetualGetHistoryPositions",
        "LnExchange perpetual Get history positions",
        {
            contractId: z.string().describe("Contract ID"),
            page: z.number().optional().describe("Page number (default: 1)"),
            limit: z.number().optional().describe("Items per page (default: 10)")
        },
        async (params) => {
            const result = await perpetualApi.getHistoryPosition(params);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );
}
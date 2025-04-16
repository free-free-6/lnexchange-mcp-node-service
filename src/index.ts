import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createSpotApi,
    getAllMarketsData,
    getUserInfoData,
    createOrder,
    cancelOrder,
    cancelAllOrders,
    enableTrade,
    createUser,
    approveToken,
    depositAsset,
    withdrawAsset
} from "./lnexchange_spots.js";

export const getMcpSpotServer = async (spotApiEnv: any) => {
    let privateKey;
    let spotApiEnvTemp = {};
    //Check if running in browser
    if (typeof window === "undefined") {
        privateKey = process.argv[2];
        if (!privateKey) {
            console.error("Please provide private key as startup parameter");
            process.exit(1);
        }

        spotApiEnvTemp = {
            ...spotApiEnv,
            privateKey
        }

    } else {
        spotApiEnvTemp = {
            ...spotApiEnv
        }
    }


    const spotApi = createSpotApi(spotApiEnvTemp);
    await spotApi.init();

    const server = new McpServer({
        name: "mcp-node-service",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });

    server.tool(
        "spotGetPublicInfo",
        "Get LnExchange spot market public information (e.g. currencies, trading pairs, asset id)",
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
        "spotGetAllMarkets",
        "Get LnExchange spot market information",
        {},
        async ({ }) => {
            const markets = await getAllMarketsData(spotApi);
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
        "spotGetUserInfo",
        "Get LnExchange spot user account",
        {},
        async ({ }) => {
            const userInfo = await getUserInfoData(spotApi);
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
        "spotCreateUser",
        "Register LnExchange spot user",
        {
            referrals: z.string().optional().describe("Referral code")
        },
        async ({ referrals }) => {
            const result = await createUser(spotApi, referrals || "");
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "spotApproveToken",
        "LnExchange spot Approve token (Required before deposit)",
        {
            tokenName: z.string().describe("Token name"),
            amount: z.string().describe("Approved amount")
        },
        async ({ tokenName, amount }) => {
            const result = await approveToken(spotApi, tokenName, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "spotDepositAsset",
        "LnExchange spot Deposit assets  (Requires prior token approval)",
        {
            assetId: z.string().describe("Asset ID"),
            amount: z.string().describe("Deposit amount")
        },
        async ({ assetId, amount }) => {
            const result = await depositAsset(spotApi, assetId, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "spotWithdrawAsset",
        "LnExchange spot Withdraw assets",
        {
            assetId: z.string().describe("Asset ID"),
            amount: z.string().describe("Deposit amount")
        },
        async ({ assetId, amount }) => {
            const result = await withdrawAsset(spotApi, assetId, amount);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    server.tool(
        "spotCreateOrder",
        "LnExchange spot Create spot trading order",
        {
            symbol: z.string().describe("Trading pair symbol, e.g. BTC-USDT"),
            side: z.string().describe("Trade direction: BUY/SELL"),
            type: z.string().describe("Order type: e.g. 1(1 limit, 2 market, 3 IOC, 4 FOK, 5 POST_ONLY)"),
            volume: z.string().describe("Trade quantity"),
            price: z.string().optional().describe("Limit order price")
        },
        async ({ symbol, side, type, volume, price }) => {
            const result = await createOrder(spotApi, {
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
        "spotCancelOrder",
        "LnExchange spot Cancel spot trading order",
        {
            orderId: z.string().describe("Order ID"),
            symbolName: z.string().describe("Trading pair symbol")
        },
        async ({ orderId, symbolName }) => {
            const result = await cancelOrder(spotApi, {
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
        "spotCancelAllOrders",
        "LnExchange spot Cancel all spot trading orders",
        {
            symbol: z.string().optional().describe("Optional, specify trading pair symbol")
        },
        async ({ symbol }) => {
            const result = await cancelAllOrders(spotApi, {
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
        "spotEnableTrade",
        "LnExchange spot Enable spot trading pair",
        {
            symbolName: z.string().describe("Trading pair symbol")
        },
        async ({ symbolName }) => {
            const result = await enableTrade(spotApi, symbolName);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
            };
        }
    );

    //Check if running in browser
    if (typeof window === "undefined") {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Weather MCP Server running on stdio");
    }
    return server;
}

getMcpSpotServer({}).catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});


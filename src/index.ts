#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createSpotApi,
    registerSpotTools
} from "./lnexchange_spots.js";
import {
    createPerpetualApi,
    registerPerpetualTools
} from "./lnexchange_perpetual.js";

export const getMcpLnExchangeServer = async (spotApiEnv: any, perpetualApiEnv: any) => {
    let privateKey;
    let spotApiEnvTemp = {};
    let perpetualApiEnvTemp = {};
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

        perpetualApiEnvTemp = {
            ...perpetualApiEnv,
            privateKey
        }

    } else {
        spotApiEnvTemp = {
            ...spotApiEnv
        }
        perpetualApiEnvTemp = {
            ...perpetualApiEnv
        }
    }


    const spotApi = createSpotApi(spotApiEnvTemp);
    await spotApi.init();

    const perpetualApi = createPerpetualApi(perpetualApiEnvTemp);
    await perpetualApi.init();

    const server = new McpServer({
        name: "mcp-node-service",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });


    //register spot tools
    registerSpotTools(server, spotApi);
    //register perpetual tools
    registerPerpetualTools(server, perpetualApi);



    //Check if running in browser
    if (typeof window === "undefined") {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Weather MCP Server running on stdio");
    }
    return server;
}

getMcpLnExchangeServer({
    env: "development",
    relay: "wss://dev-relay.lnfi.network",
    baseURL: "https://dev-spots-api.unift.xyz"
}, {
    env: "development",
    relay: "wss://dev-relay.lnfi.network",
    baseURL: "https://dev-futures-api.unift.xyz"
}).catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});


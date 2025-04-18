#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createSpotApi,
    registerSpotTools
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


    //register spot tools
    registerSpotTools(server, spotApi);



    //Check if running in browser
    if (typeof window === "undefined") {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Weather MCP Server running on stdio");
    }
    return server;
}

getMcpSpotServer({
    env: "development",
    relay: "wss://dev-relay.lnfi.network",
    baseURL: "https://dev-spots-api.unift.xyz"
}).catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});


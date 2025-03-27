# LnExchange MCP Node Service

This is a Node.js service for interacting with the LnExchange API, providing spot trading functionality.

## Installation

1. Make sure you have Node.js installed (version 16 or higher recommended)
2. Clone this repository
3. Install dependencies:

```bash
npm install
```

## Building the Project

To compile TypeScript files to JavaScript:

```bash
npm run build
```

This will:
1. Compile TypeScript files using `tsc`
2. Make the built files executable

## Usage

After building, you can start the service with:

```bash
npm start
```



## npx
xxxxxxxxxxxxxxxxxxxx Please replace with your Nostr private key

```bash
{
    "mcpServers": {
        "lnexchange-mcp-node-service-test": {
            "command": "npx",
            "args": [
                "-y",
                "lnexchange-mcp-node-service-test",
                "xxxxxxxxxxxxxxxxxxxx"
            ]
        }
    }
}
```

## Dependencies

- [lnexchange-api-test](https://www.npmjs.com/package/lnexchange-api-test) - LnExchange API client
- [zod](https://www.npmjs.com/package/zod) - TypeScript-first schema validation
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - Model Context Protocol SDK

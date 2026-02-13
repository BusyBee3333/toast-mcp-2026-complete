#!/usr/bin/env node

import { ToastMCPServer } from './server.js';

/**
 * Toast MCP Server Entry Point
 * Supports both stdio and HTTP modes
 */

interface Config {
  clientId?: string;
  clientSecret?: string;
  restaurantGuid?: string;
  environment?: 'production' | 'sandbox';
  mode?: 'stdio' | 'http';
  port?: number;
}

function loadConfig(): Config {
  const config: Config = {
    mode: (process.env.TOAST_MCP_MODE as 'stdio' | 'http') || 'stdio',
    port: process.env.TOAST_MCP_PORT ? parseInt(process.env.TOAST_MCP_PORT) : 3000,
  };

  // Load from environment variables
  config.clientId = process.env.TOAST_CLIENT_ID;
  config.clientSecret = process.env.TOAST_CLIENT_SECRET;
  config.restaurantGuid = process.env.TOAST_RESTAURANT_GUID;
  config.environment = (process.env.TOAST_ENVIRONMENT as 'production' | 'sandbox') || 'production';

  // Validate required fields
  if (!config.clientId) {
    console.error('Error: TOAST_CLIENT_ID environment variable is required');
    process.exit(1);
  }

  if (!config.clientSecret) {
    console.error('Error: TOAST_CLIENT_SECRET environment variable is required');
    process.exit(1);
  }

  return config;
}

async function main() {
  const config = loadConfig();

  console.error('[Toast MCP] Starting server...');
  console.error(`[Toast MCP] Mode: ${config.mode}`);
  console.error(`[Toast MCP] Environment: ${config.environment}`);
  if (config.restaurantGuid) {
    console.error(`[Toast MCP] Restaurant GUID: ${config.restaurantGuid}`);
  }

  try {
    if (config.mode === 'stdio') {
      // Stdio mode - standard MCP server
      const server = new ToastMCPServer({
        clientId: config.clientId!,
        clientSecret: config.clientSecret!,
        restaurantGuid: config.restaurantGuid,
        environment: config.environment,
      });

      await server.run();
    } else if (config.mode === 'http') {
      // HTTP mode - for web UI and API access
      const express = await import('express');
      const cors = await import('cors');
      const app = express.default();

      app.use(cors.default());
      app.use(express.json());

      // Serve static UI files
      app.use('/apps', express.static('dist/ui'));

      // Health check
      app.get('/health', (req, res) => {
        res.json({ status: 'ok', service: 'toast-mcp-server', version: '1.0.0' });
      });

      // API endpoint for tool execution
      app.post('/api/tools/:toolName', async (req, res) => {
        try {
          const server = new ToastMCPServer({
            clientId: config.clientId!,
            clientSecret: config.clientSecret!,
            restaurantGuid: config.restaurantGuid,
            environment: config.environment,
          });

          // This would need to be refactored to support HTTP-based tool calls
          // For now, returning placeholder
          res.json({
            error: 'HTTP tool execution not yet implemented',
            message: 'Use stdio mode for MCP integration',
          });
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      });

      const port = config.port || 3000;
      app.listen(port, () => {
        console.error(`[Toast MCP] HTTP server listening on port ${port}`);
        console.error(`[Toast MCP] UI available at http://localhost:${port}/apps/`);
      });
    }
  } catch (error) {
    console.error('[Toast MCP] Fatal error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('[Toast MCP] Unhandled error:', error);
  process.exit(1);
});

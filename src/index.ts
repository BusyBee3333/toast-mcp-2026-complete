#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// TOAST POS MCP SERVER
// API Docs: https://doc.toasttab.com/doc/devguide/apiOverview.html
// ============================================
const MCP_NAME = "toast";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://ws-api.toasttab.com";

// ============================================
// API CLIENT - OAuth2 Client Credentials Authentication
// ============================================
class ToastClient {
  private clientId: string;
  private clientSecret: string;
  private restaurantGuid: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(clientId: string, clientSecret: string, restaurantGuid: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.restaurantGuid = restaurantGuid;
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    // Fetch new token using client credentials
    const response = await fetch(`${API_BASE_URL}/authentication/v1/authentication/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        userAccessType: "TOAST_MACHINE_CLIENT",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Toast auth error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.token.accessToken;
    // Token typically valid for 1 hour
    this.tokenExpiry = Date.now() + (data.token.expiresIn || 3600) * 1000;
    return this.accessToken!;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAccessToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Toast-Restaurant-External-ID": this.restaurantGuid,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Toast API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  async get(endpoint: string, params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`${endpoint}${queryString}`, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  getRestaurantGuid(): string {
    return this.restaurantGuid;
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_orders",
    description: "List orders from Toast POS within a time range. Returns order summaries with checks, items, and payment info.",
    inputSchema: {
      type: "object" as const,
      properties: {
        start_date: { type: "string", description: "Start date/time in ISO 8601 format (required, e.g., 2024-01-01T00:00:00.000Z)" },
        end_date: { type: "string", description: "End date/time in ISO 8601 format (required)" },
        page_size: { type: "number", description: "Number of orders per page (default 100, max 100)" },
        page_token: { type: "string", description: "Pagination token from previous response" },
        business_date: { type: "string", description: "Filter by business date (YYYYMMDD format)" },
      },
      required: ["start_date", "end_date"],
    },
  },
  {
    name: "get_order",
    description: "Get a specific order by GUID with full details including checks, selections, payments",
    inputSchema: {
      type: "object" as const,
      properties: {
        order_guid: { type: "string", description: "Order GUID" },
      },
      required: ["order_guid"],
    },
  },
  {
    name: "list_menu_items",
    description: "List menu items from Toast menus API. Returns items with prices, modifiers, and availability.",
    inputSchema: {
      type: "object" as const,
      properties: {
        menu_guid: { type: "string", description: "Specific menu GUID to fetch (optional - fetches all menus if not provided)" },
        include_modifiers: { type: "boolean", description: "Include modifier groups and options (default true)" },
      },
    },
  },
  {
    name: "update_menu_item",
    description: "Update a menu item's stock status (86'd status) or visibility",
    inputSchema: {
      type: "object" as const,
      properties: {
        item_guid: { type: "string", description: "Menu item GUID (required)" },
        quantity: { type: "string", description: "Stock quantity: 'OUT_OF_STOCK', number, or 'UNLIMITED'" },
        status: { type: "string", description: "Item status: IN_STOCK, OUT_OF_STOCK" },
      },
      required: ["item_guid"],
    },
  },
  {
    name: "list_employees",
    description: "List employees from Toast labor API",
    inputSchema: {
      type: "object" as const,
      properties: {
        page_size: { type: "number", description: "Number of employees per page (default 100)" },
        page_token: { type: "string", description: "Pagination token from previous response" },
        include_archived: { type: "boolean", description: "Include archived/inactive employees" },
      },
    },
  },
  {
    name: "get_labor",
    description: "Get labor/time entry data for shifts within a date range",
    inputSchema: {
      type: "object" as const,
      properties: {
        start_date: { type: "string", description: "Start date in ISO 8601 format (required)" },
        end_date: { type: "string", description: "End date in ISO 8601 format (required)" },
        employee_guid: { type: "string", description: "Filter by specific employee GUID" },
        page_size: { type: "number", description: "Number of entries per page (default 100)" },
        page_token: { type: "string", description: "Pagination token" },
      },
      required: ["start_date", "end_date"],
    },
  },
  {
    name: "list_checks",
    description: "List checks (tabs) from orders within a time range",
    inputSchema: {
      type: "object" as const,
      properties: {
        start_date: { type: "string", description: "Start date/time in ISO 8601 format (required)" },
        end_date: { type: "string", description: "End date/time in ISO 8601 format (required)" },
        page_size: { type: "number", description: "Number of checks per page (default 100)" },
        page_token: { type: "string", description: "Pagination token" },
        check_status: { type: "string", description: "Filter by status: OPEN, CLOSED, VOID" },
      },
      required: ["start_date", "end_date"],
    },
  },
  {
    name: "void_check",
    description: "Void a check (requires proper permissions). This action cannot be undone.",
    inputSchema: {
      type: "object" as const,
      properties: {
        order_guid: { type: "string", description: "Order GUID containing the check (required)" },
        check_guid: { type: "string", description: "Check GUID to void (required)" },
        void_reason: { type: "string", description: "Reason for voiding the check" },
        void_business_date: { type: "number", description: "Business date for void (YYYYMMDD format)" },
      },
      required: ["order_guid", "check_guid"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: ToastClient, name: string, args: any) {
  const restaurantGuid = client.getRestaurantGuid();

  switch (name) {
    case "list_orders": {
      const params: Record<string, string> = {
        startDate: args.start_date,
        endDate: args.end_date,
      };
      if (args.page_size) params.pageSize = String(args.page_size);
      if (args.page_token) params.pageToken = args.page_token;
      if (args.business_date) params.businessDate = args.business_date;
      return await client.get(`/orders/v2/orders`, params);
    }

    case "get_order": {
      return await client.get(`/orders/v2/orders/${args.order_guid}`);
    }

    case "list_menu_items": {
      // Get menus with full item details
      if (args.menu_guid) {
        return await client.get(`/menus/v2/menus/${args.menu_guid}`);
      }
      // Get all menus
      return await client.get(`/menus/v2/menus`);
    }

    case "update_menu_item": {
      // Use stock API to update item availability
      const stockData: any = {};
      if (args.quantity !== undefined) {
        stockData.quantity = args.quantity;
      }
      if (args.status) {
        stockData.status = args.status;
      }
      return await client.post(`/stock/v1/items/${args.item_guid}`, stockData);
    }

    case "list_employees": {
      const params: Record<string, string> = {};
      if (args.page_size) params.pageSize = String(args.page_size);
      if (args.page_token) params.pageToken = args.page_token;
      if (args.include_archived) params.includeArchived = String(args.include_archived);
      return await client.get(`/labor/v1/employees`, params);
    }

    case "get_labor": {
      const params: Record<string, string> = {
        startDate: args.start_date,
        endDate: args.end_date,
      };
      if (args.employee_guid) params.employeeId = args.employee_guid;
      if (args.page_size) params.pageSize = String(args.page_size);
      if (args.page_token) params.pageToken = args.page_token;
      return await client.get(`/labor/v1/timeEntries`, params);
    }

    case "list_checks": {
      // Checks are part of orders - fetch orders and extract checks
      const params: Record<string, string> = {
        startDate: args.start_date,
        endDate: args.end_date,
      };
      if (args.page_size) params.pageSize = String(args.page_size);
      if (args.page_token) params.pageToken = args.page_token;

      const ordersResponse = await client.get(`/orders/v2/orders`, params);

      // Extract checks from orders
      const checks: any[] = [];
      if (ordersResponse.orders) {
        for (const order of ordersResponse.orders) {
          if (order.checks) {
            for (const check of order.checks) {
              // Filter by status if specified
              if (args.check_status && check.voidStatus !== args.check_status) {
                continue;
              }
              checks.push({
                ...check,
                orderGuid: order.guid,
                orderOpenedDate: order.openedDate,
              });
            }
          }
        }
      }

      return {
        checks,
        nextPageToken: ordersResponse.nextPageToken,
      };
    }

    case "void_check": {
      const voidData: any = {
        voidReason: args.void_reason || "Voided via API",
      };
      if (args.void_business_date) {
        voidData.voidBusinessDate = args.void_business_date;
      }

      // PATCH the check to void it
      return await client.patch(
        `/orders/v2/orders/${args.order_guid}/checks/${args.check_guid}`,
        {
          voidStatus: "VOID",
          ...voidData,
        }
      );
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const clientId = process.env.TOAST_CLIENT_ID;
  const clientSecret = process.env.TOAST_CLIENT_SECRET;
  const restaurantGuid = process.env.TOAST_RESTAURANT_GUID;

  if (!clientId) {
    console.error("Error: TOAST_CLIENT_ID environment variable required");
    process.exit(1);
  }
  if (!clientSecret) {
    console.error("Error: TOAST_CLIENT_SECRET environment variable required");
    process.exit(1);
  }
  if (!restaurantGuid) {
    console.error("Error: TOAST_RESTAURANT_GUID environment variable required");
    process.exit(1);
  }

  const client = new ToastClient(clientId, clientSecret, restaurantGuid);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);

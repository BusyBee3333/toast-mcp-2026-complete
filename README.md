# Toast MCP Server

Complete Model Context Protocol (MCP) server for Toast restaurant POS and management platform integration.

## 🚀 Features

### 50+ Tools Across 10 Categories

1. **Orders (12 tools)** - Complete order lifecycle management
   - Get, list, create, void orders
   - Search by customer, business date
   - Add/void selections, apply discounts
   - Update promised times, track status

2. **Menus (11 tools)** - Full menu and item management
   - List/get menus, groups, items
   - Search items, update pricing
   - 86 management (out of stock)
   - Bulk operations

3. **Employees (9 tools)** - Staff management
   - Employee CRUD operations
   - Job position management
   - Search and filtering
   - Time entry tracking

4. **Labor (6 tools)** - Workforce analytics
   - Shift management
   - Active shift tracking
   - Labor reports and summaries
   - Employee hours calculation

5. **Restaurant (9 tools)** - Configuration and settings
   - Restaurant info and access
   - Tables and service areas
   - Dining options, revenue centers
   - Online ordering and delivery settings

6. **Payments (6 tools)** - Transaction management
   - Payment CRUD operations
   - Refunds and voids
   - Payment summaries by type

7. **Inventory (5 tools)** - Stock management
   - Stock level tracking
   - Low stock alerts
   - Quantity updates
   - Bulk operations

8. **Customers (4 tools)** - Customer relationship management
   - Customer search and profiles
   - Order history
   - Loyalty program integration
   - Top customers analysis

9. **Reporting (6 tools)** - Analytics and insights
   - Sales summaries
   - Hourly breakdown
   - Item sales reports
   - Payment type, discount, and void reports

10. **Cash (8 tools)** - Cash management
    - Cash drawer tracking
    - Paid in/out entries
    - Deposit recording
    - Drawer summaries

### 18 React Apps (Client-Side UI)

**Orders & Service:**
- Order Dashboard - Real-time monitoring
- Order Detail - Deep order inspection
- Order Grid - Multi-order management
- Table Map - Visual floor plan

**Menu Management:**
- Menu Manager - Full menu editing
- Menu Item Detail - Item configuration
- Menu Performance - Sales analytics

**Staff & Labor:**
- Employee Dashboard - Staff directory
- Employee Schedule - Shift planning
- Labor Dashboard - Cost tracking
- Tip Summary - Earnings distribution

**Payments & Finance:**
- Payment History - Transaction log
- Sales Dashboard - Comprehensive metrics
- Revenue by Hour - Hourly analysis

**Inventory & Operations:**
- Inventory Tracker - Stock management
- Restaurant Overview - System config

**Customer Management:**
- Customer Detail - Profiles and history
- Customer Loyalty - Rewards tracking

## 📦 Installation

```bash
npm install @busybee3333/toast-mcp-server
```

Or clone and build locally:

```bash
git clone https://github.com/BusyBee3333/mcpengine.git
cd mcpengine/servers/toast
npm install
npm run build
```

## 🔧 Configuration

Set required environment variables:

```bash
export TOAST_CLIENT_ID="your_client_id"
export TOAST_CLIENT_SECRET="your_client_secret"
export TOAST_RESTAURANT_GUID="your_restaurant_guid"  # Optional
export TOAST_ENVIRONMENT="production"  # or "sandbox"
```

## 🎯 Usage

### Stdio Mode (MCP Integration)

```bash
toast-mcp-server
```

Or via npx:

```bash
npx @busybee3333/toast-mcp-server
```

### HTTP Mode (Web UI + API)

```bash
TOAST_MCP_MODE=http TOAST_MCP_PORT=3000 toast-mcp-server
```

Access UI at: `http://localhost:3000/apps/`

### Claude Desktop Integration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "toast": {
      "command": "npx",
      "args": [
        "@busybee3333/toast-mcp-server"
      ],
      "env": {
        "TOAST_CLIENT_ID": "your_client_id",
        "TOAST_CLIENT_SECRET": "your_client_secret",
        "TOAST_RESTAURANT_GUID": "your_restaurant_guid",
        "TOAST_ENVIRONMENT": "production"
      }
    }
  }
}
```

## 🛠️ Tool Examples

### Get Order
```json
{
  "name": "toast_get_order",
  "arguments": {
    "orderGuid": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### List Orders for Business Date
```json
{
  "name": "toast_list_orders",
  "arguments": {
    "businessDate": 20240215
  }
}
```

### Create Order
```json
{
  "name": "toast_create_order",
  "arguments": {
    "source": "ONLINE",
    "selections": [
      {
        "itemGuid": "item-123",
        "quantity": 2
      }
    ],
    "customer": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+15551234567"
    }
  }
}
```

### Mark Item 86'd
```json
{
  "name": "toast_set_item_86",
  "arguments": {
    "itemGuid": "item-456",
    "outOfStock": true
  }
}
```

### Get Sales Summary
```json
{
  "name": "toast_get_sales_summary",
  "arguments": {
    "businessDate": 20240215
  }
}
```

## 🏗️ Architecture

```
toast/
├── src/
│   ├── clients/
│   │   └── toast.ts          # Toast API client with auth
│   ├── tools/
│   │   ├── orders.ts         # 12 order tools
│   │   ├── menus.ts          # 11 menu tools
│   │   ├── employees.ts      # 9 employee tools
│   │   ├── labor.ts          # 6 labor tools
│   │   ├── restaurant.ts     # 9 restaurant tools
│   │   ├── payments.ts       # 6 payment tools
│   │   ├── inventory.ts      # 5 inventory tools
│   │   ├── customers.ts      # 4 customer tools
│   │   ├── reporting.ts      # 6 reporting tools
│   │   └── cash.ts           # 8 cash tools
│   ├── types/
│   │   └── index.ts          # Comprehensive TypeScript types
│   ├── ui/
│   │   └── react-app/        # 18 React apps (client-side)
│   ├── server.ts             # MCP server implementation
│   └── main.ts               # Entry point (stdio + HTTP)
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 API Coverage

This server implements comprehensive coverage of the Toast API:

- ✅ Orders API v2 (full CRUD)
- ✅ Menus API v2 (read + update)
- ✅ Labor API v1 (employees, shifts, time entries)
- ✅ Configuration API v1 (restaurant settings)
- ✅ Stock API v1 (inventory management)
- ✅ Cash Management API v1
- ✅ Partners API v1 (restaurant access)

## 🔐 Authentication

Uses OAuth 2.0 client credentials flow with automatic token refresh. Tokens are managed internally and refreshed 5 minutes before expiration.

## 🎨 UI Theme

All 18 apps use a consistent dark theme optimized for restaurant environments:
- Background: `#0f0f0f`
- Cards: `#1a1a1a`
- Accent: `#00bfa5`
- Text: `#e0e0e0`

## 🤝 Contributing

Contributions welcome! Please see the main [mcpengine repo](https://github.com/BusyBee3333/mcpengine) for contribution guidelines.

## 📄 License

MIT © BusyBee3333

## 🔗 Links

- [Toast API Documentation](https://doc.toasttab.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Engine Repository](https://github.com/BusyBee3333/mcpengine)

## 🐛 Known Issues

- HTTP mode tool execution not yet implemented (use stdio mode for MCP)
- UI apps currently use client-side demo data (connect to Toast API for live data)

## 🗓️ Roadmap

- [ ] WebSocket support for real-time order updates
- [ ] Full HTTP mode implementation
- [ ] Additional reporting endpoints
- [ ] Kitchen display system (KDS) integration
- [ ] Multi-location support

---

**Built with ❤️ for the restaurant industry**

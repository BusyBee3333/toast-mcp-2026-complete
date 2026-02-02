> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/toast)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🍞 Toast MCP Server — Restaurant Operations on Autopilot

## 💡 What This Unlocks

**This MCP server gives AI direct access to your Toast POS system.** Stop manually pulling reports, updating menu items, or tracking labor costs. Just tell Claude what you need, and it happens.

### 🎯 Toast-Specific Power Moves

| Use Case | What It Does | Tools Used |
|----------|-------------|-----------|
| **"86" items instantly** | Mark menu items out of stock across all terminals | `list_menu_items`, `update_menu_item` |
| **Daily sales reconciliation** | Pull all orders + payments for a business day | `list_orders`, `get_order`, `list_checks` |
| **Labor cost analysis** | Compare actual hours worked vs. scheduled shifts | `list_employees`, `get_labor` |
| **Order investigation** | Find specific orders by time/amount, void if needed | `list_orders`, `get_order`, `void_check` |
| **Menu sync verification** | Audit menu items against your master menu list | `list_menu_items` |

### 🔗 The Real Power: Natural Language Restaurant Ops

Instead of clicking through Toast dashboards:

- *"Show me all orders from last night's dinner rush (5-9pm)"*
- *"Mark the grilled salmon as 86'd"*
- *"What's our total labor cost for this week?"*
- *"Find the order with the $127 total from yesterday"*
- *"Void check #4521 — customer never showed up"*

## 📦 What's Inside

**8 restaurant-focused API tools** covering Toast's core POS functionality:

- **Orders:** `list_orders`, `get_order` — Sales data, items, modifiers, payments
- **Checks:** `list_checks`, `void_check` — Tab management and corrections
- **Menu:** `list_menu_items`, `update_menu_item` — Inventory & 86'd items
- **Labor:** `list_employees`, `get_labor` — Staff scheduling & time tracking

All with automatic OAuth2 authentication, proper error handling, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Recommended)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Toast-MCP-2026-Complete.git
   cd toast-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Toast API credentials:**
   - Log into [Toast Developer Portal](https://dev.toasttab.com/)
   - Create a new integration (Restaurant Management API)
   - Save your **Client ID**, **Client Secret**, and **Restaurant GUID**

3. **Configure Claude Desktop:**
   
   **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "toast": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/toast-mcp-2026-complete/dist/index.js"],
         "env": {
           "TOAST_CLIENT_ID": "your-client-id",
           "TOAST_CLIENT_SECRET": "your-client-secret",
           "TOAST_RESTAURANT_GUID": "your-restaurant-guid"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop** — you'll see 8 Toast tools appear in the MCP section

### Option 2: Local Development

```bash
cp .env.example .env
# Edit .env with your Toast credentials
npm run dev
```

## 🔐 Authentication

Toast uses **OAuth2 Client Credentials** flow:

1. Go to [Toast Developer Portal](https://dev.toasttab.com/)
2. Navigate to **Integrations** → **Create Integration**
3. Select **Restaurant Management API** scope
4. Copy your **Client ID** and **Client Secret**
5. Find your **Restaurant GUID** in Toast Web (Settings → Restaurant Info)

**Required Scopes:**
- Orders (read)
- Menus (read/write)
- Labor (read)

**API Docs:** [https://doc.toasttab.com/doc/devguide/apiOverview.html](https://doc.toasttab.com/doc/devguide/apiOverview.html)

The MCP server automatically handles token refresh (tokens expire after 1 hour).

## 🎯 Example Prompts

Once connected to Claude:

**Sales & Orders:**
- *"Pull all orders from yesterday between 6-9pm"*
- *"Show me order abc123 with full details"*
- *"What were our top-selling items last week?"*

**Menu Management:**
- *"List all menu items with prices"*
- *"Mark the ribeye steak as out of stock"*
- *"What items are currently 86'd?"*

**Labor & Staffing:**
- *"Show me all employees"*
- *"Get labor data for last Monday-Friday"*
- *"Calculate total hours worked by employee X"*

**Check Operations:**
- *"List all open checks right now"*
- *"Void check #4521 with reason 'customer no-show'"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Toast account with API access (paid plan required)

### Local Setup

```bash
git clone https://github.com/BusyBee3333/Toast-MCP-2026-Complete.git
cd toast-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your credentials
npm run build
npm start
```

### Project Structure

```
toast-mcp-2026-complete/
├── src/
│   └── index.ts          # Main MCP server + Toast API client
├── dist/                 # Compiled JavaScript (npm run build)
├── package.json
├── tsconfig.json
└── .env.example
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Toast auth error: 401"
- Verify your Client ID and Client Secret are correct
- Check that your integration has the required scopes enabled
- Ensure your Restaurant GUID matches your actual restaurant

### "Toast API error: 403 Forbidden"
- Your API credentials don't have the necessary permissions
- Check your integration's scope settings in the Toast Developer Portal

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating `claude_desktop_config.json`
- Verify the path is **absolute** (no `~` or relative paths)
- Check that `npm run build` completed successfully
- Look for the `dist/index.js` file

### "Toast-Restaurant-External-ID header required"
- Make sure `TOAST_RESTAURANT_GUID` is set in your environment
- This is different from your Client ID — find it in Toast Web settings

## 📖 Resources

- [Toast API Documentation](https://doc.toasttab.com/doc/devguide/apiOverview.html)
- [Toast Developer Portal](https://dev.toasttab.com/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Setup](https://claude.ai/desktop)

## 🤝 Contributing

Contributions welcome! To add new Toast API endpoints:

1. Fork the repo
2. Add tool definitions to `src/index.ts` (tools array)
3. Implement handlers in `handleTool()` function
4. Update README with new capabilities
5. Submit a PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

**Want more MCP servers?** Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms (Gusto, Calendly, Stripe, QuickBooks, and more).

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).

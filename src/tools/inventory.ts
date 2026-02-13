import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { StockItem } from '../types/index.js';

/**
 * Inventory Management Tools
 */

export function registerInventoryTools(client: ToastClient) {
  return [
    {
      name: 'toast_get_stock_item',
      description: 'Get stock/inventory information for a specific item at a location',
      inputSchema: z.object({
        itemGuid: z.string(),
        locationGuid: z.string().optional().describe('Defaults to restaurant GUID'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { itemGuid: string; locationGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const locGuid = args.locationGuid || restGuid;
        
        const stockItem = await client.get<StockItem>(
          `/stock/v1/items/${args.itemGuid}`,
          { restaurantGuid: restGuid, locationGuid: locGuid }
        );
        return { stockItem };
      },
    },

    {
      name: 'toast_update_stock_quantity',
      description: 'Update the quantity of an item in stock',
      inputSchema: z.object({
        itemGuid: z.string(),
        quantity: z.number().describe('New quantity'),
        locationGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { itemGuid: string; quantity: number; locationGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const locGuid = args.locationGuid || restGuid;
        
        const result = await client.patch(
          `/stock/v1/items/${args.itemGuid}`,
          { quantity: args.quantity },
          { params: { restaurantGuid: restGuid, locationGuid: locGuid } }
        );
        return { success: true, itemGuid: args.itemGuid, newQuantity: args.quantity };
      },
    },

    {
      name: 'toast_set_infinite_quantity',
      description: 'Mark an item as having infinite quantity (always in stock)',
      inputSchema: z.object({
        itemGuid: z.string(),
        infinite: z.boolean(),
        locationGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { itemGuid: string; infinite: boolean; locationGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const locGuid = args.locationGuid || restGuid;
        
        const result = await client.patch(
          `/stock/v1/items/${args.itemGuid}`,
          { infiniteQuantity: args.infinite },
          { params: { restaurantGuid: restGuid, locationGuid: locGuid } }
        );
        return { success: true, itemGuid: args.itemGuid, infiniteQuantity: args.infinite };
      },
    },

    {
      name: 'toast_list_low_stock_items',
      description: 'List items that are low in stock or out of stock',
      inputSchema: z.object({
        threshold: z.number().optional().describe('Quantity threshold (default: 0 for out of stock only)'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { threshold?: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const threshold = args.threshold ?? 0;
        
        // Note: This would need to iterate through items or use a specific low-stock endpoint
        // For demonstration, showing the approach
        const menus = await client.get(
          `/menus/v2/menus`,
          { restaurantGuid: restGuid }
        );

        const allItemGuids: string[] = [];
        (menus as any[]).forEach((menu: any) => {
          menu.groups?.forEach((group: any) => {
            group.items?.forEach((item: any) => {
              allItemGuids.push(item.guid);
            });
          });
        });

        // Check stock for each item
        const lowStockItems: any[] = [];
        for (const itemGuid of allItemGuids.slice(0, 50)) { // Limit to avoid rate limiting
          try {
            const stockItem = await client.get<StockItem>(
              `/stock/v1/items/${itemGuid}`,
              { restaurantGuid: restGuid }
            );
            
            if (!stockItem.infiniteQuantity && (stockItem.quantity || 0) <= threshold) {
              lowStockItems.push({
                itemGuid,
                quantity: stockItem.quantity,
                outOfStock: stockItem.outOfStock,
              });
            }
          } catch (err) {
            // Item may not have stock tracking
            continue;
          }
        }

        return { items: lowStockItems, count: lowStockItems.length };
      },
    },

    {
      name: 'toast_bulk_update_stock',
      description: 'Update stock quantities for multiple items at once',
      inputSchema: z.object({
        updates: z.array(z.object({
          itemGuid: z.string(),
          quantity: z.number(),
        })),
        locationGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { updates: Array<{ itemGuid: string; quantity: number }>; locationGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const locGuid = args.locationGuid || restGuid;
        
        const results = await Promise.all(
          args.updates.map(update =>
            client.patch(
              `/stock/v1/items/${update.itemGuid}`,
              { quantity: update.quantity },
              { params: { restaurantGuid: restGuid, locationGuid: locGuid } }
            ).catch(err => ({ error: err.message, itemGuid: update.itemGuid }))
          )
        );

        const successful = results.filter(r => !('error' in r));
        const failed = results.filter(r => 'error' in r);

        return {
          successCount: successful.length,
          failCount: failed.length,
          failed,
        };
      },
    },
  ];
}

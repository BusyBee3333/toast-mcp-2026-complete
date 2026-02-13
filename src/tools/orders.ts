import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Order, Check } from '../types/index.js';

/**
 * Orders Management Tools - comprehensive order lifecycle management
 * Covers order retrieval, creation, modification, and status tracking
 */

export function registerOrdersTools(client: ToastClient) {
  return [
    {
      name: 'toast_get_order',
      description: 'Get detailed information about a specific order by GUID',
      inputSchema: z.object({
        orderGuid: z.string().describe('The unique GUID of the order'),
        restaurantGuid: z.string().optional().describe('Restaurant GUID (uses config default if not provided)'),
      }),
      handler: async (args: { orderGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const order = await client.get<Order>(
          `/orders/v2/orders/${args.orderGuid}`,
          { restaurantGuid: restGuid }
        );
        return { order };
      },
    },

    {
      name: 'toast_list_orders',
      description: 'List orders with filtering options (date range, status, business date). Returns paginated results.',
      inputSchema: z.object({
        businessDate: z.number().optional().describe('Business date in YYYYMMDD format'),
        startDate: z.string().optional().describe('Start date in ISO 8601 format'),
        endDate: z.string().optional().describe('End date in ISO 8601 format'),
        page: z.number().optional().describe('Page number (default: 1)'),
        pageSize: z.number().optional().describe('Page size (default: 100, max: 100)'),
        restaurantGuid: z.string().optional().describe('Restaurant GUID'),
      }),
      handler: async (args: { businessDate?: number; startDate?: string; endDate?: string; page?: number; pageSize?: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const orders = await client.getPaginated<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
            startDate: args.startDate,
            endDate: args.endDate,
            page: args.page,
            pageSize: args.pageSize,
          }
        );
        return { orders: orders.data, pagination: { page: orders.page, pageSize: orders.pageSize, hasMore: orders.hasMore } };
      },
    },

    {
      name: 'toast_create_order',
      description: 'Create a new order (online/delivery/takeout). Requires check and selections data.',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
        source: z.string().default('ONLINE'),
        channelGuid: z.string().optional(),
        diningOption: z.string().optional(),
        promisedDate: z.string().optional(),
        numberOfGuests: z.number().optional(),
        selections: z.array(z.object({
          itemGuid: z.string(),
          quantity: z.number(),
          modifiers: z.array(z.object({
            modifierGuid: z.string(),
            quantity: z.number(),
          })).optional(),
        })),
        customer: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
        }).optional(),
        deliveryInfo: z.object({
          address1: z.string(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          notes: z.string().optional(),
        }).optional(),
      }),
      handler: async (args: any) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const order = await client.post<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            source: args.source,
            channelGuid: args.channelGuid,
            diningOption: args.diningOption,
            promisedDate: args.promisedDate,
            numberOfGuests: args.numberOfGuests,
            checks: [{
              selections: args.selections,
              customer: args.customer,
            }],
            deliveryInfo: args.deliveryInfo,
          }
        );
        return { order };
      },
    },

    {
      name: 'toast_void_order',
      description: 'Void/cancel an entire order by GUID',
      inputSchema: z.object({
        orderGuid: z.string(),
        voidReason: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { orderGuid: string; voidReason?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.post(
          `/orders/v2/orders/${args.orderGuid}/void`,
          { voidReason: args.voidReason },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_get_check',
      description: 'Get detailed information about a specific check within an order',
      inputSchema: z.object({
        checkGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { checkGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const check = await client.get<Check>(
          `/orders/v2/checks/${args.checkGuid}`,
          { restaurantGuid: restGuid }
        );
        return { check };
      },
    },

    {
      name: 'toast_add_selections',
      description: 'Add items/selections to an existing check',
      inputSchema: z.object({
        checkGuid: z.string(),
        selections: z.array(z.object({
          itemGuid: z.string(),
          quantity: z.number(),
          modifiers: z.array(z.object({
            modifierGuid: z.string(),
            quantity: z.number(),
          })).optional(),
        })),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: any) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.post(
          `/orders/v2/checks/${args.checkGuid}/selections`,
          { selections: args.selections },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_void_selection',
      description: 'Void/remove a specific selection (item) from a check',
      inputSchema: z.object({
        selectionGuid: z.string(),
        voidReason: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { selectionGuid: string; voidReason?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.post(
          `/orders/v2/selections/${args.selectionGuid}/void`,
          { voidReason: args.voidReason },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_apply_discount',
      description: 'Apply a discount to a check or specific selection',
      inputSchema: z.object({
        checkGuid: z.string(),
        discountGuid: z.string(),
        selectionGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { checkGuid: string; discountGuid: string; selectionGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.post(
          `/orders/v2/checks/${args.checkGuid}/discounts`,
          { discountGuid: args.discountGuid, selectionGuid: args.selectionGuid },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_get_order_status',
      description: 'Get fulfillment status of an order (kitchen prep, ready, completed)',
      inputSchema: z.object({
        orderGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { orderGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const order = await client.get<Order>(
          `/orders/v2/orders/${args.orderGuid}`,
          { restaurantGuid: restGuid }
        );
        
        const selectionStatuses = order.checks.flatMap(check =>
          check.selections.map(sel => ({
            itemName: sel.displayName,
            fulfillmentStatus: sel.fulfillmentStatus,
            voided: sel.voided,
          }))
        );

        return {
          orderGuid: order.guid,
          openedDate: order.openedDate,
          closedDate: order.closedDate,
          voided: order.voided,
          selectionStatuses,
        };
      },
    },

    {
      name: 'toast_update_order_promised_time',
      description: 'Update the promised fulfillment time for an order',
      inputSchema: z.object({
        orderGuid: z.string(),
        promisedDate: z.string().describe('ISO 8601 timestamp'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { orderGuid: string; promisedDate: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.patch(
          `/orders/v2/orders/${args.orderGuid}`,
          { promisedDate: args.promisedDate },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_get_orders_by_business_date',
      description: 'Get all orders for a specific business date (formatted YYYYMMDD)',
      inputSchema: z.object({
        businessDate: z.number().describe('Business date in YYYYMMDD format, e.g., 20240215'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );
        return { orders, count: orders.length };
      },
    },

    {
      name: 'toast_search_orders_by_customer',
      description: 'Search orders by customer phone or email',
      inputSchema: z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { phone?: string; email?: string; startDate?: string; endDate?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const allOrders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            startDate: args.startDate,
            endDate: args.endDate,
          }
        );

        const matchingOrders = allOrders.filter(order =>
          order.checks.some(check =>
            check.customer &&
            (args.phone && check.customer.phone === args.phone) ||
            (args.email && check.customer.email === args.email)
          )
        );

        return { orders: matchingOrders, count: matchingOrders.length };
      },
    },
  ];
}

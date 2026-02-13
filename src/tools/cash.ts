import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { CashDrawer, CashEntry, CashDeposit } from '../types/index.js';

/**
 * Cash Management Tools
 */

export function registerCashTools(client: ToastClient) {
  return [
    {
      name: 'toast_list_cash_drawers',
      description: 'List all cash drawers for a business date',
      inputSchema: z.object({
        businessDate: z.number().describe('Business date in YYYYMMDD format'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const drawers = await client.get<CashDrawer[]>(
          `/cashmgmt/v1/drawers`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );
        return { drawers, count: drawers.length };
      },
    },

    {
      name: 'toast_get_cash_drawer',
      description: 'Get detailed information about a specific cash drawer',
      inputSchema: z.object({
        drawerGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { drawerGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const drawer = await client.get<CashDrawer>(
          `/cashmgmt/v1/drawers/${args.drawerGuid}`,
          { restaurantGuid: restGuid }
        );
        return { drawer };
      },
    },

    {
      name: 'toast_list_cash_entries',
      description: 'List cash entries (paid in/paid out) for a cash drawer or business date',
      inputSchema: z.object({
        businessDate: z.number().optional(),
        drawerGuid: z.string().optional(),
        employeeGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate?: number; drawerGuid?: string; employeeGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const entries = await client.get<CashEntry[]>(
          `/cashmgmt/v1/entries`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
            drawerGuid: args.drawerGuid,
            employeeGuid: args.employeeGuid,
          }
        );
        return { entries, count: entries.length };
      },
    },

    {
      name: 'toast_create_cash_entry',
      description: 'Record a cash paid in or paid out entry',
      inputSchema: z.object({
        drawerGuid: z.string(),
        amount: z.number().describe('Amount in cents (positive for paid in, negative for paid out)'),
        type: z.enum(['PAID_IN', 'PAID_OUT']),
        reason: z.string().optional(),
        comment: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: any) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const entry = await client.post<CashEntry>(
          `/cashmgmt/v1/entries`,
          {
            drawerGuid: args.drawerGuid,
            amount: args.amount,
            type: args.type,
            reason: args.reason,
            comment: args.comment,
          },
          { params: { restaurantGuid: restGuid } }
        );
        return { entry };
      },
    },

    {
      name: 'toast_get_cash_drawer_summary',
      description: 'Get summary of cash drawer activity (paid in, paid out, net)',
      inputSchema: z.object({
        drawerGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { drawerGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const entries = await client.get<CashEntry[]>(
          `/cashmgmt/v1/entries`,
          {
            restaurantGuid: restGuid,
            drawerGuid: args.drawerGuid,
          }
        );

        const paidIn = entries
          .filter(e => e.type === 'PAID_IN' && !e.deleted)
          .reduce((sum, e) => sum + e.amount, 0);
        
        const paidOut = entries
          .filter(e => e.type === 'PAID_OUT' && !e.deleted)
          .reduce((sum, e) => sum + Math.abs(e.amount), 0);

        return {
          drawerGuid: args.drawerGuid,
          paidIn,
          paidOut,
          netCash: paidIn - paidOut,
          entryCount: entries.length,
        };
      },
    },

    {
      name: 'toast_void_cash_entry',
      description: 'Void/undo a cash entry',
      inputSchema: z.object({
        entryGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { entryGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.delete(
          `/cashmgmt/v1/entries/${args.entryGuid}`,
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, entryGuid: args.entryGuid };
      },
    },

    {
      name: 'toast_list_cash_deposits',
      description: 'List cash deposit records',
      inputSchema: z.object({
        businessDate: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate?: number; startDate?: string; endDate?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const deposits = await client.get<CashDeposit[]>(
          `/cashmgmt/v1/deposits`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
            startDate: args.startDate,
            endDate: args.endDate,
          }
        );
        return { deposits, count: deposits.length };
      },
    },

    {
      name: 'toast_create_cash_deposit',
      description: 'Record a cash deposit',
      inputSchema: z.object({
        amount: z.number().describe('Deposit amount in cents'),
        date: z.string().optional().describe('ISO 8601 date (defaults to now)'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { amount: number; date?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const deposit = await client.post<CashDeposit>(
          `/cashmgmt/v1/deposits`,
          {
            amount: args.amount,
            date: args.date || new Date().toISOString(),
          },
          { params: { restaurantGuid: restGuid } }
        );
        return { deposit };
      },
    },
  ];
}
